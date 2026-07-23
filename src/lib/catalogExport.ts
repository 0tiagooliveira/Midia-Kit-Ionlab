import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { VIDEOS, MANUAIS } from '../constants';
import { db } from '../firebase';
import type { ManualItem, VideoItem } from '../types';
import { loadBaseFotoProducts, type FotoProduct } from './fotos';

type FotoOverride = Partial<FotoProduct> & { deleted?: boolean };
type VideoOverride = Partial<VideoItem> & { deleted?: boolean };
type ManualOverride = Partial<ManualItem> & { deleted?: boolean };

function normalizeUrl(value?: string | null): string {
  return (value || '').trim();
}

function toYoutubeUrl(value?: string | null): string {
  const raw = normalizeUrl(value);
  if (!raw) return '';
  if (raw.includes('http')) return raw;
  return `https://www.youtube.com/watch?v=${raw}`;
}

async function readOverrides<T extends { id: string }>(collectionName: string): Promise<Record<string, Partial<T> & { deleted?: boolean }>> {
  const snapshot = await getDocs(collection(db, collectionName));
  const overrides: Record<string, Partial<T> & { deleted?: boolean }> = {};

  snapshot.forEach((item) => {
    overrides[item.id] = item.data() as Partial<T> & { deleted?: boolean };
  });

  return overrides;
}

function mergeBaseAndOverrides<T extends { id: string }>(
  baseItems: T[],
  overrides: Record<string, Partial<T> & { deleted?: boolean }>
): T[] {
  const baseIds = new Set(baseItems.map((item) => item.id));

  const fromBase = baseItems.flatMap((item) => {
    const patch = overrides[item.id];
    if (patch?.deleted) {
      return [];
    }

    return [{ ...item, ...patch, id: item.id } as T];
  });

  const custom = Object.entries(overrides)
    .filter(([id, item]) => !baseIds.has(id) && !item.deleted)
    .map(([id, item]) => ({ ...item, id } as T));

  return [...fromBase, ...custom];
}

function buildFotoRows(products: FotoProduct[]) {
  return products.map((product) => {
    const images = product.images.filter(Boolean);
    const [img1 = '', img2 = '', img3 = '', img4 = '', ...additionalImages] = images;

    return {
      'Nome produto': product.name,
      'Imagem principal': img1,
      'Imagem 2': img2,
      'Imagem 3': img3,
      'Imagem 4': img4,
      Marca: product.brand || '',
      Modelo: product.model || '',
      'Imagens adicionais': additionalImages.join(', '),
      'Nome categoria': product.category || 'Sem categoria'
    };
  });
}

function buildVideoRows(videos: VideoItem[]) {
  return videos.map((video) => ({
    Categoria: video.category || '',
    Titulo: video.title || '',
    Descontinuado: video.discontinued ? 'Sim' : 'Nao',
    'YouTube (horizontal)': toYoutubeUrl(video.youtubeId),
    'Shorts (vertical)': toYoutubeUrl(video.shortsId),
    Thumbnail: normalizeUrl(video.thumbnailUrl),
    'Download materiais': normalizeUrl(video.downloadUrl)
  }));
}

function buildManualRows(manuals: ManualItem[]) {
  return manuals.map((manual) => ({
    Titulo: manual.title || '',
    Categoria: manual.category || '',
    Descricao: manual.description || '',
    Descontinuado: manual.discontinued ? 'Sim' : 'Nao',
    Capa: normalizeUrl(manual.coverUrl),
    'Download PDF': normalizeUrl(manual.downloadUrl)
  }));
}

function applyAutoWidths(sheet: XLSX.WorkSheet) {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { header: 1 }) as unknown[][];
  const widths = rows.reduce<number[]>((acc, row) => {
    row.forEach((cell, index) => {
      const text = cell == null ? '' : String(cell);
      acc[index] = Math.max(acc[index] || 0, text.length + 2);
    });
    return acc;
  }, []);

  sheet['!cols'] = widths.map((width) => ({ wch: Math.min(Math.max(width, 12), 60) }));
}

async function buildWorkbook() {
  const [baseFotos, fotoOverrides, videoOverrides, manualOverrides] = await Promise.all([
    loadBaseFotoProducts(),
    readOverrides<FotoProduct>('fotos'),
    readOverrides<VideoItem>('videos'),
    readOverrides<ManualItem>('manuais')
  ]);

  const fotos = mergeBaseAndOverrides(baseFotos, fotoOverrides as Record<string, FotoOverride>);
  const videos = mergeBaseAndOverrides(VIDEOS, videoOverrides as Record<string, VideoOverride>);
  const manuals = mergeBaseAndOverrides(MANUAIS, manualOverrides as Record<string, ManualOverride>);

  const workbook = XLSX.utils.book_new();
  const exportedAt = new Date();
  const resumoSheet = XLSX.utils.json_to_sheet([
    { Campo: 'Gerado em', Valor: exportedAt.toLocaleString('pt-BR') },
    { Campo: 'Fotos', Valor: fotos.length },
    { Campo: 'Videos', Valor: videos.length },
    { Campo: 'Catalogos/Manuais', Valor: manuals.length }
  ]);

  const fotosSheet = XLSX.utils.json_to_sheet(buildFotoRows(fotos));
  const videosSheet = XLSX.utils.json_to_sheet(buildVideoRows(videos));
  const manualsSheet = XLSX.utils.json_to_sheet(buildManualRows(manuals));

  applyAutoWidths(resumoSheet);
  applyAutoWidths(fotosSheet);
  applyAutoWidths(videosSheet);
  applyAutoWidths(manualsSheet);

  XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo');
  XLSX.utils.book_append_sheet(workbook, fotosSheet, 'Fotos');
  XLSX.utils.book_append_sheet(workbook, videosSheet, 'Videos');
  XLSX.utils.book_append_sheet(workbook, manualsSheet, 'Catalogos');

  return { workbook, exportedAt, counts: { fotos: fotos.length, videos: videos.length, manuals: manuals.length } };
}

export async function exportMediaKitSpreadsheet() {
  const { workbook, exportedAt } = await buildWorkbook();
  const stamp = exportedAt.toISOString().slice(0, 10);
  const fileName = `midia-kit-exportacao-${stamp}.xlsx`;
  XLSX.writeFile(workbook, fileName, { bookType: 'xlsx' });
  return fileName;
}
