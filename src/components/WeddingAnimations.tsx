import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ANIMATION, COLORS } from '../constants/theme';

// Animation keyframes
const floatUp = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg) translateX(0) translateY(0);
  }
  25% {
    transform: rotate(90deg) translateX(20px) translateY(-20px);
  }
  50% {
    transform: rotate(180deg) translateX(0) translateY(-40px);
  }
  75% {
    transform: rotate(270deg) translateX(-20px) translateY(-20px);
  }
  100% {
    transform: rotate(360deg) translateX(0) translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.2), 
                inset 0 0 5px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 
                inset 0 0 10px rgba(255, 215, 0, 0.3);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.2), 
                inset 0 0 5px rgba(255, 215, 0, 0.1);
  }
`;

const fall = keyframes`
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(calc(20px * var(--random-x))) rotate(calc(360deg * var(--random-spin)));
    opacity: 0;
  }
`;

const sway = keyframes`
  0% {
    transform: rotate(calc(-10deg * var(--random-sway)));
  }
  50% {
    transform: rotate(calc(10deg * var(--random-sway)));
  }
  100% {
    transform: rotate(calc(-10deg * var(--random-sway)));
  }
`;

// Styled components for animations
const AnimationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const Heart = styled.div<{ delay: number; size: number; left: number }>`
  position: absolute;
  bottom: -20px;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${COLORS.FILIPINO_RED};
  transform: rotate(45deg);
  opacity: 0;
  animation: ${floatUp} ${ANIMATION.HEART_FLOAT_DURATION} ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${COLORS.FILIPINO_RED};
    border-radius: 50%;
  }
  
  &:before {
    top: -50%;
    left: 0;
  }
  
  &:after {
    top: 0;
    left: -50%;
  }
`;

const Ring = styled.div<{ delay: number; size: number; top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 3px solid rgba(255, 215, 0, 0.7);
  border-radius: 50%;
  animation: 
    ${spin} ${ANIMATION.RING_SPIN_DURATION} ease-in-out infinite,
    ${shimmer} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay}s, ${props => props.delay + 1}s;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: transparent;
    border: 2px solid rgba(255, 223, 0, 0.5);
  }
`;

const Confetti = styled.div<{ 
  delay: number; 
  size: number; 
  left: number; 
  color: string;
  randomX: number;
  randomSpin: number;
}>`
  position: absolute;
  top: -20px;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  opacity: 0.8;
  animation: ${fall} ${ANIMATION.CONFETTI_FALL_DURATION} linear infinite;
  animation-delay: ${props => props.delay}s;
  --random-x: ${props => props.randomX};
  --random-spin: ${props => props.randomSpin};
`;

const Flower = styled.div<{ 
  delay: number; 
  size: number; 
  top: number;
  left: number;
  randomSway: number;
}>`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 50%;
  animation: ${sway} ${ANIMATION.FLOWER_SWAY_DURATION} ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  --random-sway: ${props => props.randomSway};
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background-color: ${COLORS.FILIPINO_YELLOW};
  }
  
  &:before {
    content: '';
    position: absolute;
    bottom: -${props => props.size / 2}px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: ${props => props.size}px;
    background-color: ${COLORS.AUSTRALIAN_BLUE};
  }
`;

interface WeddingAnimationsProps {
  enabled?: boolean;
}

const WeddingAnimations: React.FC<WeddingAnimationsProps> = ({ enabled = true }) => {
  const [hearts, setHearts] = useState<Array<{ id: number; delay: number; size: number; left: number }>>([]);
  const [rings, setRings] = useState<Array<{ id: number; delay: number; size: number; top: number; left: number }>>([]);
  const [confetti, setConfetti] = useState<Array<{ 
    id: number; 
    delay: number; 
    size: number; 
    left: number; 
    color: string;
    randomX: number;
    randomSpin: number;
  }>>([]);
  const [flowers, setFlowers] = useState<Array<{ 
    id: number; 
    delay: number; 
    size: number; 
    top: number;
    left: number;
    randomSway: number;
  }>>([]);

  useEffect(() => {
    if (!enabled) return;
    
    // Generate hearts
    const newHearts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      size: 10 + Math.random() * 15,
      left: Math.random() * 100
    }));
    setHearts(newHearts);
    
    // Generate rings
    const newRings = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      size: 30 + Math.random() * 20,
      top: 10 + Math.random() * 80,
      left: 10 + Math.random() * 80
    }));
    setRings(newRings);
    
    // Generate confetti
    const confettiColors = [
      COLORS.FILIPINO_BLUE,
      COLORS.FILIPINO_RED,
      COLORS.FILIPINO_YELLOW,
      COLORS.AUSTRALIAN_BLUE,
      COLORS.AUSTRALIAN_RED,
      COLORS.PRIMARY_RUSTY_BLUE,
      COLORS.LIGHT_RUSTY_BLUE,
      'rgba(255, 215, 0, 0.8)',  // Gold
      'rgba(255, 223, 0, 0.7)',  // Light gold
      'rgba(212, 175, 55, 0.8)', // Metallic gold
      'rgba(207, 181, 59, 0.7)'  // Old gold
    ];
    
    const newConfetti = Array.from({ length: 40 }, (_, i) => {
      // Make 40% of confetti gold-colored
      const isGold = Math.random() < 0.4;
      const colorIndex = isGold 
        ? 7 + Math.floor(Math.random() * 4) // Choose from gold colors (indices 7-10)
        : Math.floor(Math.random() * 7);    // Choose from regular colors (indices 0-6)
      
      return {
        id: i,
        delay: Math.random() * 5,
        size: 5 + Math.random() * 10,
        left: Math.random() * 100,
        color: confettiColors[colorIndex],
        randomX: Math.random() * 5 - 2.5,
        randomSpin: Math.random() * 3
      };
    });
    setConfetti(newConfetti);
    
    // Generate flowers
    const newFlowers = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      size: 15 + Math.random() * 10,
      top: 60 + Math.random() * 30,
      left: 5 + (i * 12),
      randomSway: 0.5 + Math.random()
    }));
    setFlowers(newFlowers);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <AnimationContainer>
      {hearts.map(heart => (
        <Heart 
          key={`heart-${heart.id}`}
          delay={heart.delay}
          size={heart.size}
          left={heart.left}
        />
      ))}
      
      {rings.map(ring => (
        <Ring 
          key={`ring-${ring.id}`}
          delay={ring.delay}
          size={ring.size}
          top={ring.top}
          left={ring.left}
        />
      ))}
      
      {confetti.map(conf => (
        <Confetti 
          key={`confetti-${conf.id}`}
          delay={conf.delay}
          size={conf.size}
          left={conf.left}
          color={conf.color}
          randomX={conf.randomX}
          randomSpin={conf.randomSpin}
        />
      ))}
      
      {flowers.map(flower => (
        <Flower 
          key={`flower-${flower.id}`}
          delay={flower.delay}
          size={flower.size}
          top={flower.top}
          left={flower.left}
          randomSway={flower.randomSway}
        />
      ))}
    </AnimationContainer>
  );
};

export default WeddingAnimations; 