import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Manuais from './pages/Manuais';
import Fotos from './pages/Fotos';
import Contato from './pages/Contato';
import { useEffect } from 'react';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

function ScrollToTop() {
  const { pathname } = window.location;
  useEffect(() => {
    window.scrollTo(0, 0);
    if (analytics) {
      logEvent(analytics, 'page_view', { page_path: pathname });
    }
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
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
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
