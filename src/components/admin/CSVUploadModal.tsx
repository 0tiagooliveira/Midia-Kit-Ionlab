import React, { useState, useRef } from 'react';
import { X, Upload as UploadIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { FotoProduct } from '../../lib/fotos';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: FotoProduct[], onProgress?: (percent: number) => void) => Promise<void>;
}

async function readCSVText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    // Preferir UTF-8 sem substituir bytes invalidos silenciosamente.
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    // Fallback para CSV exportado em ANSI (Windows-1252), comum em PT-BR.
    return new TextDecoder('windows-1252').decode(bytes);
  }
}

function parseCSVLine(line: string, delimiter: string = ';'): string[] {
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
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function detectDelimiter(firstLine: string): string {
  // Tenta detectar se é ; ou ,
  const semiCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  return commaCount > semiCount ? ',' : ';';
}

function parseCSV(csvContent: string): {
  headers: string[];
  rows: string[][];
  delimiter: string;
} {
  const normalizedContent = csvContent.replace(/^\uFEFF/, '');
  const lines = normalizedContent.split('\n').filter((l) => l.trim());
  if (lines.length === 0) {
    throw new Error('Arquivo CSV vazio');
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCSVLine(lines[0], delimiter);

  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i], delimiter);
    if (cols.some((c) => c.trim())) {
      rows.push(cols);
    }
  }

  return { headers, rows, delimiter };
}

function mapColumnsToProduct(
  headers: string[],
  row: string[]
): FotoProduct | null {
  // Mapear headers para os índices correspondentes
  const headerLower = headers.map((h) => h.toLowerCase().trim());

  const findIndex = (patterns: string[]): number => {
    return headerLower.findIndex((h) =>
      patterns.some((p) => h.includes(p.toLowerCase()))
    );
  };

  const findIndexExactOrIncludes = (exactPatterns: string[], includePatterns: string[]): number => {
    const exact = headerLower.findIndex((h) =>
      exactPatterns.some((p) => h === p.toLowerCase())
    );
    if (exact >= 0) return exact;

    return headerLower.findIndex((h) =>
      includePatterns.some((p) => h.includes(p.toLowerCase()))
    );
  };

  const nameIdx = findIndex(['nome produto', 'nome', 'product name']);
  const img1Idx = findIndex(['imagem principal', 'imagem 1', 'image 1', 'imagen principal']);
  const img2Idx = findIndex(['imagem 2', 'image 2', 'imagen 2']);
  const img3Idx = findIndex(['imagem 3', 'image 3', 'imagen 3']);
  const img4Idx = findIndex(['imagem 4', 'image 4', 'imagen 4']);
  const marcaIdx = findIndex(['marca', 'brand', 'manufacturer']);
  const modeloIdx = findIndex(['modelo', 'model']);
  const imagenAdIdx = findIndex(['imagens adicionais', 'additional images', 'imágenes adicionais']);
  const categoryNameIdx = findIndexExactOrIncludes(
    ['nome categoria', 'categoria nome', 'nome da categoria'],
    ['nome categoria', 'categoria nome', 'nome da categoria']
  );
  const categoryFallbackIdx = findIndex(['categoria', 'category']);
  const categoryIdx = categoryNameIdx >= 0 ? categoryNameIdx : categoryFallbackIdx;

  const name = nameIdx >= 0 ? row[nameIdx]?.trim() || '' : '';
  if (!name) return null;

  const img1 = img1Idx >= 0 ? row[img1Idx]?.trim() || '' : '';
  const img2 = img2Idx >= 0 ? row[img2Idx]?.trim() || '' : '';
  const img3 = img3Idx >= 0 ? row[img3Idx]?.trim() || '' : '';
  const img4 = img4Idx >= 0 ? row[img4Idx]?.trim() || '' : '';
  const marca = marcaIdx >= 0 ? row[marcaIdx]?.trim() || '' : '';
  const modelo = modeloIdx >= 0 ? row[modeloIdx]?.trim() || '' : '';
  const imagenAdRaw = imagenAdIdx >= 0 ? row[imagenAdIdx]?.trim() || '' : '';
  const category = categoryIdx >= 0 ? row[categoryIdx]?.trim() || '' : '';

  // Processar imagens adicionais (separadas por vírgula)
  const additionalImages = imagenAdRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && s.startsWith('http'));

  // Montar array de imagens
  const images = [img1, img2, img3, img4, ...additionalImages].filter(
    (s) => s && s.startsWith('http')
  );

  return {
    id: `p${Math.random().toString(36).substr(2, 9)}`,
    name,
    images: images.length > 0 ? images : [],
    brand: marca,
    model: modelo,
    category: category || 'Sem categoria',
    discontinued: false,
  };
}

