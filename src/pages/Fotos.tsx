import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, Filter, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import PhotoCard, { FotoProduct } from '../components/PhotoCard';

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

    products.push({ id: `p${i}`, name, images, brand, model, category });
  }

  return products;
}

export default function Fotos() {
  const [products, setProducts] = useState<FotoProduct[]>(() => readCachedProducts());
  const [loading, setLoading] = useState(products.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [renderLimit, setRenderLimit] = useState(INITIAL_RENDER_LIMIT);

  useEffect(() => {
    fetch('/Fotos.csv')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder('windows-1252');
        const text = decoder.decode(buffer);
        const parsedProducts = parseProducts(text);
        setProducts(parsedProducts);
        writeCachedProducts(parsedProducts);
      })
      .catch(err => {
        console.error(err);
        if (products.length === 0) {
          setError('Erro ao carregar dados.');
        }
      })
      .finally(() => setLoading(false));
  }, [products.length]);

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
    for (const [category, items] of Object.entries(grouped)) {
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
                <PhotoCard product={product} />
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
    </div>
  );
}
