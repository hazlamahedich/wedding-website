import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import CursorElement from '../components/CursorElement';
import { COLORS } from '../constants/theme';
import WeddingAnimations from '../components/WeddingAnimations';

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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FlightCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const FlightCardTitle = styled.h3`
  font-size: 1.5rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${COLORS.RUSTY_HIGHLIGHT};
`;

const FlightInfo = styled.div`
  margin-bottom: 20px;
`;

const FlightRoute = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
`;

const FlightDetails = styled.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 5px;
`;

const PriceRange = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${COLORS.RUSTY_BLUE_ACCENT};
  margin-top: 15px;
`;

// Add these new styled components for airline logos
const AirlineLogosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
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
const AirlineLogoFallback = styled.a<{ name: string; href: string; target?: string; rel?: string }>`
  display: flex;
  width: 60px;
  height: 30px;
  background-color: #f5f5f5;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-align: center;
  padding: 0 5px;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  cursor: none;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    background-color: #e8f4fd;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
`;

// Create a new component for the tooltip
const AirlineTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${COLORS.DARK_RUSTY_BLUE};
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  width: 220px;
  text-align: left;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  line-height: 1.4;
  margin-bottom: 10px;
  white-space: normal;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: ${COLORS.DARK_RUSTY_BLUE} transparent transparent transparent;
  }
  
  ${AirlineLogoFallback}:hover & {
    opacity: 1;
    visibility: visible;
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
        {tooltipContent && <AirlineTooltip>{tooltipContent}</AirlineTooltip>}
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
    'China Airlines': 'https://www.china-airlines.com/en-us'
  };
  
  return websites[airline] || 'https://www.skyscanner.com.au/';
};

// Update the AirlineList component
const AirlineList = styled.div`
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
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

