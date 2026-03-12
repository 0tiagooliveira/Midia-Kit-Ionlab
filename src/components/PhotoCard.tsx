import { useState, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';

export interface FotoProduct {
  id: string;
  name: string;
  images: string[];
  brand: string;
  model: string;
  category: string;
}

export default function PhotoCard({ product }: { product: FotoProduct }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const images = product.images.filter(Boolean);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const prev = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(i => (i > 0 ? i - 1 : images.length - 1));
  };
  const next = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(i => (i < images.length - 1 ? i + 1 : 0));
  };

  async function downloadAllAsZip() {
    setDownloading(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const folderName = product.model || product.name;
      await Promise.all(
        images.map(async (url, i) => {
          try {
            const res = await fetch(url);
            const blob = await res.blob();
            const ext = url.split('.').pop()?.split('?')[0].toLowerCase() || 'jpg';
            zip.file(`${folderName}_${i + 1}.${ext}`, blob);
          } catch {
            // skip image if blocked by CORS or network error
          }
        })
      );
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      {/* Image area */}
      <div className="relative aspect-square bg-gray-50 flex-shrink-0">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-contain p-3"
          loading="lazy"
        />

        {/* Image counter */}
        {hasMultiple && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
            {currentIndex + 1}/{images.length}
          </div>
        )}

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Download button */}
      </div>

      {/* Fixed thumbnails strip keeps button aligned across all cards */}
      <div className="h-[56px] px-2 py-2 border-t border-gray-50 flex-shrink-0">
        {hasMultiple ? (
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`flex-shrink-0 w-9 h-9 rounded border-2 overflow-hidden transition-all ${
                  i === currentIndex
                    ? 'border-[var(--color-ion-blue)]'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={img}
                  alt={`thumb-${i + 1}`}
                  className="w-full h-full object-contain bg-gray-50"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-[11px] font-medium text-gray-300 uppercase tracking-wide">1 imagem</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-3 flex flex-col gap-1 min-h-[110px]">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-3">{product.name}</h3>
        {product.model && (
          <span className="inline-block self-start bg-blue-50 text-blue-700 text-xs font-mono px-2 py-0.5 rounded mt-1">
            {product.model}
          </span>
        )}
      </div>

      {/* Download all images as ZIP - VideoCard style */}
      <div className="px-3 pb-3 mt-auto">
        <button
          onClick={downloadAllAsZip}
          disabled={downloading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-ion-blue)] to-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-[0_6px_14px_rgba(0,86,179,0.35)] hover:shadow-[0_8px_18px_rgba(0,86,179,0.45)] hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:shadow-none"
        >
          {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          <span>{downloading ? 'Baixando...' : 'Download Fotos'}</span>
        </button>
      </div>
    </div>
  );
}
