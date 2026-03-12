import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Product } from '../data/products';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleDownload = async (e: React.MouseEvent, url: string, filename: string) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback for cross-origin issues
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      {/* Category Badge */}
      <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-widest font-bold text-ion-blue bg-blue-50 px-2 py-1 rounded">
          {product.category}
        </span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
          {product.brand}
        </span>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-square bg-white flex items-center justify-center p-4 group/gallery">
        {product.images.length > 0 ? (
          <>
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-white text-gray-700"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-white text-gray-700"
                >
                  <ChevronRight size={18} />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {product.images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        idx === currentImageIndex ? "bg-ion-blue w-3" : "bg-gray-300"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Download Button overlay */}
            <button
              onClick={(e) => handleDownload(e, product.images[currentImageIndex], product.model)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-ion-blue hover:text-white text-gray-600"
              title="Baixar imagem (PNG)"
            >
              <Download size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-widest font-medium">Sem imagem</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow border-t border-gray-50">
        <div className="mb-1">
          <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {product.model}
          </span>
        </div>
        <h3 className="font-bold text-ion-dark text-sm leading-snug mt-2 line-clamp-3" title={product.name}>
          {product.name}
        </h3>
      </div>
    </div>
  );
}

export default ProductCard;
