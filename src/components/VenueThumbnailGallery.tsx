import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { COLORS } from '../constants/theme';
import CursorElement from './CursorElement';

// Styled components
const GalleryContainer = styled.div`
  margin-top: 30px;
  width: 100%;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ThumbnailItem = styled(motion.div)<{ isActive: boolean }>`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${props => props.isActive ? COLORS.PRIMARY_RUSTY_BLUE : 'transparent'};
  transition: border-color 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ThumbnailItem}:hover & {
    transform: scale(1.1);
  }
`;

const ThumbnailOverlay = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.isActive 
    ? 'rgba(93, 123, 147, 0.2)' 
    : 'rgba(0, 0, 0, 0.3)'};
  transition: background-color 0.3s ease;
  
  ${ThumbnailItem}:hover & {
    background-color: rgba(93, 123, 147, 0.2);
  }
`;

const GalleryTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 20px;
  text-align: center;
`;

// Carousel data (same as in VenueCarousel)
const carouselData = [
  {
    id: 1,
    image: '/images/venue-1.jpg',
    title: 'Breathtaking Ceremony Space',
  },
  {
    id: 2,
    image: '/images/venue-2.jpg',
    title: 'Elegant Reception Hall',
  },
  {
    id: 3,
    image: '/images/venue-3.jpg',
    title: 'Lush Garden Setting',
  },
  {
    id: 4,
    image: '/images/venue-4.jpg',
    title: 'Sunset Terrace',
  },
  {
    id: 5,
    image: '/images/venue-5.jpg',
    title: 'Romantic Evening Ambiance',
  },
  {
    id: 6,
    image: '/images/venue-6.jpg',
    title: 'Luxurious Accommodations',
  }
];

interface VenueThumbnailGalleryProps {
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
}

const VenueThumbnailGallery: React.FC<VenueThumbnailGalleryProps> = ({ 
  activeIndex, 
  onThumbnailClick 
}) => {
  return (
    <GalleryContainer>
      <GalleryTitle>Explore Our Venue</GalleryTitle>
      <GalleryGrid>
        {carouselData.map((item, index) => (
          <CursorElement 
            key={item.id}
            cursorType="gallery" 
            cursorText="Select" 
            cursorTheme="rustyBlue"
          >
            <ThumbnailItem 
              isActive={index === activeIndex}
              onClick={() => onThumbnailClick(index)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ThumbnailImage 
                src={item.image} 
                alt={item.title} 
              />
              <ThumbnailOverlay isActive={index === activeIndex} />
            </ThumbnailItem>
          </CursorElement>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
};

export default VenueThumbnailGallery; 