export default function CSVUploadModal({
  isOpen,
  onClose,
  onImport,
}: CSVUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<FotoProduct[]>([]);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'ready' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setStatus('parsing');
    setErrorMsg('');
    setPreview([]);

    try {
      const text = await readCSVText(file);
      
      const { headers, rows } = parseCSV(text);

      // Validar que temos as colunas esperadas
      const headerLower = headers.map((h) => h.toLowerCase());
      const hasNameColumn = headerLower.some((h) =>
        h.includes('nome produto')
      );
      const hasImageColumn = headerLower.some((h) =>
        h.includes('imagem principal')
      );

      if (!hasNameColumn) {
        throw new Error(
          'Coluna "Nome produto" não encontrada no CSV'
        );
      }

      if (!hasImageColumn) {
        throw new Error(
          'Coluna "Imagem principal" não encontrada no CSV'
        );
      }

      // Mapear linhas para produtos
      const products: FotoProduct[] = [];
      rows.forEach((row, idx) => {
        const product = mapColumnsToProduct(headers, row);
        if (product) {
          products.push(product);
        }
      });

      if (products.length === 0) {
        throw new Error(
          'Nenhum produto válido encontrado no CSV'
        );
      }

      setPreview(products);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Erro ao processar arquivo'
      );
      setStatus('error');
    }
  };

  const handleImport = () => {
    if (preview.length === 0) return;

    // Chamar onImport sem await - deixar em background
    // O progress será gerenciado no componente pai
    onImport(preview).catch((err) => {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao importar produtos');
      setStatus('error');
    });

    // Fechar modal imediatamente
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview([]);
    setStatus('idle');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Importar Produtos do CSV
                </h2>
                <button
                  onClick={handleClose}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {status === 'idle' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Selecione um arquivo CSV com as seguintes colunas:
                  </p>
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                    <strong>Colunas esperadas:</strong> Nome produto, Imagem principal, Imagem 2, Imagem 3, Imagem 4, Marca, Modelo, Imagens adicionais, Nome categoria
                  </div>
                  <p className="text-xs text-gray-500">
                    O sistema ignorará automaticamente colunas extras na planilha.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <UploadIcon className="h-4 w-4" />
                    Selecionar arquivo CSV
                  </button>
                </div>
              )}

              {status === 'parsing' && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600">Processando arquivo...</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-lg bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-900">{errorMsg}</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                      >
                        <UploadIcon className="h-4 w-4" />
                        Tentar outro arquivo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {status === 'ready' && preview.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {preview.length} produto(s) pronto(s) para importar
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {preview.slice(0, 10).map((product, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-gray-200 p-3"
                      >
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              {product.name}
                            </span>
                            {product.brand && (
                              <span className="ml-2 text-gray-500">
                                ({product.brand}
                                {product.model ? ` ${product.model}` : ''})
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.images.length} imagem(ns) • {product.category}
                          </div>
                        </div>
                      </div>
                    ))}
                    {preview.length > 10 && (
                      <div className="py-2 text-center text-xs text-gray-500">
                        ... e mais {preview.length - 10} produto(s)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                {status === 'ready' && (
                  <button
                    onClick={handleImport}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Importar {preview.length} Produto(s)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
