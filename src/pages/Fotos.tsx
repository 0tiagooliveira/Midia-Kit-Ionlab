import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, X, Filter, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import PhotoCard, { FotoProduct } from '../components/PhotoCard';
import { useAdminSession } from '../hooks/useAdminSession';
import { db } from '../firebase';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import AdminModal from '../components/admin/AdminModal';
import CSVUploadModal from '../components/admin/CSVUploadModal';
import ProgressToast from '../components/ProgressToast';
import { Plus, Upload as UploadIcon } from 'lucide-react';

const PRODUCTS_CACHE_KEY = 'fotos-products-cache-v1';
const INITIAL_RENDER_LIMIT = 120;
const RENDER_STEP = 120;

function readCachedProducts(): FotoProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FotoProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedProducts(products: FotoProduct[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));
  } catch {
    // ignore cache write failures
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseProducts(csv: string): FotoProduct[] {
  const lines = csv.split('\n').filter(l => l.trim());
  const products: FotoProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 2) continue;

    const name = cols[0] || '';
    const mainImage = cols[1] || '';
    const img2 = cols[2] || '';
    const img3 = cols[3] || '';
    const img4 = cols[4] || '';
    const brand = cols[5] || '';
    const model = cols[6] || '';
    const additionalRaw = cols[7] || '';
    const category = cols[8] || '';

    if (!name) continue;

    const additionalImages = additionalRaw
      .split(',')
      .map(s => s.trim())
      .filter(s => s && !s.includes('youtube.com') && !s.includes('youtu.be'));

    const images = [mainImage, img2, img3, img4, ...additionalImages].filter(
      s => s && s.startsWith('http')
    );

    products.push({ id: `p${i}`, name, images, brand, model, category, discontinued: false });
  }

  return products;
}

