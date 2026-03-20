import { X } from 'lucide-react';

interface ProgressToastProps {
  isVisible: boolean;
  progress: number;
  total: number;
  onCancel?: () => void;
}

export default function ProgressToast({
  isVisible,
  progress,
  total,
  onCancel,
}: ProgressToastProps) {
  if (!isVisible) return null;

  const current = Math.round((progress / 100) * total);

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
            <p className="text-sm font-semibold text-gray-900">
              Importando {current}/{total} produtos...
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="h-6 w-6 flex items-center justify-center -mr-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Text */}
        <p className="text-xs text-gray-500">
          {progress}% concluído
        </p>
      </div>
    </div>
  );
}
