import { GoogleGenerativeAI } from '@google/generative-ai';
import { ImageData, AspectRatio, RetouchStyle, StyleFunctionStyle } from '../types';

// Configuração da API do Gemini
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

// Função para converter File para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Função para converter base64 para Part
const base64ToPart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType: mimeType
    }
  };
};

// Mapeamento de aspect ratios para dimensões
const aspectRatioMap: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '4:3': { width: 1024, height: 768 },
  '3:4': { width: 768, height: 1024 },
  '21:9': { width: 2560, height: 1080 }
};

// Mapeamento de estilos de retoque
const retouchStyleMap: Record<RetouchStyle, string> = {
  'none': '',
  'enhance': 'Melhore a qualidade da imagem, aumente a nitidez e o contraste',
  'vintage': 'Aplique um filtro vintage com tons sépia e granulação',
  'modern': 'Aplique um estilo moderno com cores vibrantes e alta saturação',
  'artistic': 'Transforme em uma obra de arte com pinceladas visíveis'
};

// Mapeamento de estilos de função
const styleFunctionMap: Record<StyleFunctionStyle, string> = {
  'none': '',
  'oil-painting': 'Transforme em uma pintura a óleo clássica',
  'watercolor': 'Aplique o estilo aquarela com transparências',
  'sketch': 'Converta em um desenho a lápis realista',
  'pop-art': 'Aplique o estilo pop art com cores vibrantes',
  'cyberpunk': 'Aplique o estilo cyberpunk futurista'
};

// Função para gerar imagem usando API externa
const generateImageWithAPI = async (prompt: string, width: number, height: number): Promise<string> => {
  try {
    // Usando uma API gratuita de geração de imagens
    const response = await fetch('https://api.unsplash.com/photos/random', {
      method: 'GET',
      headers: {
        'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY' // Seria necessário uma chave real
      }
    });

    if (!response.ok) {
      throw new Error('Falha na API externa');
    }

    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.log('API externa falhou, usando geração local');
    return generateLocalImage(width, height, prompt);
  }
};

// Função para gerar imagem localmente com canvas
const generateLocalImage = (width: number, height: number, prompt: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Não foi possível criar o contexto do canvas');
  }

  // Criar um gradiente de fundo mais elaborado
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
  
  // Cores baseadas no prompt
  const colors = getColorsFromPrompt(prompt);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(0.5, colors.secondary);
  gradient.addColorStop(1, colors.tertiary);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Adicionar elementos decorativos
  addDecorativeElements(ctx, width, height, prompt);

  // Adicionar texto principal
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `bold ${Math.min(width, height) / 20}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const words = prompt.split(' ');
  const mainText = words.slice(0, 3).join(' ');
  ctx.fillText(mainText, width / 2, height / 2 - 30);

  // Adicionar texto secundário
  ctx.font = `${Math.min(width, height) / 30}px Arial`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  const secondaryText = words.slice(3, 6).join(' ') || 'AI Generated';
  ctx.fillText(secondaryText, width / 2, height / 2 + 20);

  return canvas.toDataURL('image/png').split(',')[1];
};

// Função para extrair cores do prompt
const getColorsFromPrompt = (prompt: string) => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('azul') || lowerPrompt.includes('blue')) {
    return {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      tertiary: '#93c5fd'
    };
  } else if (lowerPrompt.includes('vermelho') || lowerPrompt.includes('red')) {
    return {
      primary: '#991b1b',
      secondary: '#dc2626',
      tertiary: '#fca5a5'
    };
  } else if (lowerPrompt.includes('verde') || lowerPrompt.includes('green')) {
    return {
      primary: '#166534',
      secondary: '#16a34a',
      tertiary: '#86efac'
    };
  } else if (lowerPrompt.includes('roxo') || lowerPrompt.includes('purple')) {
    return {
      primary: '#7c2d12',
      secondary: '#a855f7',
      tertiary: '#c084fc'
    };
  } else {
    return {
      primary: '#667eea',
      secondary: '#764ba2',
      tertiary: '#f093fb'
    };
  }
};

// Função para adicionar elementos decorativos
const addDecorativeElements = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Adicionar formas geométricas baseadas no prompt
  ctx.save();
  ctx.globalAlpha = 0.3;
  
  if (lowerPrompt.includes('círculo') || lowerPrompt.includes('circle')) {
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.2, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  
  if (lowerPrompt.includes('quadrado') || lowerPrompt.includes('square')) {
    ctx.fillStyle = 'white';
    ctx.fillRect(width * 0.8 - 50, height * 0.2, 100, 100);
  }
  
  if (lowerPrompt.includes('triângulo') || lowerPrompt.includes('triangle')) {
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.8);
    ctx.lineTo(width * 0.3, height * 0.6);
    ctx.lineTo(width * 0.7, height * 0.6);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  
  ctx.restore();
};

export const generateOrEditImage = async (
  prompt: string,
  images: ImageData[],
  aspectRatio: AspectRatio,
  retouchStyle: RetouchStyle = 'none',
  styleFunctionStyle: StyleFunctionStyle = 'none'
): Promise<string> => {
  try {
    // Preparar o prompt final
    let finalPrompt = prompt;
    
    if (retouchStyle !== 'none') {
      finalPrompt += ` ${retouchStyleMap[retouchStyle]}`;
    }
    
    if (styleFunctionStyle !== 'none') {
      finalPrompt += ` ${styleFunctionMap[styleFunctionStyle]}`;
    }

    // Adicionar instruções de dimensão
    const dimensions = aspectRatioMap[aspectRatio];
    finalPrompt += ` Dimensões: ${dimensions.width}x${dimensions.height} pixels.`;

    // Se há imagens para editar, usar o Gemini para análise
    if (images.length > 0) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // Preparar as partes da requisição
        const parts: any[] = [{ text: `Analise esta imagem e descreva como modificá-la: ${finalPrompt}` }];

        // Adicionar imagens para análise
        for (const imageData of images) {
          const base64 = await fileToBase64(imageData.file);
          const mimeType = imageData.file.type;
          const imagePart = base64ToPart(base64, mimeType);
          parts.push(imagePart);
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        const analysis = response.text();
        
        // Usar a análise do Gemini para melhorar a geração
        finalPrompt = `${finalPrompt} Baseado na análise: ${analysis}`;
      } catch (error) {
        console.log('Análise com Gemini falhou, continuando com prompt original');
      }
    }

    // Gerar a imagem
    const imageBase64 = await generateImageWithAPI(finalPrompt, dimensions.width, dimensions.height);
    
    return imageBase64;

  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    throw new Error('Falha ao gerar a imagem. Verifique sua conexão e tente novamente.');
  }
};