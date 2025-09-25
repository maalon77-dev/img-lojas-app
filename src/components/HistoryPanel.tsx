import React from 'react';
import { History, Trash2 } from 'lucide-react';

interface HistoryPanelProps {
  history: string[];
  onSelect: (imageUrl: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  const clearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      // This would need to be passed as a prop or handled by parent
      // For now, we'll just show an alert
      alert('Funcionalidade de limpar histórico será implementada');
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <History className="w-5 h-5 mr-2" />
            Histórico
          </h3>
        </div>
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma imagem no histórico ainda</p>
          <p className="text-sm text-gray-400">Suas criações aparecerão aqui</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <History className="w-5 h-5 mr-2" />
          Histórico ({history.length})
        </h3>
        <button
          onClick={clearHistory}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Limpar histórico"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {history.map((imageUrl, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => onSelect(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`Histórico ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border hover:border-blue-300 transition-colors"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                Usar
              </div>
            </div>

            {/* Index badge */}
            <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Clique em uma imagem para usá-la como base para edição
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
