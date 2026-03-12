import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface NavItem {
  name: string;
  path: string;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Início', path: '/' },
  { name: 'Catálogos', path: 'https://catalogos-ionlab.web.app/', external: true },
  { name: 'Vídeos', path: '/videos' },
  { name: 'Manuais', path: '/manuais' },
  { name: 'Fotos', path: '/fotos' },
  { name: 'Contato', path: '/contato' },
];

export default function Header() {
  const location = useLocation();

  const isActive = (item: NavItem) =>
    !item.external && location.pathname === item.path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        {/* Top row: logo + desktop nav */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="https://images.tcdn.com.br/files/1357340/themes/65/img/settings/E-commerce.png?da96ae01df019aac90648d556630d406"
              alt="IonLab Logo"
              className="h-10 md:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) =>
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  className="text-xs uppercase tracking-[0.14em] font-bold transition-colors duration-200 text-slate-400 hover:text-slate-600"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'text-xs uppercase tracking-[0.14em] font-bold transition-colors duration-200',
                    isActive(item) ? 'text-[#1767ae]' : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Mobile nav — horizontal scroll strip, same as Catalogos-Ionlab */}
        <nav className="mt-3 flex gap-5 overflow-x-auto no-scrollbar border-t border-slate-200/70 pt-3 md:hidden">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.path}
                href={item.path}
                className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200 text-slate-400"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200',
                  isActive(item) ? 'text-[#1767ae]' : 'text-slate-400'
                )}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
