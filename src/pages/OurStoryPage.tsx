import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, useInView, useAnimation, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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

const TimelineContainer = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${COLORS.LIGHT_RUSTY_BLUE};
    transform: translateX(-50%);
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineEntry = styled(motion.div)<{isLeft: boolean}>`
  display: flex;
  justify-content: ${props => props.isLeft ? 'flex-start' : 'flex-end'};
  margin-bottom: 80px;
  position: relative;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 70px;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const pulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
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

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const TimelineDot = styled(motion.div)<{theme: 'rustyBlue' | 'filipino' | 'australian'}>`
  position: absolute;
  left: 50%;
  top: 20px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.theme === 'filipino') return COLORS.FILIPINO_RED;
    if (props.theme === 'australian') return COLORS.AUSTRALIAN_BLUE;
    return COLORS.PRIMARY_RUSTY_BLUE;
  }};
  transform: translateX(-50%);
  z-index: 2;
  
  @media (max-width: 768px) {
    left: 30px;
  }
  
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid ${props => {
      if (props.theme === 'filipino') return COLORS.FILIPINO_RED;
      if (props.theme === 'australian') return COLORS.AUSTRALIAN_BLUE;
      return COLORS.PRIMARY_RUSTY_BLUE;
    }};
    transform: translate(-50%, -50%);
    opacity: 0.4;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

const TimelineContent = styled(motion.div)<{isLeft: boolean}>`
  width: 45%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 20px;
    ${props => props.isLeft ? 'right: -10px' : 'left: -10px'};
    width: 20px;
    height: 20px;
    background-color: white;
    transform: rotate(45deg);
    box-shadow: ${props => props.isLeft ? '2px -2px 5px rgba(0, 0, 0, 0.05)' : '-2px 2px 5px rgba(0, 0, 0, 0.05)'};
    
    @media (max-width: 768px) {
      left: -10px;
      right: auto;
      box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.05);
    }
  }
`;

const TimelineDate = styled.div<{theme: 'rustyBlue' | 'filipino' | 'australian'}>`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => {
    if (props.theme === 'filipino') return COLORS.FILIPINO_BLUE;
    if (props.theme === 'australian') return COLORS.AUSTRALIAN_BLUE;
    return COLORS.PRIMARY_RUSTY_BLUE;
  }};
`;

const TimelineTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
`;

const TimelineText = styled.p`
  font-family: 'Playfair Display', serif;
  line-height: 1.6;
  color: ${COLORS.WEATHERED_BLUE};
  margin-bottom: 1rem;
`;

const ParallaxContainer = styled(motion.div)`
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  margin: 15px 0;
`;

const ParallaxImage = styled(motion.div)`
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const ExpandButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 10px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-left: 5px;
    transition: transform 0.3s ease;
  }
  
  &[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
`;

const ExpandableContent = styled(motion.div)`
  margin-top: 15px;
  overflow: hidden;
`;

const ThemeDecoration = styled(motion.div)<{theme: 'rustyBlue' | 'filipino' | 'australian'}>`
  position: absolute;
  width: 40px;
  height: 40px;
  
  ${props => {
    if (props.theme === 'filipino') {
      return `
        top: -15px;
        right: -15px;
        background-image: url('/images/filipino-decoration.svg');
      `;
    }
    if (props.theme === 'australian') {
      return `
        bottom: -15px;
        left: -15px;
        background-image: url('/images/australian-decoration.svg');
      `;
    }
    return `
      top: -15px;
      left: -15px;
      background-image: url('/images/rusty-blue-decoration.svg');
    `;
  }}
  
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 3;
`;

const ThemeAnimation = styled.div<{theme: 'rustyBlue' | 'filipino' | 'australian'}>`
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 1;
  pointer-events: none;
  
  ${props => {
    if (props.theme === 'filipino') {
      return css`
        top: -15px;
        right: 20px;
        background-image: url('/images/filipino-decoration.svg');
        background-size: contain;
        background-repeat: no-repeat;
        animation: ${float} 3s ease-in-out infinite;
      `;
    }
    if (props.theme === 'australian') {
      return css`
        bottom: 10px;
        right: 10px;
        background-image: url('/images/australian-decoration.svg');
        background-size: contain;
        background-repeat: no-repeat;
        animation: ${rotate} 10s linear infinite;
      `;
    }
    return css`
      top: 10px;
      right: 10px;
      background-image: url('/images/rusty-blue-decoration.svg');
      background-size: contain;
      background-repeat: no-repeat;
      background-image: linear-gradient(
        90deg,
        rgba(93, 123, 147, 0.1) 25%,
        rgba(93, 123, 147, 0.3) 50%,
        rgba(93, 123, 147, 0.1) 75%
      );
      background-size: 200% 100%;
      animation: ${shimmer} 3s linear infinite;
    `;
  }}
`;

const ProgressContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: rgba(93, 123, 147, 0.2);
  z-index: 100;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${COLORS.PRIMARY_RUSTY_BLUE},
    ${COLORS.FILIPINO_RED},
    ${COLORS.AUSTRALIAN_BLUE}
  );
  background-size: 200% 100%;
  animation: ${shimmer} 3s linear infinite;
`;

const ScrollPrompt = styled(motion.div)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  opacity: 0.8;
  z-index: 90;
  pointer-events: none;
`;

const ScrollIcon = styled(motion.div)`
  width: 30px;
  height: 50px;
  border: 2px solid ${COLORS.PRIMARY_RUSTY_BLUE};
  border-radius: 15px;
  margin-bottom: 10px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 6px;
    height: 6px;
    background: ${COLORS.PRIMARY_RUSTY_BLUE};
    border-radius: 50%;
    transform: translateX(-50%);
    animation: ${float} 1.5s infinite;
  }
