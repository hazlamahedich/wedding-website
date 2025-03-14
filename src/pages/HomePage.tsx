import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import CursorElement from '../components/CursorElement';
import { COLORS } from '../constants/theme';
import { getTimeDifference, calculateTimeUnits } from '../utils/dateUtils';
import WeddingAnimations from '../components/WeddingAnimations';

// Global styles to ensure proper layout
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

// Styled components for the new layout
const PageContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
  will-change: transform; /* Optimize for animations */
  margin: 0;
  padding: 0;
`;

// Enhanced animations - reduced complexity
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

// Enhanced Hero Section with 3D perspective - optimized
const ParallaxSection = styled.section<{ bgImage: string }>`
  height: calc(100vh - var(--nav-height, 70px)); /* Subtract navigation height */
  width: 100%;
  background-image: 
    linear-gradient(to bottom, rgba(13, 71, 161, 0.6), rgba(30, 136, 229, 0.8)), 
    url(${props => props.bgImage});
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
  perspective: 800px; /* Reduced for better performance */
  overflow: hidden;
  margin-top: var(--nav-height, 70px); /* Use CSS variable with fallback */
  
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
  
  /* Simplified after pseudo-element */
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

// Floating decorative elements - reduced number and simplified
const FloatingElement = styled.div<{ top: string; left: string; delay: string; size: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ${float} 8s ease-in-out infinite; /* Slowed down animation */
  animation-delay: ${props => props.delay};
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.15); /* Simplified shadow */
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 0;
  will-change: transform; /* Optimize for animations */
`;

// Enhanced hero content with 3D transform - optimized
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

// Enhanced names with 3D effect and gold shimmer - optimized
const Names = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 5.5rem;
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

// Enhanced date with animation - optimized
const Date = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 400;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.9);
  animation: ${pulse} 8s infinite ease-in-out; /* Slowed down animation */
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const Venue = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
  text-shadow: 
    1px 1px 10px rgba(0, 0, 0, 0.4),
    0 0 8px rgba(255, 215, 0, 0.3);
  color: rgba(255, 255, 255, 0.95);
  position: relative;
  display: inline-block;
  padding: 0.5rem 2rem;
  transform: translateZ(5px);
  
  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  
  &::before, &::after {
    content: '❦';
    font-size: 1rem;
    color: rgba(255, 215, 0, 0.7);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  
  &::before {
    left: -15px;
  }
  
  &::after {
    right: -15px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.4rem 1.5rem;
    
    &::before, &::after {
      font-size: 0.8rem;
    }
  }
`;

const ActionButton = styled(Link)`
  display: inline-block;
  padding: 15px 40px;
  margin-top: 1rem;
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transform: translateZ(30px);
  
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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
    transform: translateY(-2px) translateZ(30px) scale(1.05);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    
    &:before {
      left: 100%;
    }
  }
`;

// Enhanced countdown with 3D effect
const CountdownContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 2rem 0 1.5rem 0;
  perspective: 1000px;
  transform-style: preserve-3d;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

// Flip animation for countdown numbers
const flip = keyframes`
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0);
  }
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(13, 71, 161, 0.2);
  backdrop-filter: blur(10px);
  padding: 1.2rem 0.8rem;
  border-radius: 16px;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  min-width: 90px;
  transform-style: preserve-3d;
  transform: translateZ(40px);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateZ(50px) scale(1.05);
  }
  
  @media (max-width: 768px) {
    min-width: 60px;
    padding: 0.7rem;
  }
`;

const CountdownNumber = styled.div`
  font-size: 3.2rem;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
  color: white;
  text-shadow: 
    0 0 10px rgba(13, 71, 161, 0.8),
    0 0 15px rgba(255, 215, 0, 0.5),
    1px 1px 2px rgba(0, 0, 0, 0.7);
  position: relative;
  transform-style: preserve-3d;
  
  &.animate {
    animation: ${flip} 0.6s ease-in-out;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 2px;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 215, 0, 0.6), 
      transparent
    );
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CountdownLabel = styled.div`
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    letter-spacing: 1px;
  }
`;

// Enhanced scroll indicator with animations
const glow = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
  50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 215, 0, 0.4); }
`;

