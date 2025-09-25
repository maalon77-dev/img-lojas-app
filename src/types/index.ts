export type AppMode = 'create' | 'edit';

export type CreateFunction = 'free' | 'thumbnail' | 'logo' | 'banner';

export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';

export type ViewState = 'placeholder' | 'loading' | 'image';

export interface ImageData {
  file: File;
  previewUrl: string;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';

export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

export type RetouchStyle = 'none' | 'enhance' | 'vintage' | 'modern' | 'artistic';

export type StyleFunctionStyle = 'none' | 'oil-painting' | 'watercolor' | 'sketch' | 'pop-art' | 'cyberpunk';

export type CreateStyle = 'cinematic' | '8k' | 'realistic' | 'illustration';

export interface GenerationConfig {
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
