import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <img 
                src="https://images.tcdn.com.br/files/1357340/themes/65/img/settings/E-commerce.png?da96ae01df019aac90648d556630d406" 
                alt="IonLab Logo" 
                className="h-10 w-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-gray-400 text-xs uppercase tracking-widest leading-relaxed max-w-xs">
              Portal oficial de recursos visuais, vídeos e materiais de marketing da IonLab.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-ion-dark mb-6 uppercase tracking-widest text-sm">Acesso Rápido</h4>
            <ul className="space-y-3 text-xs uppercase tracking-widest font-bold text-gray-400">
              <li><Link to="/catalogos" className="hover:text-ion-blue transition-colors">Catálogos</Link></li>
              <li><Link to="/videos" className="hover:text-ion-blue transition-colors">Vídeos</Link></li>
              <li><Link to="/manuais" className="hover:text-ion-blue transition-colors">Manuais</Link></li>
              <li><Link to="/fotos" className="hover:text-ion-blue transition-colors">Fotos</Link></li>
              <li><Link to="/artes" className="hover:text-ion-blue transition-colors">Social Media</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-ion-dark mb-6 uppercase tracking-widest text-sm">Contato</h4>
            <ul className="space-y-3 text-xs uppercase tracking-widest font-bold text-gray-400">
              <li>marketing@ionlab.com.br</li>
              <li>(41) 3501-7200</li>
              <li>Seg - Sex: 08h - 18h</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} IonLab. Todos os direitos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600">Privacidade</a>
            <a href="#" className="hover:text-blue-600">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
