import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Palette, Settings } from 'lucide-react';
import { 
  AppMode, 
  CreateFunction, 
  EditFunction, 
  AspectRatio, 
  RetouchStyle, 
  StyleFunctionStyle, 
  CreateStyle, 
  ImageData 
} from '../types';

interface LeftPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  createFn: CreateFunction;
  setCreateFn: (fn: CreateFunction) => void;
  editFn: EditFunction;
  setEditFn: (fn: EditFunction) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  retouchStyle: RetouchStyle;
  setRetouchStyle: (style: RetouchStyle) => void;
  styleFunctionStyle: StyleFunctionStyle;
  setStyleFunctionStyle: (style: StyleFunctionStyle) => void;
  createStyles: CreateStyle[];
  setCreateStyles: React.Dispatch<React.SetStateAction<CreateStyle[]>>;
  image1: ImageData | null;
  setImage1: (image: ImageData | null) => void;
  image2: ImageData | null;
  setImage2: (image: ImageData | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onBackToEdit: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  prompt,
  setPrompt,
  mode,
  setMode,
  createFn,
  setCreateFn,
  editFn,
  setEditFn,
  aspectRatio,
  setAspectRatio,
  retouchStyle,
  setRetouchStyle,
  styleFunctionStyle,
  setStyleFunctionStyle,
  createStyles,
  setCreateStyles,
  image1,
  setImage1,
  image2,
  setImage2,
  onGenerate,
  isLoading,
  onBackToEdit
}) => {
  const handleImageUpload = useCallback((setImage: (image: ImageData | null) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImage({ file, previewUrl });
      }
    };
    input.click();
  }, []);

  const removeImage = useCallback((setImage: (image: ImageData | null) => void) => {
    setImage(null);
  }, []);

  const toggleCreateStyle = useCallback((style: CreateStyle) => {
    setCreateStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  }, [setCreateStyles]);

  const createFunctionOptions: { value: CreateFunction; label: string; icon: React.ReactNode }[] = [
    { value: 'free', label: 'Livre', icon: <Palette className="w-4 h-4" /> },
    { value: 'thumbnail', label: 'Thumbnail', icon: <ImageIcon className="w-4 h-4" /> },
    { value: 'logo', label: 'Logo', icon: <Settings className="w-4 h-4" /> },
    { value: 'banner', label: 'Banner', icon: <ImageIcon className="w-4 h-4" /> }
  ];

  const editFunctionOptions: { value: EditFunction; label: string; icon: React.ReactNode }[] = [
    { value: 'add-remove', label: 'Adicionar/Remover', icon: <Settings className="w-4 h-4" /> },
    { value: 'retouch', label: 'Retoque', icon: <Palette className="w-4 h-4" /> },
    { value: 'style', label: 'Estilo', icon: <Palette className="w-4 h-4" /> },
    { value: 'compose', label: 'Unir', icon: <ImageIcon className="w-4 h-4" /> }
  ];

  const aspectRatioOptions: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: '1:1 (Quadrado)' },
    { value: '16:9', label: '16:9 (Widescreen)' },
    { value: '9:16', label: '9:16 (Vertical)' },
    { value: '4:3', label: '4:3 (Clássico)' },
    { value: '3:4', label: '3:4 (Retrato)' },
    { value: '21:9', label: '21:9 (Ultra-wide)' }
  ];

  const retouchStyleOptions: { value: RetouchStyle; label: string }[] = [
    { value: 'none', label: 'Nenhum' },
    { value: 'enhance', label: 'Melhorar' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'modern', label: 'Moderno' },
    { value: 'artistic', label: 'Artístico' }
  ];

  const styleFunctionOptions: { value: StyleFunctionStyle; label: string }[] = [
    { value: 'none', label: 'Nenhum' },
    { value: 'oil-painting', label: 'Pintura a Óleo' },
    { value: 'watercolor', label: 'Aquarela' },
    { value: 'sketch', label: 'Desenho' },
    { value: 'pop-art', label: 'Pop Art' },
    { value: 'cyberpunk', label: 'Cyberpunk' }
  ];

  const createStyleOptions: { value: CreateStyle; label: string }[] = [
    { value: 'cinematic', label: 'Cinematográfico' },
    { value: '8k', label: '8K Ultra' },
    { value: 'realistic', label: 'Realista' },
    { value: 'illustration', label: 'Ilustração' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Invente com IA</h1>
        <p className="text-gray-600">Estúdio de Criação de Imagens</p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Modo</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode('create')}
            className={`p-3 rounded-lg border-2 transition-all ${
              mode === 'create'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Palette className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Criar</span>
            </div>
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`p-3 rounded-lg border-2 transition-all ${
              mode === 'edit'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Settings className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Editar</span>
            </div>
          </button>
        </div>
      </div>

      {/* Function Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {mode === 'create' ? 'Função de Criação' : 'Função de Edição'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(mode === 'create' ? createFunctionOptions : editFunctionOptions).map((option) => (
            <button
              key={option.value}
              onClick={() => mode === 'create' ? setCreateFn(option.value as CreateFunction) : setEditFn(option.value as EditFunction)}
              className={`p-3 rounded-lg border-2 transition-all ${
                (mode === 'create' ? createFn : editFn) === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                {option.icon}
                <span className="text-xs font-medium mt-1 block">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descreva sua ideia..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Image Upload */}
      {mode === 'edit' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Imagens</label>
          
          {/* Image 1 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Imagem Principal</label>
            {image1 ? (
              <div className="relative">
                <img src={image1.previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={() => removeImage(setImage1)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleImageUpload(setImage1)}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Clique para upload</span>
                </div>
              </button>
            )}
          </div>

          {/* Image 2 - Only for compose function */}
          {editFn === 'compose' && (
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Segunda Imagem</label>
              {image2 ? (
                <div className="relative">
                  <img src={image2.previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(setImage2)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleImageUpload(setImage2)}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Clique para upload</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Proporção</label>
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {aspectRatioOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Style Options */}
      {mode === 'create' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Estilos</label>
          <div className="grid grid-cols-2 gap-2">
            {createStyleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleCreateStyle(option.value)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  createStyles.includes(option.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Retouch Style - Only for edit mode with retouch function */}
      {mode === 'edit' && editFn === 'retouch' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Estilo de Retoque</label>
          <select
            value={retouchStyle}
            onChange={(e) => setRetouchStyle(e.target.value as RetouchStyle)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {retouchStyleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Style Function - Only for edit mode with style function */}
      {mode === 'edit' && editFn === 'style' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Estilo de Função</label>
          <select
            value={styleFunctionStyle}
            onChange={(e) => setStyleFunctionStyle(e.target.value as StyleFunctionStyle)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {styleFunctionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Gerando...' : 'Gerar Imagem'}
      </button>

      {/* Back Button for Edit Functions */}
      {mode === 'edit' && editFn !== 'add-remove' && (
        <button
          onClick={onBackToEdit}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Voltar às Funções
        </button>
      )}
    </div>
  );
};

export default LeftPanel;
