import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import PhotoCard, { FotoProduct } from '../components/PhotoCard';

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
  const [products, setProducts] = useState<FotoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    fetch('/Fotos.csv')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder('windows-1252');
        const text = decoder.decode(buffer);
        setProducts(parseProducts(text));
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar dados.');
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-400 text-lg">Carregando produtos...</p>
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

      {/* Search + Categorias button */}
      <div className="flex gap-3 mb-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="O que você procura hoje?"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowCategories(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md whitespace-nowrap bg-[var(--color-ion-blue)] text-white hover:brightness-110"
        >
          <SlidersHorizontal size={14} />
          Categorias
          <ChevronDown size={14} className={`transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Catalogos-style categories panel */}
      {showCategories && (
        <div className="mt-3 rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-gray-500" />
              <span className="font-bold text-gray-900 text-[32px]">Navegar por Categorias</span>
            </div>
            <button
              onClick={() => setShowCategories(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <div className="h-px bg-gray-200 mb-4" />

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-60 shrink-0">
              <button
                onClick={() => { setActiveCategory(null); setShowCategories(false); }}
                className={`w-full h-11 flex items-center justify-between px-4 rounded-xl font-bold text-base transition-all ${
                  !activeCategory
                    ? 'bg-[var(--color-ion-blue)] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 flex-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowCategories(false); }}
                  className={`h-11 px-4 text-[15px] font-semibold rounded-xl transition-all text-left uppercase tracking-wide truncate ${
                    activeCategory === cat
                      ? 'bg-blue-50 text-[var(--color-ion-blue)] ring-1 ring-[var(--color-ion-blue)]'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                  title={cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
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
      {Object.entries(grouped).map(([category, items]) => (
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
