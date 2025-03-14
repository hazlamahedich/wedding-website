import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS, ANIMATION, EASING } from '../constants/theme';
import CursorElement from '../components/CursorElement';
import WeddingAnimations from '../components/WeddingAnimations';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import VenueGallery from '../components/VenueGallery';

// Animation keyframes
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

const shimmerEffect = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
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

// Add pulse animation from HomePage
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

// Add parallax shift animation
const parallaxShift = keyframes`
  0% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-10px) translateX(5px); }
  100% { transform: translateY(0) translateX(0); }
`;

// Styled components
const PageContainer = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  font-family: 'Playfair Display', serif;
  position: relative;
`;

const HeroSection = styled.section`
  height: calc(100vh - var(--nav-height, 70px));
  width: 100%;
  background-image: 
    linear-gradient(to bottom, rgba(13, 71, 161, 0.6), rgba(30, 136, 229, 0.8)),
    url('/images/venue-hero.jpg');
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

const HeroContent = styled.div`
  max-width: 800px;
  z-index: 2;
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

const HeroSubtitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
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

const ShimmerButton = styled.button`
  padding: 15px 40px;
  font-size: 1.2rem;
  font-family: 'Playfair Display', serif;
  background: linear-gradient(90deg, 
    ${COLORS.DARK_RUSTY_BLUE}, 
    ${COLORS.PRIMARY_RUSTY_BLUE}, 
    ${COLORS.LIGHT_RUSTY_BLUE}, 
    ${COLORS.PRIMARY_RUSTY_BLUE}, 
    ${COLORS.DARK_RUSTY_BLUE}
  );
  background-size: 200% 100%;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: ${shimmerEffect} 3s infinite linear;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(30, 136, 229, 0.5);
  }
`;

const Section = styled.section`
  padding: 100px 5%;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 70px 5%;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${COLORS.RUSTY_BLUE_ACCENT};
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const VenueDetailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  margin-top: 50px;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const VenueInfoCard = styled.div`
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const VenueInfoTitle = styled.h3`
  font-size: 1.8rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 20px;
`;

const VenueInfoText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
`;

const VenueInfoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
`;

const VenueInfoItem = styled.li`
  font-size: 1.1rem;
  padding: 10px 0;
  border-bottom: 1px solid ${COLORS.RUSTY_HIGHLIGHT};
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:before {
    content: '✓';
    color: ${COLORS.PRIMARY_RUSTY_BLUE};
    margin-right: 10px;
    font-weight: bold;
  }
`;

const GallerySection = styled.section`
  padding: 100px 5%;
  background-color: #f8f9fa;
  position: relative;
  z-index: 1;
`;

const MapSection = styled.section`
  padding: 100px 5%;
  position: relative;
  z-index: 1;
`;

const MapWrapper = styled.div`
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const DirectionsContainer = styled.div`
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const DirectionsCard = styled.div`
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${COLORS.PRIMARY_RUSTY_BLUE};
  animation: ${floatAnimation} 4s infinite ease-in-out;
`;

const DirectionsTitle = styled.h3`
  font-size: 1.5rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 20px;
`;

const DirectionsList = styled.ol`
  padding-left: 20px;
  margin: 0;
`;

const DirectionsItem = styled.li`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 15px;
  color: #555;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CTASection = styled.section`
  padding: 100px 5%;
  background: linear-gradient(135deg, ${COLORS.DARK_RUSTY_BLUE}, ${COLORS.PRIMARY_RUSTY_BLUE});
  color: white;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 40px;
  line-height: 1.8;
`;

// Add new styled components for parallax effect
const ParallaxSection = styled.section`
  position: relative;
  height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ParallaxBackground = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  transform: translateZ(-1px) scale(2);
  z-index: -1;
`;

const ParallaxContent = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 10px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 30px;
    max-width: 90%;
  }
`;

const ParallaxTitle = styled.h3`
  font-size: 2rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ParallaxText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${COLORS.DARK_RUSTY_BLUE};
`;

// Add new styled components for countdown timer
const CountdownSection = styled.section`
  padding: 80px 5%;
  background-color: ${COLORS.RUSTY_HIGHLIGHT};
  text-align: center;
  position: relative;
  z-index: 1;
`;

const CountdownTitle = styled.h2`
  font-size: 2.5rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CountdownNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  background-color: white;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    width: 80px;
    height: 80px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    width: 70px;
    height: 70px;
  }
`;

const CountdownLabel = styled.div`
  font-size: 1.2rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Add new styled components for weather forecast
const WeatherSection = styled.section`
  padding: 80px 5%;
  background-color: #f8f9fa;
  position: relative;
  z-index: 1;
