export type OutputType =
  | 'positioning'
  | 'landing'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'faq'
  | 'hero'
  | 'logo'
  | 'social-image'
  | 'og';

export interface TextOutput {
  id: string;
  type: OutputType;
  content: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  error?: string;
}

export interface ImageOutput {
  id: string;
  type: OutputType;
  url: string;
  dataUrl?: string;
  width: number;
  height: number;
  status: 'pending' | 'loading' | 'done' | 'error';
  error?: string;
}

export type AnyOutput = TextOutput | ImageOutput;

export interface LaunchKit {
  idea: string;
  outputs: AnyOutput[];
  createdAt: number;
}
