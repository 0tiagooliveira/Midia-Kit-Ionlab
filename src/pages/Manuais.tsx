import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MANUAIS } from '../constants';
import ManualCard from '../components/ManualCard';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { ManualItem } from '../types';
import { useAdminSession } from '../hooks/useAdminSession';
import AdminItemMenu from '../components/admin/AdminItemMenu';
import AdminModal from '../components/admin/AdminModal';
import { ArrowRight, ChevronDown, ChevronUp, Filter, Plus, Search, X } from 'lucide-react';

type ManualOverride = Partial<ManualItem> & { deleted?: boolean };
const DEFAULT_MANUAL_CATEGORY = 'Geral';

export default function Manuais() {
  const { isAdmin } = useAdminSession();
  const [overrides, setOverrides] = useState<Record<string, ManualOverride>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', description: '', discontinued: false, coverUrl: '', downloadUrl: '' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'manuais'), (snapshot) => {
      const next: Record<string, ManualOverride> = {};
      snapshot.forEach((item) => {
        next[item.id] = item.data() as ManualOverride;
      });
      setOverrides(next);
    });

    return () => unsubscribe();
  }, []);

  const mergedManuais = useMemo(() => {
    const baseIds = new Set(MANUAIS.map((item) => item.id));

    const fromBase = MANUAIS.flatMap((item) => {
      const patch = overrides[item.id];
      if (patch?.deleted) {
        return [];
      }

      return [{ ...item, ...patch, id: item.id } as ManualItem];
    });

    const custom = Object.entries(overrides)
      .filter(([id, item]) => !baseIds.has(id) && !item.deleted)
      .map(([id, item]) => ({
        id,
        title: item.title || 'Sem titulo',
        category: item.category || DEFAULT_MANUAL_CATEGORY,
        description: item.description || '',
        discontinued: item.discontinued === true,
        coverUrl: item.coverUrl || '',
        downloadUrl: item.downloadUrl || '#'
      } as ManualItem));

    return [...fromBase, ...custom].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }, [overrides]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) {
      return;
    }

    const id = (editingId || crypto.randomUUID().slice(0, 8)).trim();
    if (!id) return;

    await setDoc(
      doc(db, 'manuais', id),
      {
        title: form.title.trim(),
        category: form.category.trim() || DEFAULT_MANUAL_CATEGORY,
        description: form.description.trim(),
        discontinued: form.discontinued,
        coverUrl: form.coverUrl.trim(),
        downloadUrl: form.downloadUrl.trim() || '#',
        deleted: false,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    setEditingId(null);
    setForm({ title: '', category: '', description: '', discontinued: false, coverUrl: '', downloadUrl: '' });
    setModalOpen(false);
  };

  const startEdit = (manual: ManualItem) => {
    if (!isAdmin) {
      return;
    }

    setEditingId(manual.id);
    setForm({
      title: manual.title,
      category: manual.category || DEFAULT_MANUAL_CATEGORY,
      description: manual.description,
      discontinued: manual.discontinued === true,
      coverUrl: manual.coverUrl || '',
      downloadUrl: manual.downloadUrl
    });
    setModalOpen(true);
  };

  const openCreateModal = () => {
    if (!isAdmin) {
      return;
    }

    setEditingId(null);
    setForm({ title: '', category: '', description: '', discontinued: false, coverUrl: '', downloadUrl: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setForm({ title: '', category: '', description: '', discontinued: false, coverUrl: '', downloadUrl: '' });
    setModalOpen(false);
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const manual of mergedManuais) {
      set.add((manual.category || DEFAULT_MANUAL_CATEGORY).trim() || DEFAULT_MANUAL_CATEGORY);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
  }, [mergedManuais]);

  const filteredManuais = useMemo(() => {
    let result = mergedManuais;

    if (activeCategory) {
      result = result.filter((manual) => (manual.category || DEFAULT_MANUAL_CATEGORY) === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((manual) => {
        const title = manual.title.toLowerCase();
        const category = (manual.category || DEFAULT_MANUAL_CATEGORY).toLowerCase();
        return title.includes(q) || category.includes(q);
      });
    }

    return result;
  }, [mergedManuais, activeCategory, search]);

  const hasFilters = Boolean(search.trim() || activeCategory);

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      return;
    }

    if (!window.confirm('Deseja excluir este manual?')) {
      return;
    }

    const isBaseItem = MANUAIS.some((item) => item.id === id);
    if (isBaseItem) {
      await setDoc(doc(db, 'manuais', id), { deleted: true, updatedAt: serverTimestamp() }, { merge: true });
      return;
    }

    await deleteDoc(doc(db, 'manuais', id));
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {isAdmin && (
        <section className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-800">Gerenciar Manuais</h2>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1767ae] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white"
            >
              <Plus size={14} />
              Novo manual
            </button>
          </div>

          <AdminModal open={modalOpen} title={editingId ? 'Editar manual' : 'Novo manual'} onClose={closeModal}>
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Titulo" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Categoria" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <label className="md:col-span-2 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                <input type="checkbox" checked={form.discontinued} onChange={(e) => setForm((prev) => ({ ...prev, discontinued: e.target.checked }))} />
                Marcar como descontinuado(a)
              </label>
              <input value={form.coverUrl} onChange={(e) => setForm((prev) => ({ ...prev, coverUrl: e.target.value }))} placeholder="URL da capa (opcional)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <input value={form.downloadUrl} onChange={(e) => setForm((prev) => ({ ...prev, downloadUrl: e.target.value }))} placeholder="URL do PDF" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">Cancelar</button>
                <button type="submit" className="rounded-lg bg-[#1767ae] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">{editingId ? 'Atualizar' : 'Incluir'}</button>
              </div>
            </form>
          </AdminModal>
        </section>
      )}

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Manuais</h1>
        <p className="text-gray-500 max-w-2xl">
          Documentação técnica e guias de usuário dos equipamentos IonLab em formato PDF.
        </p>
      </div>

      <div className="mb-10 flex items-center gap-3 w-full md:max-w-2xl">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#1767ae] transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar manual"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          onClick={() => setShowCategories((v) => !v)}
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

        <button
          onClick={() => setShowCategories((v) => !v)}
          className={`md:hidden p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            showCategories || activeCategory
              ? 'bg-[#1767ae] text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {showCategories && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
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
                onClick={() => {
                  setActiveCategory(null);
                  setShowCategories(false);
                }}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                  !activeCategory
                    ? 'bg-[#1767ae] text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-600 hover:bg-white hover:text-[#1767ae] hover:shadow-md hover:ring-1 hover:ring-[#1767ae]/20'
                }`}
              >
                <span className="truncate">Todos</span>
                {!activeCategory && <ArrowRight className="h-4 w-4" />}
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setShowCategories(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                    activeCategory === category
                      ? 'bg-[#1767ae] text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-50 text-slate-600 hover:bg-white hover:text-[#1767ae] hover:shadow-md hover:ring-1 hover:ring-[#1767ae]/20'
                  }`}
                >
                  <span className="truncate">{category}</span>
                  {activeCategory === category && <ArrowRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {hasFilters && (
        <p className="text-sm text-gray-500 mt-4 mb-4">
          {filteredManuais.length} resultado{filteredManuais.length !== 1 ? 's' : ''} encontrado
          {filteredManuais.length !== 1 ? 's' : ''}
          <button
            onClick={() => {
              setSearch('');
              setActiveCategory(null);
            }}
            className="ml-2 text-blue-600 hover:underline"
          >
            Limpar filtros
          </button>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredManuais.map((manual, idx) => (
          <motion.div
            key={manual.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ManualCard
              manual={manual}
              showAdminMenu={isAdmin}
              onEdit={() => startEdit(manual)}
              onDelete={() => handleDelete(manual.id)}
            />
          </motion.div>
        ))}
      </div>

      {filteredManuais.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-3">Nenhum manual encontrado</p>
          <button
            onClick={() => {
              setSearch('');
              setActiveCategory(null);
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
