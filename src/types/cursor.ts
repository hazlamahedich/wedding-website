export type CursorTheme = 'rustyBlue' | 'filipino' | 'australian';

export type CursorType = 'default' | 'button' | 'gallery' | 'video' | 'link' | 'form';

export type CursorIntensity = 'low' | 'medium' | 'high';

export type CursorTexture = 'smooth' | 'weathered' | 'patina' | 'vintage';

export interface CursorProps {
  enabled?: boolean;
}

export interface CursorContextProps {
  type: CursorType;
  text?: string;
  theme?: CursorTheme;
  intensity?: CursorIntensity;
  texture?: CursorTexture;
  accent?: string;
  isHovering: boolean;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  updateCursorType: (type: CursorType) => void;
  updateCursorText: (text: string | undefined) => void;
  updateCursorTheme: (theme: CursorTheme | undefined) => void;
  updateCursorIntensity: (intensity: CursorIntensity | undefined) => void;
  updateCursorTexture: (texture: CursorTexture | undefined) => void;
  updateCursorAccent: (accent: string | undefined) => void;
  updateIsHovering: (isHovering: boolean) => void;
}

export interface CursorElementProps {
  cursorType?: CursorType;
  cursorText?: string;
  cursorTheme?: CursorTheme;
  cursorIntensity?: CursorIntensity;
  cursorTexture?: CursorTexture;
  cursorAccent?: string;
  children: React.ReactNode;
} 