`;

const WeatherContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
  
  @media (max-width: 992px) {
    gap: 20px;
  }
`;

const WeatherCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 250px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 220px;
    padding: 25px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const WeatherMonth = styled.h3`
  font-size: 1.5rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 20px;
`;

const WeatherIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${COLORS.DARK_RUSTY_BLUE};
`;

const WeatherTemp = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${COLORS.DARK_RUSTY_BLUE};
  margin-bottom: 10px;
`;

const WeatherDesc = styled.div`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 20px;
`;

const WeatherNote = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  max-width: 800px;
  margin: 40px auto 0;
  text-align: center;
  font-style: italic;
`;

// Add new styled components for FAQ section
const FAQSection = styled.section`
  padding: 100px 5%;
  position: relative;
  z-index: 1;
`;

const FAQContainer = styled.div`
  max-width: 900px;
  margin: 50px auto 0;
`;

const FAQItem = styled.div`
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
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
  
  &:hover {
    background-color: ${props => props.isOpen ? COLORS.PRIMARY_RUSTY_BLUE : COLORS.RUSTY_HIGHLIGHT};
  }
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  background-color: white;
  padding: ${props => props.isOpen ? '20px 30px' : '0 30px'};
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s;
`;

const FAQIcon = styled.span<{ isOpen: boolean }>`
  transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0)'};
  transition: transform 0.3s;
  font-size: 1.5rem;
  font-weight: 300;
`;

// Add FloatingElement component from HomePage
const FloatingElement = styled.div<{ top: string; left: string; delay: string; size: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ${floatAnimation} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay};
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 0;
  will-change: transform;
`;

// Add ScrollIndicator from HomePage
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
  margin-top: -10px;
  animation: ${pulse} 2s infinite;
  
  &.arrow:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &.arrow:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

// Add CulturalAccent from HomePage
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