const ScrollText = styled.span`
  font-size: 0.9rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: white;
  opacity: 0.7;
  transition: all 0.3s ease;
  transform: translateY(5px);
  animation: ${glow} 2s infinite ease-in-out;
`;

const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
  margin-bottom: 5px;
  opacity: 0;
  animation: fadeInOut 2s infinite;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  &:nth-child(4) {
    animation-delay: 0.6s;
  }
  
  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: rotate(45deg) translate(-5px, -5px);
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: rotate(45deg) translate(5px, 5px);
    }
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateX(-50%) translateY(-5px);
    
    .arrow {
      animation-play-state: paused;
      opacity: 0.9;
    }
    
    ${ScrollText} {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Enhanced cultural accent with animation
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
    animation: ${shimmer} 3s infinite linear;
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

// Enhanced Story Section with modern design
const StorySection = styled.section`
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/images/pattern-bg.png');
    opacity: 0.05;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to top, #f9f9f9, transparent);
    pointer-events: none;
    z-index: 1;
  }
`;

// Enhanced section title with animation
const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 3px;
    background: linear-gradient(
      90deg, 
      ${COLORS.FILIPINO_BLUE}, 
      ${COLORS.FILIPINO_RED}, 
      ${COLORS.AUSTRALIAN_BLUE}, 
      ${COLORS.AUSTRALIAN_RED}
    );
    animation: ${shimmer} 3s infinite linear;
    background-size: 200% 100%;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 100px;
  padding-top: 40px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent,
      ${COLORS.LIGHT_RUSTY_BLUE},
      ${COLORS.LIGHT_RUSTY_BLUE},
      transparent
    );
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    &::before {
      display: none;
    }
  }
`;

// Enhanced story item with modern design
const StoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1s ease, transform 1s ease;
  position: relative;
  z-index: 2;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:nth-child(even) {
    flex-direction: row-reverse;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background: ${COLORS.PRIMARY_RUSTY_BLUE};
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    box-shadow: 
      0 0 0 5px rgba(255, 255, 255, 0.8),
      0 0 0 10px rgba(100, 181, 246, 0.2);
  }
  
  @media (max-width: 768px) {
    flex-direction: column !important;
    gap: 30px;
    
    &::before {
      display: none;
    }
  }
`;

// Enhanced story image with modern effects - optimized for performance
const StoryImage = styled.div<{ bgImage: string }>`
  flex: 1;
  height: 400px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  will-change: transform; /* Optimize for animations */
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.3)
    );
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`;

// Enhanced story content with modern design
const StoryContent = styled.div`
  flex: 1;
  padding: 30px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.05),
    0 1px 1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.7);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.08),
      0 5px 15px rgba(0, 0, 0, 0.05);
  }
`;

const StoryDate = styled.div`
  font-size: 1.2rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  display: inline-block;
  padding: 5px 15px;
  background: rgba(100, 181, 246, 0.1);
  border-radius: 30px;
`;

const StoryTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 20px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(
      90deg, 
      ${COLORS.FILIPINO_BLUE}, 
      ${COLORS.FILIPINO_RED}
    );
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const StoryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-top: 20px;
`;

// Enhanced Gallery Section with modern design
const GallerySection = styled.section`
  padding: 100px 20px;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 10% 20%, rgba(100, 181, 246, 0.03) 0%, transparent 30%),
      radial-gradient(circle at 90% 80%, rgba(100, 181, 246, 0.03) 0%, transparent 30%);
    pointer-events: none;
  }
`;

// Enhanced gallery grid with masonry layout
const GalleryGrid = styled.div`
  max-width: 1200px;
  margin: 60px auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 300px;
  grid-auto-flow: dense;
  gap: 20px;
  
  & > div:nth-child(3n+1) {
    grid-row: span 2;
  }
  
  & > div:nth-child(4n+1) {
    grid-column: span 2;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-rows: 150px;
    gap: 10px;
    
    & > div:nth-child(3n+1), & > div:nth-child(4n+1) {
      grid-row: span 1;
      grid-column: span 1;
    }
  }
