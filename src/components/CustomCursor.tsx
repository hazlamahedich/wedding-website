import React, { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useCursor } from '../contexts/CursorContext';
import { gsap } from 'gsap';
import { COLORS, CURSOR, ANIMATION, EASING } from '../constants/theme';
import { CursorProps } from '../types/cursor';

// Keyframes animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const CursorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  will-change: transform;
  overflow: hidden;
`;

interface DotProps {
  type: string;
  isHovering: boolean;
  theme?: string;
}

const Dot = styled.div<DotProps>`
  position: fixed;
  width: ${CURSOR.MAIN_DOT_SIZE};
  height: ${CURSOR.MAIN_DOT_SIZE};
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: ${(props) => 
    props.theme === 'filipino' 
      ? COLORS.FILIPINO_BLUE 
      : props.theme === 'australian'
        ? COLORS.AUSTRALIAN_BLUE
        : COLORS.PRIMARY_RUSTY_BLUE};
  box-shadow: 0 0 10px ${COLORS.WEATHERED_BLUE};
  transition: width 0.3s ${EASING.HOVER_TRANSITION}, 
              height 0.3s ${EASING.HOVER_TRANSITION},
              background-color 0.3s ease;
  pointer-events: none;
  z-index: 9999;
  will-change: transform, width, height;
  
  ${(props) => props.isHovering && css`
    width: ${CURSOR.MAIN_DOT_HOVER_SIZE};
    height: ${CURSOR.MAIN_DOT_HOVER_SIZE};
    
    ${props.type === 'button' && css`
      background-color: ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_RED 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_RED
          : COLORS.LIGHT_RUSTY_BLUE};
      opacity: 0.7;
    `}
    
    ${props.type === 'gallery' && css`
      background-color: ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_YELLOW 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_BLUE
          : COLORS.RUSTY_HIGHLIGHT};
      transform: scale(1.5) translate(-30%, -30%);
    `}
    
    ${props.type === 'video' && css`
      background-color: ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_RED 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_RED
          : COLORS.RUSTY_BLUE_ACCENT};
      clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
      width: 20px;
      height: 20px;
    `}
    
    ${props.type === 'form' && css`
      background-color: ${COLORS.RUSTY_HIGHLIGHT};
      width: 3px;
      height: 24px;
      border-radius: 0;
    `}
    
    ${props.type === 'link' && css`
      background-color: ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_BLUE 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_BLUE
          : COLORS.WEATHERED_BLUE};
      transform: scale(1.8) translate(-25%, -25%);
    `}
  `}
`;

interface RingProps {
  isHovering: boolean;
  type: string;
  theme?: string;
  texture?: string;
}

const Ring = styled.div<RingProps>`
  position: fixed;
  width: ${CURSOR.RING_SIZE};
  height: ${CURSOR.RING_SIZE};
  transform: translate(-50%, -50%);
  border: 1px solid ${(props) => 
    props.theme === 'filipino' 
      ? COLORS.FILIPINO_RED 
      : props.theme === 'australian'
        ? COLORS.AUSTRALIAN_RED
        : COLORS.RUSTY_BLUE_ACCENT};
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  will-change: transform, width, height, border;
  transition: width 0.4s ${EASING.HOVER_TRANSITION}, 
              height 0.4s ${EASING.HOVER_TRANSITION},
              border 0.4s ease;
  animation: ${pulse} ${ANIMATION.RING_PULSE_DURATION} infinite ease-in-out;
  
  ${(props) => props.texture === 'weathered' && css`
    border-style: dashed;
  `}
  
  ${(props) => props.texture === 'patina' && css`
    border-style: double;
    border-width: 2px;
  `}
  
  ${(props) => props.texture === 'vintage' && css`
    border-style: dotted;
  `}
  
  ${(props) => props.isHovering && css`
    width: ${CURSOR.RING_HOVER_SIZE};
    height: ${CURSOR.RING_HOVER_SIZE};
    animation: ${pulse} 1.5s infinite ease-in-out;
    
    ${props.type === 'button' && css`
      width: 60px;
      height: 60px;
      border: 2px solid ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_RED 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_RED
          : COLORS.LIGHT_RUSTY_BLUE};
      border-radius: 30%;
    `}
    
    ${props.type === 'gallery' && css`
      width: 70px;
      height: 70px;
      border: 1.5px solid ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_YELLOW 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_BLUE
          : COLORS.RUSTY_HIGHLIGHT};
    `}
    
    ${props.type === 'video' && css`
      width: 50px;
      height: 50px;
      border: 2px solid ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_RED 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_RED
          : COLORS.RUSTY_BLUE_ACCENT};
      border-radius: 12%;
    `}
    
    ${props.type === 'form' && css`
      width: 30px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid ${COLORS.RUSTY_HIGHLIGHT};
    `}
    
    ${props.type === 'link' && css`
      width: 50px;
      height: 50px;
      border: 2px solid ${props.theme === 'filipino' 
        ? COLORS.FILIPINO_BLUE 
        : props.theme === 'australian'
          ? COLORS.AUSTRALIAN_BLUE
          : COLORS.WEATHERED_BLUE};
    `}
  `}
