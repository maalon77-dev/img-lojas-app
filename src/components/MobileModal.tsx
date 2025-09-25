import React from 'react';
import { X, Download, Edit, Plus, RefreshCw } from 'lucide-react';
import { ImageFormat } from '../types';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  onDownload: (format: ImageFormat) => void;
  onEdit: () => void;
  onNewImage: () => void;
  onGenerateVariation: () => void;
}

const MobileModal: React.FC<MobileModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onDownload,
  onEdit,
  onNewImage,
  onGenerateVariation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Ações</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Image Preview */}
          {imageUrl && (
            <div className="mb-4">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Download Options */}
            <button
              onClick={() => onDownload('png')}
              className="flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PNG</span>
            </button>
            
            <button
              onClick={() => onDownload('jpg')}
              className="flex items-center justify-center space-x-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>JPG</span>
            </button>

            {/* Edit */}
            <button
              onClick={onEdit}
              className="flex items-center justify-center space-x-2 p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>

            {/* Generate Variation */}
            <button
              onClick={onGenerateVariation}
              className="flex items-center justify-center space-x-2 p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Variação</span>
            </button>

            {/* New Image */}
            <button
              onClick={onNewImage}
              className="flex items-center justify-center space-x-2 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors col-span-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Imagem</span>
            </button>
          </div>

          {/* Additional Download Options */}
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600 mb-2">Outros formatos:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => onDownload('webp')}
                className="flex-1 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                WebP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileModal;