const TravelPage: React.FC = () => {
  const [navHeight, setNavHeight] = useState(70);
  const contentRef = useRef<HTMLDivElement>(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  useEffect(() => {
    // Update navigation height
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
  
  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <PageContainer>
      <ParallaxSection bgImage="/images/travel-hero.jpg">
        {animationsEnabled && <WeddingAnimations enabled={true} />}
        
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
      
      <ContentSection ref={contentRef}>
        <SectionTitle>Flight Information</SectionTitle>
        
        <FlightCardsContainer>
          {/* Australia to Manila Flights */}
          <FlightCard>
            <FlightCardTitle>Sydney to Manila</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Sydney (SYD) → Manila (MNL)</FlightRoute>
              <FlightDetails>Flight Duration: ~8-9 hours</FlightDetails>
              <FlightDetails>Direct flights available</FlightDetails>
              <PriceRange>Price Range: AUD $600 - $1,200</PriceRange>
              <AirlineList>
                Airlines: Qantas, Philippine Airlines, Cebu Pacific
              </AirlineList>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Qantas" 
                  href="https://www.qantas.com/" 
                  tooltipContent="Qantas Airways&#10;Flight Numbers: QF19/QF20&#10;Route: Sydney (SYD) to Manila (MNL)&#10;Aircraft Type: Airbus A330&#10;Flight Duration: ~8 hours 30 minutes&#10;Schedule: Daily flights&#10;Direct non-stop service"
                >
                  Qantas
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: PR212/PR213&#10;Route: Sydney (SYD) to Manila (MNL)&#10;Aircraft Type: Airbus A330-300&#10;Flight Duration: ~8 hours 15 minutes&#10;Schedule: Daily flights&#10;Direct non-stop service"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cebu Pacific" 
                  href="https://www.cebupacificair.com/" 
                  tooltipContent="Cebu Pacific&#10;Flight Numbers: 5J40/5J39&#10;Route: Sydney (SYD) to Manila (MNL)&#10;Aircraft Type: Airbus A330-300&#10;Flight Duration: ~8 hours 45 minutes&#10;Schedule: 5 times weekly&#10;Direct non-stop service&#10;Budget airline with optional add-ons"
                >
                  Cebu
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>Melbourne to Manila</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Melbourne (MEL) → Manila (MNL)</FlightRoute>
              <FlightDetails>Flight Duration: ~9-10 hours</FlightDetails>
              <FlightDetails>Direct flights available</FlightDetails>
              <PriceRange>Price Range: AUD $650 - $1,300</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cebu Pacific, Qantas (via Sydney)
              </AirlineList>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: PR210/PR209&#10;Route: Melbourne (MEL) to Manila (MNL)&#10;Aircraft Type: Airbus A330-300&#10;Flight Duration: ~9 hours 10 minutes&#10;Schedule: 5 times weekly&#10;Direct non-stop service"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cebu Pacific" 
                  href="https://www.cebupacificair.com/" 
                  tooltipContent="Cebu Pacific&#10;Flight Numbers: 5J50/5J49&#10;Route: Melbourne (MEL) to Manila (MNL)&#10;Aircraft Type: Airbus A330-300&#10;Flight Duration: ~9 hours 30 minutes&#10;Schedule: 3 times weekly&#10;Direct non-stop service&#10;Budget airline with optional add-ons"
                >
                  Cebu
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Qantas" 
                  href="https://www.qantas.com/" 
                  tooltipContent="Qantas Airways&#10;Route: Melbourne (MEL) → Sydney (SYD) → Manila (MNL)&#10;Aircraft Type: Boeing 737 + Airbus A330&#10;Flight Duration: ~11-12 hours total&#10;Typical Layover: Sydney (1-2 hours)&#10;Connecting service via Sydney"
                >
                  Qantas
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          {/* Canada to Manila Flights */}
          <FlightCard>
            <FlightCardTitle>Vancouver to Manila</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Vancouver (YVR) → Manila (MNL)</FlightRoute>
              <FlightDetails>Flight Duration: ~13-16 hours</FlightDetails>
              <FlightDetails>Direct flights available (Air Canada starting April 2025)</FlightDetails>
              <PriceRange>Price Range: CAD $1,000 - $1,800</PriceRange>
              <AirlineList>
                Airlines: Air Canada, Philippine Airlines, Cathay Pacific, Korean Air, ANA
              </AirlineList>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Air Canada" 
                  href="https://www.aircanada.com/en-ca/flights-from-vancouver-to-manila" 
                  tooltipContent="Air Canada&#10;Flight Numbers: AC129/AC128 (Starting April 2025)&#10;Route: Vancouver (YVR) to Manila (MNL)&#10;Aircraft Type: Boeing 787 Dreamliner&#10;Flight Duration: ~13 hours 45 minutes&#10;Schedule: 3 times weekly&#10;Direct non-stop service"
                >
                  Air CA
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: PR117/PR116&#10;Route: Vancouver (YVR) to Manila (MNL)&#10;Aircraft Type: Airbus A350&#10;Flight Duration: ~13 hours 30 minutes&#10;Schedule: 3 times weekly&#10;Direct non-stop service"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cathay Pacific" 
                  href="https://www.cathaypacific.com/" 
                  tooltipContent="Cathay Pacific Airways&#10;Route: Vancouver (YVR) → Hong Kong (HKG) → Manila (MNL)&#10;Aircraft Type: Boeing 777-300ER / Airbus A350&#10;Flight Duration: ~16-17 hours total&#10;Typical Layover: Hong Kong (2-3 hours)"
                >
                  Cathay
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Korean Air" 
                  href="https://www.koreanair.com/" 
                  tooltipContent="Korean Air&#10;Route: Vancouver (YVR) → Seoul (ICN) → Manila (MNL)&#10;Aircraft Type: Boeing 777 or 787&#10;Flight Duration: ~16-18 hours total&#10;Typical Layover: Seoul (2-4 hours)"
                >
                  Korean
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="ANA" 
                  href="https://www.ana.co.jp/en/us/" 
                  tooltipContent="All Nippon Airways (ANA)&#10;Route: Vancouver (YVR) → Tokyo (NRT/HND) → Manila (MNL)&#10;Aircraft Type: Boeing 787 Dreamliner&#10;Flight Duration: ~16-18 hours total&#10;Typical Layover: Tokyo (2-3 hours)"
                >
                  ANA
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>Toronto to Manila</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Toronto (YYZ) → Manila (MNL)</FlightRoute>
              <FlightDetails>Flight Duration: ~18-22 hours</FlightDetails>
              <FlightDetails>Usually 1-2 stops</FlightDetails>
              <FlightDetails>Direct flights available via Philippine Airlines (PR119)</FlightDetails>
              <PriceRange>Price Range: CAD $1,200 - $2,000</PriceRange>
              <AirlineList>
                Airlines: Cathay Pacific, EVA Air, Korean Air, Emirates, Philippine Airlines
              </AirlineList>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Cathay Pacific" 
                  href="https://www.cathaypacific.com/" 
                  tooltipContent="Cathay Pacific Airways&#10;Route: Toronto → Hong Kong → Manila&#10;Aircraft: Boeing 777-300ER&#10;Flight Duration: ~19-21 hours total&#10;Typical Layover: Hong Kong (2-4 hours)"
                >
                  Cathay
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="EVA Air" 
                  href="https://www.evaair.com/" 
                  tooltipContent="EVA Air&#10;Route: Toronto → Taipei → Manila&#10;Aircraft: Boeing 777-300ER&#10;Flight Duration: ~20-22 hours total&#10;Typical Layover: Taipei (2-3 hours)"
                >
                  EVA
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Korean Air" 
                  href="https://www.koreanair.com/" 
                  tooltipContent="Korean Air&#10;Route: Toronto → Seoul → Manila&#10;Aircraft: Boeing 777 or 787&#10;Flight Duration: ~19-21 hours total&#10;Typical Layover: Seoul (2-4 hours)"
                >
                  Korean
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Emirates" 
                  href="https://www.emirates.com/" 
                  tooltipContent="Emirates&#10;Route: Toronto → Dubai → Manila&#10;Aircraft: Airbus A380 or Boeing 777&#10;Flight Duration: ~22-24 hours total&#10;Typical Layover: Dubai (2-4 hours)"
                >
                  Emirates
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Number: PR119&#10;Route: Toronto Pearson (YYZ) to Manila (MNL)&#10;Aircraft Type: Airbus A350&#10;Flight Duration: ~16-17 hours&#10;Schedule: Operates on Mondays, Thursdays, and Saturdays&#10;Departure times: Late evening/early morning&#10;Direct non-stop service"
                >
                  PAL
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          {/* US to Manila Flights */}
          <FlightCard>
            <FlightCardTitle>Los Angeles to Manila</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Los Angeles (LAX) → Manila (MNL)</FlightRoute>
              <FlightDetails>Flight Duration: ~15-17 hours</FlightDetails>
              <FlightDetails>Direct flights available</FlightDetails>
              <FlightDetails>Connecting flights via Tokyo (Zip Air) or Taipei (China Airlines)</FlightDetails>
              <PriceRange>Price Range: USD $700 - $1,500</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cathay Pacific, Korean Air, ANA, Zip Air, China Airlines
              </AirlineList>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: PR103/PR102&#10;Route: Los Angeles (LAX) to Manila (MNL)&#10;Aircraft Type: Boeing 777-300ER&#10;Flight Duration: ~15 hours 30 minutes&#10;Schedule: Daily flights&#10;Direct non-stop service"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cathay Pacific" 
                  href="https://www.cathaypacific.com/" 
                  tooltipContent="Cathay Pacific Airways&#10;Route: Los Angeles (LAX) → Hong Kong (HKG) → Manila (MNL)&#10;Aircraft Type: Boeing 777-300ER / Airbus A350&#10;Flight Duration: ~17-19 hours total&#10;Typical Layover: Hong Kong (2-3 hours)"
                >
                  Cathay
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Korean Air" 
                  href="https://www.koreanair.com/" 
                  tooltipContent="Korean Air&#10;Route: Los Angeles (LAX) → Seoul (ICN) → Manila (MNL)&#10;Aircraft Type: Airbus A380 or Boeing 777&#10;Flight Duration: ~17-19 hours total&#10;Typical Layover: Seoul (2-4 hours)"
                >
                  Korean
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="ANA" 
                  href="https://www.ana.co.jp/en/us/" 
                  tooltipContent="All Nippon Airways (ANA)&#10;Route: Los Angeles (LAX) → Tokyo (NRT/HND) → Manila (MNL)&#10;Aircraft Type: Boeing 777 or 787&#10;Flight Duration: ~17-19 hours total&#10;Typical Layover: Tokyo (2-3 hours)"
                >
                  ANA
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Zip Air" 
                  href="https://www.zipair.net/en" 
                  tooltipContent="Zip Air Tokyo&#10;Route: Los Angeles (LAX) → Tokyo (NRT) → Manila (MNL)&#10;Aircraft Type: Boeing 787-8&#10;Flight Duration: ~17-18 hours total&#10;Typical Layover: Tokyo (2-4 hours)&#10;Budget airline with optional add-ons"
                >
                  Zip Air
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="China Airlines" 
                  href="https://www.china-airlines.com/en-us/flights-from-los-angeles-to-manila" 
                  tooltipContent="China Airlines&#10;Route: Los Angeles (LAX) → Taipei (TPE) → Manila (MNL)&#10;Aircraft Type: Airbus A350 or Boeing 777&#10;Flight Duration: ~17-19 hours total&#10;Typical Layover: Taipei (2-3 hours)&#10;Fare from $738 round-trip with 2 free checked bags"
                >
                  China
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>San Francisco to Manila</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>San Francisco (SFO) → Manila (MNL)</FlightRoute>
              <FlightDetails>Flight Duration: ~15-16 hours</FlightDetails>
              <FlightDetails>Direct flights available</FlightDetails>
              <FlightDetails>Connecting flights via Taipei (China Airlines)</FlightDetails>
              <PriceRange>Price Range: USD $550 - $1,200</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, United Airlines, Singapore Airlines, China Airlines
              </AirlineList>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: PR105/PR104&#10;Route: San Francisco (SFO) to Manila (MNL)&#10;Aircraft Type: Airbus A350-900&#10;Flight Duration: ~14 hours 45 minutes&#10;Schedule: Daily flights&#10;Direct non-stop service"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="United Airlines" 
                  href="https://www.united.com/en/us/flights-from-san-francisco-to-manila" 
                  tooltipContent="United Airlines&#10;Flight Numbers: UA805/UA806&#10;Route: San Francisco (SFO) to Manila (MNL)&#10;Aircraft Type: Boeing 777-300ER&#10;Flight Duration: ~15 hours&#10;Schedule: Daily flights&#10;Direct non-stop service"
                >
                  United
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Singapore Airlines" 
                  href="https://www.singaporeair.com/en_UK/us/home" 
                  tooltipContent="Singapore Airlines&#10;Route: San Francisco (SFO) → Singapore (SIN) → Manila (MNL)&#10;Aircraft Type: Airbus A350 or Boeing 777&#10;Flight Duration: ~19-21 hours total&#10;Typical Layover: Singapore (2-3 hours)"
                >
                  SIA
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="China Airlines" 
                  href="https://www.china-airlines.com/en-us/flights-from-los-angeles-to-manila" 
                  tooltipContent="China Airlines&#10;Route: San Francisco (SFO) → Taipei (TPE) → Manila (MNL)&#10;Aircraft Type: Airbus A350 or Boeing 777&#10;Flight Duration: ~16-18 hours total&#10;Typical Layover: Taipei (2-3 hours)&#10;Fare from $550 one-way with 2 free checked bags"
                >
                  China
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>New York to Manila</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>New York (JFK) → Manila (MNL)</FlightRoute>
              <FlightDetails>Flight Duration: ~20-22 hours</FlightDetails>
              <FlightDetails>Usually 1 stop (Tokyo, Seoul, Hong Kong, or Dubai)</FlightDetails>
              <FlightDetails>Budget options via Tokyo (Zip Air) or Taipei (China Airlines)</FlightDetails>
              <PriceRange>Price Range: USD $800 - $1,700</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cathay Pacific, Korean Air, Emirates, Zip Air, China Airlines
              </AirlineList>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: PR127/PR126&#10;Route: New York (JFK) → Manila (MNL)&#10;Aircraft Type: Airbus A350-900&#10;Flight Duration: ~20 hours (with technical stop in Vancouver)&#10;Schedule: 3 times weekly&#10;Direct service with technical stop"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cathay Pacific" 
                  href="https://www.cathaypacific.com/" 
                  tooltipContent="Cathay Pacific Airways&#10;Route: New York (JFK) → Hong Kong (HKG) → Manila (MNL)&#10;Aircraft Type: Boeing 777-300ER / Airbus A350&#10;Flight Duration: ~21-23 hours total&#10;Typical Layover: Hong Kong (2-3 hours)"
                >
                  Cathay
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Korean Air" 
                  href="https://www.koreanair.com/" 
                  tooltipContent="Korean Air&#10;Route: New York (JFK) → Seoul (ICN) → Manila (MNL)&#10;Aircraft Type: Airbus A380 or Boeing 777&#10;Flight Duration: ~21-23 hours total&#10;Typical Layover: Seoul (2-4 hours)"
                >
                  Korean
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Emirates" 
                  href="https://www.emirates.com/" 
                  tooltipContent="Emirates&#10;Route: New York (JFK) → Dubai (DXB) → Manila (MNL)&#10;Aircraft Type: Airbus A380 or Boeing 777&#10;Flight Duration: ~22-24 hours total&#10;Typical Layover: Dubai (2-4 hours)"
                >
                  Emirates
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Zip Air" 
                  href="https://www.zipair.net/en" 
                  tooltipContent="Zip Air Tokyo&#10;Route: New York (JFK) → Tokyo (NRT) → Manila (MNL)&#10;Aircraft Type: Boeing 787-8&#10;Flight Duration: ~21-22 hours total&#10;Typical Layover: Tokyo (2-4 hours)&#10;Budget airline with optional add-ons"
                >
                  Zip Air
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="China Airlines" 
                  href="https://www.china-airlines.com/en-us/flights-from-los-angeles-to-manila" 
                  tooltipContent="China Airlines&#10;Route: New York (JFK) → Taipei (TPE) → Manila (MNL)&#10;Aircraft Type: Airbus A350 or Boeing 777&#10;Flight Duration: ~21-23 hours total&#10;Typical Layover: Taipei (2-3 hours)&#10;Fare from $800 round-trip with 2 free checked bags"
                >
                  China
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
        </FlightCardsContainer>
        
        {/* Add Domestic Philippines Flights Section */}
        <SectionTitle style={{ marginTop: '60px' }}>Domestic Flights in the Philippines</SectionTitle>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px', color: '#555' }}>
          Explore the beautiful islands and tourist destinations of the Philippines with these convenient domestic flights from Manila.
        </p>
        
        <FlightCardsContainer>
          {/* Domestic flight cards will be added here */}
          <FlightCard>
            <FlightCardTitle>Manila to Cebu</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Manila (MNL) → Cebu (CEB)</FlightRoute>
              <FlightDetails>Flight Duration: ~1h 20m</FlightDetails>
              <FlightDetails>Multiple direct flights daily</FlightDetails>
              <PriceRange>Price Range: PHP 1,500 - 5,000 (USD $30 - $100)</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cebu Pacific, AirAsia
              </AirlineList>
              <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f5f9ff', borderRadius: '5px', fontSize: '0.9rem' }}>
                <strong>What to expect:</strong> Cebu offers pristine beaches, vibrant coral reefs, and the famous Kawasan Falls. 
                Visitors can swim with whale sharks in Oslob, explore the historic Magellan's Cross, or island hop to nearby 
                destinations like Bohol. The city combines urban amenities with easy access to natural wonders.
              </div>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: Multiple daily (PR1845, PR1849, etc.)&#10;Route: Manila (MNL) to Cebu (CEB)&#10;Aircraft Type: Airbus A320 or A321&#10;Flight Duration: ~1 hour 20 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 2 (Manila)"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cebu Pacific" 
                  href="https://www.cebupacificair.com/" 
                  tooltipContent="Cebu Pacific&#10;Flight Numbers: Multiple daily (5J551, 5J553, etc.)&#10;Route: Manila (MNL) to Cebu (CEB)&#10;Aircraft Type: Airbus A320 or A321&#10;Flight Duration: ~1 hour 25 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 3 (Manila)&#10;Budget airline with optional add-ons"
                >
                  Cebu
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="AirAsia" 
                  href="https://www.airasia.com/" 
                  tooltipContent="AirAsia Philippines&#10;Flight Numbers: Multiple daily (Z2775, Z2777, etc.)&#10;Route: Manila (MNL) to Cebu (CEB)&#10;Aircraft Type: Airbus A320&#10;Flight Duration: ~1 hour 20 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 4 (Manila)&#10;Budget airline with optional add-ons"
                >
                  AirAsia
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>Manila to Bohol</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Manila (MNL) → Tagbilaran (TAG)</FlightRoute>
              <FlightDetails>Flight Duration: ~1h 30m</FlightDetails>
              <FlightDetails>Multiple direct flights daily</FlightDetails>
              <PriceRange>Price Range: PHP 2,000 - 6,000 (USD $40 - $120)</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cebu Pacific, AirAsia
              </AirlineList>
              <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f5f9ff', borderRadius: '5px', fontSize: '0.9rem' }}>
                <strong>What to expect:</strong> Bohol is famous for its Chocolate Hills, tiny tarsier primates, and beautiful beaches on Panglao Island. 
                Visitors can take a cruise on the Loboc River, explore the Hinagdanan Cave, or enjoy world-class diving and snorkeling at Balicasag Island. 
                The island offers a perfect mix of natural wonders and cultural experiences.
              </div>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: Multiple daily (PR2773, PR2777, etc.)&#10;Route: Manila (MNL) to Tagbilaran (TAG)&#10;Aircraft Type: Airbus A320 or A321&#10;Flight Duration: ~1 hour 30 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 2 (Manila)"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cebu Pacific" 
                  href="https://www.cebupacificair.com/" 
                  tooltipContent="Cebu Pacific&#10;Flight Numbers: Multiple daily (5J619, 5J621, etc.)&#10;Route: Manila (MNL) to Tagbilaran (TAG)&#10;Aircraft Type: Airbus A320&#10;Flight Duration: ~1 hour 35 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 3 (Manila)&#10;Budget airline with optional add-ons"
                >
                  Cebu
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="AirAsia" 
                  href="https://www.airasia.com/" 
                  tooltipContent="AirAsia Philippines&#10;Flight Numbers: Multiple daily (Z2225, Z2227, etc.)&#10;Route: Manila (MNL) to Tagbilaran (TAG)&#10;Aircraft Type: Airbus A320&#10;Flight Duration: ~1 hour 30 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 4 (Manila)&#10;Budget airline with optional add-ons"
                >
                  AirAsia
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>Manila to Boracay</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Manila (MNL) → Caticlan (MPH)</FlightRoute>
              <FlightDetails>Flight Duration: ~1h 10m</FlightDetails>
              <FlightDetails>Multiple direct flights daily</FlightDetails>
              <PriceRange>Price Range: PHP 1,800 - 6,500 (USD $35 - $130)</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cebu Pacific, AirAsia
              </AirlineList>
              <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f5f9ff', borderRadius: '5px', fontSize: '0.9rem' }}>
                <strong>What to expect:</strong> Boracay is renowned for its stunning White Beach with powdery white sand and crystal-clear waters. 
                The island offers water activities like parasailing, island hopping, and snorkeling. After a recent rehabilitation, 
                Boracay maintains its beauty while providing a more sustainable tourism experience with excellent dining, nightlife, and accommodations.
              </div>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: Multiple daily (PR2041, PR2043, etc.)&#10;Route: Manila (MNL) to Caticlan (MPH)&#10;Aircraft Type: Bombardier Q400&#10;Flight Duration: ~1 hour 10 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 2 (Manila)&#10;Note: Short runway at Caticlan requires smaller aircraft"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cebu Pacific" 
                  href="https://www.cebupacificair.com/" 
                  tooltipContent="Cebu Pacific&#10;Flight Numbers: Multiple daily (5J891, 5J893, etc.)&#10;Route: Manila (MNL) to Caticlan (MPH)&#10;Aircraft Type: ATR 72-600&#10;Flight Duration: ~1 hour 15 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 3 (Manila)&#10;Budget airline with optional add-ons&#10;Note: Also offers flights to Kalibo (KLO) with land transfer to Boracay"
                >
                  Cebu
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="AirAsia" 
                  href="https://www.airasia.com/" 
                  tooltipContent="AirAsia Philippines&#10;Flight Numbers: Multiple daily (Z2221, Z2223, etc.)&#10;Route: Manila (MNL) to Caticlan (MPH)&#10;Aircraft Type: Airbus A320&#10;Flight Duration: ~1 hour 10 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 4 (Manila)&#10;Budget airline with optional add-ons&#10;Note: Also offers flights to Kalibo (KLO) with land transfer to Boracay"
                >
                  AirAsia
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>Manila to Palawan</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Manila (MNL) → Puerto Princesa (PPS)</FlightRoute>
              <FlightDetails>Flight Duration: ~1h 30m</FlightDetails>
              <FlightDetails>Multiple direct flights daily</FlightDetails>
              <PriceRange>Price Range: PHP 1,500 - 6,000 (USD $30 - $120)</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cebu Pacific, AirAsia
              </AirlineList>
              <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f5f9ff', borderRadius: '5px', fontSize: '0.9rem' }}>
                <strong>What to expect:</strong> Palawan is home to the UNESCO World Heritage Puerto Princesa Underground River, 
                one of the world's longest navigable underground rivers. The island province offers stunning limestone cliffs in El Nido, 
                pristine beaches, and world-class diving spots. Visitors can enjoy island hopping tours, kayaking through lagoons, 
                and exploring diverse marine ecosystems in this paradise often called "The Last Frontier" of the Philippines.
              </div>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: Multiple daily (PR1781, PR1783, etc.)&#10;Route: Manila (MNL) to Puerto Princesa (PPS)&#10;Aircraft Type: Airbus A320 or A321&#10;Flight Duration: ~1 hour 30 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 2 (Manila)&#10;Note: Also offers flights to El Nido (ENI) on smaller aircraft"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cebu Pacific" 
                  href="https://www.cebupacificair.com/" 
                  tooltipContent="Cebu Pacific&#10;Flight Numbers: Multiple daily (5J641, 5J643, etc.)&#10;Route: Manila (MNL) to Puerto Princesa (PPS)&#10;Aircraft Type: Airbus A320&#10;Flight Duration: ~1 hour 35 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 3 (Manila)&#10;Budget airline with optional add-ons"
                >
                  Cebu
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="AirAsia" 
                  href="https://www.airasia.com/" 
                  tooltipContent="AirAsia Philippines&#10;Flight Numbers: Multiple daily (Z2521, Z2523, etc.)&#10;Route: Manila (MNL) to Puerto Princesa (PPS)&#10;Aircraft Type: Airbus A320&#10;Flight Duration: ~1 hour 30 minutes&#10;Schedule: Multiple flights daily&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 4 (Manila)&#10;Budget airline with optional add-ons"
                >
                  AirAsia
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
          
          <FlightCard>
            <FlightCardTitle>Manila to Siargao</FlightCardTitle>
            <FlightInfo>
              <FlightRoute>Manila (MNL) → Siargao (IAO)</FlightRoute>
              <FlightDetails>Flight Duration: ~2h 30m</FlightDetails>
              <FlightDetails>Limited direct flights available</FlightDetails>
              <PriceRange>Price Range: PHP 3,000 - 8,000 (USD $60 - $160)</PriceRange>
              <AirlineList>
                Airlines: Philippine Airlines, Cebu Pacific
              </AirlineList>
              <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f5f9ff', borderRadius: '5px', fontSize: '0.9rem' }}>
                <strong>What to expect:</strong> Siargao is the surfing capital of the Philippines, famous for its Cloud 9 surf break 
                that attracts surfers from around the world. Beyond surfing, visitors can enjoy island hopping to Guyam, Daku, and Naked Islands, 
                explore the stunning Sugba Lagoon, or visit the Magpupungko rock pools. With its laid-back atmosphere, palm-lined roads, 
                and pristine beaches, Siargao offers a perfect blend of adventure and relaxation for all types of travelers.
              </div>
              <AirlineLogosContainer>
                <AirlineLogoWithTooltip 
                  name="Philippine Airlines" 
                  href="https://www.philippineairlines.com/" 
                  tooltipContent="Philippine Airlines&#10;Flight Numbers: PR2971/PR2972&#10;Route: Manila (MNL) to Siargao (IAO)&#10;Aircraft Type: Airbus A320 or Bombardier Q400&#10;Flight Duration: ~2 hours 30 minutes&#10;Schedule: Daily flights&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 2 (Manila)&#10;Note: Limited flights due to smaller airport capacity"
                >
                  PAL
                </AirlineLogoWithTooltip>
                <AirlineLogoWithTooltip 
                  name="Cebu Pacific" 
                  href="https://www.cebupacificair.com/" 
                  tooltipContent="Cebu Pacific&#10;Flight Numbers: 5J381/5J382&#10;Route: Manila (MNL) to Siargao (IAO)&#10;Aircraft Type: ATR 72-600&#10;Flight Duration: ~2 hours 40 minutes&#10;Schedule: Daily flights&#10;Direct non-stop service&#10;Terminal: NAIA Terminal 3 (Manila)&#10;Budget airline with optional add-ons&#10;Note: Limited flights due to smaller airport capacity"
                >
                  Cebu
                </AirlineLogoWithTooltip>
              </AirlineLogosContainer>
            </FlightInfo>
          </FlightCard>
        </FlightCardsContainer>
        
        {/* Domestic Travel Tips Section */}
        <div style={{ 
          margin: '50px auto', 
          maxWidth: '800px', 
          padding: '25px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Domestic Travel Tips</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>Book in advance:</strong> Domestic flights in the Philippines can fill up quickly, especially during peak seasons (December-January, Holy Week, summer months of March-May).</li>
            <li><strong>Check baggage allowances:</strong> Budget airlines like Cebu Pacific and AirAsia have strict baggage policies. Consider purchasing baggage allowance in advance to save money.</li>
            <li><strong>Arrive early:</strong> Manila's airport terminals can be busy. Arrive at least 2 hours before domestic flights.</li>
            <li><strong>Terminal awareness:</strong> Manila has four separate terminals that are not connected internally. Verify which terminal your flight departs from.</li>
            <li><strong>Alternative airports:</strong> Some destinations have alternative airports. For example, Boracay can be accessed via Caticlan (closer) or Kalibo (usually cheaper).</li>
            <li><strong>Local transportation:</strong> Research local transportation options at your destination in advance. Many tourist destinations offer airport transfers.</li>
            <li><strong>Weather considerations:</strong> The Philippines has a rainy season (June-November) which can affect flights. The country also experiences typhoons that may cause cancellations.</li>
          </ul>
          <p style={{ marginTop: '20px', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>
            For the most up-to-date flight information, we recommend checking the official airline websites linked above.
          </p>
        </div>
        
        <SkyscannerSection>
          <SkyscannerTitle>Get the Latest Flight Updates</SkyscannerTitle>
          <SkyscannerDescription>
            Flight prices and schedules may change. For the most up-to-date information and to find the best deals,
            we recommend using Skyscanner to compare flights from your location to Manila.
          </SkyscannerDescription>
          <CursorElement cursorType="button">
            <SkyscannerButton href="https://www.skyscanner.com.au/transport/flights/syd/mnl/" target="_blank" rel="noopener noreferrer">
              Search Flights on Skyscanner
            </SkyscannerButton>
          </CursorElement>
        </SkyscannerSection>
        
        <TravelTips>
          <TipTitle>Travel Tips</TipTitle>
          <TipsList>
            <TipItem>Book your flights at least 3-4 months in advance for the best rates.</TipItem>
            <TipItem>Consider travel insurance that covers trip cancellation and medical emergencies.</TipItem>
            <TipItem>Check if you need a visa to enter the Philippines. Many countries have 30-day visa-free entry.</TipItem>
            <TipItem>Manila traffic can be heavy - allow extra time when traveling to/from the airport.</TipItem>
            <TipItem>The best time to visit the Philippines is during the dry season (November to April).</TipItem>
            <TipItem>Bring lightweight, breathable clothing as the Philippines has a tropical climate.</TipItem>
          </TipsList>
        </TravelTips>
        
        {/* Accommodation Section */}
        <AccommodationSection>
          <SectionTitle>Accommodation Options</SectionTitle>
          <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px', color: '#555' }}>
            Find the perfect place to stay during your visit to the Philippines. We recommend using these trusted platforms to book your accommodation.
          </p>
          
          <AccommodationCardsContainer>
            <AccommodationCard>
              <AccommodationLogo logoUrl="/images/logos/airbnb-logo.png" />
              <AccommodationTitle>Airbnb</AccommodationTitle>
              <AccommodationDescription>
                Find unique homes, apartments, and experiences. Airbnb offers a wide range of accommodations from budget-friendly rooms to luxury villas across the Philippines.
              </AccommodationDescription>
              <CursorElement cursorType="button">
                <AccommodationButton 
                  href="https://www.airbnb.com/s/Philippines" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Browse on Airbnb
                </AccommodationButton>
              </CursorElement>
            </AccommodationCard>
            
            <AccommodationCard>
              <AccommodationLogo logoUrl="/images/logos/agoda-logo.png" />
              <AccommodationTitle>Agoda</AccommodationTitle>
              <AccommodationDescription>
                Specializing in Asian accommodations, Agoda often offers competitive rates for hotels, resorts, and hostels throughout the Philippines with excellent local deals.
              </AccommodationDescription>
              <CursorElement cursorType="button">
                <AccommodationButton 
                  href="https://www.agoda.com/country/philippines.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Search on Agoda
                </AccommodationButton>
              </CursorElement>
            </AccommodationCard>
            
            <AccommodationCard>
              <AccommodationLogo logoUrl="/images/logos/booking-logo.png" />
              <AccommodationTitle>Booking.com</AccommodationTitle>
              <AccommodationDescription>
                With a vast selection of hotels, resorts, and apartments, Booking.com offers flexible booking options, free cancellation on many properties, and a loyalty program.
              </AccommodationDescription>
              <CursorElement cursorType="button">
                <AccommodationButton 
                  href="https://www.booking.com/country/ph.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Book on Booking.com
                </AccommodationButton>
              </CursorElement>
            </AccommodationCard>
            
            <AccommodationCard>
              <AccommodationLogo logoUrl="/images/logos/tripadvisor-logo.png" />
              <AccommodationTitle>TripAdvisor</AccommodationTitle>
              <AccommodationDescription>
                Compare prices across multiple booking sites, read authentic traveler reviews, and discover the best-rated accommodations and attractions in the Philippines.
              </AccommodationDescription>
              <CursorElement cursorType="button">
                <AccommodationButton 
                  href="https://www.tripadvisor.com/Tourism-g294245-Philippines-Vacations.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit TripAdvisor
                </AccommodationButton>
              </CursorElement>
            </AccommodationCard>
          </AccommodationCardsContainer>
          
          <div style={{ 
            margin: '50px auto 0', 
            maxWidth: '800px', 
            padding: '25px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Accommodation Tips</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>Book early:</strong> Especially for popular destinations like Boracay, El Nido, and Siargao, accommodations can fill up quickly during peak season.</li>
              <li><strong>Location matters:</strong> In Manila, consider staying in Makati, BGC, or Pasay for convenience and proximity to shopping, dining, and transportation.</li>
              <li><strong>Check reviews:</strong> Always read recent reviews from other travelers before booking your accommodation.</li>
              <li><strong>Consider amenities:</strong> Air conditioning is essential in the Philippines' tropical climate. Also check for WiFi reliability if you need to stay connected.</li>
              <li><strong>Budget options:</strong> Hostels and guesthouses offer affordable alternatives if you're traveling on a budget.</li>
              <li><strong>Luxury resorts:</strong> The Philippines has world-class luxury resorts, particularly in Boracay, Palawan, and Cebu, if you're looking to splurge.</li>
              <li><strong>Local homestays:</strong> For an authentic experience, consider homestays which allow you to connect with local families and experience Filipino hospitality.</li>
            </ul>
          </div>
        </AccommodationSection>
      </ContentSection>
    </PageContainer>
  );
};

export default TravelPage; 