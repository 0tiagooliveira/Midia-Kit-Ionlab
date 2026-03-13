import { useEffect } from 'react';
import { trackCatalogClick } from '../lib/analytics';

const CATALOGOS_URL = 'https://catalogos-ionlab.web.app/';

export default function CatalogosRedirect() {
  useEffect(() => {
    trackCatalogClick({
      source: 'catalogos_redirect_page',
      destination: CATALOGOS_URL,
      mode: 'automatic'
    });
    window.location.replace(CATALOGOS_URL);
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#1767ae]">
          Redirecionando para Catálogos
        </p>
        <a
          href={CATALOGOS_URL}
          onClick={() => {
            trackCatalogClick({
              source: 'catalogos_redirect_fallback',
              destination: CATALOGOS_URL,
              mode: 'manual'
            });
          }}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Se nao abrir automaticamente, clique aqui.
        </a>
      </div>
    </div>
  );
}