`;

// Enhanced gallery item with hover effects - optimized for performance
const GalleryItem = styled.div<{ bgImage: string }>`
  height: 100%;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0.9);
  will-change: transform, opacity; /* Optimize for animations */
  
  &.visible {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    
    &::before {
      opacity: 0.6;
    }
    
    &::after {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(13, 71, 161, 0.2),
      rgba(30, 136, 229, 0.6)
    );
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &::after {
    content: 'View Photo';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1.1rem;
    text-align: center;
    transform: translateY(100%);
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease;
    opacity: 0;
  }
`;

// Enhanced RSVP Section with modern design
const RsvpSection = styled.section`
  min-height: 70vh;
  background-image: 
    linear-gradient(to bottom, rgba(13, 71, 161, 0.7), rgba(30, 136, 229, 0.8)), 
    url('/images/rsvp-bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 30%);
    pointer-events: none;
  }
`;

// Enhanced RSVP content with glassmorphism
const RsvpContent = styled.div`
  max-width: 800px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateZ(0);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

// Enhanced RSVP text with animation
const RsvpText = styled.p`
  font-size: 1.4rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 255, 255, 0.5), 
      transparent
    );
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// Lazy loading image component
const LazyImage = memo(({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && imgRef.current) {
            const img = imgRef.current;
            img.src = src;
            img.onload = () => setIsLoaded(true);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);
  
  return (
    <img 
      ref={imgRef}
      alt={alt}
      className={`${className || ''} ${isLoaded ? 'loaded' : 'loading'}`}
      style={{ 
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
      loading="lazy"
    />
  );
});

// Memoized Story Item Component for better performance
const MemoizedStoryItem = memo(({ index, bgImage, date, title, text, storyRefs }: {
  index: number;
  bgImage: string;
  date: string;
  title: string;
  text: string;
  storyRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) => {
  return (
    <StoryItem ref={(el: HTMLDivElement | null) => { 
      if (el) storyRefs.current[index] = el; 
    }}>
      <StoryImage bgImage={bgImage} />
      <StoryContent>
        <StoryDate>{date}</StoryDate>
        <StoryTitle>{title}</StoryTitle>
        <StoryText>{text}</StoryText>
      </StoryContent>
    </StoryItem>
  );
});

// Memoized Gallery Item Component for better performance
const MemoizedGalleryItem = memo(({ bgImage, theme }: {
  bgImage: string;
  theme: "rustyBlue" | "filipino" | "australian";
}) => {
  return (
    <CursorElement cursorType="gallery" cursorText="View Photo" cursorTheme={theme}>
      <GalleryItem bgImage={bgImage} className="gallery-item" />
    </CursorElement>
  );
});

// Declare window.storyRefs for TypeScript
declare global {
  interface Window {
    // Add any global window properties if needed
  }
}

const HomePage: React.FC = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [animationsEnabled] = useState(true);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Make storyRefs available globally to avoid re-renders
  // window.storyRefs = storyRefs; // Removed this line
  
  const [prevCountdown, setPrevCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Track mouse position for parallax effect - with reduced sensitivity
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Add gallery ref for animations
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Measure navigation height and set CSS variable
  useEffect(() => {
    const setNavHeight = () => {
      const navElement = document.querySelector('nav');
      if (navElement) {
        const navHeight = navElement.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
      }
    };
    
    // Set initial height
    setNavHeight();
    
    // Update on resize
    window.addEventListener('resize', setNavHeight);
    
    return () => {
      window.removeEventListener('resize', setNavHeight);
    };
  }, []);
  
  // Handle mouse movement for parallax effect - with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Only update every other mouse move event to reduce calculations
    if (Math.random() > 0.5) return;
    
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 10, // Reduced multiplier for better performance
      y: (e.clientY / window.innerHeight - 0.5) * 10
    });
  }, []);
  
  // Memoize the countdown update function
  const updateCountdown = useCallback(() => {
    const weddingDateStr = '2026-01-07T16:00:00';
    const difference = getTimeDifference(weddingDateStr);
    if (difference > 0) {
      setPrevCountdown(countdown);
      setCountdown(calculateTimeUnits(difference));
    }
  }, [countdown]);
  
  useEffect(() => {
    // Update countdown less frequently (every 5 seconds instead of every second)
    updateCountdown();
    const interval = setInterval(updateCountdown, 5000);
    
    return () => clearInterval(interval);
  }, [updateCountdown]);
  
  useEffect(() => {
    // Add mouse move event listener for parallax effect
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2, // Reduced threshold for better performance
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    storyRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      storyRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  // Add gallery animation effect
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && galleryRef.current) {
          const galleryItems = galleryRef.current.querySelectorAll('.gallery-item');
          galleryItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, 100 * index);
          });
        }
      });
    }, observerOptions);
    
    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }
    
    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Add scroll position tracking for more efficient rendering
  const [scrollY, setScrollY] = useState(0);
  
  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    // Only update every few scroll events
    if (Math.random() > 0.1) return;
    
    setScrollY(window.scrollY);
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  // Only render sections that are near the viewport
  const isNearViewport = useCallback((sectionId: string): boolean => {
    if (typeof window === 'undefined') return true;
    
    const section = document.getElementById(sectionId);
    if (!section) return true; // Default to rendering if section not found
    
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Consider a section "near" if it's within 1000px of the viewport
    return rect.top < windowHeight + 1000 && rect.bottom > -1000;
  }, [scrollY]);
  
  // Initialize all sections as visible on first render
  const [sectionsInitialized, setSectionsInitialized] = useState(false);
  
  useEffect(() => {
    // Set all sections to initialized after first render
    if (!sectionsInitialized) {
      setSectionsInitialized(true);
    }
  }, [sectionsInitialized]);
  
  // Generate floating elements for the hero section - reduced number
  const floatingElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    // Reduced from 8 to 5 elements for better performance
    for (let i = 0; i < 5; i++) {
      elements.push(
        <FloatingElement 
          key={i}
          top={`${10 + Math.random() * 80}%`}
          left={`${Math.random() * 90}%`}
          delay={`${Math.random() * 5}s`}
          size={`${30 + Math.random() * 50}px`} // Reduced max size
        />
      );
    }
    return elements;
  }, []);
  
  // Memoize the gallery items to prevent unnecessary re-renders
  const galleryItems = useMemo(() => {
    const items = [
      { bgImage: "/images/gallery1.jpg", theme: "rustyBlue" as const },
      { bgImage: "/images/gallery2.jpg", theme: "filipino" as const },
      { bgImage: "/images/gallery3.jpg", theme: "australian" as const },
      { bgImage: "/images/gallery4.jpg", theme: "rustyBlue" as const },
      { bgImage: "/images/gallery5.jpg", theme: "filipino" as const },
      { bgImage: "/images/gallery6.jpg", theme: "australian" as const },
      { bgImage: "/images/gallery1.jpg", theme: "rustyBlue" as const },
      { bgImage: "/images/gallery2.jpg", theme: "filipino" as const }
    ];
    
    return items.map((item, index) => (
      <MemoizedGalleryItem 
        key={index} 
        bgImage={item.bgImage} 
        theme={item.theme} 
      />
    ));
  }, []);
  
  // Add image preloading for critical images
  useEffect(() => {
    // Preload hero background image
    const preloadHeroImage = new Image();
    preloadHeroImage.src = '/images/hero-bg.jpg';
    
    // Preload first story image
    const preloadStoryImage = new Image();
    preloadStoryImage.src = '/images/story1.jpg';
  }, []);
  
  // Memoize the story items to prevent unnecessary re-renders
  const storyItems = useMemo(() => {
    const items = [
      {
        bgImage: "/images/story1.jpg",
        date: "June 2020",
        title: "How We Met",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim."
      },
      {
        bgImage: "/images/story2.jpg",
        date: "August 2022",
        title: "The Proposal",
        text: "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus."
      },
      {
        bgImage: "/images/story3.jpg",
        date: "January 2026",
        title: "Our Wedding",
        text: "Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi."
      }
    ];
    
    return items.map((item, index) => (
      <MemoizedStoryItem 
        key={index}
        index={index}
        bgImage={item.bgImage}
        date={item.date}
        title={item.title}
        text={item.text}
        storyRefs={storyRefs}
      />
    ));
  }, [storyRefs]);
  
  return (
    <PageContainer>
      <GlobalStyle />
      {/* Hero Section - Always render */}
      <ParallaxSection bgImage="/images/hero-bg.jpg" id="hero">
        {animationsEnabled && <WeddingAnimations enabled={true} />}
        {floatingElements}
        
        <HeroContent style={{ 
          transform: `translateZ(10px) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` 
        }}>
          <Names style={{ 
            transform: `translateZ(20px) translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px)` 
          }}>
            Elaine & Toby
          </Names>
          <Date style={{ 
            transform: `translateZ(15px) translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)` 
          }}>
            January 7, 2026
          </Date>
          <Venue style={{ 
            transform: `translateZ(10px) translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)` 
          }}>
            Alta d Tagaytay, Tagaytay City, Philippines
          </Venue>
          
          <CountdownContainer>
            <CountdownItem>
              <CountdownNumber className={prevCountdown.days !== countdown.days ? 'animate' : ''}>
                {countdown.days}
              </CountdownNumber>
              <CountdownLabel>Days</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber className={prevCountdown.hours !== countdown.hours ? 'animate' : ''}>
                {countdown.hours}
              </CountdownNumber>
              <CountdownLabel>Hours</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber className={prevCountdown.minutes !== countdown.minutes ? 'animate' : ''}>
                {countdown.minutes}
              </CountdownNumber>
              <CountdownLabel>Minutes</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber className={prevCountdown.seconds !== countdown.seconds ? 'animate' : ''}>
                {countdown.seconds}
              </CountdownNumber>
              <CountdownLabel>Seconds</CountdownLabel>
            </CountdownItem>
          </CountdownContainer>
          
          <CursorElement
            cursorType="button"
            cursorText="RSVP Now"
            cursorTheme="filipino"
          >
            <ActionButton to="/rsvp" style={{ 
              transform: `translateZ(30px) translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px) translateY(-10px)` 
            }}>
              RSVP Now
            </ActionButton>
          </CursorElement>
        </HeroContent>
        
        <ScrollIndicator onClick={() => scrollToSection('our-story')}>
          <ScrollText>Scroll Down</ScrollText>
          <ScrollArrow className="arrow" />
          <ScrollArrow className="arrow" />
          <ScrollArrow className="arrow" />
        </ScrollIndicator>
        
        <CulturalAccent>
          <AccentStripe color={COLORS.FILIPINO_BLUE} />
          <AccentStripe color={COLORS.FILIPINO_RED} />
          <AccentStripe color={COLORS.AUSTRALIAN_BLUE} />
          <AccentStripe color={COLORS.AUSTRALIAN_RED} />
        </CulturalAccent>
      </ParallaxSection>
      
      {/* Our Story Section - Conditionally render based on scroll position */}
      {(sectionsInitialized || isNearViewport('our-story')) && (
        <StorySection id="our-story">
          <SectionTitle>Our Story</SectionTitle>
          <StoryContainer>
            {storyItems}
          </StoryContainer>
        </StorySection>
      )}
      
      {/* Gallery Section - Conditionally render based on scroll position */}
      {(sectionsInitialized || isNearViewport('gallery')) && (
        <GallerySection id="gallery">
          <SectionTitle>Gallery</SectionTitle>
          <GalleryGrid ref={galleryRef}>
            {galleryItems}
          </GalleryGrid>
        </GallerySection>
      )}
      
      {/* RSVP Section - Conditionally render based on scroll position */}
      {(sectionsInitialized || isNearViewport('rsvp')) && (
        <RsvpSection id="rsvp">
          <RsvpContent>
            <SectionTitle>Join Our Celebration</SectionTitle>
            <RsvpText>
              We would be honored to have you join us on our special day. Please let us know if you can make it by clicking the button below.
            </RsvpText>
            <CursorElement cursorType="button" cursorText="RSVP Now" cursorTheme="filipino">
              <ActionButton to="/rsvp">RSVP Now</ActionButton>
            </CursorElement>
          </RsvpContent>
          
          <CulturalAccent>
            <AccentStripe color={COLORS.FILIPINO_BLUE} />
            <AccentStripe color={COLORS.FILIPINO_RED} />
            <AccentStripe color={COLORS.AUSTRALIAN_BLUE} />
            <AccentStripe color={COLORS.AUSTRALIAN_RED} />
          </CulturalAccent>
        </RsvpSection>
      )}
    </PageContainer>
  );
};

export default React.memo(HomePage); 