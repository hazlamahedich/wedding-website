import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { COLORS, EASING } from '../constants/theme';
import CursorElement from '../components/CursorElement';
import WeddingAnimations from '../components/WeddingAnimations';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Add pulse animation for hero subtitle
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

// Add a new parallax animation
const parallaxShift = keyframes`
  0% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-10px) translateX(5px); }
  100% { transform: translateY(0) translateX(0); }
`;

// Add a subtle pulse animation for interactive elements
const subtlePulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.3); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
`;

// Add a shimmer effect for decorative elements
const shimmerEffect = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

// Add a reveal animation for hero content
const revealText = keyframes`
  0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
`;

// Add a rotating animation for decorative elements
const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const flipAnimation = keyframes`
  0% {
    transform: rotateY(0deg);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: rotateY(90deg);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: rotateY(180deg);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const flipBackAnimation = keyframes`
  0% {
    transform: rotateY(180deg);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: rotateY(90deg);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: rotateY(0deg);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

// Update the timeline animations for smoother transitions
const timelineItemAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const timelineDotPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(30, 136, 229, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(30, 136, 229, 0);
    transform: scale(1.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(30, 136, 229, 0);
    transform: scale(1);
  }
`;

const timelineProgressGrow = keyframes`
  from {
    height: var(--prev-progress-height);
  }
  to {
    height: var(--progress-height);
  }
`;

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const highlightAnimation = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Add a new animation for timeline content
const timelineContentHighlight = keyframes`
  0% {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 8px 25px rgba(30, 136, 229, 0.3);
  }
  100% {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Add a smooth highlight animation for active timeline items
const activeTimelineItemAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 25px rgba(30, 136, 229, 0.15);
  }
  100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Add a hover animation for timeline dots
const timelineDotHover = keyframes`
  0% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 0 0 rgba(30, 136, 229, 0.4);
  }
  50% {
    transform: translateX(-50%) scale(1.3);
    box-shadow: 0 0 0 8px rgba(30, 136, 229, 0.1);
  }
  100% {
    transform: translateX(-50%) scale(1.2);
    box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.2);
  }
`;

// Improve the timeline scroll reveal animation
const timelineScrollReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  70% {
    opacity: 1;
    transform: translateY(-5px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Styled components
const PageContainer = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  font-family: 'Playfair Display', serif;
  position: relative;
`;

// Enhanced Hero Section with 3D perspective - matching HomePage styling
const HeroSection = styled.section`
  height: calc(100vh - var(--nav-height, 70px));
  width: 100%;
  background-image: 
    linear-gradient(to bottom, rgba(13, 71, 161, 0.6), rgba(30, 136, 229, 0.8));
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 20px;
  position: relative;
  perspective: 800px;
  overflow: hidden;
  margin-top: var(--nav-height, 70px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(255, 215, 0, 0.1) 0%,
      rgba(255, 215, 0, 0.05) 50%,
      transparent 70%
    );
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
    pointer-events: none;
  }
`;

// Replace animated background particles with wedding-themed elements
const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const FloatingElement = styled.div<{ size: number; posX: number; posY: number; delay: number; duration: number; type: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.posY}%;
  left: ${props => props.posX}%;
  animation: ${floatAnimation} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.7;
  background-image: ${props => {
    switch(props.type) {
      case 'heart': return `url('/images/heart-icon.svg')`;
      case 'ring': return `url('/images/ring-icon.svg')`;
      case 'flower': return `url('/images/flower-icon.svg')`;
      case 'leaf': return `url('/images/leaf-icon.svg')`;
      default: return `url('/images/heart-icon.svg')`;
    }
  }};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
`;

// Replace decorative rings with wedding-themed decorative elements
const DecorativeElement = styled.div<{ size: number; posX: number; posY: number; delay: number; duration: number; type: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: ${props => props.type === 'ring' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'};
  border-radius: ${props => props.type === 'ring' ? '50%' : '0'};
  top: ${props => props.posY}%;
  left: ${props => props.posX}%;
  animation: ${props => props.type === 'ring' ? rotateAnimation : floatAnimation} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 1;
  background-image: ${props => {
    switch(props.type) {
      case 'ring': return 'none';
      case 'floral': return `url('/images/floral-decoration.svg')`;
      case 'ribbon': return `url('/images/ribbon-decoration.svg')`;
      default: return 'none';
    }
  }};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.6;
`;

// Enhanced hero content with 3D transform - matching HomePage styling
const HeroContent = styled.div`
  max-width: 800px;
  z-index: 1;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1.2s ease forwards;
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Enhanced hero title with animation
const HeroTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 4.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 
    2px 2px 10px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(255, 215, 0, 0.5);
  color: white;
  position: relative;
  letter-spacing: 2px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 2px;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 215, 0, 0.3), 
      rgba(255, 215, 0, 0.7), 
      rgba(255, 215, 0, 0.3), 
      transparent
    );
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

// Enhanced hero subtitle with animation
const HeroSubtitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.9);
  animation: ${pulse} 8s infinite ease-in-out;
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

// Add cultural accent with animation
const CulturalAccent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  display: flex;
  z-index: 5;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.2)
    );
    animation: ${shimmerEffect} 3s infinite linear;
    pointer-events: none;
  }
`;

const AccentStripe = styled.div<{color: string}>`
  flex: 1;
  height: 100%;
  background-color: ${props => props.color};
  position: relative;
  overflow: hidden;
`;

// Interactive feature buttons
const FeatureButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  animation: ${fadeIn} 1s ease 0.6s forwards;
  opacity: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const FeatureButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 12px 25px;
  color: white;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.5s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 10px 20px;
  }
