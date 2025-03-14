import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import CursorElement from '../components/CursorElement';
import { COLORS } from '../constants/theme';
import WeddingAnimations from '../components/WeddingAnimations';
import InteractiveFlightMap from '../components/InteractiveFlightMap';
import PopularDestinations from '../components/PopularDestinations';

// Animations
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

// Page Container
const PageContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
  will-change: transform;
  margin: 0;
  padding: 0;
`;

// Hero Section
const ParallaxSection = styled.section<{ bgImage: string }>`
  height: calc(100vh - var(--nav-height, 70px));
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

// Floating decorative elements
const FloatingElement = styled.div<{ top: string; left: string; delay: string; size: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay};
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 0;
  will-change: transform;
`;

// Hero Content
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

const HeroTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
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
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.9);
  animation: ${pulse} 8s infinite ease-in-out;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

// Content Section
const ContentSection = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${COLORS.LIGHT_RUSTY_BLUE};
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Flight Information Cards
const FlightCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
  
  /* Remove special styling for the New York flight card to match other cards */
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    
    /* Maintain centering on mobile */
    & > div:last-child:nth-child(odd) {
      max-width: 350px;
    }
  }
`;

const FlightCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const FlightCardHeader = styled.div`
  background: linear-gradient(135deg, ${COLORS.PRIMARY_RUSTY_BLUE}, ${COLORS.DARK_RUSTY_BLUE});
  color: white;
  padding: 15px 20px;
  position: relative;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  p {
    margin: 5px 0 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const FlightCardBody = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const FlightDetail = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  
  svg {
    min-width: 24px;
    margin-right: 12px;
    color: ${COLORS.DARK_RUSTY_BLUE};
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #333;
  margin-right: 5px;
  display: block;
`;

const DetailValue = styled.span`
  color: #555;
`;

const FlightCardFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
  position: relative;
  z-index: 1;
`;

// Add these new styled components for airline logos
const AirlineLogosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: flex-start;
  margin-top: 4px;
  
  /* Ensure logos are arranged in neat rows of 4 */
  & > * {
    flex: 0 0 calc(25% - 6px);
    max-width: 70px;
  }
  
  @media (max-width: 768px) {
    gap: 2px;
    & > * {
      flex: 0 0 calc(25% - 4px);
      max-width: 65px;
    }
  }
`;

// Update the AirlineLogo component to be a clickable link
const AirlineLogo = styled.a<{ airline: string }>`
  display: block;
  width: 60px;
  height: 30px;
  background-image: ${props => `url('/images/airlines/${props.airline.toLowerCase().replace(/\s+/g, '-')}.png')`};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: none;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
`;

// Update the AirlineLogoFallback component to be a clickable link
const AirlineLogoFallback = styled.a<{ name: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-align: center;
  padding: 4px;
  border-radius: 5px;
  background-color: #f5f9fd;
  border: 1px solid #e0e9f5;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  cursor: none;
  position: relative;
  width: 68px;
  height: 40px;
  margin: 1px;
  z-index: 2; /* Higher than FlightCardFooter but lower than tooltip */

  &:hover {
    transform: translateY(-2px);
    background-color: #e8f4fd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10; /* Higher z-index on hover to ensure tooltip visibility */
  }
`;

// Create a new component for the tooltip
const AirlineTooltip = styled.div`
  position: absolute;
  top: auto;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${COLORS.DARK_RUSTY_BLUE};
  color: white;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.8rem;
  width: 280px;
  text-align: left;
  z-index: 9999; /* Increased z-index to ensure it appears above all elements */
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  /* Always ensure tooltip appears on top */
  ${AirlineLogoFallback}:hover & {
    opacity: 1;
    visibility: visible;
    bottom: 100%;
    top: auto;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: ${COLORS.DARK_RUSTY_BLUE} transparent transparent transparent;
  }

  /* Airline name styling at the top of tooltip */
  &::before {
    content: attr(data-airline-name);
    display: block;
    font-weight: bold;
    font-size: 0.9rem;
    margin-bottom: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 5px;
  }
`;

// Create a wrapper component that includes the tooltip
interface AirlineLogoWithTooltipProps {
  name: string;
  href: string;
  tooltipContent?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

// Update the AirlineLogoWithTooltip component to include the airline name in the tooltip
const AirlineLogoWithTooltip: React.FC<AirlineLogoWithTooltipProps> = ({ 
  name, 
  href, 
  tooltipContent, 
  target, 
  rel, 
  children 
}) => {
  return (
    <CursorElement cursorType="link">
      <AirlineLogoFallback 
        name={name} 
        href={href} 
        target={target || "_blank"} 
        rel={rel || "noopener noreferrer"}
      >
        {children}
        {tooltipContent && (
          <AirlineTooltip data-airline-name={name}>
            {tooltipContent}
          </AirlineTooltip>
        )}
      </AirlineLogoFallback>
    </CursorElement>
  );
};

// Create a helper function to get airline website URLs
const getAirlineWebsite = (airline: string): string => {
  const websites: Record<string, string> = {
    'Qantas': 'https://www.qantas.com/',
    'Philippine Airlines': 'https://www.philippineairlines.com/',
    'Cebu Pacific': 'https://www.cebupacificair.com/',
    'Cathay Pacific': 'https://www.cathaypacific.com/',
    'Korean Air': 'https://www.koreanair.com/',
    'ANA': 'https://www.ana.co.jp/en/us/',
    'Emirates': 'https://www.emirates.com/',
    'EVA Air': 'https://www.evaair.com/',
    'Air Canada': 'https://www.aircanada.com/en-ca/flights-from-vancouver-to-manila',
    'United Airlines': 'https://www.united.com/en/us/flights-from-san-francisco-to-manila',
    'Singapore Airlines': 'https://www.singaporeair.com/en_UK/us/home',
    'Zip Air': 'https://www.zipair.net/en',
    'China Airlines': 'https://www.china-airlines.com/en-us',
    'Delta Airlines': 'https://www.delta.com/',
    'Japan Airlines': 'https://www.jal.com/',
    'Asiana Airlines': 'https://flyasiana.com/C/US/EN/index',
    'Qatar Airways': 'https://www.qatarairways.com/',
    'Etihad Airways': 'https://www.etihad.com/',
    'Malaysia Airlines': 'https://www.malaysiaairlines.com/',
    'Thai Airways': 'https://www.thaiairways.com/',
    'China Southern': 'https://global.csair.com/',
    'China Eastern': 'https://us.ceair.com/',
    'Vietnam Airlines': 'https://www.vietnamairlines.com/',
    'Jetstar': 'https://www.jetstar.com/',
    'Scoot': 'https://www.flyscoot.com/',
    'Turkish Airlines': 'https://www.turkishairlines.com/'
  };
  
  return websites[airline] || 'https://www.skyscanner.com.au/';
};

// Update the AirlineList component
const AirlineList = styled.h3`
  font-size: 1rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 8px;
  text-align: center;
`;

const TravelTips = styled.div`
  background-color: rgba(187, 222, 251, 0.3);
  border-radius: 10px;
  padding: 30px;
  margin-top: 60px;
`;

const TipTitle = styled.h3`
  font-size: 1.8rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 20px;
`;

const TipsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TipItem = styled.li`
  margin-bottom: 15px;
  padding-left: 25px;
  position: relative;
  
  &::before {
    content: '✈️';
    position: absolute;
    left: 0;
    top: 2px;
  }
`;

const ScrollDownIndicator = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  cursor: none;
  z-index: 10;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
  
  span {
    font-size: 0.9rem;
    letter-spacing: 1px;
    margin-bottom: 5px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    margin-top: 8px;
    animation: ${float} 2s infinite ease-in-out;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
`;

// Add new styled components for the Skyscanner section
const SkyscannerSection = styled.div`
  margin: 60px 0;
  padding: 40px;
  background: linear-gradient(135deg, ${COLORS.LIGHT_RUSTY_BLUE}20, ${COLORS.PRIMARY_RUSTY_BLUE}10);
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
`;

const SkyscannerTitle = styled.h3`
  font-size: 1.8rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 20px;
`;

const SkyscannerDescription = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 25px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const SkyscannerButton = styled.a`
  display: inline-block;
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
  
  &:hover {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(30, 136, 229, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

// Add new styled components for accommodation section
const AccommodationSection = styled.div`
  margin: 60px 0;
`;

const AccommodationCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AccommodationCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const AccommodationLogo = styled.div<{ logoUrl: string }>`
  height: 60px;
  background-image: url(${props => props.logoUrl});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px;
`;

const AccommodationTitle = styled.h3`
  font-size: 1.4rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 15px;
`;

const AccommodationDescription = styled.p`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 20px;
`;

const AccommodationButton = styled.a`
  display: inline-block;
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.2);
  
  &:hover {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 136, 229, 0.3);
  }
