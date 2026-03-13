import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Manuais from './pages/Manuais';
import Fotos from './pages/Fotos';
import Contato from './pages/Contato';
import CatalogosRedirect from './pages/CatalogosRedirect';
import { useEffect } from 'react';
import { setAnalyticsUserProps, trackPageView } from './lib/analytics';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Início | Mídia Kit IonLab',
  '/catalogos': 'Catálogos | Mídia Kit IonLab',
  '/videos': 'Vídeos | Mídia Kit IonLab',
  '/manuais': 'Manuais | Mídia Kit IonLab',
  '/fotos': 'Fotos | Mídia Kit IonLab',
  '/contato': 'Contato | Mídia Kit IonLab'
};

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const pageTitle = PAGE_TITLES[pathname] || 'Mídia Kit IonLab';

    document.title = pageTitle;
    window.scrollTo(0, 0);

    trackPageView(pathname, pageTitle);
  }, [location.pathname]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogos" element={<CatalogosRedirect />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/manuais" element={<Manuais />} />
          <Route path="/fotos" element={<Fotos />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    setAnalyticsUserProps({
      site_language: 'pt-br',
      app_name: 'midia-kit-ionlab'
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