`;

// Enhanced scroll indicator with interactive animation
const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px;
  border-radius: 30px;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: ${subtlePulse} 2s infinite ease-in-out;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translateX(-50%) translateY(-5px);
    animation-play-state: paused;
  }
`;

const ScrollText = styled.span`
  font-size: 1rem;
  margin-bottom: 8px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  font-weight: 600;
  letter-spacing: 1px;
  color: white;
`;

const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotate(45deg);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

// Event Details Section Styled Components
const ContentSection = styled.section`
  padding: 100px 5%;
  background-color: white;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 70px;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${COLORS.RUSTY_HIGHLIGHT};
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  perspective: 1000px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const DetailCard = styled.div<{ delay: number; isFlipped: boolean }>`
  flex: 0 0 calc(33.333% - 30px);
  height: 400px;
  margin: 0 15px 40px;
  position: relative;
  transform-style: preserve-3d;
  opacity: 0;
  animation: ${fadeIn} 0.8s ${EASING.HOVER_TRANSITION} forwards;
  animation-delay: ${props => props.delay * 0.2}s;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  perspective: 1000px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
  
  &.flipping-forward {
    animation: ${flipAnimation} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  &.flipping-backward {
    animation: ${flipBackAnimation} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  @media (max-width: 1024px) {
    flex: 0 0 calc(50% - 30px);
  }
  
  @media (max-width: 768px) {
    flex: 0 0 calc(100% - 30px);
    max-width: 400px;
  }
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CardFront = styled(CardSide)`
  background-color: white;
  transform: rotateY(0deg);
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const CardBack = styled(CardSide)`
  background-color: ${COLORS.RUSTY_HIGHLIGHT};
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  text-align: center;
  z-index: 1;
`;

const DetailCardImage = styled.div<{ bgImage: string }>`
  height: 200px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
`;

const DetailCardContent = styled.div`
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const DetailCardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: ${COLORS.DARK_RUSTY_BLUE};
`;

const DetailCardText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
  flex: 1;
`;

const DetailCardTime = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  font-weight: 600;
  
  svg {
    margin-right: 10px;
  }
`;

const FlipButton = styled.button`
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  border: none;
  border-radius: 30px;
  padding: 8px 15px;
  font-size: 0.9rem;
  font-family: 'Playfair Display', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  align-self: center;
  
  &:hover {
    background-color: ${COLORS.RUSTY_BLUE_ACCENT};
    transform: translateY(-3px);
  }
  
  svg {
    margin-right: 5px;
  }
`;

const BackCardTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: ${COLORS.DARK_RUSTY_BLUE};
`;

const BackCardContent = styled.div`
  font-size: 1.2rem;
  line-height: 1.8;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 30px;
`;

const BackCardIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 30px;
    height: 30px;
    fill: ${COLORS.PRIMARY_RUSTY_BLUE};
  }
`;

// Timeline Section Styled Components
const TimelineSection = styled.section`
  padding: 100px 5%;
  background-color: ${COLORS.RUSTY_HIGHLIGHT};
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
    opacity: 0.6;
    z-index: -1;
  }
`;

const TimelineContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 100%;
    background-color: rgba(30, 136, 229, 0.3);
    border-radius: 2px;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div<{ isLeft: boolean; delay: number; isActive: boolean }>`
  display: flex;
  justify-content: ${props => props.isLeft ? 'flex-start' : 'flex-end'};
  margin-bottom: 60px;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, opacity;
  
  ${props => props.isActive && css`
    animation: ${activeTimelineItemAnimation} 3s infinite ease-in-out;
  `}
  
  &.in-view {
    animation: ${timelineScrollReveal} 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: ${props => props.delay * 0.15}s;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 60px;
  }
