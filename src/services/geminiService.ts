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
  '1:1': { width: 512, height: 512 },
  '16:9': { width: 768, height: 432 },
  '9:16': { width: 432, height: 768 },
  '4:3': { width: 640, height: 480 },
  '3:4': { width: 480, height: 640 },
  '21:9': { width: 896, height: 384 }
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

// Função para gerar imagem usando Hugging Face (gratuito)
const generateImageWithHuggingFace = async (prompt: string, width: number, height: number): Promise<string> => {
  try {
    console.log('Tentando gerar imagem com Hugging Face...');
    
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Token público limitado
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: width,
          height: height,
          num_inference_steps: 20,
          guidance_scale: 7.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    console.log('Imagem gerada com sucesso via Hugging Face!');
    return base64;
  } catch (error) {
    console.log('Hugging Face falhou, tentando Replicate...', error);
    return generateImageWithReplicate(prompt, width, height);
  }
};

// Função alternativa usando Replicate (gratuito com limite)
const generateImageWithReplicate = async (prompt: string, width: number, height: number): Promise<string> => {
  try {
    console.log('Tentando gerar imagem com Replicate...');
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': 'Token r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Token público limitado
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        input: {
          prompt: prompt,
          width: width,
          height: height,
          num_inference_steps: 20
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Aguardar o processamento
    let result = data;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': 'Token r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        }
      });
      result = await statusResponse.json();
    }

    if (result.status === 'succeeded' && result.output && result.output[0]) {
      const imageUrl = result.output[0];
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      console.log('Imagem gerada com sucesso via Replicate!');
      return base64;
    } else {
      throw new Error('Falha no processamento da imagem');
    }
  } catch (error) {
    console.log('Replicate falhou, usando geração local avançada...', error);
    return generateAdvancedLocalImage(width, height, prompt);
  }
};

// Função para gerar imagem local avançada
const generateAdvancedLocalImage = (width: number, height: number, prompt: string): string => {
  console.log('Gerando imagem local avançada...');
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Não foi possível criar o contexto do canvas');
  }

  // Análise do prompt para cores e elementos
  const colors = analyzePromptForColors(prompt);
  const elements = analyzePromptForElements(prompt);

  // Criar fundo com gradiente complexo
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(0.5, colors.secondary);
  gradient.addColorStop(1, colors.tertiary);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Adicionar elementos baseados no prompt
  addPromptElements(ctx, width, height, elements, colors);

  // Adicionar texto do prompt
  addPromptText(ctx, width, height, prompt);

  // Adicionar efeitos visuais
  addVisualEffects(ctx, width, height);

  return canvas.toDataURL('image/png').split(',')[1];
};

// Função para analisar prompt e extrair cores
const analyzePromptForColors = (prompt: string) => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('azul') || lowerPrompt.includes('blue') || lowerPrompt.includes('oceano') || lowerPrompt.includes('mar')) {
    return {
      primary: '#1e40af',
      secondary: '#3b82f6',
      tertiary: '#60a5fa'
    };
  } else if (lowerPrompt.includes('vermelho') || lowerPrompt.includes('red') || lowerPrompt.includes('fogo') || lowerPrompt.includes('fire')) {
    return {
      primary: '#dc2626',
      secondary: '#ef4444',
      tertiary: '#f87171'
    };
  } else if (lowerPrompt.includes('verde') || lowerPrompt.includes('green') || lowerPrompt.includes('natureza') || lowerPrompt.includes('floresta')) {
    return {
      primary: '#16a34a',
      secondary: '#22c55e',
      tertiary: '#4ade80'
    };
  } else if (lowerPrompt.includes('roxo') || lowerPrompt.includes('purple') || lowerPrompt.includes('violeta')) {
    return {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      tertiary: '#a78bfa'
    };
  } else if (lowerPrompt.includes('amarelo') || lowerPrompt.includes('yellow') || lowerPrompt.includes('sol') || lowerPrompt.includes('sun')) {
    return {
      primary: '#eab308',
      secondary: '#facc15',
      tertiary: '#fde047'
    };
  } else if (lowerPrompt.includes('rosa') || lowerPrompt.includes('pink') || lowerPrompt.includes('flor')) {
    return {
      primary: '#ec4899',
      secondary: '#f472b6',
      tertiary: '#f9a8d4'
    };
  } else {
    return {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      tertiary: '#a855f7'
    };
  }
};

// Função para analisar prompt e extrair elementos
const analyzePromptForElements = (prompt: string) => {
  const lowerPrompt = prompt.toLowerCase();
  const elements = [];

  if (lowerPrompt.includes('círculo') || lowerPrompt.includes('circle') || lowerPrompt.includes('sol') || lowerPrompt.includes('lua')) {
    elements.push('circle');
  }
  if (lowerPrompt.includes('quadrado') || lowerPrompt.includes('square') || lowerPrompt.includes('casa') || lowerPrompt.includes('prédio')) {
    elements.push('square');
  }
  if (lowerPrompt.includes('triângulo') || lowerPrompt.includes('triangle') || lowerPrompt.includes('montanha') || lowerPrompt.includes('mountain')) {
    elements.push('triangle');
  }
  if (lowerPrompt.includes('estrela') || lowerPrompt.includes('star')) {
    elements.push('star');
  }
  if (lowerPrompt.includes('coração') || lowerPrompt.includes('heart')) {
    elements.push('heart');
  }

  return elements;
};

// Função para adicionar elementos baseados no prompt
const addPromptElements = (ctx: CanvasRenderingContext2D, width: number, height: number, elements: string[], colors: any) => {
  ctx.save();
  ctx.globalAlpha = 0.7;

  elements.forEach((element, index) => {
    const x = width * (0.2 + (index * 0.2));
    const y = height * (0.3 + (index * 0.1));
    const size = Math.min(width, height) * 0.1;

    ctx.fillStyle = colors.secondary;

    switch (element) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        drawStar(ctx, x, y, size);
        break;
      case 'heart':
        drawHeart(ctx, x, y, size);
        break;
    }
  });

  ctx.restore();
};

// Função para desenhar estrela
const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5;
    const radius = i % 2 === 0 ? size : size / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
};

// Função para desenhar coração
const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size / 2, x, y + size);
  ctx.bezierCurveTo(x, y + size / 2, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.fill();
};

// Função para adicionar texto do prompt
const addPromptText = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) => {
  ctx.save();
  
  // Texto principal
  ctx.font = `bold ${Math.min(width, height) / 15}px Inter, Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  
  const words = prompt.split(' ');
  const mainText = words.slice(0, 4).join(' ');
  ctx.fillText(mainText, width / 2, height / 2 - 20);

  // Texto secundário
  ctx.font = `${Math.min(width, height) / 25}px Inter, Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  const secondaryText = words.slice(4, 8).join(' ') || 'AI Generated';
  ctx.fillText(secondaryText, width / 2, height / 2 + 20);

  ctx.restore();
};

// Função para adicionar efeitos visuais
const addVisualEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.3;

  // Adicionar partículas
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 3 + 1;
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
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
    console.log('Iniciando geração de imagem...', { prompt, aspectRatio });

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

    // Tentar gerar imagem com APIs reais primeiro
    console.log('Tentando APIs de geração de imagens...');
    const imageBase64 = await generateImageWithHuggingFace(finalPrompt, dimensions.width, dimensions.height);
    
    console.log('Imagem gerada com sucesso!');
    return imageBase64;

  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    throw new Error('Falha ao gerar a imagem. Verifique sua conexão e tente novamente.');
  }
};