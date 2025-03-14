import React, { useEffect, useRef } from 'react';
import { useCursor } from '../contexts/CursorContext';
import { CursorElementProps } from '../types/cursor';

const CursorElement: React.FC<CursorElementProps> = ({
  cursorType,
  cursorText,
  cursorTheme,
  cursorIntensity,
  cursorTexture,
  cursorAccent,
  children,
}) => {
  const {
    updateCursorType,
    updateCursorText,
    updateCursorTheme,
    updateCursorIntensity,
    updateCursorTexture,
    updateCursorAccent,
    updateIsHovering,
  } = useCursor();
  
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cursorType) updateCursorType(cursorType);
    if (cursorText !== undefined) updateCursorText(cursorText);
    if (cursorTheme !== undefined) updateCursorTheme(cursorTheme);
    if (cursorIntensity !== undefined) updateCursorIntensity(cursorIntensity);
    if (cursorTexture !== undefined) updateCursorTexture(cursorTexture);
    if (cursorAccent !== undefined) updateCursorAccent(cursorAccent);
    updateIsHovering(true);
  };

  const handleMouseLeave = () => {
    updateCursorType('default');
    updateCursorText(undefined);
    updateCursorTheme('rustyBlue');
    updateCursorIntensity('medium');
    updateCursorTexture('smooth');
    updateCursorAccent(undefined);
    updateIsHovering(false);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [
    cursorType,
    cursorText,
    cursorTheme,
    cursorIntensity,
    cursorTexture,
    cursorAccent,
  ]);

  return <div ref={elementRef}>{children}</div>;
};

export default CursorElement; 