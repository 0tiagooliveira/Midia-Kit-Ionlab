import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { name: 'Início', path: '/' },
  { name: 'Catálogos', path: '/catalogos' },
  { name: 'Vídeos', path: '/videos' },
  { name: 'Manuais', path: '/manuais' },
  { name: 'Fotos', path: '/fotos' },
  { name: 'Social Media', path: '/artes' },
  { name: 'Contato', path: '/contato' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center mr-8">
          <img 
            src="https://images.tcdn.com.br/files/1357340/themes/65/img/settings/E-commerce.png?da96ae01df019aac90648d556630d406" 
            alt="IonLab Logo" 
            className="h-12 w-auto"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-xs uppercase tracking-widest font-bold transition-colors hover:text-ion-blue",
                location.pathname === item.path ? "text-ion-blue" : "text-gray-400"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-200">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block text-base font-medium",
                location.pathname === item.path ? "text-blue-600" : "text-gray-600"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