export default function Fotos() {
  const { isAdmin } = useAdminSession();
  const [baseProducts, setBaseProducts] = useState<FotoProduct[]>(() => readCachedProducts());
  const [overrides, setOverrides] = useState<Record<string, Partial<FotoProduct> & { deleted?: boolean }>>({});
  const [loading, setLoading] = useState(baseProducts.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [renderLimit, setRenderLimit] = useState(INITIAL_RENDER_LIMIT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [csvUploadOpen, setCSVUploadOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  const [importCancelFlag, setImportCancelFlag] = useState(false);
  const importCancelRef = useRef(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    brand: '',
    model: '',
    category: '',
    discontinued: false,
    images: ''
  });

  const products = useMemo(() => {
    const baseIds = new Set(baseProducts.map((item) => item.id));

    const mergedBase = baseProducts.flatMap((item) => {
      const patch = overrides[item.id];
      if (patch?.deleted) {
        return [];
      }

      return [
        {
          ...item,
          ...patch,
          id: item.id,
          images: Array.isArray(patch?.images) ? patch.images.filter(Boolean) : item.images
        }
      ];
    });

    const custom = (Object.entries(overrides) as Array<[string, Partial<FotoProduct> & { deleted?: boolean }]>)
      .filter(([id, patch]) => !baseIds.has(id) && !patch.deleted)
      .map(([id, patch]) => ({
        id,
        name: patch.name || 'Sem nome',
        brand: patch.brand || '',
        model: patch.model || '',
        category: patch.category || 'Outros',
        discontinued: patch.discontinued === true,
        images: Array.isArray(patch.images) ? patch.images.filter(Boolean) : []
      }));

    return [...mergedBase, ...custom];
  }, [baseProducts, overrides]);

  useEffect(() => {
    fetch('/Fotos.csv')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder('windows-1252');
        const text = decoder.decode(buffer);
        const parsedProducts = parseProducts(text);
        setBaseProducts(parsedProducts);
        writeCachedProducts(parsedProducts);
      })
      .catch(err => {
        console.error(err);
        if (baseProducts.length === 0) {
          setError('Erro ao carregar dados.');
        }
      })
      .finally(() => setLoading(false));
  }, [baseProducts.length]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'fotos'), (snapshot) => {
      const next: Record<string, Partial<FotoProduct> & { deleted?: boolean }> = {};
      snapshot.forEach((item) => {
        next[item.id] = item.data() as Partial<FotoProduct> & { deleted?: boolean };
      });
      setOverrides(next);
    });

    return () => unsubscribe();
  }, []);

  const startEdit = (product: FotoProduct) => {
    if (!isAdmin) {
      return;
    }

    setEditingId(product.id);
    setForm({
      id: product.id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      category: product.category,
      discontinued: product.discontinued === true,
      images: product.images.join('\n')
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ id: '', name: '', brand: '', model: '', category: '', discontinued: false, images: '' });
    setModalOpen(false);
  };

  const openCreateModal = () => {
    if (!isAdmin) {
      return;
    }

    setEditingId(null);
    setForm({ id: '', name: '', brand: '', model: '', category: '', discontinued: false, images: '' });
    setModalOpen(true);
  };

  const saveProduct = async () => {
    if (!isAdmin) {
      return;
    }

    const id = (editingId || form.id || crypto.randomUUID().slice(0, 8)).trim();
    if (!id) return;

    const images = form.images
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    await setDoc(
      doc(db, 'fotos', id),
      {
        name: form.name.trim(),
        brand: form.brand.trim(),
        model: form.model.trim(),
        category: form.category.trim() || 'Outros',
        discontinued: form.discontinued,
        images,
        deleted: false,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    resetForm();
  };

  const removeProduct = async (id: string) => {
    if (!isAdmin) {
      return;
    }

    if (!window.confirm('Deseja excluir este item de fotos?')) {
      return;
    }

    const isBaseItem = baseProducts.some((item) => item.id === id);
    if (isBaseItem) {
      await setDoc(doc(db, 'fotos', id), { deleted: true, updatedAt: serverTimestamp() }, { merge: true });
      return;
    }

    await deleteDoc(doc(db, 'fotos', id));
  };

  const clearAllFotos = async () => {
    if (!isAdmin) return;

    if (isImporting) {
      importCancelRef.current = true;
      setImportCancelFlag(true);
    }

    const confirmation = window.prompt('Digite LIMPAR para apagar TODAS as fotos (inclusive as do CSV base):');
    if (confirmation !== 'LIMPAR') {
      return;
    }

    try {
      const allIds = new Set<string>();

      baseProducts.forEach((item) => allIds.add(item.id));
      Object.keys(overrides).forEach((id) => allIds.add(id));

      if (allIds.size === 0) {
        alert('Nao ha fotos para limpar.');
        return;
      }

      const ids = Array.from(allIds);
      const chunkSize = 500;
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      for (let i = 0; i < ids.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = ids.slice(i, i + chunkSize);
        chunk.forEach((id) => {
          batch.set(
            doc(db, 'fotos', id),
            { deleted: true, updatedAt: serverTimestamp() },
            { merge: true }
          );
        });
        await batch.commit();

        // Pequeno delay entre batches para não sobrecarregar
        if (i + chunkSize < ids.length) {
          await delay(300);
        }
      }

      setImportCancelFlag(false);
      importCancelRef.current = false;
      setIsImporting(false);
      setImportProgress(0);
      setImportTotal(0);
      alert(`✓ ${ids.length} item(ns) ocultado(s). Galeria zerada.`);
    } catch (err) {
      console.error('Erro ao limpar fotos:', err);
      alert('Erro ao limpar as fotos. Tente novamente.');
    }
  };

  const handleCSVImport = async (importedProducts: FotoProduct[], onProgress?: (percent: number) => void) => {
    if (!isAdmin) return;

    // Fechar modal imediatamente
    setCSVUploadOpen(false);

    // Iniciar importação em background
    setIsImporting(true);
    setImportProgress(0);
    setImportTotal(importedProducts.length);
    setImportCancelFlag(false);
    importCancelRef.current = false;

    const normalizeForMatch = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

    const slugify = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);

    const existingByModel = new Map<string, string>();
    const existingByName = new Map<string, string>();

    for (const p of products) {
      const modelKey = normalizeForMatch(p.model || '');
      const nameKey = normalizeForMatch(p.name || '');

      if (modelKey && !existingByModel.has(modelKey)) {
        existingByModel.set(modelKey, p.id);
      }

      if (nameKey && !existingByName.has(nameKey)) {
        existingByName.set(nameKey, p.id);
      }
    }

    try {
      const total = importedProducts.length;
      const batchSize = 500;
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      for (let batchStart = 0; batchStart < importedProducts.length; batchStart += batchSize) {
        // Verificar se foi cancelado
        if (importCancelRef.current) {
          setIsImporting(false);
          setImportCancelFlag(false);
          alert(`Importacao cancelada em ${batchStart}/${total} produtos.`);
          return;
        }

        const batchEnd = Math.min(batchStart + batchSize, importedProducts.length);
        const batch = writeBatch(db);

        for (let index = batchStart; index < batchEnd; index++) {
          const product = importedProducts[index];
          const modelKey = normalizeForMatch(product.model || '');
          const nameKey = normalizeForMatch(product.name || '');
          const matchedId = (modelKey && existingByModel.get(modelKey)) || (nameKey && existingByName.get(nameKey));
          const fallbackId = slugify(product.model || product.name) || `produto-${index + 1}`;
          const id = matchedId || fallbackId;

          batch.set(
            doc(db, 'fotos', id),
            {
              name: product.name.trim(),
              brand: product.brand || '',
              model: product.model || '',
              category: product.category || 'Outros',
              discontinued: product.discontinued === true,
              images: product.images,
              deleted: false,
              updatedAt: serverTimestamp()
            },
            { merge: true }
          );

          if (modelKey && !existingByModel.has(modelKey)) {
            existingByModel.set(modelKey, id);
          }

          if (nameKey && !existingByName.has(nameKey)) {
            existingByName.set(nameKey, id);
          }
        }

        // Fazer commit do batch
        await batch.commit();
        
        // Atualizar progresso
        const percent = Math.round((batchEnd / total) * 100);
        setImportProgress(percent);
        onProgress?.(percent);

        // Pequeno delay entre batches para não sobrecarregar
        if (batchEnd < importedProducts.length) {
          await delay(300);
        }
      }
      
      // Aguardar um pouco antes de fechar para mostrar 100%
      setTimeout(() => {
        setIsImporting(false);
        setImportCancelFlag(false);
        alert(`✓ ${importedProducts.length} produto(s) importado(s) com sucesso!`);
      }, 500);
    } catch (err) {
      console.error('Erro ao importar:', err);
      setIsImporting(false);
      setImportCancelFlag(false);
      throw err;
    }
  };

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const cats: string[] = [];
    for (const p of products) {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        cats.push(p.category);
      }
    }
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory) result = result.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, search]);

  useEffect(() => {
    setRenderLimit(INITIAL_RENDER_LIMIT);
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const groups: Record<string, FotoProduct[]> = {};
    for (const p of filtered) {
      const cat = p.category || 'Outros';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    }
    for (const category of Object.keys(groups)) {
      groups[category].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
      );
    }
    return groups;
  }, [filtered]);

  const displayedGroups = useMemo(() => {
    let remaining = renderLimit;
    const result: Array<[string, FotoProduct[]]> = [];
    for (const [category, items] of Object.entries(grouped) as Array<[string, FotoProduct[]]>) {
      if (remaining <= 0) break;
      const slice = items.slice(0, remaining);
      if (slice.length > 0) {
        result.push([category, slice]);
        remaining -= slice.length;
      }
    }
    return result;
  }, [grouped, renderLimit]);

  const hasMoreToRender = filtered.length > renderLimit;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="h-9 w-56 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-gray-100 bg-white p-3 animate-pulse">
              <div className="aspect-square rounded-lg bg-gray-100 mb-3" />
              <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-2" />
              <div className="h-4 w-4/5 bg-gray-100 rounded mb-4" />
              <div className="h-9 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const hasFilters = !!(search || activeCategory);

  return (
    <div className="container mx-auto px-4 py-10">
      {isAdmin && (
        <section className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-800">Gerenciar Fotos</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCSVUploadOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-emerald-700"
              >
                <UploadIcon size={14} />
                Importar CSV
              </button>
              <button
                type="button"
                onClick={clearAllFotos}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-rose-700"
              >
                Limpar tudo
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1767ae] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white"
              >
                <Plus size={14} />
                Novo item
              </button>
            </div>
          </div>

          <AdminModal open={modalOpen} title={editingId ? 'Editar item de fotos' : 'Novo item de fotos'} onClose={resetForm}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {!editingId && (
                <input value={form.id} onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))} placeholder="ID (opcional para novo)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              )}
              <label className="md:col-span-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-700">
                <input type="checkbox" checked={form.discontinued} onChange={(e) => setForm((prev) => ({ ...prev, discontinued: e.target.checked }))} />
                Descontinuado(a)
              </label>
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nome" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.brand} onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))} placeholder="Marca" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.model} onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))} placeholder="Modelo" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Categoria" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <textarea
                value={form.images}
                onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))}
                rows={4}
                placeholder="URLs das imagens (uma por linha)"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
              />

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">Cancelar</button>
                <button onClick={saveProduct} className="rounded-lg bg-[#1767ae] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">{editingId ? 'Atualizar' : 'Incluir'}</button>
              </div>
            </div>
          </AdminModal>
        </section>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Galeria de Fotos</h1>
        <p className="text-gray-400 text-sm">{products.length} produtos disponíveis</p>
      </motion.div>

      <div className="mb-10 flex items-center gap-3 w-full md:max-w-2xl">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#1767ae] transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="O que você procura hoje?"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#1767ae]/20 focus:border-[#1767ae] transition-all duration-300 outline-none text-sm md:text-base shadow-sm group-hover:bg-white group-hover:shadow-md"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowCategories(v => !v)}
          className={`md:hidden p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            showCategories || activeCategory
              ? 'bg-[#1767ae] text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Filter className="h-5 w-5" />
        </button>

        <button
          onClick={() => setShowCategories(v => !v)}
          className={`hidden md:flex items-center gap-2.5 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${
            showCategories || activeCategory
              ? 'bg-[#1767ae] text-white border border-transparent shadow-[#1767ae]/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1767ae] hover:text-[#1767ae]'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="max-w-[120px] truncate">{activeCategory || 'Categorias'}</span>
          {showCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Catalogos-style categories panel */}
      {showCategories && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-2xl mb-6"
        >
          <div className="px-4 py-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg text-[#1767ae]">
                  <Filter className="h-5 w-5" />
                </div>
                Navegar por Categorias
              </h3>
              <button
                onClick={() => setShowCategories(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              <button
                onClick={() => { setActiveCategory(null); setShowCategories(false); }}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                  !activeCategory
                    ? 'bg-[#1767ae] text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-600 hover:bg-white hover:text-[#1767ae] hover:shadow-md hover:ring-1 hover:ring-[#1767ae]/20'
                }`}
              >
                <span className="truncate">Todos</span>
                {!activeCategory && <ArrowRight className="h-4 w-4" />}
              </button>

              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowCategories(false); }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                    activeCategory === cat
                      ? 'bg-[#1767ae] text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-50 text-slate-600 hover:bg-white hover:text-[#1767ae] hover:shadow-md hover:ring-1 hover:ring-[#1767ae]/20'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  {activeCategory === cat && <ArrowRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Result count when filtering */}
      {hasFilters && (
        <p className="text-sm text-gray-500 mt-4 mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} encontrado
          {filtered.length !== 1 ? 's' : ''}
          <button
            onClick={() => { setSearch(''); setActiveCategory(null); }}
            className="ml-2 text-blue-600 hover:underline"
          >
            Limpar filtros
          </button>
        </p>
      )}

      {/* Products grouped by category */}
      {displayedGroups.map(([category, items]) => (
        <div key={category} className="mb-12">
          <div className="flex items-baseline gap-3 mb-5 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">{category}</h2>
            <span className="text-sm text-gray-400">
              {items.length} produto{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
            {items.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.4) }}
                className="h-full"
              >
                <PhotoCard
                  product={product}
                  showAdminMenu={isAdmin}
                  onEdit={() => startEdit(product)}
                  onDelete={() => removeProduct(product.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {hasMoreToRender && (
        <div className="flex justify-center pb-8">
          <button
            onClick={() => setRenderLimit(limit => limit + RENDER_STEP)}
            className="px-6 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:border-[var(--color-ion-blue)] hover:text-[var(--color-ion-blue)] transition-colors"
          >
            Carregar mais produtos ({Math.min(RENDER_STEP, filtered.length - renderLimit)})
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-3">Nenhum produto encontrado</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory(null); }}
            className="text-blue-600 hover:underline text-sm"
          >
            Limpar filtros
          </button>
        </div>
      )}

      <CSVUploadModal 
        isOpen={csvUploadOpen} 
        onClose={() => setCSVUploadOpen(false)} 
        onImport={handleCSVImport}
      />

      <ProgressToast
        isVisible={isImporting}
        progress={importProgress}
        total={importTotal}
        onCancel={() => {
          importCancelRef.current = true;
          setImportCancelFlag(true);
        }}
      />
    </div>
  );
}
