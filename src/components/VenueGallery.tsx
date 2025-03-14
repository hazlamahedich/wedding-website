import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import VenueCarousel from './VenueCarousel';
import VenueThumbnailGallery from './VenueThumbnailGallery';
import { COLORS } from '../constants/theme';

const GalleryContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const GalleryTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 15px;
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

const GalleryDescription = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: ${COLORS.WEATHERED_BLUE};
  max-width: 800px;
  margin: 30px auto 0;
  line-height: 1.8;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 20px;
  }
`;

const GalleryContent = styled.div`
  margin-top: 50px;
`;

const VenueGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };
  
  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <GalleryContainer>
      <GalleryHeader>
        <GalleryTitle>Venue Gallery</GalleryTitle>
        <GalleryDescription>
          Explore the breathtaking beauty of Alta d' Tagaytay through our gallery. 
          From the stunning ceremony space overlooking Taal Lake to the elegant reception hall, 
          our venue offers the perfect setting for your special day.
        </GalleryDescription>
      </GalleryHeader>
      
      <GalleryContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <VenueCarousel 
            autoplay={true} 
            interval={5000}
            activeIndex={activeIndex}
            onSlideChange={handleSlideChange}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <VenueThumbnailGallery 
            activeIndex={activeIndex}
            onThumbnailClick={handleThumbnailClick}
          />
        </motion.div>
      </GalleryContent>
    </GalleryContainer>
  );
};

export default VenueGallery; 