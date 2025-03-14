import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS, EASING } from '../../constants/theme';
import CursorElement from '../../components/CursorElement';

// Import styled components from parent file
const FAQSection = styled.section`
  padding: 80px 20px;
  background-color: white;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 60px 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-align: center;
  margin-bottom: 50px;
  font-family: 'Playfair Display', serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 30px;
  }
`;

const FAQSearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 30px;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FAQSearchInput = styled.input`
  width: 100%;
  padding: 15px 15px 15px 50px;
  border: 2px solid ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 30px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${COLORS.PRIMARY_RUSTY_BLUE};
    box-shadow: 0 0 0 3px rgba(var(--rusty-blue-rgb), 0.2);
  }
`;

const FAQCategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CategoryButton = styled.button<{ isActive: boolean; category: string }>`
  background-color: ${props => props.isActive ? COLORS.PRIMARY_RUSTY_BLUE : 'white'};
  color: ${props => props.isActive ? 'white' : COLORS.PRIMARY_RUSTY_BLUE};
  border: 2px solid ${COLORS.PRIMARY_RUSTY_BLUE};
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? COLORS.DARK_RUSTY_BLUE : COLORS.LIGHT_RUSTY_BLUE};
    color: ${props => props.isActive ? 'white' : COLORS.PRIMARY_RUSTY_BLUE};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 20px;
  }
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  font-size: 1.1rem;
  background-color: ${COLORS.LIGHT_RUSTY_BLUE}20;
  border-radius: 8px;
`;

// Define the props interface for the FAQSection component
interface FAQSectionProps {
  faqData: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
  openFAQ: number | null;
  toggleFAQ: (index: number) => void;
  faqSearchQuery: string;
  setFaqSearchQuery: (query: string) => void;
  faqCategory: string;
  setFaqCategory: (category: string) => void;
  filteredFaqs: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
}

// Define the FAQItem component
const FAQItem = styled.div`
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FAQQuestion = styled.div<{ isOpen: boolean }>`
  padding: 20px;
  background-color: ${props => props.isOpen ? COLORS.PRIMARY_RUSTY_BLUE : 'white'};
  color: ${props => props.isOpen ? 'white' : COLORS.PRIMARY_RUSTY_BLUE};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.isOpen ? COLORS.DARK_RUSTY_BLUE : COLORS.LIGHT_RUSTY_BLUE}40;
  }
  
  ${props => props.isOpen && css`
    animation: highlight 1s ${EASING.HOVER_TRANSITION};
    
    @keyframes highlight {
      0% { background-color: ${COLORS.LIGHT_RUSTY_BLUE}; }
      100% { background-color: ${COLORS.PRIMARY_RUSTY_BLUE}; }
    }
  `}
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '20px' : '0 20px'};
  height: ${props => props.isOpen ? 'auto' : '0'};
  opacity: ${props => props.isOpen ? 1 : 0};
  overflow: hidden;
  transition: all 0.3s ease;
  line-height: 1.6;
  color: #666;
  
  a {
    color: ${COLORS.PRIMARY_RUSTY_BLUE};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FAQIcon = styled.div<{ isOpen: boolean }>`
  width: 20px;
  height: 20px;
  position: relative;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0)'};
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: ${props => props.isOpen ? 'white' : COLORS.PRIMARY_RUSTY_BLUE};
    transition: background-color 0.3s ease;
  }
  
  &::before {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  
  &::after {
    width: 2px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
`;

// Create the MemoizedFAQItem component
const MemoizedFAQItem = React.memo(({ 
  faq, 
  index, 
  isOpen, 
  toggleFAQ 
}: { 
  faq: { question: string; answer: string; category: string }; 
  index: number; 
  isOpen: boolean; 
  toggleFAQ: (index: number) => void; 
}) => (
  <FAQItem>
    <CursorElement cursorType="button" cursorText={isOpen ? "Collapse" : "Expand"} cursorTheme="rustyBlue">
      <FAQQuestion 
        isOpen={isOpen} 
        onClick={() => toggleFAQ(index)}
      >
        {faq.question}
        <FAQIcon isOpen={isOpen} />
      </FAQQuestion>
    </CursorElement>
    
    <FAQAnswer isOpen={isOpen} dangerouslySetInnerHTML={{ __html: faq.answer }} />
  </FAQItem>
));

// Create the FAQSection component
const FAQSectionComponent: React.FC<FAQSectionProps> = ({
  faqData,
  openFAQ,
  toggleFAQ,
  faqSearchQuery,
  setFaqSearchQuery,
  faqCategory,
  setFaqCategory,
  filteredFaqs
}) => {
  return (
    <FAQSection>
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      
      <FAQSearchContainer>
        <SearchIcon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={COLORS.PRIMARY_RUSTY_BLUE} />
          </svg>
        </SearchIcon>
        <FAQSearchInput 
          type="text" 
          placeholder="Search questions..." 
          value={faqSearchQuery}
          onChange={(e) => setFaqSearchQuery(e.target.value)}
        />
      </FAQSearchContainer>
      
      <FAQCategoryFilter>
        <CursorElement cursorType="button" cursorText="All" cursorTheme="rustyBlue">
          <CategoryButton 
            isActive={faqCategory === 'all'} 
            category="all"
            onClick={() => setFaqCategory('all')}
          >
            All Questions
          </CategoryButton>
        </CursorElement>
        
        <CursorElement cursorType="button" cursorText="Venue" cursorTheme="rustyBlue">
          <CategoryButton 
            isActive={faqCategory === 'venue'} 
            category="venue"
            onClick={() => setFaqCategory('venue')}
          >
            Venue
          </CategoryButton>
        </CursorElement>
        
        <CursorElement cursorType="button" cursorText="Attire" cursorTheme="rustyBlue">
          <CategoryButton 
            isActive={faqCategory === 'attire'} 
            category="attire"
            onClick={() => setFaqCategory('attire')}
          >
            Attire
          </CategoryButton>
        </CursorElement>
        
        <CursorElement cursorType="button" cursorText="Logistics" cursorTheme="rustyBlue">
          <CategoryButton 
            isActive={faqCategory === 'logistics'} 
            category="logistics"
            onClick={() => setFaqCategory('logistics')}
          >
            Logistics
          </CategoryButton>
        </CursorElement>
        
        <CursorElement cursorType="button" cursorText="Accommodations" cursorTheme="rustyBlue">
          <CategoryButton 
            isActive={faqCategory === 'accommodations'} 
            category="accommodations"
            onClick={() => setFaqCategory('accommodations')}
          >
            Accommodations
          </CategoryButton>
        </CursorElement>
      </FAQCategoryFilter>
      
      <FAQContainer>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <MemoizedFAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openFAQ === index}
              toggleFAQ={toggleFAQ}
            />
          ))
        ) : (
          <NoResultsMessage>
            No questions found matching your search. Try different keywords or clear the search.
          </NoResultsMessage>
        )}
      </FAQContainer>
    </FAQSection>
  );
};

export default FAQSectionComponent; 