import { VIDEOS } from '../constants';
import VideoCard from '../components/VideoCard';
import { motion } from 'motion/react';

export default function Videos() {
  const categories = Array.from(new Set(VIDEOS.map(v => v.category))).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  return (
    <div className="container py-16">
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
              {VIDEOS.filter(v => v.category === category).map((video, idx) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