`;

// Add these styled components at the top of the file with other styled components
const ScrollSection = styled.section`
  padding: 60px 0;
  position: relative;
  
  &:nth-child(even) {
    background-color: ${COLORS.LIGHT_RUSTY_BLUE}15;
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 1200px;
    height: 1px;
    background: linear-gradient(to right, transparent, ${COLORS.LIGHT_RUSTY_BLUE}, transparent);
  }
`;

const SectionIntro = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 40px;
  
  p {
    color: #555;
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const SectionHighlight = styled.span`
  color: ${COLORS.DARK_RUSTY_BLUE};
  font-weight: 500;
`;

const Button = styled.button`
  background-color: ${COLORS.DARK_RUSTY_BLUE};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TipsSection = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const AccordionContainer = styled.div`
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid #eee;
  background-color: white;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AccordionHeader = styled.button<{ isActive: boolean }>`
  width: 100%;
  text-align: left;
  padding: 18px 25px;
  background-color: ${props => props.isActive ? COLORS.LIGHT_RUSTY_BLUE + '30' : 'white'};
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.isActive ? COLORS.DARK_RUSTY_BLUE : '#333'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${COLORS.LIGHT_RUSTY_BLUE}20;
  }
  
  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.isActive ? 'rotate(180deg)' : 'rotate(0)'};
    margin-left: 10px;
    min-width: 24px;
  }
`;

const AccordionContent = styled.div<{ isActive: boolean; maxHeight: string }>`
  max-height: ${props => props.isActive ? props.maxHeight : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: white;
`;

const AccordionBody = styled.div`
  padding: 0 25px 25px;
  
  ul {
    padding-left: 20px;
    margin: 0;
    
    li {
      margin-bottom: 10px;
      line-height: 1.6;
      color: #555;
      
      strong {
        color: #333;
      }
    }
  }
`;

// Add this component before the TravelPage component
const Accordion: React.FC<{
  items: { title: string; content: React.ReactNode }[];
}> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <AccordionContainer>
      {items.map((item, index) => (
        <AccordionItem key={index}>
          <AccordionHeader 
            isActive={activeIndex === index}
            onClick={() => toggleAccordion(index)}
          >
            {item.title}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" 
                fill={activeIndex === index ? COLORS.DARK_RUSTY_BLUE : '#555'}/>
            </svg>
          </AccordionHeader>
          <AccordionContent 
            isActive={activeIndex === index}
            maxHeight={activeIndex === index ? '1000px' : '0'}
          >
            <AccordionBody>
              {item.content}
            </AccordionBody>
          </AccordionContent>
        </AccordionItem>
      ))}
    </AccordionContainer>
  );
};

const CTASection = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, ${COLORS.PRIMARY_RUSTY_BLUE}40, ${COLORS.DARK_RUSTY_BLUE}40);
  border-radius: 12px;
  margin: 0 auto 60px;
  max-width: 1000px;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.1rem;
  color: #555;
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const CTAButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Button)`
  min-width: 200px;
  
  @media (max-width: 480px) {
    min-width: 100%;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: ${COLORS.DARK_RUSTY_BLUE};
  border: 2px solid ${COLORS.DARK_RUSTY_BLUE};
  
  &:hover {
    background-color: ${COLORS.LIGHT_RUSTY_BLUE}30;
    color: ${COLORS.DARK_RUSTY_BLUE};
  }
`;

// Sidebar Navigation Styled Components
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SidebarNav = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (max-width: 768px) {
    right: 10px;
    gap: 10px;
  }
`;

const NavItem = styled.button<{ active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#f8a4d8' : 'rgba(255, 255, 255, 0.8)'};
  border: 2px solid ${props => props.active ? '#e66465' : '#f8a4d8'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.active ? '#f8a4d8' : '#fff'};
    
    &::before {
      content: attr(data-tooltip);
      position: absolute;
      right: 50px;
      background-color: #333;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 1;
      visibility: visible;
    }
  }
  
  &::before {
    content: attr(data-tooltip);
    position: absolute;
    right: 50px;
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${props => props.active ? '#fff' : '#666'};
    transition: fill 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    
    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.4rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 20px;
`;

const AirlineGroupTitle = styled.h4`
  font-size: 0.85rem;
  margin: 3px 0 1px 0;
  padding: 2px 0;
  display: none;
  background-color: ${props => 
    props.children === "Direct Flights" 
      ? "rgba(0, 100, 255, 0.05)" 
      : "rgba(0, 150, 100, 0.05)"
  };
  border-top: ${props => 
    props.children === "Connecting Flights" 
      ? `1px dashed ${COLORS.WEATHERED_BLUE}` 
      : "none"
  };
`;

const EmptyPlaceholder = styled.div`
  width: 68px;
  height: 40px;
  margin: 1px;
`;

// YOLO Travel Section Styled Components
const YoloTravelSection = styled.div`
  margin: 60px 0;
  padding: 0 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const YoloTravelIntro = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
    max-width: 800px;
    margin: 0 auto 25px;
  }
`;

const YoloTravelButton = styled.a`
  display: inline-block;
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.2);
  
  &:hover {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 136, 229, 0.3);
  }
`;

const YoloTourCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const YoloTourCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const YoloTourImage = styled.div<{ imageUrl: string }>`
  height: 200px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const YoloTourTitle = styled.h3`
  font-size: 1.3rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin: 20px 20px 5px;
`;

const YoloTourPrice = styled.div`
  font-size: 1rem;
  color: #e67e22;
  font-weight: 600;
  margin: 0 20px 15px;
`;

const YoloTourDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  margin: 0 20px 15px;
`;

const YoloTourHighlights = styled.div`
  margin: 0 20px 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const YoloTourHighlightTitle = styled.h4`
  font-size: 1rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 10px;
`;

const YoloTourHighlightList = styled.ul`
  padding-left: 20px;
  margin: 0;
`;

const YoloTourHighlightItem = styled.li`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 5px;
`;

const YoloTourButton = styled.a`
  display: block;
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  text-align: center;
  padding: 12px 0;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 0 20px 20px;
  border-radius: 8px;
  
  &:hover {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
  }
`;

const YoloTravelNote = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  
  p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 20px;
  }
`;

const YoloTravelContact = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const YoloContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${COLORS.DARK_RUSTY_BLUE};
  font-size: 0.95rem;
  
  svg {
    flex-shrink: 0;
  }
`;

// Destination Components
const DestinationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin: 40px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DestinationCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const DestinationImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${DestinationCard}:hover & {
    transform: scale(1.05);
  }
`;

const DestinationName = styled.h3`
  padding: 15px 20px 5px;
  margin: 0;
  color: ${COLORS.DARK_RUSTY_BLUE};
  font-size: 1.4rem;