`;

interface TrailProps {
  theme?: string;
}

const Trail = styled.div<TrailProps>`
  position: fixed;
  width: ${CURSOR.TRAIL_SIZE};
  height: ${CURSOR.TRAIL_SIZE};
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${(props) => 
      props.theme === 'filipino' 
        ? `${COLORS.FILIPINO_BLUE}10` 
        : props.theme === 'australian'
          ? `${COLORS.AUSTRALIAN_BLUE}10`
          : `${COLORS.DARK_RUSTY_BLUE}10`
    },
    transparent 70%
  );
  opacity: 0.15;
  pointer-events: none;
  z-index: 9997;
  will-change: transform;
`;

interface TextLabelProps {
  isVisible: boolean;
}

const TextLabel = styled.div<TextLabelProps>`
  position: fixed;
  transform: translate(-50%, -50%);
  font-family: 'Playfair Display', serif;
  font-size: ${CURSOR.TEXT_LABEL_FONT_SIZE};
  color: ${COLORS.RUSTY_HIGHLIGHT};
  text-shadow: 1px 1px 2px ${COLORS.VINTAGE_BLUE_SHADOW};
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity ${ANIMATION.TEXT_FADE_DURATION} ease;
  will-change: transform, opacity;
  
  ${(props) => props.isVisible && css`
    opacity: 1;
    animation: ${fadeIn} ${ANIMATION.TEXT_FADE_DURATION} ease forwards;
  `}
`;

const CustomCursor: React.FC<CursorProps> = ({ enabled = true }) => {
  const {
    type,
    text,
    theme,
    texture,
    isHovering,
    position,
    velocity,
  } = useCursor();
  
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    const animateCursor = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          x: position.x,
          y: position.y,
          duration: 0.05,
          ease: 'power2.out',
        });
      }
      
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: position.x,
          y: position.y,
          duration: 0.25,
          ease: EASING.RING_FOLLOW,
        });
      }
      
      if (trailRef.current) {
        gsap.to(trailRef.current, {
          x: position.x,
          y: position.y,
          duration: 0.8,
          ease: EASING.TRAIL_FOLLOW,
        });
      }
      
      if (textRef.current) {
        gsap.to(textRef.current, {
          x: position.x,
          y: position.y - 40,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };
    
    gsap.ticker.add(animateCursor);
    
    return () => {
      gsap.ticker.remove(animateCursor);
    };
  }, [enabled, position]);

  // Handle click animation
  useEffect(() => {
    if (!enabled) return;
    
    const handleMouseDown = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 0.85,
          duration: 0.15,
          ease: 'power2.out',
        });
      }
      
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          scale: 0.9,
          duration: 0.15,
          ease: 'power2.out',
        });
      }
    };
    
    const handleMouseUp = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 1,
          duration: 0.2,
          ease: 'elastic.out(1, 0.3)',
        });
      }
      
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled]);

  // Hide default cursor
  useEffect(() => {
    if (enabled) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [enabled]);
  
  // Add font for text labels
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!enabled) return null;

  return (
    <CursorContainer>
      <Dot 
        ref={dotRef} 
        type={type} 
        isHovering={isHovering} 
        theme={theme}
      />
      <Ring 
        ref={ringRef} 
        isHovering={isHovering} 
        type={type} 
        theme={theme} 
        texture={texture}
      />
      <Trail 
        ref={trailRef} 
        theme={theme}
      />
      <TextLabel 
        ref={textRef} 
        isVisible={!!text && isHovering}
      >
        {text}
      </TextLabel>
    </CursorContainer>
  );
};

export default CustomCursor; 