import { ARTES } from '../constants';
import GalleryCard from '../components/GalleryCard';
import { motion } from 'motion/react';

export default function Artes() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Artes para Redes Sociais</h1>
        <p className="text-gray-500 max-w-2xl">
          Materiais gráficos otimizados para Instagram, Facebook, LinkedIn e outras plataformas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ARTES.map((arte, idx) => (
          <motion.div
            key={arte.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GalleryCard item={arte} showDownload />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
