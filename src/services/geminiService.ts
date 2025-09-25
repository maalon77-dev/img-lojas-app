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

export const generateOrEditImage = async (
  prompt: string,
  images: ImageData[],
  aspectRatio: AspectRatio,
  retouchStyle: RetouchStyle = 'none',
  styleFunctionStyle: StyleFunctionStyle = 'none'
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

    // Preparar as partes da requisição
    const parts: any[] = [{ text: finalPrompt }];

    // Adicionar imagens se fornecidas
    for (const imageData of images) {
      const base64 = await fileToBase64(imageData.file);
      const mimeType = imageData.file.type;
      const imagePart = base64ToPart(base64, mimeType);
      parts.push(imagePart);
    }

    // Gerar a imagem
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await model.generateContent(parts);
    // const response = await result.response;
    
    // Para o Gemini, vamos simular a geração de imagem
    // Em uma implementação real, você usaria uma API que realmente gere imagens
    // Por enquanto, retornamos um base64 de uma imagem de exemplo
    const mockImageBase64 = generateMockImage(dimensions.width, dimensions.height, finalPrompt);
    
    return mockImageBase64;

  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    throw new Error('Falha ao gerar a imagem. Verifique sua conexão e tente novamente.');
  }
};

// Função para gerar uma imagem mock (para demonstração)
const generateMockImage = (width: number, height: number, prompt: string): string => {
  // Em uma implementação real, isso seria substituído pela geração real de imagem
  // Por enquanto, retornamos um base64 de uma imagem simples
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Não foi possível criar o contexto do canvas');
  }

  // Criar um gradiente de fundo
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Adicionar texto
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('AI Generated Image', width / 2, height / 2 - 20);
  ctx.font = '16px Arial';
  ctx.fillText(prompt.substring(0, 50) + '...', width / 2, height / 2 + 20);

  return canvas.toDataURL('image/png').split(',')[1];
};