`;

const TimelineDot = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) scale(${props => props.isActive ? 1.2 : 1});
  width: ${props => props.isActive ? '28px' : '18px'};
  height: ${props => props.isActive ? '28px' : '18px'};
  border-radius: 50%;
  background-color: ${props => props.isActive ? COLORS.RUSTY_BLUE_ACCENT : COLORS.PRIMARY_RUSTY_BLUE};
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  will-change: transform, width, height, background-color;
  
  ${props => props.isActive && css`
    animation: ${timelineDotPulse} 2s infinite ease-in-out;
  `}
  
  &:hover {
    transform: translateX(-50%) scale(1.3);
    box-shadow: 0 0 0 5px rgba(30, 136, 229, 0.2);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    transition: transform 0.3s ease-out;
    z-index: -1;
  }
  
  &:hover:before {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0;
    transition: transform 0.5s ease-out, opacity 0.5s ease-out;
  }
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineContent = styled.div<{ isLeft: boolean; isActive: boolean }>`
  width: 45%;
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, box-shadow, background-color;
  
  ${props => props.isActive && css`
    background-color: #f8f9fa;
    box-shadow: 0 8px 25px rgba(30, 136, 229, 0.15);
    transform: translateY(-5px);
  `}
  
  &:before {
    content: '';
    position: absolute;
    top: 20px;
    ${props => props.isLeft ? css`right: -10px;` : css`left: -10px;`}
    width: 20px;
    height: 20px;
    background-color: ${props => props.isActive ? '#f8f9fa' : 'white'};
    transform: rotate(45deg);
    transition: background-color 0.4s ease;
    
    @media (max-width: 768px) {
      left: -10px;
      right: auto;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TimelineTime = styled.div<{ isActive: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.isActive ? COLORS.RUSTY_BLUE_ACCENT : COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 10px;
  transition: color 0.4s ease;
  display: flex;
  align-items: center;
`;

const TimelineTitle = styled.h3<{ isActive: boolean }>`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: ${props => props.isActive ? COLORS.RUSTY_BLUE_ACCENT : COLORS.DARK_RUSTY_BLUE};
  transition: color 0.4s ease;
`;

const TimelineText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
`;

const TimelineIcon = styled.div<{ isActive: boolean }>`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? COLORS.RUSTY_BLUE_ACCENT : COLORS.PRIMARY_RUSTY_BLUE};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
`;

const TimelineProgress = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  background: linear-gradient(to bottom, ${COLORS.RUSTY_BLUE_ACCENT}, ${COLORS.PRIMARY_RUSTY_BLUE});
  z-index: 1;
  --prev-progress-height: 0%;
  --progress-height: 0%;
  height: var(--progress-height);
  animation: ${timelineProgressGrow} 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 10px rgba(30, 136, 229, 0.3);
  border-radius: 3px;
  will-change: height;
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 20px;
`;

const TimelineButton = styled.button`
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 25px;
  font-size: 1rem;
  font-family: 'Playfair Display', serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${COLORS.RUSTY_BLUE_ACCENT};
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(30, 136, 229, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(30, 136, 229, 0.2);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    margin-right: 8px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(-3px);
  }
  
  &:last-child:hover svg {
    transform: translateX(3px);
  }
`;

// FAQ Section styled components
const FAQSection = styled.section`
  padding: 100px 5%;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #f8f9fa 0%, white 50%, #f8f9fa 100%);
`;

const FAQContainer = styled.div`
  max-width: 900px;
  margin: 50px auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FAQItem = styled.div<{ delay: number; isOpen: boolean }>`
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${props => props.isOpen 
    ? '0 15px 30px rgba(30, 136, 229, 0.2)' 
    : '0 5px 15px rgba(0, 0, 0, 0.05)'};
  opacity: 0;
  animation: ${fadeIn} 0.8s ${EASING.HOVER_TRANSITION} forwards;
  animation-delay: ${props => props.delay * 0.15}s;
  transition: all 0.3s ease;
  transform: ${props => props.isOpen ? 'scale(1.03)' : 'scale(1)'};
  position: relative;
  
  &:hover {
    transform: ${props => props.isOpen ? 'scale(1.03)' : 'translateY(-5px)'};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: ${props => props.isOpen ? COLORS.PRIMARY_RUSTY_BLUE : 'transparent'};
    transition: background-color 0.3s ease;
  }
`;

const FAQQuestion = styled.div<{ isOpen: boolean }>`
  background-color: ${props => props.isOpen ? COLORS.PRIMARY_RUSTY_BLUE : 'white'};
  color: ${props => props.isOpen ? 'white' : COLORS.DARK_RUSTY_BLUE};
  padding: 20px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.isOpen ? COLORS.PRIMARY_RUSTY_BLUE : COLORS.RUSTY_HIGHLIGHT};
  }
  
  ${props => props.isOpen && css`
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, 
        rgba(255,255,255,0) 0%, 
        rgba(255,255,255,0.1) 50%, 
        rgba(255,255,255,0) 100%);
      background-size: 200% 100%;
      animation: ${highlightAnimation} 1.5s ease-in-out;
    }
  `}
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  background-color: white;
  padding: ${props => props.isOpen ? '25px 30px' : '0 30px'};
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
`;

const FAQIcon = styled.span<{ isOpen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.isOpen ? 'white' : COLORS.RUSTY_HIGHLIGHT};
  color: ${props => props.isOpen ? COLORS.PRIMARY_RUSTY_BLUE : COLORS.DARK_RUSTY_BLUE};
  transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0)'};
  transition: all 0.3s;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 0.7;
`;

const FAQCategory = styled.div<{ category: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.8rem;
  padding: 3px 8px;
  border-radius: 20px;
  background-color: ${props => {
    switch(props.category) {
      case 'venue': return 'rgba(30, 136, 229, 0.1)';
      case 'attire': return 'rgba(233, 30, 99, 0.1)';
      case 'logistics': return 'rgba(76, 175, 80, 0.1)';
      case 'accommodations': return 'rgba(255, 152, 0, 0.1)';
      default: return 'rgba(30, 136, 229, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.category) {
      case 'venue': return COLORS.PRIMARY_RUSTY_BLUE;
      case 'attire': return '#E91E63';
      case 'logistics': return '#4CAF50';
      case 'accommodations': return '#FF9800';
      default: return COLORS.PRIMARY_RUSTY_BLUE;
    }
  }};
`;

const FAQSearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 40px;
  position: relative;
`;

const FAQSearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  padding-left: 50px;
  border: 2px solid ${COLORS.RUSTY_HIGHLIGHT};
  border-radius: 30px;
  font-size: 1.1rem;
  font-family: 'Playfair Display', serif;
  color: ${COLORS.DARK_RUSTY_BLUE};
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY_RUSTY_BLUE};
    box-shadow: 0 5px 15px rgba(30, 136, 229, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 30px;
  font-size: 1.2rem;
  color: #888;
  animation: ${bounceAnimation} 2s ease infinite;
`;

const FAQCategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

const CategoryButton = styled.button<{ isActive: boolean; category: string }>`
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  background-color: ${props => {
    if (props.isActive) {
      switch(props.category) {
        case 'venue': return COLORS.PRIMARY_RUSTY_BLUE;
        case 'attire': return '#E91E63';
        case 'logistics': return '#4CAF50';
        case 'accommodations': return '#FF9800';
        case 'all': return COLORS.DARK_RUSTY_BLUE;
        default: return COLORS.PRIMARY_RUSTY_BLUE;
      }
    } else {
      return '#f1f1f1';
    }
  }};
  color: ${props => props.isActive ? 'white' : '#666'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
`;

