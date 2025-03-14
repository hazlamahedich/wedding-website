import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CursorContextProps, CursorType, CursorTheme, CursorIntensity, CursorTexture } from '../types/cursor';

const defaultCursorContext: CursorContextProps = {
  type: 'default',
  isHovering: false,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  updateCursorType: () => {},
  updateCursorText: () => {},
  updateCursorTheme: () => {},
  updateCursorIntensity: () => {},
  updateCursorTexture: () => {},
  updateCursorAccent: () => {},
  updateIsHovering: () => {},
};

const CursorContext = createContext<CursorContextProps>(defaultCursorContext);

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider = ({ children }: CursorProviderProps) => {
  const [type, setType] = useState<CursorType>('default');
  const [text, setText] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<CursorTheme | undefined>('rustyBlue');
  const [intensity, setIntensity] = useState<CursorIntensity | undefined>('medium');
  const [texture, setTexture] = useState<CursorTexture | undefined>('smooth');
  const [accent, setAccent] = useState<string | undefined>(undefined);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [timestamp, setTimestamp] = useState(0);

  const updateCursorType = (newType: CursorType) => setType(newType);
  const updateCursorText = (newText: string | undefined) => setText(newText);
  const updateCursorTheme = (newTheme: CursorTheme | undefined) => setTheme(newTheme);
  const updateCursorIntensity = (newIntensity: CursorIntensity | undefined) => setIntensity(newIntensity);
  const updateCursorTexture = (newTexture: CursorTexture | undefined) => setTexture(newTexture);
  const updateCursorAccent = (newAccent: string | undefined) => setAccent(newAccent);
  const updateIsHovering = (newIsHovering: boolean) => setIsHovering(newIsHovering);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const now = performance.now();
      const deltaTime = now - timestamp;
      
      if (deltaTime > 0) {
        const newPosition = { x: e.clientX, y: e.clientY };
        const newVelocity = {
          x: (newPosition.x - prevPosition.x) / deltaTime,
          y: (newPosition.y - prevPosition.y) / deltaTime,
        };
        
        setPosition(newPosition);
        setVelocity(newVelocity);
        setPrevPosition(newPosition);
        setTimestamp(now);
      }
    };

    // Add event listener for mouse movement
    window.addEventListener('mousemove', updateMousePosition);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [prevPosition, timestamp]);

  const value = {
    type,
    text,
    theme,
    intensity,
    texture,
    accent,
    isHovering,
    position,
    velocity,
    updateCursorType,
    updateCursorText,
    updateCursorTheme,
    updateCursorIntensity,
    updateCursorTexture,
    updateCursorAccent,
    updateIsHovering,
  };

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
};

export const useCursor = () => useContext(CursorContext); 