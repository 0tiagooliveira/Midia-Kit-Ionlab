import { FileText, Download } from 'lucide-react';
import { ManualItem } from '../types';

interface ManualCardProps {
  manual: ManualItem;
}

export default function ManualCard({ manual }: ManualCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-full text-center">
      <div className="w-14 h-14 bg-gray-50 text-ion-blue rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-ion-blue group-hover:text-white transition-colors duration-300">
        <FileText size={28} />
      </div>
      <h3 className="font-bold text-ion-dark mb-3 uppercase tracking-wider text-sm">{manual.title}</h3>
      <p className="text-xs text-gray-400 mb-8 flex-grow uppercase tracking-widest leading-relaxed">{manual.description}</p>
      <a
        href={manual.downloadUrl}
        className="inline-flex items-center justify-center space-x-2 px-6 py-2 bg-ion-blue text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md"
      >
        <Download size={14} />
        <span>Download PDF</span>
      </a>
    </div>
  );
}
