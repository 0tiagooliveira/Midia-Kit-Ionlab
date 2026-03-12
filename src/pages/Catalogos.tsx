import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Catalogos() {
  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {/* Dedicated Top Bar for Navigation */}
      <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4 shrink-0">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-ion-dark hover:text-ion-blue transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Voltar ao Mídia Kit</span>
        </Link>
        <div className="ml-auto">
          <img 
            src="https://images.tcdn.com.br/files/1357340/themes/65/img/settings/E-commerce.png?da96ae01df019aac90648d556630d406" 
            alt="IonLab Logo" 
            className="h-5 w-auto opacity-50"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow w-full relative"
      >
        <iframe 
          src="https://catalogos-ionlab.web.app/" 
          className="absolute inset-0 w-full h-full border-none"
          title="Catálogos IonLab"
          allow="fullscreen"
        />
      </motion.div>
    </div>
  );
}