const VenuePage: React.FC = () => {
  // Add countdown timer state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Weather data for Tagaytay (example data)
  const weatherData = [
    {
      month: 'November',
      icon: '☀️',
      temp: '23°C',
      description: 'Mostly sunny with occasional clouds'
    },
    {
      month: 'December',
      icon: '🌤️',
      temp: '22°C',
      description: 'Partly cloudy with cool breeze'
    },
    {
      month: 'January',
      icon: '🌥️',
      temp: '21°C',
      description: 'Cool and pleasant with light winds'
    },
    {
      month: 'February',
      icon: '☀️',
      temp: '22°C',
      description: 'Sunny with occasional clouds'
    }
  ];
  
  // FAQ state
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // FAQ data
  const faqData = [
    {
      question: 'What time does the ceremony start?',
      answer: 'The ceremony will begin promptly at 3:00 PM. We recommend arriving at least 30 minutes early to find parking and be seated comfortably before the ceremony begins.'
    },
    {
      question: 'Is there parking available at the venue?',
      answer: 'Yes, Alta d\' Tagaytay has ample parking space for all guests. Valet parking will also be available for those who prefer this service.'
    },
    {
      question: 'What is the dress code for the wedding?',
      answer: 'The dress code is formal attire. Men are encouraged to wear suits or barongs, and women may wear formal dresses or traditional Filipino attire. The weather in Tagaytay can be cool, especially in the evening, so consider bringing a light jacket or wrap.'
    },
    {
      question: 'Are children welcome at the wedding?',
      answer: 'Yes, children are welcome to attend. We will have a designated kids\' area with activities and supervision during the reception.'
    },
    {
      question: 'Will there be accommodation available near the venue?',
      answer: 'Yes, there are several hotels and resorts near Alta d\' Tagaytay. We have arranged special rates at selected hotels for our wedding guests. Please see the Travel page for more details and booking information.'
    },
    {
      question: 'Is the venue wheelchair accessible?',
      answer: 'Yes, Alta d\' Tagaytay is wheelchair accessible. Please let us know in advance if you require any special accommodations, and we will be happy to assist.'
    }
  ];
  
  // Add useEffect for parallax scrolling
  useEffect(() => {
    const handleScroll = () => {
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      parallaxElements.forEach((element) => {
        const scrollPosition = window.pageYOffset;
        const elementTop = element.getBoundingClientRect().top + scrollPosition;
        const distance = scrollPosition - elementTop;
        const speed = 0.5; // Adjust for faster/slower parallax effect
        
        if (element instanceof HTMLElement) {
          element.style.transform = `translateY(${distance * speed}px)`;
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Add useEffect for countdown timer
  useEffect(() => {
    const weddingDate = new Date('January 7, 2026 00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Toggle FAQ
  const toggleFAQ = (index: number) => {
    if (openFAQ === index) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(index);
    }
  };
  
  const scrollToMap = () => {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Fix for Leaflet marker icons
  useEffect(() => {
    // Fix Leaflet icon issues
    const defaultIcon = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);
  
  // Add mouse position state for parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for parallax effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10
    });
  }, []);
  
  // Generate floating elements for the hero section
  const floatingElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      elements.push(
        <FloatingElement 
          key={i}
          top={`${10 + Math.random() * 80}%`}
          left={`${Math.random() * 90}%`}
          delay={`${Math.random() * 5}s`}
          size={`${30 + Math.random() * 50}px`}
        />
      );
    }
    return elements;
  }, []);
  
  return (
    <PageContainer>
      <WeddingAnimations enabled={true} />
      
      <HeroSection onMouseMove={handleMouseMove}>
        {floatingElements}
        
        <HeroContent style={{ 
          transform: `translateZ(10px) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` 
        }}>
          <HeroTitle style={{ 
            transform: `translateZ(20px) translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px)` 
          }}>
            Alta d' Tagaytay
          </HeroTitle>
          <HeroSubtitle style={{ 
            transform: `translateZ(15px) translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)` 
          }}>
            Where Our Forever Begins
          </HeroSubtitle>
          <CursorElement cursorType="button" cursorText="Explore" cursorTheme="rustyBlue">
            <ShimmerButton onClick={scrollToMap} style={{ 
              transform: `translateZ(30px) translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` 
            }}>
              Get Directions
            </ShimmerButton>
          </CursorElement>
        </HeroContent>
        
        <ScrollIndicator onClick={scrollToMap}>
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
      </HeroSection>
      
      <CountdownSection>
        <CountdownTitle>Counting Down to Our Special Day</CountdownTitle>
        <CountdownContainer>
          <CountdownItem>
            <CountdownNumber>{countdown.days}</CountdownNumber>
            <CountdownLabel>Days</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{countdown.hours}</CountdownNumber>
            <CountdownLabel>Hours</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{countdown.minutes}</CountdownNumber>
            <CountdownLabel>Minutes</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{countdown.seconds}</CountdownNumber>
            <CountdownLabel>Seconds</CountdownLabel>
          </CountdownItem>
        </CountdownContainer>
        <CursorElement cursorType="button" cursorText="Save" cursorTheme="rustyBlue">
          <ShimmerButton>
            Add to Calendar
          </ShimmerButton>
        </CursorElement>
      </CountdownSection>
      
      <Section>
        <SectionTitle>Venue Details</SectionTitle>
        <VenueDetailsContainer>
          <VenueInfoCard>
            <VenueInfoTitle>The Perfect Setting</VenueInfoTitle>
            <VenueInfoText>
              Alta d' Tagaytay offers a breathtaking panoramic view of Taal Lake and Volcano, 
              creating the perfect backdrop for our special day. The venue combines rustic charm 
              with elegant sophistication, reflecting our love story perfectly.
            </VenueInfoText>
            <VenueInfoText>
              Join us on January 7, 2026 as we exchange vows surrounded by the natural beauty 
              of Tagaytay and the warmth of our loved ones.
            </VenueInfoText>
          </VenueInfoCard>
          
          <VenueInfoCard>
            <VenueInfoTitle>Amenities & Features</VenueInfoTitle>
            <VenueInfoList>
              <VenueInfoItem>Panoramic view of Taal Lake and Volcano</VenueInfoItem>
              <VenueInfoItem>Spacious indoor and outdoor ceremony areas</VenueInfoItem>
              <VenueInfoItem>Elegant reception hall with modern facilities</VenueInfoItem>
              <VenueInfoItem>Gourmet catering with customized menu options</VenueInfoItem>
              <VenueInfoItem>Dedicated bridal suite and groom's quarters</VenueInfoItem>
              <VenueInfoItem>Ample parking for all guests</VenueInfoItem>
              <VenueInfoItem>Professional event coordination team</VenueInfoItem>
            </VenueInfoList>
          </VenueInfoCard>
        </VenueDetailsContainer>
      </Section>
      
      <ParallaxSection>
        <ParallaxBackground className="parallax-bg" imageUrl="/images/venue-parallax-1.jpg" />
        <ParallaxContent>
          <ParallaxTitle>A Day to Remember</ParallaxTitle>
          <ParallaxText>
            Alta d' Tagaytay provides the perfect blend of natural beauty and elegant 
            sophistication for our wedding celebration. The cool Tagaytay breeze and 
            stunning views create an atmosphere of romance and serenity.
          </ParallaxText>
        </ParallaxContent>
      </ParallaxSection>
      
      <GallerySection>
        <VenueGallery />
      </GallerySection>
      
      <ParallaxSection>
        <ParallaxBackground className="parallax-bg" imageUrl="/images/venue-parallax-2.jpg" />
        <ParallaxContent>
          <ParallaxTitle>Celebrate With Us</ParallaxTitle>
          <ParallaxText>
            We've chosen this beautiful venue to share our special day with our closest 
            friends and family. Join us for a celebration filled with love, laughter, 
            and unforgettable memories.
          </ParallaxText>
        </ParallaxContent>
      </ParallaxSection>
      
      <WeatherSection>
        <SectionTitle>Weather Forecast</SectionTitle>
        <WeatherContainer>
          {weatherData.map((weather, index) => (
            <WeatherCard key={index}>
              <WeatherMonth>{weather.month}</WeatherMonth>
              <WeatherIcon>{weather.icon}</WeatherIcon>
              <WeatherTemp>{weather.temp}</WeatherTemp>
              <WeatherDesc>{weather.description}</WeatherDesc>
            </WeatherCard>
          ))}
        </WeatherContainer>
        <WeatherNote>
          Tagaytay enjoys a cooler climate compared to Manila due to its higher elevation. 
          January typically offers pleasant weather with temperatures ranging from 18°C to 25°C. 
          We recommend bringing a light jacket or wrap for the evening.
        </WeatherNote>
      </WeatherSection>
      
      <MapSection id="map-section">
        <SectionTitle>Getting There</SectionTitle>
        <MapWrapper>
          <MapContainer
            center={[14.1152, 120.9626]} // Alta d'Tagaytay coordinates
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[14.1152, 120.9626]}>
              <Popup>
                Alta d' Tagaytay <br /> Wedding Venue
              </Popup>
            </Marker>
          </MapContainer>
        </MapWrapper>
        
        <DirectionsContainer>
          <DirectionsCard>
            <DirectionsTitle>Driving Directions from Manila</DirectionsTitle>
            <DirectionsList>
              <DirectionsItem>
                Take the South Luzon Expressway (SLEX) heading south from Manila.
              </DirectionsItem>
              <DirectionsItem>
                Take the Sta. Rosa Exit (most popular and easiest route).
              </DirectionsItem>
              <DirectionsItem>
                Follow the Sta. Rosa-Tagaytay Road all the way to Tagaytay.
              </DirectionsItem>
              <DirectionsItem>
                Once in Tagaytay, continue to Tagaytay-Nasugbu Highway.
              </DirectionsItem>
              <DirectionsItem>
                Look for the Alta d' Tagaytay signage on your right.
              </DirectionsItem>
              <DirectionsItem>
                Turn right into the property and follow the driveway to the main entrance.
              </DirectionsItem>
            </DirectionsList>
          </DirectionsCard>
          
          <DirectionsCard>
            <DirectionsTitle>Travel Information</DirectionsTitle>
            <VenueInfoList>
              <VenueInfoItem>Approximately 1.5-2 hours from Manila (depending on traffic)</VenueInfoItem>
              <VenueInfoItem>Alternative route: via SLEX Eton Exit to avoid weekend traffic</VenueInfoItem>
              <VenueInfoItem>Public transportation available: buses from Manila to Tagaytay</VenueInfoItem>
              <VenueInfoItem>Shuttle service available from major hotels in Tagaytay</VenueInfoItem>
              <VenueInfoItem>Ample parking available at the venue</VenueInfoItem>
              <VenueInfoItem>Nearby accommodations available for out-of-town guests</VenueInfoItem>
            </VenueInfoList>
          </DirectionsCard>
        </DirectionsContainer>
      </MapSection>
      
      <FAQSection>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <FAQContainer>
          {faqData.map((faq, index) => (
            <FAQItem key={index}>
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
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQContainer>
      </FAQSection>
      
      <CTASection>
        <CTATitle>Join Us On Our Special Day</CTATitle>
        <CTAText>
          We're excited to celebrate our love with you at this beautiful venue. 
          Please RSVP by November 7, 2025 to help us plan for this momentous occasion.
        </CTAText>
        <CursorElement cursorType="button" cursorText="RSVP" cursorTheme="rustyBlue">
          <ShimmerButton>
            RSVP Now
          </ShimmerButton>
        </CursorElement>
      </CTASection>
    </PageContainer>
  );
};

export default VenuePage; 