`;

const timelineEntries = [
  {
    date: 'June 2018',
    title: 'First Meeting',
    description: 'We first met at a friend\'s birthday party. Toby was visiting from Australia, and Elaine had just moved from the Philippines for work.',
    image: '/images/first-meeting.jpg',
    theme: 'rustyBlue' as const
  },
  {
    date: 'August 2018',
    title: 'First Date',
    description: 'After weeks of messaging and calls, we finally had our first official date at a cozy restaurant. We talked for hours and knew there was something special between us.',
    image: '/images/first-date.jpg',
    theme: 'rustyBlue' as const
  },
  {
    date: 'December 2018',
    title: 'Long Distance Begins',
    description: 'Toby had to return to Australia, and thus began our long-distance relationship. We committed to making it work despite the 10,000+ miles between us.',
    image: '/images/long-distance.jpg',
    theme: 'australian' as const
  },
  {
    date: 'July 2019',
    title: 'Philippines Visit',
    description: 'Toby visited Elaine\'s family in the Philippines. He experienced Filipino culture firsthand and even tried balut! Elaine\'s family immediately loved him.',
    image: '/images/philippines-visit.jpg',
    theme: 'filipino' as const
  },
  {
    date: 'January 2020',
    title: 'Moving to Australia',
    description: 'Elaine made the big decision to move to Australia to be with Toby. Little did we know that the world would soon change with the pandemic.',
    image: '/images/moving-australia.jpg',
    theme: 'australian' as const
  },
  {
    date: 'December 2023',
    title: 'The Proposal',
    description: 'During a holiday trip to the Philippines, Toby proposed on a beautiful beach at sunset, with a ring that incorporated elements from both of our cultures.',
    image: '/images/proposal.jpg',
    theme: 'filipino' as const
  },
  {
    date: 'September 15, 2025',
    title: 'Our Wedding Day',
    description: 'We can\'t wait to celebrate our love with family and friends from around the world, bringing together our Filipino and Australian heritage.',
    image: '/images/wedding.jpg',
    theme: 'rustyBlue' as const
  }
];

// Create a separate component for timeline entries
interface TimelineEntryComponentProps {
  entry: {
    date: string;
    title: string;
    description: string;
    image: string;
    theme: 'rustyBlue' | 'filipino' | 'australian';
  };
  index: number;
  isExpanded: boolean;
  toggleExpand: (index: number) => void;
}

const TimelineEntryComponent: React.FC<TimelineEntryComponentProps> = ({ 
  entry, 
  index, 
  isExpanded, 
  toggleExpand 
}) => {
  const isLeft = index % 2 === 0;
  const entryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: entryRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.1]);
  
  return (
    <TimelineEntry 
      key={index} 
      isLeft={isLeft}
      ref={entryRef}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      <TimelineDot 
        theme={entry.theme}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: 0.2 
        }}
      />
      <TimelineContent 
        isLeft={isLeft}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ThemeDecoration 
          theme={entry.theme}
          initial={{ opacity: 0, rotate: -20 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        
        <ThemeAnimation theme={entry.theme} />
        
        <TimelineDate theme={entry.theme}>{entry.date}</TimelineDate>
        <TimelineTitle>{entry.title}</TimelineTitle>
        <TimelineText>{entry.description}</TimelineText>
        
        <CursorElement
          cursorType="gallery"
          cursorText="View"
          cursorTheme={entry.theme}
          cursorIntensity="medium"
          cursorTexture={
            entry.theme === 'filipino' ? 'patina' : 
            entry.theme === 'australian' ? 'vintage' : 'smooth'
          }
        >
          <ParallaxContainer
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ParallaxImage 
              style={{ 
                backgroundImage: `url(${entry.image})`,
                y: imageY,
                scale: imageScale
              }} 
            />
          </ParallaxContainer>
        </CursorElement>
        
        <ExpandButton 
          onClick={() => toggleExpand(index)}
          aria-expanded={isExpanded}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? "Show less" : "Read more"} 
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke={COLORS.PRIMARY_RUSTY_BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ExpandButton>
        
        <AnimatePresence>
          {isExpanded && (
            <ExpandableContent
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TimelineText>
                {entry.title === 'First Meeting' && (
                  "The party was at a rooftop bar with a stunning view of the city skyline. We were introduced by our mutual friend, Sarah. Toby was only supposed to be in town for a week, but after meeting Elaine, he extended his stay for another two weeks."
                )}
                {entry.title === 'First Date' && (
                  "We went to a small Italian restaurant called 'Bella Notte'. Toby was 30 minutes early because he was so nervous. Elaine ordered spaghetti, and Toby got lasagna. We shared tiramisu for dessert and talked until the restaurant closed."
                )}
                {entry.title === 'Long Distance Begins' && (
                  "We set up a schedule to video call three times a week, accounting for the time difference. We sent each other care packages with local snacks and small gifts. The hardest part was saying goodbye after our calls."
                )}
                {entry.title === 'Philippines Visit' && (
                  "Toby stayed with Elaine's family for two weeks. Her grandmother taught him how to cook adobo, and her father took him fishing in the local bay. The whole family gathered for a special dinner to welcome him."
                )}
                {entry.title === 'Moving to Australia' && (
                  "Elaine packed her life into two suitcases. Her parents were sad to see her go but happy she found love. Toby prepared his apartment with touches of Filipino decor to make her feel at home. They adopted a cat named Milo a month after she moved in."
                )}
                {entry.title === 'The Proposal' && (
                  "Toby had been planning the proposal for months. The ring featured a blue sapphire (representing Australia) and small rubies (representing the Philippines). He asked her father for permission the day before. When she said yes, a group of local musicians that Toby had hired began playing their favorite song."
                )}
                {entry.title === 'Our Wedding Day' && (
                  "We're planning a ceremony that honors both of our cultural traditions. The color scheme will blend elements from both the Filipino and Australian flags. We'll have two ceremonies - a traditional Catholic ceremony for Elaine's family and a beach ceremony for Toby's side."
                )}
              </TimelineText>
            </ExpandableContent>
          )}
        </AnimatePresence>
      </TimelineContent>
    </TimelineEntry>
  );
};

const OurStoryPage: React.FC = () => {
  const [expandedEntries, setExpandedEntries] = useState<number[]>([]);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Hide scroll prompt after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollPrompt(false);
      } else {
        setShowScrollPrompt(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleExpand = (index: number) => {
    setExpandedEntries(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };
  
  const isExpanded = (index: number) => expandedEntries.includes(index);
  
  return (
    <>
      <ProgressContainer>
        <ProgressBar style={{ scaleX: scrollYProgress }} />
      </ProgressContainer>
      
      <AnimatePresence>
        {showScrollPrompt && (
          <ScrollPrompt
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <ScrollIcon />
            <span>Scroll to explore our journey</span>
          </ScrollPrompt>
        )}
      </AnimatePresence>
      
      <PageContainer ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionTitle>Our Story</SectionTitle>
          <Subtitle>How a chance meeting turned into forever</Subtitle>
        </motion.div>
        
        <TimelineContainer>
          {timelineEntries.map((entry, index) => (
            <TimelineEntryComponent
              key={index}
              entry={entry}
              index={index}
              isExpanded={isExpanded(index)}
              toggleExpand={toggleExpand}
            />
          ))}
        </TimelineContainer>
      </PageContainer>
    </>
  );
};

export default OurStoryPage; 