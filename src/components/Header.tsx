import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Shield, LogOut, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { trackNavigationClick } from '../lib/analytics';
import { useAdminSession } from '../hooks/useAdminSession';
import { auth } from '../firebase';

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

function AdminProfileMenu(props: {
  isAdmin: boolean;
  email?: string | null;
  photoURL?: string | null;
  avatarLabel: string;
  mobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!props.isAdmin) {
    return null;
  }

  const baseSize = props.mobile ? 'h-6 w-6' : 'h-7 w-7';
  const textSize = props.mobile ? 'text-[9px]' : 'text-[10px]';
  const statusSize = props.mobile ? 'h-2 w-2' : 'h-2.5 w-2.5';

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = '/admin';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn('relative overflow-hidden rounded-full border-2 border-emerald-200 shadow-sm', baseSize)}
        title={props.email || 'Administrador conectado'}
      >
        {props.photoURL ? (
          <img src={props.photoURL} alt="Perfil admin" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className={cn('flex h-full w-full items-center justify-center bg-emerald-50 font-black uppercase text-emerald-700', textSize)}>
            {props.avatarLabel}
          </div>
        )}
        <span className={cn('absolute -bottom-0.5 -right-0.5 rounded-full border border-white bg-emerald-500', statusSize)} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">Administrador</p>
            <p className="mt-1 break-all text-xs text-slate-600">{props.email}</p>
          </div>

          <a
            href="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(false)}
          >
            <Shield size={14} />
            Painel Admin
          </a>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 hover:bg-slate-100"
            onClick={() => {
              setOpen(false);
              window.location.reload();
            }}
          >
            <RefreshCw size={14} />
            Atualizar Sessao
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const { isAdmin, user } = useAdminSession();

  const avatarLabel =
    user?.displayName?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    'A';

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
              <div key={item.path} className="flex items-center gap-2">
                <a
                  href={item.path}
                  onClick={() => handleNavClick(item, 'header_desktop')}
                  className={cn(
                    'text-xs uppercase tracking-[0.14em] font-bold transition-colors duration-200',
                    isActive(item) ? 'text-[#1767ae]' : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {item.name}
                </a>
                {isAdmin && item.name === 'Contato' ? (
                  <AdminProfileMenu
                    isAdmin={isAdmin}
                    email={user?.email}
                    photoURL={user?.photoURL}
                    avatarLabel={avatarLabel}
                  />
                ) : null}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile nav — horizontal scroll strip, same as Catalogos-Ionlab */}
        <nav className="mt-3 flex gap-5 overflow-x-auto no-scrollbar border-t border-slate-200/70 pt-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <div key={item.path} className="flex items-center gap-2">
              <a
                href={item.path}
                onClick={() => handleNavClick(item, 'header_mobile')}
                className={cn(
                  'whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200',
                  isActive(item) ? 'text-[#1767ae]' : 'text-slate-400'
                )}
              >
                {item.name}
              </a>
              {isAdmin && item.name === 'Contato' ? (
                <AdminProfileMenu
                  isAdmin={isAdmin}
                  email={user?.email}
                  photoURL={user?.photoURL}
                  avatarLabel={avatarLabel}
                  mobile
                />
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
