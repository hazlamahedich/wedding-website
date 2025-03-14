import React, { useState } from 'react';
import styled from 'styled-components';
import CursorElement from '../components/CursorElement';
import { COLORS } from '../constants/theme';

const PageContainer = styled.div`
  padding: 120px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: ${COLORS.WEATHERED_BLUE};
  text-align: center;
  margin-bottom: 4rem;
  font-weight: 400;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

interface TabButtonProps {
  isActive: boolean;
  theme: 'rustyBlue' | 'filipino' | 'australian';
}

const TabButton = styled.button<TabButtonProps>`
  font-family: 'Playfair Display', serif;
  background-color: ${props => props.isActive ? 
    props.theme === 'filipino' ? COLORS.FILIPINO_BLUE :
    props.theme === 'australian' ? COLORS.AUSTRALIAN_BLUE :
    COLORS.PRIMARY_RUSTY_BLUE
    : 'white'};
  color: ${props => props.isActive ? 'white' : COLORS.WEATHERED_BLUE};
  border: 1px solid ${props => 
    props.theme === 'filipino' ? COLORS.FILIPINO_BLUE :
    props.theme === 'australian' ? COLORS.AUSTRALIAN_BLUE :
    COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 30px;
  padding: 10px 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? '' :
      props.theme === 'filipino' ? `${COLORS.FILIPINO_BLUE}10` :
      props.theme === 'australian' ? `${COLORS.AUSTRALIAN_BLUE}10` :
      `${COLORS.PRIMARY_RUSTY_BLUE}10`};
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
`;

interface PhotoItemProps {
  isPortrait: boolean;
}

const PhotoItem = styled.div<PhotoItemProps>`
  position: relative;
  height: ${props => props.isPortrait ? '400px' : '300px'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    height: ${props => props.isPortrait ? '250px' : '200px'};
  }
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 40px;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
`;

const ModalCaption = styled.div`
  color: white;
  margin-top: 15px;
  font-family: 'Playfair Display', serif;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 15px;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
