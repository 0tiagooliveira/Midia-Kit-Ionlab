import { FileText, Download } from 'lucide-react';
import { ManualItem } from '../types';
import AdminItemMenu from './admin/AdminItemMenu';

interface ManualCardProps {
  manual: ManualItem;
  showAdminMenu?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ManualCard({ manual, showAdminMenu = false, onEdit, onDelete }: ManualCardProps) {
  return (
    <div className="relative bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-full text-center">
      {showAdminMenu && onEdit && onDelete ? (
        <div className="absolute right-3 top-3 z-10">
          <AdminItemMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      ) : null}
      <div className="w-14 h-14 bg-gray-50 text-ion-blue rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-ion-blue group-hover:text-white transition-colors duration-300">
        <FileText size={28} />
      </div>
      <h3 className="font-bold text-ion-dark mb-3 uppercase tracking-wider text-sm">{manual.title}</h3>
      {manual.discontinued ? (
        <span className="mb-3 inline-block rounded bg-red-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-red-700">
          Descontinuado(a)
        </span>
      ) : null}
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
