import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { trackNavigationClick } from '../lib/analytics';

interface NavItem {
  name: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Início', path: 'https://midia-kit-ionlab.web.app/' },
  { name: 'Catálogos', path: 'https://catalogos-ionlab.web.app/' },
  { name: 'Vídeos', path: 'https://midia-kit-ionlab.web.app/videos' },
  { name: 'Manuais', path: 'https://midia-kit-ionlab.web.app/manuais' },
  { name: 'Fotos', path: 'https://midia-kit-ionlab.web.app/fotos' },
  { name: 'Contato', path: 'https://midia-kit-ionlab.web.app/contato' },
];

export default function Header() {
  const location = useLocation();

  const handleNavClick = (item: NavItem, source: 'header_desktop' | 'header_mobile') => {
    const isInternal = item.path.startsWith(window.location.origin);

    trackNavigationClick({
      source,
      label: item.name,
      destination: item.path,
      linkType: isInternal ? 'internal' : 'external'
    });
  };

  const isActive = (item: NavItem) => {
    const current = `${window.location.origin}${location.pathname}`.replace(/\/$/, '');
    const target = item.path.replace(/\/$/, '');
    return current === target;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="hidden md:flex items-center justify-between gap-6">
          <a href="https://midia-kit-ionlab.web.app/" className="flex items-center shrink-0">
            <img
              src="https://images.tcdn.com.br/files/1357340/themes/65/img/settings/E-commerce.png?1c3e1d532ad395d0887b32bd8aab78c5"
              alt="IonLab Logo"
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </a>

          <nav className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => handleNavClick(item, 'header_desktop')}
                className={cn(
                  'text-xs uppercase tracking-[0.14em] font-bold transition-colors duration-200',
                  isActive(item) ? 'text-[#1767ae]' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile nav — horizontal scroll strip, same as Catalogos-Ionlab */}
        <nav className="mt-3 flex gap-5 overflow-x-auto no-scrollbar border-t border-slate-200/70 pt-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={() => handleNavClick(item, 'header_mobile')}
              className={cn(
                'whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200',
                isActive(item) ? 'text-[#1767ae]' : 'text-slate-400'
              )}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
