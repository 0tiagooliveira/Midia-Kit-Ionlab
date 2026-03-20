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
import { Plus } from 'lucide-react';

type ManualOverride = Partial<ManualItem> & { deleted?: boolean };

export default function Manuais() {
  const { isAdmin } = useAdminSession();
  const [overrides, setOverrides] = useState<Record<string, ManualOverride>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: '', title: '', description: '', downloadUrl: '' });

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
        description: item.description || '',
        downloadUrl: item.downloadUrl || '#'
      } as ManualItem));

    return [...fromBase, ...custom].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }, [overrides]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) {
      return;
    }

    const id = (editingId || form.id || crypto.randomUUID().slice(0, 8)).trim();
    if (!id) return;

    await setDoc(
      doc(db, 'manuais', id),
      {
        title: form.title.trim(),
        description: form.description.trim(),
        downloadUrl: form.downloadUrl.trim() || '#',
        deleted: false,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    setEditingId(null);
    setForm({ id: '', title: '', description: '', downloadUrl: '' });
    setModalOpen(false);
  };

  const startEdit = (manual: ManualItem) => {
    if (!isAdmin) {
      return;
    }

    setEditingId(manual.id);
    setForm({ id: manual.id, title: manual.title, description: manual.description, downloadUrl: manual.downloadUrl });
    setModalOpen(true);
  };

  const openCreateModal = () => {
    if (!isAdmin) {
      return;
    }

    setEditingId(null);
    setForm({ id: '', title: '', description: '', downloadUrl: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setForm({ id: '', title: '', description: '', downloadUrl: '' });
    setModalOpen(false);
  };

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
              {!editingId && (
                <input value={form.id} onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))} placeholder="ID (opcional para novo)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              )}
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Titulo" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descricao" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
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
          Documentação técnica, guias de usuário e manuais de identidade visual da IonLab em formato PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mergedManuais.map((manual, idx) => (
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
    </div>
  );
}
