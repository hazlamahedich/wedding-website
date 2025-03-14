import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../constants/theme';
import CursorElement from './CursorElement';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled components
const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  
  @media (max-width: 768px) {
    height: 350px;
  }
`;

const CarouselTrack = styled(motion.div)`
  display: flex;
  height: 100%;
  width: 100%;
`;

const CarouselSlide = styled(motion.div)<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.isActive ? 1 : 0};
  pointer-events: ${props => props.isActive ? 'auto' : 'none'};
  transition: opacity 0.5s ease;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const CarouselOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${CarouselSlide}:hover & {
    opacity: 1;
  }
`;

const CarouselCaption = styled.div`
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  animation: ${slideIn} 0.5s ease forwards;
  max-width: 80%;
`;

const CarouselTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CarouselDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const NavigationButton = styled(motion.button)<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'prev' ? 'left: 20px;' : 'right: 20px;'}
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: white;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const NavigationIcon = styled.span<{ direction: 'prev' | 'next' }>`
  border: solid ${COLORS.PRIMARY_RUSTY_BLUE};
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 5px;
  transform: ${props => props.direction === 'prev' ? 'rotate(135deg)' : 'rotate(-45deg)'};
  
  @media (max-width: 768px) {
    padding: 4px;
  }
`;

const IndicatorsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
`;

const Indicator = styled.button<{ isActive: boolean }>`
  width: ${props => props.isActive ? '30px' : '10px'};
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.isActive ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: white;
  }
`;

const ExpandButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${COLORS.PRIMARY_RUSTY_BLUE};
  }
`;

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullscreenImage = styled(motion.img)`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
`;

// Carousel data
const carouselData = [
  {
    id: 1,
    image: '/images/venue-1.jpg',
    title: 'Breathtaking Ceremony Space',
    description: 'Exchange vows with the stunning Taal Lake and Volcano as your backdrop.'
  },
  {
    id: 2,
    image: '/images/venue-2.jpg',
    title: 'Elegant Reception Hall',
    description: 'Celebrate with loved ones in our spacious and beautifully decorated reception area.'
  },
  {
    id: 3,
    image: '/images/venue-3.jpg',
    title: 'Lush Garden Setting',
    description: 'Surrounded by meticulously maintained gardens and natural beauty.'
  },
  {
    id: 4,
    image: '/images/venue-4.jpg',
    title: 'Sunset Terrace',
    description: 'Perfect for cocktail hour with panoramic views of the sunset over Taal.'
  },
  {
    id: 5,
    image: '/images/venue-5.jpg',
    title: 'Romantic Evening Ambiance',
    description: 'As night falls, the venue transforms with enchanting lighting and atmosphere.'
  },
  {
    id: 6,
    image: '/images/venue-6.jpg',
    title: 'Luxurious Accommodations',
    description: 'Comfortable and elegant rooms for the wedding party and out-of-town guests.'
  }
];

interface VenueCarouselProps {
  autoplay?: boolean;
  interval?: number;
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
}

const VenueCarousel: React.FC<VenueCarouselProps> = ({ 
  autoplay = true, 
  interval = 5000,
  activeIndex: controlledIndex,
  onSlideChange
}) => {
  const [activeIndex, setActiveIndex] = useState(controlledIndex || 0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with controlled index if provided
  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex !== activeIndex) {
      setActiveIndex(controlledIndex);
    }
  }, [controlledIndex]);

  // Handle autoplay
  useEffect(() => {
    if (autoplay && !isPaused) {
      autoplayRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % carouselData.length;
        setActiveIndex(nextIndex);
        if (onSlideChange) {
          onSlideChange(nextIndex);
        }
      }, interval);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, interval, isPaused, activeIndex, onSlideChange]);

  // Navigate to previous slide
  const prevSlide = () => {
    const prevIndex = activeIndex === 0 ? carouselData.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
    if (onSlideChange) {
      onSlideChange(prevIndex);
    }
  };

  // Navigate to next slide
  const nextSlide = () => {
    const nextIndex = (activeIndex + 1) % carouselData.length;
    setActiveIndex(nextIndex);
    if (onSlideChange) {
      onSlideChange(nextIndex);
    }
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    setActiveIndex(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  // Open fullscreen view
  const openFullscreen = (imageUrl: string) => {
    setFullscreenImage(imageUrl);
    setIsFullscreen(true);
    setIsPaused(true);
  };

  // Close fullscreen view
  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsPaused(false);
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  // Resume autoplay on mouse leave
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <>
      <CarouselContainer 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselTrack>
          <AnimatePresence>
            {carouselData.map((slide, index) => (
              <CarouselSlide 
                key={slide.id}
                isActive={index === activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === activeIndex ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CarouselImage 
                  src={slide.image} 
                  alt={slide.title} 
                />
                <CarouselOverlay>
                  <CarouselCaption>
                    <CarouselTitle>{slide.title}</CarouselTitle>
                    <CarouselDescription>{slide.description}</CarouselDescription>
                  </CarouselCaption>
                </CarouselOverlay>
                <CursorElement 
                  cursorType="gallery" 
                  cursorText="Expand" 
                  cursorTheme="rustyBlue"
                >
                  <ExpandButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openFullscreen(slide.image)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M21 9h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>
                      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"></path>
                    </svg>
                  </ExpandButton>
                </CursorElement>
              </CarouselSlide>
            ))}
          </AnimatePresence>
        </CarouselTrack>

        <CursorElement 
          cursorType="button" 
          cursorText="Previous" 
          cursorTheme="rustyBlue"
        >
          <NavigationButton 
            direction="prev" 
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <NavigationIcon direction="prev" />
          </NavigationButton>
        </CursorElement>

        <CursorElement 
          cursorType="button" 
          cursorText="Next" 
          cursorTheme="rustyBlue"
        >
          <NavigationButton 
            direction="next" 
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <NavigationIcon direction="next" />
          </NavigationButton>
        </CursorElement>

        <IndicatorsContainer>
          {carouselData.map((_, index) => (
            <Indicator
              key={index}
              isActive={index === activeIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </IndicatorsContainer>
      </CarouselContainer>

      <AnimatePresence>
        {isFullscreen && (
          <FullscreenOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloseButton 
              onClick={closeFullscreen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </CloseButton>
            <FullscreenImage 
              src={fullscreenImage} 
              alt="Fullscreen view"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </FullscreenOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default VenueCarousel; 