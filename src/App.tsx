import React, { useState, useCallback, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import MobileModal from './components/MobileModal';
import HistoryPanel from './components/HistoryPanel';
import { AppMode, CreateFunction, EditFunction, ViewState, ImageData, AspectRatio, ImageFormat, RetouchStyle, StyleFunctionStyle, CreateStyle } from './types';
import { generateOrEditImage } from './services/geminiService';

const createStyleInstructions: Record<CreateStyle, string> = {
  cinematic: 'estilo cinematográfico',
  '8k': 'resolução 8k, ultra detalhado',
  realistic: 'fotorrealista, hiper-realismo',
  illustration: 'estilo ilustração, arte digital',
};

// Helper to convert data URL to a File object
const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};

interface GenerationConfig {
  prompt: string;
  mode: AppMode;
  createFn: CreateFunction;
  editFn: EditFunction;
  aspectRatio: AspectRatio;
  retouchStyle: RetouchStyle;
  styleFunctionStyle: StyleFunctionStyle;
  createStyles: CreateStyle[];
  image1: ImageData | null;
  image2: ImageData | null;
}

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<AppMode>('create');
  const [createFn, setCreateFn] = useState<CreateFunction>('free');
  const [editFn, setEditFn] = useState<EditFunction>('add-remove');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [retouchStyle, setRetouchStyle] = useState<RetouchStyle>('none');
  const [styleFunctionStyle, setStyleFunctionStyle] = useState<StyleFunctionStyle>('none');
  const [createStyles, setCreateStyles] = useState<CreateStyle[]>([]);
  
  const [image1, setImage1] = useState<ImageData | null>(null);
  const [image2, setImage2] = useState<ImageData | null>(null);

  const [viewState, setViewState] = useState<ViewState>('placeholder');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [history, setHistory] = useState<string[]>(() => {
    try {
        const savedHistory = localStorage.getItem('invente-ia-history');
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
        console.error("Falha ao carregar o histórico do localStorage", error);
        return [];
    }
  });

  const [comparisonImage, setComparisonImage] = useState<string | null>(null);
  const [lastGenerationConfig, setLastGenerationConfig] = useState<GenerationConfig | null>(null);

  useEffect(() => {
    try {
        localStorage.setItem('invente-ia-history', JSON.stringify(history));
    } catch (error) {
        console.error("Falha ao salvar o histórico no localStorage", error);
    }
  }, [history]);


  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert("Por favor, escreva sua ideia no prompt!");
      return;
    }
    
    const currentConfig: GenerationConfig = {
      prompt,
      mode,
      createFn,
      editFn,
      aspectRatio,
      retouchStyle,
      styleFunctionStyle,
      createStyles,
      image1,
      image2,
    };

    let promptWithStyles = prompt;
    if (mode === 'create' && createStyles.length > 0) {
      const styleKeywords = createStyles.map(style => createStyleInstructions[style]).join(', ');
      promptWithStyles = `${prompt}, ${styleKeywords}`;
    }

    let finalPrompt = `Estilo Invente com IA — realismo, nitidez alta, contraste equilibrado. ${promptWithStyles}`;
    if (mode === 'create' && createFn === 'thumbnail') {
      finalPrompt = `Crie uma thumbnail para YouTube, formato 16:9, chamativa, com cores vibrantes e elementos claros que se destacam. O tema é: ${promptWithStyles}`;
    }
    
    // Store the "before" image for comparison if in edit mode
    const originalImageUrlForComparison = mode === 'edit' && image1 ? image1.previewUrl : null;

    setViewState('loading');
    setGeneratedImage(null);
    setComparisonImage(null);


    try {
      let images: ImageData[] = [];
      if (mode === 'edit') {
        if (editFn === 'compose') {
          if (!image1 || !image2) {
            throw new Error("Selecione as duas imagens para a função 'Unir'.");
          }
          images = [image1, image2];
        } else {
          if (!image1) {
            throw new Error("Selecione uma imagem para editar.");
          }
          images = [image1];
        }
      } else if (mode === 'create' && image1) {
        images = [image1];
      }

      const activeRetouchStyle = mode === 'edit' && editFn === 'retouch' ? retouchStyle : 'none';
      const activeStyleFunctionStyle = mode === 'edit' && editFn === 'style' ? styleFunctionStyle : 'none';
      
      const resultBase64 = await generateOrEditImage(
        finalPrompt, 
        images, 
        aspectRatio, 
        activeRetouchStyle,
        activeStyleFunctionStyle
      );
      const imageUrl = `data:image/png;base64,${resultBase64}`;
      setGeneratedImage(imageUrl);
      setComparisonImage(originalImageUrlForComparison); // Set the comparison image on success
      setViewState('image');
      setLastGenerationConfig(currentConfig);

      // Add to history
      setHistory(prevHistory => [imageUrl, ...prevHistory].slice(0, 12));

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao gerar a imagem.";
      alert(errorMessage);
      setViewState('placeholder');
    }
  }, [prompt, mode, createFn, editFn, image1, image2, aspectRatio, retouchStyle, styleFunctionStyle, createStyles]);
  
  const handleGenerateVariation = useCallback(async () => {
    if (!lastGenerationConfig || !generatedImage) {
        alert("Gere uma imagem primeiro para criar variações.");
        return;
    }
    
    const { 
        prompt: lastPrompt, 
        mode: lastMode, 
        createStyles: lastCreateStyles, 
        createFn: lastCreateFn,
        editFn: lastEditFn,
        image1: lastImage1,
        image2: lastImage2,
        aspectRatio: lastAspectRatio,
        retouchStyle: lastRetouchStyle,
        styleFunctionStyle: lastStyleFunctionStyle
    } = lastGenerationConfig;

    let promptWithStyles = lastPrompt;
    if (lastMode === 'create' && lastCreateStyles.length > 0) {
      const styleKeywords = lastCreateStyles.map(style => createStyleInstructions[style]).join(', ');
      promptWithStyles = `${lastPrompt}, ${styleKeywords}`;
    }

    let finalPrompt = `Estilo Invente com IA — realismo, nitidez alta, contraste equilibrado. ${promptWithStyles}`;
    if (lastMode === 'create' && lastCreateFn === 'thumbnail') {
      finalPrompt = `Crie uma thumbnail para YouTube, formato 16:9, chamativa, com cores vibrantes e elementos claros que se destacam. O tema é: ${promptWithStyles}`;
    }

    const previousImage = generatedImage;
    setViewState('loading');
    setComparisonImage(previousImage); // The current image becomes the "before" image
    setGeneratedImage(null);

    try {
      let images: ImageData[] = [];
      if (lastMode === 'edit') {
        if (lastEditFn === 'compose') {
          if (!lastImage1 || !lastImage2) {
            throw new Error("As imagens originais da função 'Unir' não foram encontradas.");
          }
          images = [lastImage1, lastImage2];
        } else {
          if (!lastImage1) {
            throw new Error("A imagem original para editar não foi encontrada.");
          }
          images = [lastImage1];
        }
      } else if (lastMode === 'create' && lastImage1) {
        images = [lastImage1];
      }

      const activeRetouchStyle = lastMode === 'edit' && lastEditFn === 'retouch' ? lastRetouchStyle : 'none';
      const activeStyleFunctionStyle = lastMode === 'edit' && lastEditFn === 'style' ? lastStyleFunctionStyle : 'none';
      
      const resultBase64 = await generateOrEditImage(
        finalPrompt, 
        images, 
        lastAspectRatio, 
        activeRetouchStyle,
        activeStyleFunctionStyle
      );
      const imageUrl = `data:image/png;base64,${resultBase64}`;
      setGeneratedImage(imageUrl);
      setViewState('image');

      setHistory(prevHistory => [imageUrl, ...prevHistory].slice(0, 12));

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao gerar a variação.";
      alert(errorMessage);
      setGeneratedImage(previousImage);
      setComparisonImage(null);
      setViewState('image');
    }
  }, [lastGenerationConfig, generatedImage]);

  const handleDownload = useCallback((format: ImageFormat) => {
    if (!generatedImage) return;

    const download = (url: string, extension: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `invente-flux.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (format === 'png') {
        download(generatedImage, 'png');
        return;
    }

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, 0, 0);

        const mimeType = `image/${format}`;
        const quality = format === 'jpeg' ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        download(dataUrl, format);
    };
    img.src = generatedImage;
  }, [generatedImage]);


  const startNewImage = () => {
    setGeneratedImage(null);
    setViewState('placeholder');
    setIsModalOpen(false);
    setPrompt('');
    setImage1(null);
    setImage2(null);
    setCreateStyles([]);
    setComparisonImage(null);
    setLastGenerationConfig(null);
  };

  const backToEditFunctions = () => {
    setEditFn('add-remove');
    setImage2(null); 
  };

  const handleSelectFromHistory = useCallback(async (imageUrl: string) => {
    setGeneratedImage(imageUrl);
    setViewState('image');
    setComparisonImage(null); // Clear comparison when loading from history
    setLastGenerationConfig(null); // Variations aren't possible from history yet

    // Prepare image for editing
    const file = await dataUrlToFile(imageUrl, 'history-image.png');
    setImage1({ file, previewUrl: imageUrl });
    
    // Switch to edit mode
    setMode('edit');
    setEditFn('add-remove'); // Default to a common edit function
    setPrompt(''); // Clear prompt for new edit instruction
    window.scrollTo(0, 0); // Scroll to top
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-7xl mx-auto p-4 md:p-5 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4">
        <LeftPanel
          prompt={prompt}
          setPrompt={setPrompt}
          mode={mode}
          setMode={setMode}
          createFn={createFn}
          setCreateFn={setCreateFn}
          editFn={editFn}
          setEditFn={setEditFn}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          retouchStyle={retouchStyle}
          setRetouchStyle={setRetouchStyle}
          styleFunctionStyle={styleFunctionStyle}
          setStyleFunctionStyle={setStyleFunctionStyle}
          createStyles={createStyles}
          setCreateStyles={setCreateStyles}
          image1={image1}
          setImage1={setImage1}
          image2={image2}
          setImage2={setImage2}
          onGenerate={handleGenerate}
          isLoading={viewState === 'loading'}
          onBackToEdit={backToEditFunctions}
        />
        <div className="flex flex-col gap-4">
          <RightPanel
              viewState={viewState}
              generatedImage={generatedImage}
              comparisonImage={comparisonImage}
              onEdit={() => setIsModalOpen(true)}
              onDownload={handleDownload}
              onGenerateVariation={handleGenerateVariation}
          />
          <HistoryPanel history={history} onSelect={handleSelectFromHistory} />
        </div>
        <MobileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={generatedImage}
          onDownload={handleDownload}
          onEdit={() => alert("Edite o prompt e gere novamente.")}
          onNewImage={startNewImage}
          onGenerateVariation={handleGenerateVariation}
        />
      </div>
    </div>
  );
}

export default App;