const GlobalStyle = createGlobalStyle`
  .flash {
    animation: flash 1s;
  }
  
  @keyframes flash {
    0%, 50%, 100% {
      opacity: 1;
    }
    25%, 75% {
      opacity: 0.5;
    }
  }
`;

// Add interfaces for particles and rings
interface Particle {
  id: number;
  size: number;
  posX: number;
  posY: number;
  delay: number;
  duration: number;
}

interface Ring {
  id: number;
  size: number;
  posX: number;
  posY: number;
  delay: number;
  duration: number;
}

const DetailsPage: React.FC = () => {
  // Refs for scroll functionality
  const detailsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // State for flipped cards
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  
  // Timeline state
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);
  const [timelineProgress, setTimelineProgress] = useState<number>(0);
  const [isTimelineAutoPlaying, setIsTimelineAutoPlaying] = useState<boolean>(false);
  const timelineAutoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // FAQ state
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  
  // Add a ref for the timeline section
  const timelineSectionRef = useRef<HTMLDivElement>(null);
  
  // Add state to track if timeline is in view
  const [isTimelineInView, setIsTimelineInView] = useState(false);
  
  // Add a ref for each timeline item
  const timelineItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Add state for parallax effect in hero section
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Add state for active feature in hero section
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  // Optimize the scroll to details function
  const scrollToDetails = useCallback(() => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // Handle mouse movement for parallax effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate mouse position relative to the center of the screen
    const x = (clientX / innerWidth - 0.5) * 20; // Adjust multiplier for effect intensity
    const y = (clientY / innerHeight - 0.5) * 20;
    
    setMousePosition({ x, y });
  }, []);
  
  // Generate wedding-themed floating elements
  const generateFloatingElements = useCallback((count: number): any[] => {
    const elements: any[] = [];
    const types = ['heart', 'ring', 'flower', 'leaf'];
    
    for (let i = 0; i < count; i++) {
      elements.push({
        id: i,
        size: Math.random() * 20 + 15, // Random size between 15-35px
        posX: Math.random() * 100, // Random position X (0-100%)
        posY: Math.random() * 100, // Random position Y (0-100%)
        delay: Math.random() * 5, // Random delay (0-5s)
        duration: Math.random() * 5 + 5, // Random duration (5-10s)
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
    
    return elements;
  }, []);
  
  // Generate wedding-themed decorative elements
  const generateDecorativeElements = useCallback((count: number): any[] => {
    const elements: any[] = [];
    const types = ['ring', 'floral', 'ribbon'];
    
    for (let i = 0; i < count; i++) {
      elements.push({
        id: i,
        size: Math.random() * 80 + 50, // Random size between 50-130px
        posX: Math.random() * 100, // Random position X (0-100%)
        posY: Math.random() * 100, // Random position Y (0-100%)
        delay: Math.random() * 2, // Random delay (0-2s)
        duration: Math.random() * 15 + 15, // Random duration (15-30s)
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
    
    return elements;
  }, []);
  
  // Handle feature button click
  const handleFeatureClick = useCallback((feature: string) => {
    setActiveFeature(feature);
    
    // Scroll to the corresponding section
    if (feature === 'timeline') {
      timelineSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (feature === 'details') {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (feature === 'faq') {
      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // Toggle card flip
  const toggleCardFlip = useCallback((index: number) => {
    const cards = document.querySelectorAll('.detail-card');
    const card = cards[index] as HTMLElement;
    
    if (card) {
      if (flippedCards.includes(index)) {
        // Flipping back
        card.classList.add('flipping-backward');
        setTimeout(() => {
          card.classList.remove('flipping-backward');
          setFlippedCards(flippedCards.filter(i => i !== index));
        }, 800);
      } else {
        // Flipping forward
        card.classList.add('flipping-forward');
        setTimeout(() => {
          card.classList.remove('flipping-forward');
          setFlippedCards([...flippedCards, index]);
        }, 800);
      }
    }
  }, [flippedCards]);
  
  // Toggle FAQ
  const toggleFAQ = useCallback((index: number) => {
    if (openFAQ === index) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(index);
    }
  }, [openFAQ]);
  
  // Details data
  const detailsData = [
    {
      title: 'Ceremony',
      description: 'Our ceremony will take place in the beautiful garden pavilion overlooking Taal Lake. The ceremony will be a blend of Filipino and Australian traditions.',
      image: '/images/ceremony.jpg',
      time: '3:00 PM - 4:00 PM'
    },
    {
      title: 'Cocktail Hour',
      description: 'Following the ceremony, enjoy cocktails and canapés on the terrace while taking in the breathtaking views of Taal Volcano.',
      image: '/images/cocktail.jpg',
      time: '4:00 PM - 5:00 PM'
    },
    {
      title: 'Reception',
      description: 'The reception will be held in the grand ballroom, featuring a sumptuous dinner, heartfelt speeches, and dancing into the night.',
      image: '/images/reception.jpg',
      time: '5:00 PM - 11:00 PM'
    },
    {
      title: 'Accommodations',
      description: 'We have arranged special rates at several nearby hotels. See the Travel page for more details and booking information.',
      image: '/images/accommodations.jpg',
      time: 'Check-in: 2:00 PM'
    },
    {
      title: 'Transportation',
      description: 'Shuttle service will be provided from designated hotels to the venue and back. Please indicate your transportation needs in your RSVP.',
      image: '/images/transportation.jpg',
      time: 'First shuttle: 1:30 PM'
    },
    {
      title: 'After Party',
      description: 'For those who want to continue the celebration, we\'ve arranged an after-party at the hotel bar with late-night snacks and drinks.',
      image: '/images/afterparty.jpg',
      time: '11:00 PM - 2:00 AM'
    }
  ];
  
  // Additional details data for card backs
  const detailsBackData = [
    {
      title: "Ceremony Details",
      content: "Our ceremony will blend Filipino and Australian traditions. We'll have readings in both languages and incorporate symbolic rituals from both cultures.",
      icon: "🏛️"
    },
    {
      title: "Cocktail Hour Info",
      content: "Enjoy signature drinks named after meaningful places in our relationship. Live music will be performed by a string quartet.",
      icon: "🍹"
    },
    {
      title: "Reception Highlights",
      content: "Our first dance will be to 'Perfect' by Ed Sheeran. The menu features a fusion of Filipino and Australian cuisine.",
      icon: "💃"
    },
    {
      title: "Where to Stay",
      content: "Use code 'ELAINETOBYWED' when booking at partner hotels for a 15% discount. Free shuttle service available from all partner hotels.",
      icon: "🏨"
    },
    {
      title: "Getting There",
      content: "Shuttles will run every 30 minutes starting at 1:30 PM. For those driving, valet parking is complimentary for wedding guests.",
      icon: "🚌"
    },
    {
      title: "After Party Fun",
      content: "The after party will feature a live DJ, late-night snacks, and a photo booth with fun props. Casual attire welcome!",
      icon: "🎉"
    }
  ];
  
  // Timeline data
  const timelineData = [
    {
      time: '2:30 PM',
      title: 'Guest Arrival',
      description: 'Arrive at Alta d\' Tagaytay and be seated for the ceremony.'
    },
    {
      time: '3:00 PM',
      title: 'Ceremony Begins',
      description: 'The wedding ceremony will start promptly.'
    },
    {
      time: '4:00 PM',
      title: 'Cocktail Hour',
      description: 'Enjoy drinks and hors d\'oeuvres while the wedding party takes photos.'
    },
    {
      time: '5:00 PM',
      title: 'Reception Begins',
      description: 'Grand entrance of the wedding party and couple.'
    },
    {
      time: '5:30 PM',
      title: 'Dinner Service',
      description: 'A delicious multi-course dinner will be served.'
    },
    {
      time: '7:00 PM',
      title: 'Speeches & Toasts',
      description: 'Listen to heartfelt messages from family and friends.'
    },
    {
      time: '8:00 PM',
      title: 'First Dance',
      description: 'The couple\'s first dance followed by parent dances.'
    },
    {
      time: '8:30 PM',
      title: 'Dance Party',
      description: 'The dance floor opens for everyone to celebrate!'
    },
    {
      time: '11:00 PM',
      title: 'Farewell',
      description: 'The celebration concludes with a special sendoff.'
    }
  ];
  
  // Define stopTimelineAutoPlay before it's used in other functions
  const stopTimelineAutoPlay = useCallback(() => {
    if (timelineAutoPlayRef.current) {
      clearInterval(timelineAutoPlayRef.current);
      timelineAutoPlayRef.current = null;
    }
    setIsTimelineAutoPlaying(false);
  }, []);
  
  // Update the calculateTimelineProgress function to set CSS variables for animation
  const calculateTimelineProgress = useCallback((index: number) => {
    const progress = ((index + 1) / timelineData.length) * 100;
    
    // Update the CSS variables for the animation
    if (timelineRef.current) {
      const progressElement = timelineRef.current.querySelector('.timeline-progress') as HTMLElement;
      if (progressElement) {
        progressElement.style.setProperty('--prev-progress-height', progressElement.style.height || '0%');
        progressElement.style.setProperty('--progress-height', `${progress}%`);
      }
    }
    
    return progress;
  }, [timelineData.length]);
  
  // Optimize timeline functions with useCallback to prevent recreation on every render
  const handleTimelineDotClick = useCallback((index: number) => {
    // Add a flash effect to the timeline item
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems[index]) {
      timelineItems[index].classList.add('flash');
      setTimeout(() => {
        timelineItems[index].classList.remove('flash');
      }, 1000);
    }
    
    setActiveTimelineIndex(index);
    setTimelineProgress(calculateTimelineProgress(index));
    
    // Smooth scroll to the timeline item
    const timelineItem = timelineItems[index] as HTMLElement;
    if (timelineItem) {
      const offset = 100; // Adjust this value as needed
      const itemTop = timelineItem.getBoundingClientRect().top;
      const scrollPosition = window.pageYOffset + itemTop - offset;
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
    
    // If auto-playing, stop it
    if (isTimelineAutoPlaying) {
      stopTimelineAutoPlay();
    }
  }, [isTimelineAutoPlaying, calculateTimelineProgress, stopTimelineAutoPlay]);
  
  const goToNextTimelineItem = useCallback(() => {
    if (activeTimelineIndex < timelineData.length - 1) {
      const nextIndex = activeTimelineIndex + 1;
      setActiveTimelineIndex(nextIndex);
      setTimelineProgress(calculateTimelineProgress(nextIndex));
    } else {
      // If we're at the end, stop auto-play
      stopTimelineAutoPlay();
    }
  }, [activeTimelineIndex, timelineData.length, calculateTimelineProgress, stopTimelineAutoPlay]);
  
  const goToPrevTimelineItem = useCallback(() => {
    if (activeTimelineIndex > 0) {
      const prevIndex = activeTimelineIndex - 1;
      setActiveTimelineIndex(prevIndex);
      setTimelineProgress(calculateTimelineProgress(prevIndex));
    }
  }, [activeTimelineIndex, calculateTimelineProgress]);
  
  // Improve the auto-play function for smoother transitions
  const startTimelineAutoPlay = useCallback(() => {
    setIsTimelineAutoPlaying(true);
    
    const advanceTimeline = () => {
      setActiveTimelineIndex((prevIndex: number) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= timelineData.length) {
          stopTimelineAutoPlay();
          return prevIndex;
        }
        setTimelineProgress(calculateTimelineProgress(nextIndex));
        
        // Smooth scroll to the next timeline item
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineItem = timelineItems[nextIndex] as HTMLElement;
        if (timelineItem) {
          const offset = 100; // Adjust this value as needed
          const itemTop = timelineItem.getBoundingClientRect().top;
          const scrollPosition = window.pageYOffset + itemTop - offset;
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
        
        return nextIndex;
      });
    };
    
    timelineAutoPlayRef.current = setInterval(advanceTimeline, 3000);
  }, [timelineData.length, stopTimelineAutoPlay, calculateTimelineProgress]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timelineAutoPlayRef.current) {
        clearInterval(timelineAutoPlayRef.current);
      }
    };
  }, []);
  
  // Initialize timeline progress
  useEffect(() => {
    setTimelineProgress(calculateTimelineProgress(activeTimelineIndex));
  }, [activeTimelineIndex, calculateTimelineProgress]);
  
  // FAQ data
  const faqData = [
    {
      question: "What time should I arrive at the ceremony?",
      answer: "We recommend arriving 30 minutes before the ceremony starts at 3:00 PM to allow time for parking and seating.",
      category: "logistics"
    },
    {
      question: "Is there a dress code?",
      answer: "The dress code is semi-formal. We suggest suits or dress shirts for men and cocktail dresses for women. The venue is outdoors, so comfortable shoes are recommended.",
      category: "attire"
    },
    {
      question: "Will the ceremony and reception be indoors or outdoors?",
      answer: "Both the ceremony and reception will be held outdoors, weather permitting. We have an indoor backup location in case of inclement weather.",
      category: "venue"
    },
    {
      question: "Is there parking available at the venue?",
      answer: "Yes, complimentary parking is available at the venue. There will be attendants to direct you to the parking area.",
      category: "logistics"
    },
    {
      question: "Are children welcome?",
      answer: "We love your little ones, but we've decided to make our wedding an adults-only event. We hope this gives all parents the opportunity to relax and enjoy the celebration.",
      category: "logistics"
    },
    {
      question: "Are there accommodations nearby?",
      answer: "Yes, we've reserved a block of rooms at the Hilton Garden Inn, which is 10 minutes from the venue. Use code 'SMITH-JOHNSON' when booking for a special rate.",
      category: "accommodations"
    },
    {
      question: "Can I take photos during the ceremony?",
      answer: "We kindly ask that you refrain from taking photos during the ceremony, as we have professional photographers. Feel free to take photos during the reception!",
      category: "logistics"
    },
    {
      question: "What should I do if I have dietary restrictions?",
      answer: "Please indicate any dietary restrictions on your RSVP. We'll do our best to accommodate your needs.",
      category: "logistics"
    }
  ];
  
  // Filter FAQs based on search query and category
  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
    const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Add an intersection observer to detect when timeline is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsTimelineInView(true);
            // Auto-start the timeline when it comes into view
            if (!isTimelineAutoPlaying && activeTimelineIndex === 0) {
              startTimelineAutoPlay();
            }
          } else {
            setIsTimelineInView(false);
            // Optionally pause when out of view
            if (isTimelineAutoPlaying) {
              stopTimelineAutoPlay();
            }
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the element is visible
    );
    
    if (timelineSectionRef.current) {
      observer.observe(timelineSectionRef.current);
    }
    
    return () => {
      if (timelineSectionRef.current) {
        observer.unobserve(timelineSectionRef.current);
      }
    };
  }, [isTimelineAutoPlaying, activeTimelineIndex, startTimelineAutoPlay, stopTimelineAutoPlay]);
  
  // Add mouse hover functionality for timeline dots
  const handleTimelineDotHover = useCallback((index: number) => {
    // Only change on hover if not auto-playing
    if (!isTimelineAutoPlaying) {
      setActiveTimelineIndex(index);
      setTimelineProgress(calculateTimelineProgress(index));
    }
  }, [isTimelineAutoPlaying, calculateTimelineProgress]);
  
  // Fix the ref callback in the TimelineItem component
  const setTimelineItemRef = useCallback((el: HTMLDivElement | null, index: number) => {
    timelineItemRefs.current[index] = el;
  }, []);
  
  // Set up intersection observer for timeline items
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    timelineItemRefs.current.forEach(item => {
      if (item) observer.observe(item);
    });
    
    return () => {
      timelineItemRefs.current.forEach(item => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);
  
  // Add a more responsive scroll animation for timeline items
  useEffect(() => {
    const handleScroll = () => {
      const timelineItems = document.querySelectorAll('.timeline-item');
      const timelineSection = timelineSectionRef.current;
      
      if (timelineSection) {
        const sectionTop = timelineSection.getBoundingClientRect().top;
        const sectionHeight = timelineSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate how far we've scrolled through the timeline section
        const scrollPercentage = Math.max(0, Math.min(1, 
          (windowHeight - sectionTop) / (sectionHeight + windowHeight)
        ));
        
        // Update timeline progress based on scroll with smoother transitions
        if (scrollPercentage > 0.1 && !isTimelineAutoPlaying) {
          const newIndex = Math.min(
            timelineData.length - 1,
            Math.floor(scrollPercentage * timelineData.length)
          );
          
          if (newIndex !== activeTimelineIndex) {
            // Use a smoother transition when updating via scroll
            setActiveTimelineIndex(newIndex);
            setTimelineProgress(calculateTimelineProgress(newIndex));
          }
        }
        
        // Add in-view class to timeline items as they come into view with a staggered effect
        timelineItems.forEach((item, index) => {
          const itemTop = item.getBoundingClientRect().top;
          if (itemTop < windowHeight * 0.85) {
            setTimeout(() => {
              item.classList.add('in-view');
            }, index * 100); // Staggered animation
          }
        });
      }
    };
    
    // Use requestAnimationFrame for smoother scroll handling
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeTimelineIndex, calculateTimelineProgress, isTimelineAutoPlaying, timelineData.length]);
  
  // Memoize wedding-themed elements to prevent re-renders
  const floatingElements = useMemo(() => generateFloatingElements(15), [generateFloatingElements]);
  const decorativeElements = useMemo(() => generateDecorativeElements(5), [generateDecorativeElements]);
  
  // Optimize the scroll to timeline function
  const scrollToTimeline = useCallback(() => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  return (
    <PageContainer>
      <GlobalStyle />
      <WeddingAnimations enabled={true} />
      <HeroSection onMouseMove={handleMouseMove}>
        {/* Wedding-themed floating elements */}
        <ParticlesContainer>
          {floatingElements.map(element => (
            <FloatingElement
              key={element.id}
              size={element.size}
              posX={element.posX}
              posY={element.posY}
              delay={element.delay}
              duration={element.duration}
              type={element.type}
            />
          ))}
          
          {/* Wedding-themed decorative elements */}
          {decorativeElements.map(element => (
            <DecorativeElement
              key={element.id}
              size={element.size}
              posX={element.posX}
              posY={element.posY}
              delay={element.delay}
              duration={element.duration}
              type={element.type}
            />
          ))}
        </ParticlesContainer>
        
        <HeroContent style={{ 
          transform: `translateZ(10px) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` 
        }}>
          <HeroTitle style={{ 
            transform: `translateZ(20px) translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px)` 
          }}>
            Wedding Details
          </HeroTitle>
          <HeroSubtitle style={{ 
            transform: `translateZ(15px) translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)` 
          }}>
            Everything you need to know about our special day
          </HeroSubtitle>
          
          {/* Interactive feature buttons */}
          <FeatureButtonsContainer>
            <CursorElement cursorType="button" cursorText="Event Details" cursorTheme="rustyBlue">
              <FeatureButton onClick={() => handleFeatureClick('details')}>
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
                Event Details
              </FeatureButton>
            </CursorElement>
            
            <CursorElement cursorType="button" cursorText="Timeline" cursorTheme="rustyBlue">
              <FeatureButton onClick={() => handleFeatureClick('timeline')}>
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                Timeline
              </FeatureButton>
            </CursorElement>
            
            <CursorElement cursorType="button" cursorText="FAQ" cursorTheme="rustyBlue">
              <FeatureButton onClick={() => handleFeatureClick('faq')}>
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                </svg>
                FAQ
              </FeatureButton>
            </CursorElement>
          </FeatureButtonsContainer>
        </HeroContent>
        
        <CursorElement cursorType="button" cursorText="Scroll" cursorTheme="rustyBlue">
          <ScrollIndicator onClick={scrollToDetails}>
            <ScrollText>Scroll Down</ScrollText>
            <ScrollArrow />
          </ScrollIndicator>
        </CursorElement>
        
        <CulturalAccent>
          <AccentStripe color={COLORS.FILIPINO_BLUE} />
          <AccentStripe color={COLORS.FILIPINO_RED} />
          <AccentStripe color={COLORS.AUSTRALIAN_BLUE} />
          <AccentStripe color={COLORS.AUSTRALIAN_RED} />
        </CulturalAccent>
      </HeroSection>
      
      <ContentSection ref={detailsRef}>
        <SectionTitle>Event Details</SectionTitle>
        <DetailsContainer>
          {detailsData.map((detail, index) => (
            <DetailCard 
              key={index} 
              delay={index}
              isFlipped={flippedCards.includes(index)}
              onClick={() => toggleCardFlip(index)}
              className="detail-card"
            >
              <CardFront>
                <DetailCardImage bgImage={detail.image} />
                <DetailCardContent>
                  <DetailCardTitle>{detail.title}</DetailCardTitle>
                  <DetailCardText>{detail.description}</DetailCardText>
                  <DetailCardTime>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill={COLORS.PRIMARY_RUSTY_BLUE} />
                      <path d="M12 4C7.59 4 4 7.59 4 12C4 16.41 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill={COLORS.PRIMARY_RUSTY_BLUE} />
                    </svg>
                    {detail.time}
                  </DetailCardTime>
                  
                  <CursorElement cursorType="button" cursorText="Flip" cursorTheme="rustyBlue">
                    <FlipButton onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the card's onClick
                      toggleCardFlip(index);
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" fill="white" />
                      </svg>
                      More Info
                    </FlipButton>
                  </CursorElement>
                </DetailCardContent>
              </CardFront>
              
              <CardBack>
                <BackCardIcon>
                  {detailsBackData[index].icon}
                </BackCardIcon>
                <BackCardTitle>{detailsBackData[index].title}</BackCardTitle>
                <BackCardContent>{detailsBackData[index].content}</BackCardContent>
                
                <CursorElement cursorType="button" cursorText="Flip Back" cursorTheme="rustyBlue">
                  <FlipButton onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card's onClick
                    toggleCardFlip(index);
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" fill="white" />
                    </svg>
                    Back to Front
                  </FlipButton>
                </CursorElement>
              </CardBack>
            </DetailCard>
          ))}
        </DetailsContainer>
      </ContentSection>
      
      <TimelineSection ref={timelineSectionRef}>
        <SectionTitle>Wedding Day Timeline</SectionTitle>
        <TimelineContainer ref={timelineRef}>
          <TimelineProgress 
            className="timeline-progress" 
            style={{ height: `${timelineProgress}%` }} 
          />
          
          {timelineData.map((item, index) => (
            <React.Fragment key={index}>
              <CursorElement cursorType="button" cursorText="View" cursorTheme="rustyBlue">
                <TimelineDot 
                  isActive={activeTimelineIndex === index}
                  onClick={() => handleTimelineDotClick(index)}
                  onMouseEnter={() => handleTimelineDotHover(index)}
                />
              </CursorElement>
              
              <TimelineItem 
                isLeft={index % 2 === 0} 
                delay={index}
                isActive={activeTimelineIndex === index}
                className="timeline-item"
                ref={(el) => setTimelineItemRef(el, index)}
              >
                <TimelineContent 
                  isLeft={index % 2 === 0}
                  isActive={activeTimelineIndex === index}
                >
                  <TimelineTime isActive={activeTimelineIndex === index}>
                    <TimelineIcon isActive={activeTimelineIndex === index}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="white" />
                        <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="white" />
                      </svg>
                    </TimelineIcon>
                    {item.time}
                  </TimelineTime>
                  <TimelineTitle isActive={activeTimelineIndex === index}>{item.title}</TimelineTitle>
                  <TimelineText>{item.description}</TimelineText>
                </TimelineContent>
              </TimelineItem>
            </React.Fragment>
          ))}
        </TimelineContainer>
        
        <TimelineControls>
          <CursorElement cursorType="button" cursorText="Previous" cursorTheme="rustyBlue">
            <TimelineButton 
              onClick={goToPrevTimelineItem}
              disabled={activeTimelineIndex === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="white" />
              </svg>
              Previous
            </TimelineButton>
          </CursorElement>
          
          <CursorElement cursorType="button" cursorText={isTimelineAutoPlaying ? "Pause" : "Play"} cursorTheme="rustyBlue">
            <TimelineButton 
              onClick={isTimelineAutoPlaying ? stopTimelineAutoPlay : startTimelineAutoPlay}
              disabled={activeTimelineIndex === timelineData.length - 1 && !isTimelineAutoPlaying}
            >
              {isTimelineAutoPlaying ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" fill="white" />
                  </svg>
                  Play
                </>
              )}
            </TimelineButton>
          </CursorElement>
          
          <CursorElement cursorType="button" cursorText="Next" cursorTheme="rustyBlue">
            <TimelineButton 
              onClick={goToNextTimelineItem}
              disabled={activeTimelineIndex === timelineData.length - 1}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z" fill="white" />
              </svg>
            </TimelineButton>
          </CursorElement>
        </TimelineControls>
      </TimelineSection>
      
      <FAQSection id="faq-section">
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        
        <FAQSearchContainer>
          <SearchIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={COLORS.PRIMARY_RUSTY_BLUE} />
            </svg>
          </SearchIcon>
          <FAQSearchInput 
            type="text" 
            placeholder="Search questions..." 
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
          />
        </FAQSearchContainer>
        
        <FAQCategoryFilter>
          <CursorElement cursorType="button" cursorText="All" cursorTheme="rustyBlue">
            <CategoryButton 
              isActive={faqCategory === 'all'} 
              category="all"
              onClick={() => setFaqCategory('all')}
            >
              All Questions
            </CategoryButton>
          </CursorElement>
          
          <CursorElement cursorType="button" cursorText="Venue" cursorTheme="rustyBlue">
            <CategoryButton 
              isActive={faqCategory === 'venue'} 
              category="venue"
              onClick={() => setFaqCategory('venue')}
            >
              Venue
            </CategoryButton>
          </CursorElement>
          
          <CursorElement cursorType="button" cursorText="Attire" cursorTheme="rustyBlue">
            <CategoryButton 
              isActive={faqCategory === 'attire'} 
              category="attire"
              onClick={() => setFaqCategory('attire')}
            >
              Attire
            </CategoryButton>
          </CursorElement>
          
          <CursorElement cursorType="button" cursorText="Logistics" cursorTheme="rustyBlue">
            <CategoryButton 
              isActive={faqCategory === 'logistics'} 
              category="logistics"
              onClick={() => setFaqCategory('logistics')}
            >
              Logistics
            </CategoryButton>
          </CursorElement>
          
          <CursorElement cursorType="button" cursorText="Accommodations" cursorTheme="rustyBlue">
            <CategoryButton 
              isActive={faqCategory === 'accommodations'} 
              category="accommodations"
              onClick={() => setFaqCategory('accommodations')}
            >
              Accommodations
            </CategoryButton>
          </CursorElement>
        </FAQCategoryFilter>
        
        <FAQContainer>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                delay={index} 
                isOpen={openFAQ === index}
              >
                <CursorElement cursorType="button" cursorText="Toggle" cursorTheme="rustyBlue">
                  <FAQQuestion 
                    isOpen={openFAQ === index}
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                    <FAQIcon isOpen={openFAQ === index}>+</FAQIcon>
                  </FAQQuestion>
                </CursorElement>
                <FAQAnswer isOpen={openFAQ === index}>
                  {faq.answer}
                  <FAQCategory category={faq.category}>
                    {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                  </FAQCategory>
                </FAQAnswer>
              </FAQItem>
            ))
          ) : (
            <NoResultsMessage>
              No questions found matching your search. Try different keywords or clear the search.
            </NoResultsMessage>
          )}
        </FAQContainer>
      </FAQSection>
    </PageContainer>
  );
};

export default DetailsPage; 