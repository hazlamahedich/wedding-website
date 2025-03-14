import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { COLORS, EASING } from '../../constants/theme';
import CursorElement from '../../components/CursorElement';

// Import styled components from parent file
const TimelineSection = styled.section`
  background-color: ${COLORS.RUSTY_HIGHLIGHT};
  padding: 80px 20px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  text-align: center;
  margin-bottom: 50px;
  font-family: 'Playfair Display', serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 30px;
  }
`;

const TimelineContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding: 20px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-50%);
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineProgress = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  background-color: white;
  transform: translateX(-50%);
  transition: height 0.5s ${EASING.HOVER_TRANSITION};
  z-index: 1;
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const TimelineButton = styled.button`
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Define the props interface for the TimelineSection component
interface TimelineSectionProps {
  timelineData: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  activeTimelineIndex: number;
  timelineProgress: number;
  handleTimelineDotClick: (index: number) => void;
  goToPrevTimelineItem: () => void;
  goToNextTimelineItem: () => void;
  isTimelineAutoPlaying: boolean;
  startTimelineAutoPlay: () => void;
  stopTimelineAutoPlay: () => void;
}

// Define the TimelineItem component
const TimelineItem = styled.div<{ isLeft: boolean; isActive: boolean }>`
  position: relative;
  margin-bottom: 50px;
  width: 50%;
  padding: 0 40px;
  box-sizing: border-box;
  left: ${props => props.isLeft ? '0' : '50%'};
  opacity: ${props => props.isActive ? 1 : 0.7};
  transform: scale(${props => props.isActive ? 1.05 : 1});
  transition: all 0.5s ${EASING.HOVER_TRANSITION};
  
  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    padding-left: 60px;
    padding-right: 20px;
  }
`;

const TimelineDot = styled.div<{ isActive: boolean }>`
  position: absolute;
  width: ${props => props.isActive ? '20px' : '16px'};
  height: ${props => props.isActive ? '20px' : '16px'};
  background-color: ${props => props.isActive ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 50%;
  top: 15px;
  left: ${props => props.isActive ? 'calc(50% - 10px)' : 'calc(50% - 8px)'};
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.isActive ? '0 0 15px rgba(255, 255, 255, 0.8)' : 'none'};
  
  &:hover {
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    left: ${props => props.isActive ? '20px' : '22px'};
  }
`;

const TimelineContent = styled.div<{ isLeft: boolean; isActive: boolean }>`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    width: 0;
    height: 0;
    border-style: solid;
    
    ${props => props.isLeft 
      ? `right: -10px; border-width: 10px 0 10px 10px; border-color: transparent transparent transparent white;` 
      : `left: -10px; border-width: 10px 10px 10px 0; border-color: transparent white transparent transparent;`}
  }
  
  @media (max-width: 768px) {
    &::before {
      left: -10px;
      border-width: 10px 10px 10px 0;
      border-color: transparent white transparent transparent;
    }
  }
`;

const TimelineTime = styled.div<{ isActive: boolean }>`
  font-size: 1.1rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
`;

const TimelineIcon = styled.div<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: ${props => props.isActive ? 'rotate 2s infinite linear' : 'none'};
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const TimelineTitle = styled.h3<{ isActive: boolean }>`
  font-size: 1.3rem;
  margin: 0 0 10px;
  color: ${props => props.isActive ? COLORS.PRIMARY_RUSTY_BLUE : '#333'};
  transition: color 0.3s ease;
`;

const TimelineDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

// Create the MemoizedTimelineItem component
const MemoizedTimelineItem = React.memo(({ 
  item, 
  index, 
  isLeft, 
  isActive, 
  handleTimelineDotClick 
}: { 
  item: { time: string; title: string; description: string }; 
  index: number; 
  isLeft: boolean; 
  isActive: boolean; 
  handleTimelineDotClick: (index: number) => void; 
}) => (
  <TimelineItem isLeft={isLeft} isActive={isActive}>
    <CursorElement cursorType="button" cursorText={`Go to ${item.title}`} cursorTheme="rustyBlue">
      <TimelineDot 
        isActive={isActive} 
        onClick={() => handleTimelineDotClick(index)} 
      />
    </CursorElement>
    
    <TimelineContent isLeft={isLeft} isActive={isActive}>
      <TimelineTime isActive={isActive}>
        <TimelineIcon isActive={isActive}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill={COLORS.PRIMARY_RUSTY_BLUE} />
          </svg>
        </TimelineIcon>
        {item.time}
      </TimelineTime>
      <TimelineTitle isActive={isActive}>{item.title}</TimelineTitle>
      <TimelineDescription>{item.description}</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
));

// Create the TimelineSection component with forwardRef
const TimelineSectionComponent = forwardRef<HTMLElement, TimelineSectionProps>(({
  timelineData,
  activeTimelineIndex,
  timelineProgress,
  handleTimelineDotClick,
  goToPrevTimelineItem,
  goToNextTimelineItem,
  isTimelineAutoPlaying,
  startTimelineAutoPlay,
  stopTimelineAutoPlay
}, ref) => {
  return (
    <TimelineSection ref={ref}>
      <SectionTitle>Wedding Day Timeline</SectionTitle>
      <TimelineContainer>
        <TimelineProgress 
          className="timeline-progress" 
          style={{ height: `${timelineProgress}%` }} 
        />
        
        {timelineData.map((item, index) => (
          <MemoizedTimelineItem
            key={index}
            item={item}
            index={index}
            isLeft={index % 2 === 0}
            isActive={activeTimelineIndex === index}
            handleTimelineDotClick={handleTimelineDotClick}
          />
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
  );
});

export default TimelineSectionComponent; 