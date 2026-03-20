import { useMemo, useState, FormEvent, useEffect } from 'react';
import { VIDEOS } from '../constants';
import VideoCard from '../components/VideoCard';
import { motion } from 'motion/react';
import { useAdminSession } from '../hooks/useAdminSession';
import { db } from '../firebase';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { VideoItem } from '../types';
import AdminItemMenu from '../components/admin/AdminItemMenu';
import AdminModal from '../components/admin/AdminModal';
import { Plus } from 'lucide-react';

type VideoOverride = Partial<VideoItem> & { deleted?: boolean };

export default function Videos() {
  const { isAdmin } = useAdminSession();
  const [overrides, setOverrides] = useState<Record<string, VideoOverride>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: '',
    category: '',
    title: '',
    youtubeId: '',
    shortsId: '',
    thumbnailUrl: '',
    downloadUrl: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'videos'), (snapshot) => {
      const next: Record<string, VideoOverride> = {};
      snapshot.forEach((item) => {
        next[item.id] = item.data() as VideoOverride;
      });
      setOverrides(next);
    });

    return () => unsubscribe();
  }, []);

  const mergedVideos = useMemo(() => {
    const baseIds = new Set(VIDEOS.map((item) => item.id));

    const fromBase = VIDEOS.flatMap((item) => {
      const patch = overrides[item.id];
      if (patch?.deleted) {
        return [];
      }

      return [{ ...item, ...patch, id: item.id } as VideoItem];
    });

    const custom = Object.entries(overrides)
      .filter(([id, item]) => !baseIds.has(id) && !item.deleted)
      .map(([id, item]) => ({
        id,
        category: item.category || 'Sem categoria',
        title: item.title || 'Sem titulo',
        youtubeId: item.youtubeId,
        shortsId: item.shortsId,
        thumbnailUrl: item.thumbnailUrl,
        downloadUrl: item.downloadUrl || '#'
      } as VideoItem));

    return [...fromBase, ...custom].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }, [overrides]);

  const categories = Array.from(new Set(mergedVideos.map(v => v.category))).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const resetForm = () => {
    setEditingId(null);
    setForm({ id: '', category: '', title: '', youtubeId: '', shortsId: '', thumbnailUrl: '', downloadUrl: '' });
    setModalOpen(false);
  };

  const openCreateModal = () => {
    if (!isAdmin) {
      return;
    }

    setEditingId(null);
    setForm({ id: '', category: '', title: '', youtubeId: '', shortsId: '', thumbnailUrl: '', downloadUrl: '' });
    setModalOpen(true);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) {
      return;
    }

    const id = (editingId || form.id || crypto.randomUUID().slice(0, 8)).trim();
    if (!id) return;

    await setDoc(
      doc(db, 'videos', id),
      {
        category: form.category.trim(),
        title: form.title.trim(),
        youtubeId: form.youtubeId.trim() || null,
        shortsId: form.shortsId.trim() || null,
        thumbnailUrl: form.thumbnailUrl.trim() || null,
        downloadUrl: form.downloadUrl.trim() || '#',
        deleted: false,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    resetForm();
  };

  const startEdit = (video: VideoItem) => {
    if (!isAdmin) {
      return;
    }

    setEditingId(video.id);
    setForm({
      id: video.id,
      category: video.category,
      title: video.title,
      youtubeId: video.youtubeId || '',
      shortsId: video.shortsId || '',
      thumbnailUrl: video.thumbnailUrl || '',
      downloadUrl: video.downloadUrl
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      return;
    }

    if (!window.confirm('Deseja excluir este video?')) {
      return;
    }

    const isBaseItem = VIDEOS.some((item) => item.id === id);
    if (isBaseItem) {
      await setDoc(doc(db, 'videos', id), { deleted: true, updatedAt: serverTimestamp() }, { merge: true });
      return;
    }

    await deleteDoc(doc(db, 'videos', id));
  };

  return (
    <div className="container py-16">
      {isAdmin && (
        <section className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-800">Gerenciar Videos</h2>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1767ae] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white"
            >
              <Plus size={14} />
              Novo video
            </button>
          </div>

          <AdminModal open={modalOpen} title={editingId ? 'Editar video' : 'Novo video'} onClose={resetForm}>
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {!editingId && (
                <input value={form.id} onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))} placeholder="ID (opcional para novo)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              )}
              <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Categoria" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Titulo" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <input value={form.youtubeId} onChange={(e) => setForm((prev) => ({ ...prev, youtubeId: e.target.value }))} placeholder="YouTube ID (horizontal)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.shortsId} onChange={(e) => setForm((prev) => ({ ...prev, shortsId: e.target.value }))} placeholder="Shorts ID (vertical)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={form.thumbnailUrl} onChange={(e) => setForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))} placeholder="URL thumbnail (opcional)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <input value={form.downloadUrl} onChange={(e) => setForm((prev) => ({ ...prev, downloadUrl: e.target.value }))} placeholder="URL de download" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">Cancelar</button>
                <button type="submit" className="rounded-lg bg-[#1767ae] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">{editingId ? 'Atualizar' : 'Incluir'}</button>
              </div>
            </form>
          </AdminModal>
        </section>
      )}

      <div className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold text-ion-dark mb-4 uppercase tracking-tight">Vídeos IonLab</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
          Explore nossa biblioteca de vídeos de equipamentos e consumíveis, prontos para uso em apresentações ou redes sociais.
        </p>
      </div>

      <div className="space-y-20">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center space-x-4 mb-8">
              <h2 className="text-xl font-bold text-ion-dark uppercase tracking-widest">{category}</h2>
              <div className="h-[2px] flex-grow bg-gray-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mergedVideos.filter(v => v.category === category).map((video, idx) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <VideoCard
                    video={video}
                    showAdminMenu={isAdmin}
                    onEdit={() => startEdit(video)}
                    onDelete={() => handleDelete(video.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