`;

const DestinationInfo = styled.div`
  padding: 0 20px 20px;
  
  p {
    margin: 10px 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const PhilippinesNarrative = styled.div`
  margin: 50px 0;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: ${COLORS.DARK_RUSTY_BLUE};
    margin-top: 0;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 25px;
  }
  
  p {
    margin: 15px 0;
    line-height: 1.7;
    font-size: 1.05rem;
  }
  
  strong {
    color: ${COLORS.DARK_RUSTY_BLUE};
  }
`;

const TravelProviderButton = styled.a`
  display: inline-block;
  margin: 10px 10px 10px 0;
  padding: 12px 20px;
  background-color: ${COLORS.LIGHT_RUSTY_BLUE};
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: ${COLORS.RUSTY_BLUE_ACCENT};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Main Component
const TravelPage: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(70);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  // Create refs for each section
  const sectionRefs = {
    international: useRef<HTMLDivElement>(null),
    domestic: useRef<HTMLDivElement>(null),
    map: useRef<HTMLDivElement>(null),
    deals: useRef<HTMLDivElement>(null),
    accommodations: useRef<HTMLDivElement>(null),
    yoloTravel: useRef<HTMLDivElement>(null),
    tips: useRef<HTMLDivElement>(null),
    explore: useRef<HTMLDivElement>(null),
    destinations: useRef<HTMLDivElement>(null),
  };
  
  useEffect(() => {
    const updateNavHeight = () => {
      const navElement = document.querySelector('nav');
      if (navElement) {
        const height = navElement.offsetHeight;
        setNavHeight(height);
        document.documentElement.style.setProperty('--nav-height', `${height}px`);
      }
    };
    
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    
    return () => {
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide sidebar based on scroll position
      const contentTop = contentRef.current?.getBoundingClientRect().top || 0;
      const showSidebar = contentTop <= navHeight;
      setSidebarVisible(showSidebar);
      
      // Determine which section is currently in view
      if (contentRef.current) {
        let currentSection = '';
        const scrollPosition = window.scrollY + navHeight + 100; // Add offset for better UX
        
        // Check each section
        Object.entries(sectionRefs).forEach(([key, ref]) => {
          if (ref.current) {
            const sectionTop = ref.current.offsetTop;
            const sectionBottom = sectionTop + ref.current.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
              currentSection = key;
            }
          }
        });
        
        if (currentSection !== activeSection) {
          setActiveSection(currentSection);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, navHeight, sectionRefs]);
  
  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToSection = (sectionKey: string) => {
    const sectionRef = sectionRefs[sectionKey as keyof typeof sectionRefs];
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <PageContainer>
      <ParallaxSection bgImage="/images/travel-hero.jpg">
        <WeddingAnimations enabled={true} />
        
        {/* Floating decorative elements */}
        <FloatingElement top="15%" left="10%" delay="0s" size="100px" />
        <FloatingElement top="25%" left="85%" delay="1s" size="120px" />
        <FloatingElement top="65%" left="15%" delay="2s" size="80px" />
        <FloatingElement top="75%" left="80%" delay="1.5s" size="90px" />
        
        <HeroContent>
          <HeroTitle>Travel Information</HeroTitle>
          <HeroSubtitle>Everything you need to know about getting to our wedding</HeroSubtitle>
        </HeroContent>
        
        <ScrollDownIndicator onClick={scrollToContent}>
          <span>Scroll Down</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ScrollDownIndicator>
      </ParallaxSection>
      
      {/* Sidebar Navigation */}
      <SidebarNav visible={sidebarVisible}>
        <NavItem 
          active={activeSection === 'international'} 
          data-tooltip="International Flights"
          onClick={() => scrollToSection('international')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
          </svg>
        </NavItem>
        
        <NavItem 
          active={activeSection === 'domestic'} 
          data-tooltip="Domestic Flights"
          onClick={() => scrollToSection('domestic')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49s7.12-1.9 16.57-4.43c.81-.23 1.28-1.05 1.07-1.85z" fill="currentColor"/>
          </svg>
        </NavItem>
        
        <NavItem 
          active={activeSection === 'map'} 
          data-tooltip="Interactive Map"
          onClick={() => scrollToSection('map')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" fill="currentColor"/>
          </svg>
        </NavItem>
        
        <NavItem 
          active={activeSection === 'deals'} 
          data-tooltip="Flight Deals"
          onClick={() => scrollToSection('deals')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" fill="currentColor"/>
          </svg>
        </NavItem>
        
        <NavItem 
          active={activeSection === 'accommodations'} 
          data-tooltip="Accommodations"
          onClick={() => scrollToSection('accommodations')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="currentColor"/>
          </svg>
        </NavItem>
        
        <NavItem 
          active={activeSection === 'yoloTravel'} 
          data-tooltip="YOLO Travel Tours"
          onClick={() => scrollToSection('yoloTravel')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-3h11v3zm0-4H4v-3h11v3zm5 4h-4V7h4v11z" fill="currentColor"/>
          </svg>
        </NavItem>
        
        <NavItem 
          active={activeSection === 'tips'} 
          data-tooltip="Travel Tips"
          onClick={() => scrollToSection('tips')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/>
          </svg>
        </NavItem>
        
        <NavItem 
          active={activeSection === 'explore'} 
          data-tooltip="Explore Philippines"
          onClick={() => scrollToSection('explore')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" fill="currentColor"/>
          </svg>
        </NavItem>
      </SidebarNav>
      
      <ContentSection ref={contentRef}>
        {/* ... existing content ... */}
        
        {/* Add refs to each section */}
        <div ref={sectionRefs.international}>
          <SectionTitle>International Flights to Manila</SectionTitle>
          <FlightCardsContainer>
            {/* Sydney to Manila Flight Card */}
            <FlightCard>
              <FlightCardHeader>
                <h3>Sydney to Manila</h3>
                <p>Flight Duration: ~8-9 hours</p>
              </FlightCardHeader>
              <FlightCardBody>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Best Time to Book:</DetailLabel>
                    <DetailValue>2-3 months in advance</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Average Price:</DetailLabel>
                    <DetailValue>AUD $600 - $1,200 (USD $400 - $800)</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Direct Flights Available:</DetailLabel>
                    <DetailValue>Yes, multiple weekly flights</DetailValue>
                  </div>
                </FlightDetail>
              </FlightCardBody>
              <FlightCardFooter>
                <AirlineList>Airlines serving this route:</AirlineList>
                <AirlineLogosContainer>
                  {/* Direct Flights First */}
                  <AirlineLogoWithTooltip 
                    name="Philippine Airlines" 
                    href={getAirlineWebsite('Philippine Airlines')}
                    tooltipContent="Aircraft: Airbus A330-300, Boeing 777-300ER
Stopovers: Direct flight
Travel time: ~8h 50m
Frequency: 4 flights per week
Price range: Economy $550-1,050, Premium Economy $1,100+, Business $2,200+"
                  >
                    PAL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Qantas" 
                    href={getAirlineWebsite('Qantas')}
                    tooltipContent="Aircraft: Airbus A330-300
Stopovers: Direct flight
Travel time: ~8h 50m
Frequency: 3 flights per week
Price range: Economy $600-900, Premium Economy $1,100+, Business $2,200+"
                  >
                    QF
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Cebu Pacific" 
                    href={getAirlineWebsite('Cebu Pacific')}
                    tooltipContent="Aircraft: Airbus A330-300
Stopovers: Direct flight
Travel time: ~8h 35m
Frequency: 4 flights per week
Price range: Economy $320-680"
                  >
                    CEB
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                  
                  {/* Connecting Flights */}
                  <AirlineLogoWithTooltip 
                    name="Singapore Airlines" 
                    href={getAirlineWebsite('Singapore Airlines')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Singapore
Travel time: ~14-16h total
Frequency: Daily flights
Price range: Economy $470-720, Premium Economy $950-1,250, Business $2,600-3,600"
                  >
                    SQ
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Cathay Pacific" 
                    href={getAirlineWebsite('Cathay Pacific')}
                    tooltipContent="Aircraft: Airbus A330, Boeing 777
Stopovers: Hong Kong
Travel time: ~16-18h total
Frequency: Daily flights
Price range: Economy $450-700, Premium Economy $900-1,300, Business $2,300-3,200"
                  >
                    CX
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Emirates" 
                    href={getAirlineWebsite('Emirates')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A380
Stopovers: Dubai
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $620-920, Premium Economy $1,250-1,650, Business $3,100-4,600"
                  >
                    EK
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Malaysia Airlines" 
                    href={getAirlineWebsite('Malaysia Airlines')}
                    tooltipContent="Aircraft: Boeing 737, Airbus A330
Stopovers: Kuala Lumpur
Travel time: ~15-17h total
Frequency: Daily flights
Price range: Economy $520-770, Business $2,300-3,100"
                  >
                    MH
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Thai Airways" 
                    href={getAirlineWebsite('Thai Airways')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Bangkok
Travel time: ~16-18h total
Frequency: Daily flights
Price range: Economy $570-820, Premium Economy $1,150-1,450, Business $2,500-3,400"
                  >
                    TG
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Scoot" 
                    href={getAirlineWebsite('Scoot')}
                    tooltipContent="Aircraft: Boeing 787
Stopovers: Singapore
Travel time: ~18-22h total
Frequency: Multiple weekly flights
Price range: Economy $325-450"
                  >
                    TR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Vietnam Airlines" 
                    href={getAirlineWebsite('Vietnam Airlines')}
                    tooltipContent="Aircraft: Airbus A350, Boeing 787
Stopovers: Ho Chi Minh City
Travel time: ~15-17h total
Frequency: 5 flights per week
Price range: Economy $500-750, Business $2,200-3,000"
                  >
                    VN
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                </AirlineLogosContainer>
              </FlightCardFooter>
            </FlightCard>
            
            {/* Melbourne to Manila Flight Card */}
            <FlightCard>
              <FlightCardHeader>
                <h3>Melbourne to Manila</h3>
                <p>Flight Duration: ~8h 35m - 8h 50m</p>
              </FlightCardHeader>
              <FlightCardBody>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Best Time to Book:</DetailLabel>
                    <DetailValue>5 weeks in advance</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Average Price:</DetailLabel>
                    <DetailValue>AUD $550 - $1,100 (USD $370 - $730)</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Direct Flights Available:</DetailLabel>
                    <DetailValue>Yes, multiple weekly flights</DetailValue>
                  </div>
                </FlightDetail>
              </FlightCardBody>
              <FlightCardFooter>
                <AirlineList>Airlines serving this route:</AirlineList>
                <AirlineLogosContainer>
                  {/* Direct Flights First */}
                  <AirlineLogoWithTooltip 
                    name="Philippine Airlines" 
                    href={getAirlineWebsite('Philippine Airlines')}
                    tooltipContent="Aircraft: Airbus A330-300, Boeing 777-300ER
Stopovers: Direct flight
Travel time: ~8h 50m
Frequency: 4 flights per week
Price range: Economy $550-1,050, Premium Economy $1,100+, Business $2,200+"
                  >
                    PAL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Qantas" 
                    href={getAirlineWebsite('Qantas')}
                    tooltipContent="Aircraft: Airbus A330-300
Stopovers: Direct flight
Travel time: ~8h 50m
Frequency: 3 flights per week
Price range: Economy $600-900, Premium Economy $1,100+, Business $2,200+"
                  >
                    QF
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Cebu Pacific" 
                    href={getAirlineWebsite('Cebu Pacific')}
                    tooltipContent="Aircraft: Airbus A330-300
Stopovers: Direct flight
Travel time: ~8h 35m
Frequency: 4 flights per week
Price range: Economy $320-680"
                  >
                    CEB
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                  
                  {/* Connecting Flights */}
                  <AirlineLogoWithTooltip 
                    name="Singapore Airlines" 
                    href={getAirlineWebsite('Singapore Airlines')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Singapore
Travel time: ~14-16h total
Frequency: Daily flights
Price range: Economy $470-720, Premium Economy $950-1,250, Business $2,600-3,600"
                  >
                    SQ
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Cathay Pacific" 
                    href={getAirlineWebsite('Cathay Pacific')}
                    tooltipContent="Aircraft: Airbus A330, Boeing 777
Stopovers: Hong Kong
Travel time: ~16-18h total
Frequency: Daily flights
Price range: Economy $450-700, Premium Economy $900-1,300, Business $2,300-3,200"
                  >
                    CX
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Emirates" 
                    href={getAirlineWebsite('Emirates')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A380
Stopovers: Dubai
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $620-920, Premium Economy $1,250-1,650, Business $3,100-4,600"
                  >
                    EK
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Malaysia Airlines" 
                    href={getAirlineWebsite('Malaysia Airlines')}
                    tooltipContent="Aircraft: Boeing 737, Airbus A330
Stopovers: Kuala Lumpur
Travel time: ~15-17h total
Frequency: Daily flights
Price range: Economy $520-770, Business $2,300-3,100"
                  >
                    MH
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Thai Airways" 
                    href={getAirlineWebsite('Thai Airways')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Bangkok
Travel time: ~16-18h total
Frequency: Daily flights
Price range: Economy $570-820, Premium Economy $1,150-1,450, Business $2,500-3,400"
                  >
                    TG
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Scoot" 
                    href={getAirlineWebsite('Scoot')}
                    tooltipContent="Aircraft: Boeing 787
Stopovers: Singapore
Travel time: ~18-22h total
Frequency: Multiple weekly flights
Price range: Economy $325-450"
                  >
                    TR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Vietnam Airlines" 
                    href={getAirlineWebsite('Vietnam Airlines')}
                    tooltipContent="Aircraft: Airbus A350, Boeing 787
Stopovers: Ho Chi Minh City
Travel time: ~15-17h total
Frequency: 5 flights per week
Price range: Economy $500-750, Business $2,200-3,000"
                  >
                    VN
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                </AirlineLogosContainer>
              </FlightCardFooter>
            </FlightCard>
            
            {/* Vancouver to Manila Flight Card */}
            <FlightCard>
              <FlightCardHeader>
                <h3>Vancouver to Manila</h3>
                <p>Flight Duration: ~13-16 hours</p>
              </FlightCardHeader>
              <FlightCardBody>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Best Time to Book:</DetailLabel>
                    <DetailValue>3-4 months in advance</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Average Price:</DetailLabel>
                    <DetailValue>CAD $1,000 - $1,800 (USD $750 - $1,350)</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Direct Flights Available:</DetailLabel>
                    <DetailValue>Yes, with Philippine Airlines and Air Canada (starting April 2025)</DetailValue>
                  </div>
                </FlightDetail>
              </FlightCardBody>
              <FlightCardFooter>
                <AirlineList>Airlines serving this route:</AirlineList>
                <AirlineLogosContainer>
                  {/* Direct Flights First */}
                  <AirlineLogoWithTooltip 
                    name="Philippine Airlines" 
                    href={getAirlineWebsite('Philippine Airlines')}
                    tooltipContent="Aircraft: Boeing 777-300ER (393 seats)
Stopovers: Direct flight
Travel time: ~13h 25m
Frequency: 3-7 flights per week
Price range: Economy $750-1,200, Premium Economy $1,500+, Business $2,800+"
                  >
                    PAL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Air Canada" 
                    href={getAirlineWebsite('Air Canada')}
                    tooltipContent="Aircraft: Boeing 787 Dreamliner
Stopovers: Direct flight (starting April 2025)
Travel time: ~13h 30m
Frequency: 3-4 flights per week
Price range: Economy $800-1,300, Premium Economy $1,600+, Business $3,000+"
                  >
                    AC
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  
                  {/* Connecting Flights */}
                  <AirlineLogoWithTooltip 
                    name="Cathay Pacific" 
                    href={getAirlineWebsite('Cathay Pacific')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Hong Kong
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $750-1,100, Premium Economy $1,400-1,800, Business $2,800-3,800"
                  >
                    CX
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="EVA Air" 
                    href={getAirlineWebsite('EVA Air')}
                    tooltipContent="Aircraft: Boeing 777, Boeing 787
Stopovers: Taipei
Travel time: ~17-19h total
Frequency: Daily flights
Price range: Economy $700-1,050, Premium Economy $1,300-1,700, Business $2,600-3,600"
                  >
                    BR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Korean Air" 
                    href={getAirlineWebsite('Korean Air')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A330
Stopovers: Seoul
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $750-1,100, Premium Economy $1,400-1,800, Business $2,800-3,800"
                  >
                    KE
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Japan Airlines" 
                    href={getAirlineWebsite('Japan Airlines')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $800-1,150, Premium Economy $1,500-1,900, Business $3,000-4,000"
                  >
                    JL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Singapore Airlines" 
                    href={getAirlineWebsite('Singapore Airlines')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Singapore
Travel time: ~20-22h total
Frequency: Daily flights
Price range: Economy $800-1,200, Premium Economy $1,600-2,000, Business $3,200-4,200"
                  >
                    SQ
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="China Airlines" 
                    href={getAirlineWebsite('China Airlines')}
                    tooltipContent="Aircraft: Airbus A350, Boeing 777
Stopovers: Taipei
Travel time: ~17-19h total
Frequency: Multiple weekly flights
Price range: Economy $650-950, Premium Economy $1,200-1,600, Business $2,400-3,400"
                  >
                    CI
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="ANA" 
                    href={getAirlineWebsite('ANA')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $800-1,150, Premium Economy $1,500-1,900, Business $3,000-4,000"
                  >
                    NH
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                </AirlineLogosContainer>
              </FlightCardFooter>
            </FlightCard>
            
            {/* Toronto to Manila Flight Card */}
            <FlightCard>
              <FlightCardHeader>
                <h3>Toronto to Manila</h3>
                <p>Flight Duration: ~16-17 hours</p>
              </FlightCardHeader>
              <FlightCardBody>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Best Time to Book:</DetailLabel>
                    <DetailValue>3-5 months in advance</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Average Price:</DetailLabel>
                    <DetailValue>CAD $1,200 - $2,000 (USD $900 - $1,500)</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Direct Flights Available:</DetailLabel>
                    <DetailValue>Yes, with Philippine Airlines</DetailValue>
                  </div>
                </FlightDetail>
              </FlightCardBody>
              <FlightCardFooter>
                <AirlineList>Airlines serving this route:</AirlineList>
                <AirlineLogosContainer>
                  {/* Direct Flights First */}
                  <AirlineGroupTitle>Direct Flights</AirlineGroupTitle>
                  <AirlineLogoWithTooltip 
                    name="Philippine Airlines" 
                    href={getAirlineWebsite('Philippine Airlines')}
                    tooltipContent="Aircraft: Airbus A350
Stopovers: Direct flight
Travel time: ~16h 15m - 17h 05m
Frequency: 6 flights per week (Mon, Wed, Thu, Fri, Sat, Sun)
Price range: Economy $1,100-1,700, Premium Economy $2,000+, Business $3,500+"
                  >
                    PAL
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  
                  {/* Connecting Flights */}
                  <AirlineGroupTitle>Connecting Flights</AirlineGroupTitle>
                  <AirlineLogoWithTooltip 
                    name="Cathay Pacific" 
                    href={getAirlineWebsite('Cathay Pacific')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Hong Kong
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $950-1,450, Premium Economy $1,800-2,300, Business $3,700-5,200"
                  >
                    CX
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Korean Air" 
                    href={getAirlineWebsite('Korean Air')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A380
Stopovers: Seoul
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $900-1,400, Premium Economy $1,700-2,200, Business $3,500-5,000"
                  >
                    KE
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="EVA Air" 
                    href={getAirlineWebsite('EVA Air')}
                    tooltipContent="Aircraft: Boeing 777, Boeing 787
Stopovers: Taipei
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $900-1,400, Premium Economy $1,700-2,200, Business $3,500-5,000"
                  >
                    BR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Japan Airlines" 
                    href={getAirlineWebsite('Japan Airlines')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $950-1,450, Premium Economy $1,800-2,300, Business $3,700-5,200"
                  >
                    JL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Air Canada" 
                    href={getAirlineWebsite('Air Canada')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Various (Vancouver, Tokyo, Hong Kong)
Travel time: ~24-28h total
Frequency: Daily flights
Price range: Economy $1,000-1,500, Premium Economy $1,900-2,400, Business $3,800-5,300"
                  >
                    AC
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="ANA" 
                    href={getAirlineWebsite('ANA')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $950-1,450, Premium Economy $1,800-2,300, Business $3,700-5,200"
                  >
                    NH
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Emirates" 
                    href={getAirlineWebsite('Emirates')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A380
Stopovers: Dubai
Travel time: ~26-28h total
Frequency: Daily flights
Price range: Economy $1,100-1,600, Premium Economy $2,100-2,600, Business $4,200-5,700"
                  >
                    EK
                  </AirlineLogoWithTooltip>
                </AirlineLogosContainer>
              </FlightCardFooter>
            </FlightCard>
            
            {/* San Francisco to Manila Flight Card */}
            <FlightCard>
              <FlightCardHeader>
                <h3>San Francisco to Manila</h3>
                <p>Flight Duration: ~15-16 hours</p>
              </FlightCardHeader>
              <FlightCardBody>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Best Time to Book:</DetailLabel>
                    <DetailValue>3-4 months in advance</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Average Price:</DetailLabel>
                    <DetailValue>USD $550 - $1,200</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Direct Flights Available:</DetailLabel>
                    <DetailValue>Yes, with Philippine Airlines and United</DetailValue>
                  </div>
                </FlightDetail>
              </FlightCardBody>
              <FlightCardFooter>
                <AirlineList>Airlines serving this route:</AirlineList>
                <AirlineLogosContainer>
                  {/* Direct Flights First */}
                  <AirlineGroupTitle>Direct Flights</AirlineGroupTitle>
                  <AirlineLogoWithTooltip 
                    name="Philippine Airlines" 
                    href={getAirlineWebsite('Philippine Airlines')}
                    tooltipContent="Aircraft: Airbus A350, Boeing 777
Stopovers: Direct flight
Travel time: ~14h 30m
Frequency: Daily flights
Price range: Economy $650-1,100, Premium Economy $1,300+, Business $2,800+"
                  >
                    PAL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="United Airlines" 
                    href={getAirlineWebsite('United Airlines')}
                    tooltipContent="Aircraft: Boeing 777-300ER
Stopovers: Direct flight
Travel time: ~14h 45m
Frequency: Daily flights
Price range: Economy $700-1,200, Premium Economy $1,400+, Business $3,000+"
                  >
                    UA
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  
                  {/* Connecting Flights */}
                  <AirlineGroupTitle>Connecting Flights</AirlineGroupTitle>
                  <AirlineLogoWithTooltip 
                    name="EVA Air" 
                    href={getAirlineWebsite('EVA Air')}
                    tooltipContent="Aircraft: Boeing 777, Boeing 787
Stopovers: Taipei
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $550-900, Premium Economy $1,100-1,500, Business $2,500-3,500"
                  >
                    BR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Cathay Pacific" 
                    href={getAirlineWebsite('Cathay Pacific')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Hong Kong
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $600-950, Premium Economy $1,200-1,600, Business $2,700-3,700"
                  >
                    CX
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Japan Airlines" 
                    href={getAirlineWebsite('Japan Airlines')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $650-1,000, Premium Economy $1,300-1,700, Business $2,900-3,900"
                  >
                    JL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="ANA" 
                    href={getAirlineWebsite('ANA')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $650-1,000, Premium Economy $1,300-1,700, Business $2,900-3,900"
                  >
                    NH
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Korean Air" 
                    href={getAirlineWebsite('Korean Air')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A330
Stopovers: Seoul
Travel time: ~18-20h total
Frequency: Daily flights
Price range: Economy $600-950, Premium Economy $1,200-1,600, Business $2,700-3,700"
                  >
                    KE
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Singapore Airlines" 
                    href={getAirlineWebsite('Singapore Airlines')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Singapore
Travel time: ~20-22h total
Frequency: Daily flights
Price range: Economy $700-1,050, Premium Economy $1,400-1,800, Business $3,100-4,100"
                  >
                    SQ
                  </AirlineLogoWithTooltip>
                </AirlineLogosContainer>
              </FlightCardFooter>
            </FlightCard>
            
            {/* Los Angeles to Manila Flight Card */}
            <FlightCard>
              <FlightCardHeader>
                <h3>Los Angeles to Manila</h3>
                <p>Flight Duration: ~15-17 hours</p>
              </FlightCardHeader>
              <FlightCardBody>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Best Time to Book:</DetailLabel>
                    <DetailValue>1-2 months in advance</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Average Price:</DetailLabel>
                    <DetailValue>USD $600 - $1,300</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Direct Flights Available:</DetailLabel>
                    <DetailValue>Yes, with Philippine Airlines</DetailValue>
                  </div>
                </FlightDetail>
              </FlightCardBody>
              <FlightCardFooter>
                <AirlineList>Airlines serving this route:</AirlineList>
                <AirlineLogosContainer>
                  {/* Direct Flights First */}
                  <AirlineGroupTitle>Direct Flights</AirlineGroupTitle>
                  <AirlineLogoWithTooltip 
                    name="Philippine Airlines" 
                    href={getAirlineWebsite('Philippine Airlines')}
                    tooltipContent="Aircraft: Airbus A350, Boeing 777
Stopovers: Direct flight
Travel time: ~15h 30m
Frequency: Daily flights
Price range: Economy $600-1,100, Premium Economy $1,300+, Business $2,800+"
                  >
                    PAL
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  
                  {/* Connecting Flights */}
                  <AirlineGroupTitle>Connecting Flights</AirlineGroupTitle>
                  <AirlineLogoWithTooltip 
                    name="Cebu Pacific" 
                    href={getAirlineWebsite('Cebu Pacific')}
                    tooltipContent="Aircraft: Airbus A330
Stopovers: Various connecting points
Travel time: ~20-24h total
Frequency: Multiple weekly flights
Price range: Economy $500-900"
                  >
                    CEB
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Delta" 
                    href={getAirlineWebsite('Delta Airlines')}
                    tooltipContent="Aircraft: Boeing 767, Airbus A330
Stopovers: Tokyo
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $700-1,200, Premium Economy $1,400-1,800, Business $3,000-4,000"
                  >
                    DL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Korean Air" 
                    href={getAirlineWebsite('Korean Air')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A330
Stopovers: Seoul
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $650-1,150, Premium Economy $1,300-1,700, Business $2,800-3,800"
                  >
                    KE
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Cathay Pacific" 
                    href={getAirlineWebsite('Cathay Pacific')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Hong Kong
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $650-1,150, Premium Economy $1,300-1,700, Business $2,800-3,800"
                  >
                    CX
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Japan Airlines" 
                    href={getAirlineWebsite('Japan Airlines')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $700-1,200, Premium Economy $1,400-1,800, Business $3,000-4,000"
                  >
                    JL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="EVA Air" 
                    href={getAirlineWebsite('EVA Air')}
                    tooltipContent="Aircraft: Boeing 777, Boeing 787
Stopovers: Taipei
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $600-1,100, Premium Economy $1,200-1,600, Business $2,600-3,600"
                  >
                    BR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="ANA" 
                    href={getAirlineWebsite('ANA')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~19-21h total
Frequency: Daily flights
Price range: Economy $700-1,200, Premium Economy $1,400-1,800, Business $3,000-4,000"
                  >
                    NH
                  </AirlineLogoWithTooltip>
                </AirlineLogosContainer>
              </FlightCardFooter>
            </FlightCard>
            
            {/* New York to Manila Flight Card */}
            <FlightCard>
              <FlightCardHeader>
                <h3>New York to Manila</h3>
                <p>Flight Duration: ~16.5h direct, ~22-26h connecting</p>
              </FlightCardHeader>
              <FlightCardBody>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Best Time to Book:</DetailLabel>
                    <DetailValue>4-5 months in advance</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Average Price:</DetailLabel>
                    <DetailValue>USD $800 - $1,700</DetailValue>
                  </div>
                </FlightDetail>
                <FlightDetail>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <DetailLabel>Direct Flights Available:</DetailLabel>
                    <DetailValue>Yes, with Philippine Airlines</DetailValue>
                  </div>
                </FlightDetail>
              </FlightCardBody>
              <FlightCardFooter>
                <AirlineList>Airlines serving this route:</AirlineList>
                <AirlineLogosContainer>
                  {/* Direct Flights First */}
                  <AirlineLogoWithTooltip 
                    name="Philippine Airlines" 
                    href={getAirlineWebsite('Philippine Airlines')}
                    tooltipContent="Aircraft: Airbus A350-900
Stopovers: Direct flight
Travel time: ~16h 30m
Frequency: 4 flights per week
Price range: Economy $1,100-1,800, Premium Economy $2,200+, Business $4,000+"
                  >
                    PAL
                  </AirlineLogoWithTooltip>
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  <EmptyPlaceholder />
                  
                  {/* Connecting Flights */}
                  <AirlineLogoWithTooltip 
                    name="Korean Air" 
                    href={getAirlineWebsite('Korean Air')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A380
Stopovers: Seoul
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $900-1,400, Premium Economy $1,700-2,200, Business $3,500-5,000"
                  >
                    KE
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Cathay Pacific" 
                    href={getAirlineWebsite('Cathay Pacific')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Hong Kong
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $950-1,450, Premium Economy $1,800-2,300, Business $3,700-5,200"
                  >
                    CX
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Singapore Airlines" 
                    href={getAirlineWebsite('Singapore Airlines')}
                    tooltipContent="Aircraft: Airbus A350, Boeing 777
Stopovers: Singapore
Travel time: ~23-25h total
Frequency: Daily flights
Price range: Economy $1,000-1,500, Premium Economy $1,900-2,400, Business $4,000-5,500"
                  >
                    SQ
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="EVA Air" 
                    href={getAirlineWebsite('EVA Air')}
                    tooltipContent="Aircraft: Boeing 777, Boeing 787
Stopovers: Taipei
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $900-1,400, Premium Economy $1,700-2,200, Business $3,500-5,000"
                  >
                    BR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Japan Airlines" 
                    href={getAirlineWebsite('Japan Airlines')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $950-1,450, Premium Economy $1,800-2,300, Business $3,700-5,200"
                  >
                    JL
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="ANA" 
                    href={getAirlineWebsite('ANA')}
                    tooltipContent="Aircraft: Boeing 787, Boeing 777
Stopovers: Tokyo
Travel time: ~22-24h total
Frequency: Daily flights
Price range: Economy $950-1,450, Premium Economy $1,800-2,300, Business $3,700-5,200"
                  >
                    NH
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Emirates" 
                    href={getAirlineWebsite('Emirates')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A380
Stopovers: Dubai
Travel time: ~24-26h total
Frequency: Daily flights
Price range: Economy $1,000-1,500, Premium Economy $1,900-2,400, Business $4,000-5,500"
                  >
                    EK
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Qatar Airways" 
                    href={getAirlineWebsite('Qatar Airways')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A350
Stopovers: Doha
Travel time: ~24-26h total
Frequency: Daily flights
Price range: Economy $1,000-1,500, Premium Economy $1,900-2,400, Business $4,000-5,500"
                  >
                    QR
                  </AirlineLogoWithTooltip>
                  <AirlineLogoWithTooltip 
                    name="Turkish Airlines" 
                    href={getAirlineWebsite('Turkish Airlines')}
                    tooltipContent="Aircraft: Boeing 777, Airbus A330
Stopovers: Istanbul
Travel time: ~24-26h total
Frequency: Daily flights
Price range: Economy $950-1,450, Premium Economy $1,800-2,300, Business $3,700-5,200"
                  >
                    TK
                  </AirlineLogoWithTooltip>
                </AirlineLogosContainer>
              </FlightCardFooter>
            </FlightCard>
          </FlightCardsContainer>
        </div>
        
        <div ref={sectionRefs.deals}>
          <SectionTitle>Find the Best Flight Deals</SectionTitle>
          <SkyscannerSection>
            <SkyscannerTitle>Search for the Best Flight Deals</SkyscannerTitle>
            <SkyscannerDescription>
              We recommend using Skyscanner to find the best deals on flights to Manila. Skyscanner compares prices from hundreds of airlines and travel agencies to help you find the most affordable options.
            </SkyscannerDescription>
            <CursorElement cursorType="link">
              <SkyscannerButton 
                href="https://www.skyscanner.com.au/transport/flights/syd/mnl/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Search Flights on Skyscanner
              </SkyscannerButton>
            </CursorElement>
          </SkyscannerSection>
          
          <TravelTips>
            <TipTitle>Flight Booking Tips</TipTitle>
            <TipsList>
              <TipItem>Book your flights 3-4 months in advance for the best prices.</TipItem>
              <TipItem>Consider flexible dates if possible - flying mid-week is often cheaper.</TipItem>
              <TipItem>Set up price alerts on Skyscanner or Google Flights to track fare changes.</TipItem>
              <TipItem>Look for flights with a stopover - they're often cheaper than direct flights.</TipItem>
              <TipItem>Check if your credit card offers travel insurance or points for flight bookings.</TipItem>
            </TipsList>
          </TravelTips>
        </div>
        
        <div ref={sectionRefs.accommodations}>
          <SectionTitle>Recommended Accommodation Options</SectionTitle>
          <AccommodationSection>
            <AccommodationCardsContainer>
              <AccommodationCard>
                <AccommodationLogo logoUrl="/images/hotels/agoda-logo.png" />
                <AccommodationTitle>Agoda</AccommodationTitle>
                <AccommodationDescription>
                  Find the best hotel deals in Manila with Agoda. Compare prices, read reviews, and browse a wide selection of accommodations from luxury hotels to budget-friendly options near our wedding venue.
                </AccommodationDescription>
                <CursorElement cursorType="link">
                  <AccommodationButton 
                    href="https://www.agoda.com/search?city=14469" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Search on Agoda
                  </AccommodationButton>
                </CursorElement>
              </AccommodationCard>
              
              <AccommodationCard>
                <AccommodationLogo logoUrl="/images/hotels/booking-logo.png" />
                <AccommodationTitle>Booking.com</AccommodationTitle>
                <AccommodationDescription>
                  Booking.com offers a diverse range of accommodations in Manila with flexible cancellation policies and special deals. Easy to use platform with detailed filters to find your perfect stay.
                </AccommodationDescription>
                <CursorElement cursorType="link">
                  <AccommodationButton 
                    href="https://www.booking.com/city/ph/manila.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Browse Booking.com
                  </AccommodationButton>
                </CursorElement>
              </AccommodationCard>
              
              <AccommodationCard>
                <AccommodationLogo logoUrl="/images/hotels/airbnb-logo.png" />
                <AccommodationTitle>Airbnb</AccommodationTitle>
                <AccommodationDescription>
                  Experience Manila like a local with Airbnb. Find unique stays from private apartments to family homes in various neighborhoods, often with more space and amenities than traditional hotels.
                </AccommodationDescription>
                <CursorElement cursorType="link">
                  <AccommodationButton 
                    href="https://www.airbnb.com/s/Manila--Philippines/homes" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Browse Airbnb
                  </AccommodationButton>
                </CursorElement>
              </AccommodationCard>
            </AccommodationCardsContainer>
          </AccommodationSection>
        </div>
        
        {/* Add YOLO Travel Section */}
        <div ref={sectionRefs.yoloTravel}>
          <SectionTitle>Explore Manila & Tagaytay with YOLO Travel</SectionTitle>
          <YoloTravelSection>
            <YoloTravelIntro>
              <p>If you're looking to explore Manila, Tagaytay, and the surrounding areas during your stay, we highly recommend YOLO Travel Philippines. They offer a variety of tours that showcase the best of what the region has to offer, from historical sites to natural wonders.</p>
              <CursorElement cursorType="link">
                <YoloTravelButton 
                  href="https://www.yolotravelph.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit YOLO Travel Website
                </YoloTravelButton>
              </CursorElement>
            </YoloTravelIntro>
            
            <YoloTourCardsContainer>
              {/* Manila-Tagaytay Sightseeing Tour */}
              <YoloTourCard>
                <YoloTourImage imageUrl="/images/tours/manila-tagaytay.jpg" />
                <YoloTourTitle>Manila-Tagaytay Sightseeing</YoloTourTitle>
                <YoloTourPrice>₱5,999 per person</YoloTourPrice>
                <YoloTourDescription>
                  History and nature in one unique day trip. Discover the heritage area of Intramuros with its rich history, then head to Tagaytay to see one of the smallest volcanoes known to man. Includes a jeepney ride to the Palace in the Sky, extreme fish feeding, fruit stands, and souvenir shopping.
                </YoloTourDescription>
                <YoloTourHighlights>
                  <YoloTourHighlightTitle>Highlights:</YoloTourHighlightTitle>
                  <YoloTourHighlightList>
                    <YoloTourHighlightItem>Intramuros historical tour</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Taal Volcano viewpoint</YoloTourHighlightItem>
                    <YoloTourHighlightItem>People's Park in the Sky</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Manila Cathedral & San Agustin Church</YoloTourHighlightItem>
                  </YoloTourHighlightList>
                </YoloTourHighlights>
                <CursorElement cursorType="link">
                  <YoloTourButton 
                    href="https://yolotravelph.com/manila-tagaytay-sightseeing/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Tour Details
                  </YoloTourButton>
                </CursorElement>
              </YoloTourCard>
              
              {/* Pagsanjan Falls Tour */}
              <YoloTourCard>
                <YoloTourImage imageUrl="/images/tours/pagsanjan-falls.jpg" />
                <YoloTourTitle>Pagsanjan Falls Adventure</YoloTourTitle>
                <YoloTourPrice>₱5,500 per person</YoloTourPrice>
                <YoloTourDescription>
                  Experience one of the most breathtaking natural wonders in the Philippines. Board a traditional dugout canoe for a thrilling journey up the Pagsanjan River, surrounded by lush rainforest and towering cliffs, to reach the majestic Pagsanjan Falls.
                </YoloTourDescription>
                <YoloTourHighlights>
                  <YoloTourHighlightTitle>Highlights:</YoloTourHighlightTitle>
                  <YoloTourHighlightList>
                    <YoloTourHighlightItem>Scenic drive from Manila to Pagsanjan</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Traditional dugout canoe ride</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Up-close experience with the falls</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Local cuisine lunch</YoloTourHighlightItem>
                  </YoloTourHighlightList>
                </YoloTourHighlights>
                <CursorElement cursorType="link">
                  <YoloTourButton 
                    href="https://yolotravelph.com/pagsanjan-falls/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Tour Details
                  </YoloTourButton>
                </CursorElement>
              </YoloTourCard>
              
              {/* Active Taal Volcano Experience */}
              <YoloTourCard>
                <YoloTourImage imageUrl="/images/tours/taal-volcano.jpg" />
                <YoloTourTitle>Active Taal Volcano Experience</YoloTourTitle>
                <YoloTourPrice>From ₱6,500 per person</YoloTourPrice>
                <YoloTourDescription>
                  Embark on an adventure to one of the world's smallest active volcanoes. Take a boat ride across Taal Lake and trek to the crater for breathtaking views. This tour combines natural beauty with an exhilarating hiking experience.
                </YoloTourDescription>
                <YoloTourHighlights>
                  <YoloTourHighlightTitle>Highlights:</YoloTourHighlightTitle>
                  <YoloTourHighlightList>
                    <YoloTourHighlightItem>Boat ride across Taal Lake</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Trek to the volcano crater</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Panoramic views of the surrounding landscape</YoloTourHighlightItem>
                    <YoloTourHighlightItem>Expert local guides</YoloTourHighlightItem>
                  </YoloTourHighlightList>
                </YoloTourHighlights>
                <CursorElement cursorType="link">
                  <YoloTourButton 
                    href="https://yolotravelph.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Tour Details
                  </YoloTourButton>
                </CursorElement>
              </YoloTourCard>
            </YoloTourCardsContainer>
            
            <YoloTravelNote>
              <p>YOLO Travel Philippines offers many more tours including combo day tours, day hikes, half-day tours, and evening tours. They also provide services like car rentals and airport transfers. Contact them directly for more information or to book a tour.</p>
              <YoloTravelContact>
                <YoloContactItem>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                  </svg>
                  <span>+63 976 000 2308</span>
                </YoloContactItem>
                <YoloContactItem>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                  </svg>
                  <span>yolotravelph@gmail.com</span>
                </YoloContactItem>
                <YoloContactItem>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.9 15.5L16.5 15.9C15.6 16.8 13.4 15.9 11.2 13.8C9 11.6 8.1 9.4 9 8.5L9.4 8.1C9.8 7.7 10.4 7.7 10.8 8.1L12.2 9.5C12.6 9.9 12.6 10.5 12.2 10.9L11.9 11.2C11.9 11.2 11.9 11.3 12 11.4C12.1 11.5 12.2 11.7 12.4 11.9C12.8 12.3 13.1 12.6 13.4 12.7C13.5 12.8 13.6 12.8 13.6 12.8L13.9 12.5C14.3 12.1 14.9 12.1 15.3 12.5L16.7 13.9C17.1 14.3 17.1 14.9 16.9 15.5Z" fill="currentColor"/>
                  </svg>
                  <span>Viber, WhatsApp, Telegram: +63 976 000 2308</span>
                </YoloContactItem>
              </YoloTravelContact>
            </YoloTravelNote>
          </YoloTravelSection>
        </div>
        
        <div ref={sectionRefs.tips}>
          <SectionTitle>Travel Tips</SectionTitle>
          <TipsSection>
            <Accordion
              items={[
                {
                  title: "Flight Booking Tips",
                  content: (
                    <ul>
                      <li><strong>Book in advance:</strong> Aim to book your flights 3-4 months before your travel date for the best prices.</li>
                      <li><strong>Be flexible with dates:</strong> If possible, try flying mid-week as it's often cheaper than weekend flights.</li>
                      <li><strong>Set up price alerts:</strong> Use services like Skyscanner, Google Flights, or Hopper to track fare changes.</li>
                      <li><strong>Consider stopovers:</strong> Flights with a stopover are typically cheaper than direct flights.</li>
                      <li><strong>Check baggage policies:</strong> Review the airline's baggage allowance before booking to avoid unexpected fees.</li>
                    </ul>
                  )
                },
                {
                  title: "Domestic Travel in the Philippines",
                  content: (
                    <ul>
                      <li><strong>Book domestic flights early:</strong> Domestic flights can fill up quickly, especially during peak season.</li>
                      <li><strong>Consider alternative airports:</strong> Some destinations have multiple airports - check all options.</li>
                      <li><strong>Be prepared for delays:</strong> Weather can affect flight schedules, especially during rainy season.</li>
                      <li><strong>Pack light:</strong> Domestic flights often have stricter baggage limits than international flights.</li>
                      <li><strong>Bring cash:</strong> While credit cards are widely accepted in major cities, cash is preferred in smaller towns.</li>
                    </ul>
                  )
                },
                {
                  title: "Accommodation Advice",
                  content: (
                    <ul>
                      <li><strong>Book early:</strong> Secure your accommodation as soon as you confirm your travel dates.</li>
                      <li><strong>Consider location:</strong> Stay close to the wedding venue or in areas with good transportation options.</li>
                      <li><strong>Check reviews:</strong> Read recent reviews on multiple platforms before booking.</li>
                      <li><strong>Verify amenities:</strong> Ensure the accommodation has the amenities you need (WiFi, air conditioning, etc.).</li>
                      <li><strong>Contact us for recommendations:</strong> We're happy to suggest accommodations based on your preferences.</li>
                    </ul>
                  )
                },
                {
                  title: "Packing Essentials",
                  content: (
                    <ul>
                      <li><strong>Weather-appropriate clothing:</strong> The Philippines is hot and humid - pack light, breathable fabrics.</li>
                      <li><strong>Sun protection:</strong> Bring sunscreen, sunglasses, and a hat for outdoor activities.</li>
                      <li><strong>Insect repellent:</strong> Especially important if you plan to visit rural areas or beaches.</li>
                      <li><strong>Medications:</strong> Bring any prescription medications and a basic first-aid kit.</li>
                      <li><strong>Power adapters:</strong> The Philippines uses Type A, B, and C plugs with 220V electricity.</li>
                      <li><strong>Comfortable shoes:</strong> For exploring the city and any excursions you might take.</li>
                    </ul>
                  )
                },
                {
                  title: "Local Transportation",
                  content: (
                    <ul>
                      <li><strong>Ride-hailing apps:</strong> Grab is widely used in the Philippines and is a convenient way to get around.</li>
                      <li><strong>Taxis:</strong> Available in major cities, but make sure the meter is running or agree on a price beforehand.</li>
                      <li><strong>Jeepneys and buses:</strong> Affordable public transportation options, but can be crowded and confusing for first-timers.</li>
                      <li><strong>Car rentals:</strong> Consider renting a car with a driver if you plan to travel extensively.</li>
                      <li><strong>Walking:</strong> Many areas in Manila are walkable, but be mindful of the heat and traffic.</li>
                    </ul>
                  )
                }
              ]}
            />
          </TipsSection>
        </div>
        
        <div ref={sectionRefs.explore}>
          <SectionTitle>Explore the Philippines</SectionTitle>
          <CTASection>
            <p>
              The Philippines is a tropical paradise waiting to be discovered! With over 7,000 islands offering pristine beaches, lush mountains, vibrant coral reefs, and warm, hospitable people, your wedding trip can become an unforgettable adventure.
            </p>
            <p>
              From the iconic Chocolate Hills of Bohol to the crystal-clear waters of Boracay, the limestone cliffs of Palawan to the surfing waves of Siargao, each destination offers unique experiences that will leave you breathless. Immerse yourself in the rich Filipino culture, savor the delicious local cuisine, and create memories that will last a lifetime.
            </p>
            <p>
              Ready to start planning your Philippine adventure? Book your flights with these major carriers:
            </p>
            <div style={{ marginTop: '15px' }}>
              <TravelProviderButton href="https://www.philippineairlines.com" target="_blank" rel="noopener noreferrer">
                Philippine Airlines
              </TravelProviderButton>
              <TravelProviderButton href="https://www.cebupacificair.com" target="_blank" rel="noopener noreferrer">
                Cebu Pacific
              </TravelProviderButton>
              <TravelProviderButton href="https://www.airasia.com" target="_blank" rel="noopener noreferrer">
                AirAsia
              </TravelProviderButton>
            </div>
            <p style={{ marginTop: '20px' }}>
              Prefer to travel by sea? Experience the beauty of island hopping with:
            </p>
            <div>
              <TravelProviderButton href="https://travel.2go.com.ph" target="_blank" rel="noopener noreferrer">
                2Go Travel
              </TravelProviderButton>
            </div>
            <p style={{ marginTop: '20px' }}>
              We're excited to share our beautiful country with you! Feel free to reach out if you need any recommendations or assistance planning your extended stay.
            </p>
          </CTASection>
        </div>
        
        <div ref={sectionRefs.destinations}>
          <SectionTitle>Popular Destinations</SectionTitle>
          <p>Hover over destinations to see flight information. Click on routes to view details.</p>
          <PopularDestinations />
        </div>
      </ContentSection>
    </PageContainer>
  );
};

export default TravelPage; 