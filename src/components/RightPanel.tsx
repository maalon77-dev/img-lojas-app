import React from 'react';
import { Download, Edit, RefreshCw, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ViewState, ImageFormat } from '../types';

interface RightPanelProps {
  viewState: ViewState;
  generatedImage: string | null;
  comparisonImage: string | null;
  onEdit: () => void;
  onDownload: (format: ImageFormat) => void;
  onGenerateVariation: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  viewState,
  generatedImage,
  comparisonImage,
  onEdit,
  onDownload,
  onGenerateVariation
}) => {
  const renderContent = () => {
    switch (viewState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-xl">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Gerando sua imagem...</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Nossa IA está trabalhando para criar a imagem perfeita para você. Isso pode levar alguns segundos.
            </p>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            {/* Comparison View */}
            {comparisonImage && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Antes</h3>
                <div className="relative">
                  <img 
                    src={comparisonImage} 
                    alt="Imagem original" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              </div>
            )}

            {/* Generated Image */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                {comparisonImage ? 'Depois' : 'Imagem Gerada'}
              </h3>
              <div className="relative group">
                <img 
                  src={generatedImage!} 
                  alt="Imagem gerada" 
                  className="w-full h-auto rounded-lg border shadow-lg"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={onEdit}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={onGenerateVariation}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Gerar Variação"
                    >
                      <RefreshCw className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onDownload('png')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PNG</span>
              </button>
              <button
                onClick={() => onDownload('jpg')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>JPG</span>
              </button>
              <button
                onClick={() => onDownload('webp')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>WebP</span>
              </button>
              <button
                onClick={onGenerateVariation}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Variação</span>
              </button>
            </div>
          </div>
        );

      default: // placeholder
        return (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Pronto para criar!</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Digite sua ideia no prompt ao lado e clique em "Gerar Imagem" para começar a criar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Visualização</h2>
        <p className="text-gray-600 text-sm">Veja sua criação em tempo real</p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default RightPanel;
