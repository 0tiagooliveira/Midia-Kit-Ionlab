import { Download, Play, Smartphone, Monitor } from 'lucide-react';
import { VideoItem } from '../types';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface VideoCardProps {
  video: VideoItem;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [format, setFormat] = useState<'horizontal' | 'vertical'>(
    video.youtubeId ? 'horizontal' : 'vertical'
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const activeId = format === 'horizontal' ? video.youtubeId : video.shortsId;

  const handleFormatChange = (newFormat: 'horizontal' | 'vertical') => {
    setFormat(newFormat);
    setIsPlaying(false); // Reset playing state when format changes to show new thumbnail
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
      <div className="p-3 bg-gray-50 border-b border-gray-100 flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest font-bold text-ion-blue bg-blue-50 px-2 py-1 rounded">
            {video.category}
          </span>
        </div>
        
        <div className="flex gap-2">
          {video.youtubeId && (
            <button
              onClick={() => handleFormatChange('horizontal')}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded text-[10px] font-bold uppercase tracking-widest transition-all",
                format === 'horizontal' 
                  ? "bg-ion-blue text-white shadow-md" 
                  : "bg-white text-gray-400 border border-gray-200 hover:border-ion-blue hover:text-ion-blue"
              )}
            >
              <Monitor size={14} />
              <span>Horizontal</span>
            </button>
          )}
          {video.shortsId && (
            <button
              onClick={() => handleFormatChange('vertical')}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded text-[10px] font-bold uppercase tracking-widest transition-all",
                format === 'vertical' 
                  ? "bg-ion-blue text-white shadow-md" 
                  : "bg-white text-gray-400 border border-gray-200 hover:border-ion-blue hover:text-ion-blue"
              )}
            >
              <Smartphone size={14} />
              <span>Vertical</span>
            </button>
          )}
        </div>
      </div>

      <button 
        className="w-full relative bg-black flex items-center justify-center overflow-hidden cursor-pointer group/video border-none p-0 aspect-video"
        onClick={() => !isPlaying && setIsPlaying(true)}
        type="button"
      >
        {activeId ? (
          <>
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0&modestbranding=1&mute=1&playsinline=1`}
                title={video.title}
                className={cn(
                  "absolute inset-0 w-full h-full",
                  format === 'vertical' ? "object-contain" : "object-cover"
                )}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={video.thumbnailUrl || `https://img.youtube.com/vi/${activeId}/hqdefault.jpg`}
                  alt={video.title}
                  className={cn(
                    "w-full h-full transition-opacity duration-500 opacity-80 group-hover/video:opacity-100",
                    format === 'vertical' ? "object-contain bg-black" : "object-cover"
                  )}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-ion-blue/90 text-white rounded-full flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition-transform duration-300">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-xs uppercase tracking-widest font-bold">
            Vídeo não disponível
          </div>
        )}
      </button>

      <div className="p-6 text-center flex-grow flex flex-col justify-between">
        <h3 className="font-bold text-ion-dark mb-4 uppercase tracking-wider text-[13px] leading-tight">
          {video.title}
        </h3>
        <a
          href={video.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center space-x-2 px-6 py-2 bg-ion-blue text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md"
        >
          <Download size={14} />
          <span>Download Materiais</span>
        </a>
      </div>
    </div>
  );
}
