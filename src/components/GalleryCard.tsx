import { Download, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryCardProps {
  item: GalleryItem;
  showDownload?: boolean;
}

export default function GalleryCard({ item, showDownload = false }: GalleryCardProps) {
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* Overlay - Catalog Style */}
      <div className="absolute inset-0 bg-ion-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{item.title}</h3>
        <div className="flex space-x-3">
          {showDownload && item.downloadUrl && (
            <a
              href={item.downloadUrl}
              className="p-3 bg-white text-ion-blue rounded hover:bg-ion-blue hover:text-white transition-colors shadow-lg"
              title="Download"
            >
              <Download size={18} />
            </a>
          )}
          <button className="p-3 bg-white text-ion-blue rounded hover:bg-ion-blue hover:text-white transition-colors shadow-lg">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4 md:hidden">
        <h3 className="text-xs font-bold text-ion-dark uppercase tracking-widest truncate">{item.title}</h3>
      </div>
    </div>
  );
}