`;

// Photo gallery data
const galleries = {
  all: [
    { id: 1, src: '/images/gallery/all1.jpg', caption: 'First vacation together in Bali', isPortrait: false, theme: 'rustyBlue' },
    { id: 2, src: '/images/gallery/all2.jpg', caption: 'Hiking in the Australian outback', isPortrait: true, theme: 'australian' },
    { id: 3, src: '/images/gallery/all3.jpg', caption: 'Filipino family gathering', isPortrait: false, theme: 'filipino' },
    { id: 5, src: '/images/gallery/all5.jpg', caption: 'Cultural celebration in Manila', isPortrait: false, theme: 'filipino' },
    { id: 6, src: '/images/gallery/all6.jpg', caption: 'Weekend getaway in Sydney', isPortrait: false, theme: 'australian' },
    { id: 8, src: '/images/gallery/all8.jpg', caption: 'Beach day in Gold Coast', isPortrait: false, theme: 'australian' },
    { id: 10, src: '/images/gallery/all10.jpg', caption: 'Traditional Filipino celebration', isPortrait: true, theme: 'filipino' },
    { id: 11, src: '/images/gallery/all11.jpg', caption: 'Road trip across Australia', isPortrait: false, theme: 'australian' },
    { id: 12, src: '/images/gallery/all12.jpg', caption: 'The proposal in Palawan', isPortrait: true, theme: 'filipino' },
  ],
  philippines: [
    { id: 1, src: '/images/gallery/ph1.jpg', caption: 'Exploring Palawan together', isPortrait: false, theme: 'filipino' },
    { id: 2, src: '/images/gallery/ph2.jpg', caption: 'Meeting Elaine\'s family in Manila', isPortrait: true, theme: 'filipino' },
    { id: 3, src: '/images/gallery/ph3.jpg', caption: 'Celebrating Filipino festivals', isPortrait: false, theme: 'filipino' },
    { id: 4, src: '/images/gallery/ph4.jpg', caption: 'Beach day in Boracay', isPortrait: true, theme: 'filipino' },
    { id: 5, src: '/images/gallery/ph5.jpg', caption: 'Proposal at the beach', isPortrait: false, theme: 'filipino' },
    { id: 6, src: '/images/gallery/ph6.jpg', caption: 'Learning to cook Filipino dishes', isPortrait: false, theme: 'filipino' },
  ],
  australia: [
    { id: 1, src: '/images/gallery/au1.jpg', caption: 'Our home in Sydney', isPortrait: false, theme: 'australian' },
    { id: 2, src: '/images/gallery/au2.jpg', caption: 'Exploring the outback', isPortrait: true, theme: 'australian' },
    { id: 3, src: '/images/gallery/au3.jpg', caption: 'Surfing lessons at Bondi Beach', isPortrait: false, theme: 'australian' },
    { id: 4, src: '/images/gallery/au4.jpg', caption: 'Road trip along Great Ocean Road', isPortrait: false, theme: 'australian' },
    { id: 5, src: '/images/gallery/au5.jpg', caption: 'Visiting the Sydney Opera House', isPortrait: true, theme: 'australian' },
    { id: 6, src: '/images/gallery/au6.jpg', caption: 'Hiking in the Blue Mountains', isPortrait: false, theme: 'australian' },
  ],
};

type GalleryTab = 'all' | 'philippines' | 'australia';

const GalleryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GalleryTab>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  
  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
  };
  
  const openPhotoModal = (photoId: number) => {
    setSelectedPhoto(photoId);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };
  
  const closePhotoModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };
  
  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (selectedPhoto === null) return;
    
    const photos = galleries[activeTab];
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto);
    
    if (direction === 'prev') {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
      setSelectedPhoto(photos[prevIndex].id);
    } else {
      const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
      setSelectedPhoto(photos[nextIndex].id);
    }
  };
  
  const selectedPhotoData = selectedPhoto !== null 
    ? galleries[activeTab].find(photo => photo.id === selectedPhoto) 
    : null;
  
  return (
    <PageContainer>
      <SectionTitle>Our Gallery</SectionTitle>
      <Subtitle>Memories across two continents</Subtitle>
      
      <TabsContainer>
        <CursorElement
          cursorType="button"
          cursorText="All Photos"
          cursorTheme="rustyBlue"
        >
          <TabButton 
            isActive={activeTab === 'all'} 
            theme="rustyBlue"
            onClick={() => handleTabChange('all')}
          >
            All Photos
          </TabButton>
        </CursorElement>
        
        <CursorElement
          cursorType="button"
          cursorText="Philippines"
          cursorTheme="filipino"
        >
          <TabButton 
            isActive={activeTab === 'philippines'} 
            theme="filipino"
            onClick={() => handleTabChange('philippines')}
          >
            Philippines
          </TabButton>
        </CursorElement>
        
        <CursorElement
          cursorType="button"
          cursorText="Australia"
          cursorTheme="australian"
        >
          <TabButton 
            isActive={activeTab === 'australia'} 
            theme="australian"
            onClick={() => handleTabChange('australia')}
          >
            Australia
          </TabButton>
        </CursorElement>
      </TabsContainer>
      
      <PhotoGrid>
        {galleries[activeTab].map((photo) => (
          <CursorElement
            key={photo.id}
            cursorType="gallery"
            cursorText="View Photo"
            cursorTheme={photo.theme as any}
            cursorTexture={
              photo.theme === 'filipino' ? 'patina' : 
              photo.theme === 'australian' ? 'vintage' : 'smooth'
            }
          >
            <PhotoItem 
              isPortrait={photo.isPortrait}
              onClick={() => openPhotoModal(photo.id)}
            >
              <Photo src={photo.src} alt={photo.caption} />
            </PhotoItem>
          </CursorElement>
        ))}
      </PhotoGrid>
      
      {selectedPhotoData && (
        <ModalOverlay onClick={closePhotoModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closePhotoModal}>×</CloseButton>
            <ModalImage src={selectedPhotoData.src} alt={selectedPhotoData.caption} />
            <ModalCaption>{selectedPhotoData.caption}</ModalCaption>
            
            <NavButton className="prev" onClick={() => navigatePhoto('prev')}>
              &#10094;
            </NavButton>
            <NavButton className="next" onClick={() => navigatePhoto('next')}>
              &#10095;
            </NavButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default GalleryPage; 