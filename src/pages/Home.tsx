import { Link } from 'react-router-dom';
import { Play, FileText, Image, Share2, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

const SECTIONS = [
  {
    title: 'Catálogos',
    description: 'Navegue por nossos catálogos digitais interativos.',
    icon: BookOpen,
    path: '/catalogos',
    color: 'bg-red-500'
  },
  {
    title: 'Vídeos',
    description: 'Assista e baixe nossos vídeos institucionais e de produtos.',
    icon: Play,
    path: '/videos',
    color: 'bg-blue-500'
  },
  {
    title: 'Manuais',
    description: 'Acesse guias técnicos e manuais de identidade visual.',
    icon: FileText,
    path: '/manuais',
    color: 'bg-indigo-500'
  },
  {
    title: 'Fotos',
    description: 'Fotos dos equipamentos em alta resolução.',
    icon: Image,
    path: '/fotos',
    color: 'bg-emerald-500'
  },
  {
    title: 'Social Media',
    description: 'Materiais gráficos prontos para suas redes sociais.',
    icon: Share2,
    path: '/artes',
    color: 'bg-orange-500'
  }
];

export default function Home() {
  return (
    <div className="pb-20">
      {/* Hero Section - Modern & Impactful */}
      <section className="bg-white py-16 md:py-24 overflow-hidden relative border-b border-gray-50">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-ion-blue/10 px-3 py-1 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ion-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-ion-blue"></span>
                </span>
                <span className="text-ion-blue text-[10px] uppercase tracking-widest font-bold">
                  Recursos Oficiais Atualizados
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-ion-dark mb-6 leading-[1.1] uppercase tracking-tighter">
                Mídia Kit <br />
                <span className="text-ion-blue">IonLab</span>
              </h1>
              
              <p className="text-lg text-gray-500 mb-8 leading-relaxed font-medium max-w-lg">
                Sua central definitiva de materiais. Encontre catálogos, vídeos, fotos e manuais técnicos para fortalecer sua comunicação.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('materiais')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary py-4 px-10 flex items-center space-x-3 text-sm shadow-xl shadow-ion-blue/20"
                >
                  <span>Explorar Materiais</span>
                  <ArrowRight size={18} />
                </button>
                <Link
                  to="/catalogos"
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl border-2 border-gray-100 text-ion-dark font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  <BookOpen size={18} className="text-ion-blue" />
                  <span>Catálogos Digitais</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 bg-gradient-to-br from-ion-blue to-blue-700 p-1 rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="bg-white rounded-[1.8rem] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                    alt="Tecnologia Laboratorial" 
                    className="w-full h-[400px] object-cover opacity-90"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-ion-blue/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Sections - Catalog Style */}
      <section id="materiais" className="container py-12 md:py-16">
        <div className="mb-12">
          <h2 className="text-2xl font-black text-ion-dark uppercase tracking-tight flex items-center">
            <span className="w-8 h-1 bg-ion-blue mr-4 rounded-full"></span>
            Categorias de Materiais
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SECTIONS.map((section, idx) => (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={section.path}
                className="group block bg-white p-10 rounded-xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
              >
                <div className={`w-16 h-16 ${section.color} text-white rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <section.icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-ion-dark mb-3 uppercase tracking-wider group-hover:text-ion-blue transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-8 uppercase tracking-widest font-bold">
                  {section.description}
                </p>
                <div className="inline-flex items-center text-ion-blue font-bold text-xs uppercase tracking-widest border-b-2 border-transparent group-hover:border-ion-blue transition-all pb-1">
                  <span>Explorar</span>
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-blue-600 rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Precisa de algo específico?</h2>
            <p className="text-xl text-blue-100 mb-10">
              Se você não encontrou o material que procurava, entre em contato com nossa equipe de marketing.
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
            >
              Falar com o Marketing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
