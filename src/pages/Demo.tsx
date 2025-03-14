import React from 'react';
import styled from 'styled-components';
import CursorElement from '../components/CursorElement';
import { COLORS } from '../constants/theme';

const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Playfair Display', serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  font-size: 24px;
  color: ${COLORS.WEATHERED_BLUE};
  font-weight: normal;
`;

const Section = styled.section`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h3`
  font-size: 32px;
  color: ${COLORS.RUSTY_BLUE_ACCENT};
  margin-bottom: 30px;
  border-bottom: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  padding-bottom: 10px;
`;

const ElementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const ElementBox = styled.div`
  padding: 30px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;
`;

const Button = styled.button`
  background-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-family: 'Playfair Display', serif;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: ${COLORS.LIGHT_RUSTY_BLUE};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: ${COLORS.DARK_RUSTY_BLUE};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 4px;
  font-size: 16px;
  font-family: 'Playfair Display', serif;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  }
`;

const NavLink = styled.a`
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  font-size: 18px;
  text-decoration: none;
  padding: 8px 16px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ThemeSection = styled.div`
  margin-top: 30px;
`;

const ThemeTitle = styled.h4`
  font-size: 20px;
  color: ${COLORS.RUSTY_BLUE_ACCENT};
  margin-bottom: 20px;
`;

const Demo: React.FC = () => {
  return (
    <DemoContainer>
      <Header>
        <Title>Elaine & Toby's Wedding</Title>
        <Subtitle>Custom Cursor Demo</Subtitle>
      </Header>
      
      <Section>
        <SectionTitle>Button Interactions</SectionTitle>
        <p>Hover over these buttons to see the custom cursor transform:</p>
        
        <ElementGrid>
          <ElementBox>
            <CursorElement
              cursorType="button"
              cursorText="Click"
              cursorTheme="rustyBlue"
            >
              <Button>RSVP Now</Button>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="button"
              cursorText="Click"
              cursorTheme="filipino"
              cursorTexture="patina"
            >
              <Button style={{ backgroundColor: COLORS.FILIPINO_BLUE }}>
                Filipino Style
              </Button>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="button"
              cursorText="Click"
              cursorTheme="australian"
              cursorTexture="vintage"
            >
              <Button style={{ backgroundColor: COLORS.AUSTRALIAN_BLUE }}>
                Australian Style
              </Button>
            </CursorElement>
          </ElementBox>
        </ElementGrid>
      </Section>
      
      <Section>
        <SectionTitle>Gallery Interactions</SectionTitle>
        <p>Hover over these gallery elements to see the custom cursor transform:</p>
        
        <ElementGrid>
          <ElementBox>
            <CursorElement
              cursorType="gallery"
              cursorText="View"
              cursorTheme="rustyBlue"
              cursorIntensity="medium"
            >
              <ImageContainer>Rusty Blue Gallery Item</ImageContainer>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="gallery"
              cursorText="View"
              cursorTheme="filipino"
              cursorIntensity="high"
              cursorTexture="patina"
            >
              <ImageContainer style={{ backgroundColor: COLORS.FILIPINO_BLUE }}>
                Filipino Gallery Item
              </ImageContainer>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="gallery"
              cursorText="View"
              cursorTheme="australian"
              cursorIntensity="low"
              cursorTexture="vintage"
            >
              <ImageContainer style={{ backgroundColor: COLORS.AUSTRALIAN_BLUE }}>
                Australian Gallery Item
              </ImageContainer>
            </CursorElement>
          </ElementBox>
        </ElementGrid>
      </Section>
      
      <Section>
        <SectionTitle>Video Interactions</SectionTitle>
        <p>Hover over these video elements to see the custom cursor transform:</p>
        
        <ElementGrid>
          <ElementBox>
            <CursorElement
              cursorType="video"
              cursorText="Play"
              cursorTheme="rustyBlue"
              cursorTexture="weathered"
            >
              <VideoContainer>Rusty Blue Video</VideoContainer>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="video"
              cursorText="Play"
              cursorTheme="filipino"
              cursorTexture="patina"
            >
              <VideoContainer style={{ backgroundColor: COLORS.FILIPINO_BLUE }}>
                Filipino Video
              </VideoContainer>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="video"
              cursorText="Play"
              cursorTheme="australian"
              cursorTexture="vintage"
            >
              <VideoContainer style={{ backgroundColor: COLORS.AUSTRALIAN_BLUE }}>
                Australian Video
              </VideoContainer>
            </CursorElement>
          </ElementBox>
        </ElementGrid>
      </Section>
      
      <Section>
        <SectionTitle>Form Field Interactions</SectionTitle>
        <p>Hover over these form fields to see the custom cursor transform:</p>
        
        <ElementGrid>
          <ElementBox>
            <CursorElement
              cursorType="form"
              cursorTheme="rustyBlue"
            >
              <FormInput placeholder="Enter your name..." />
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="form"
              cursorTheme="filipino"
            >
              <FormInput placeholder="Enter your email..." />
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="form"
              cursorTheme="australian"
            >
              <FormInput placeholder="Add a message..." />
            </CursorElement>
          </ElementBox>
        </ElementGrid>
      </Section>
      
      <Section>
        <SectionTitle>Navigation Link Interactions</SectionTitle>
        <p>Hover over these navigation links to see the custom cursor transform:</p>
        
        <ElementGrid>
          <ElementBox>
            <CursorElement
              cursorType="link"
              cursorText="Navigate"
              cursorTheme="rustyBlue"
              cursorAccent="cultural"
            >
              <NavLink href="#">Our Story</NavLink>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="link"
              cursorText="Navigate"
              cursorTheme="filipino"
              cursorAccent="cultural"
            >
              <NavLink href="#" style={{ color: COLORS.FILIPINO_BLUE }}>
                Venue Info
              </NavLink>
            </CursorElement>
          </ElementBox>
          
          <ElementBox>
            <CursorElement
              cursorType="link"
              cursorText="Navigate"
              cursorTheme="australian"
              cursorAccent="cultural"
            >
              <NavLink href="#" style={{ color: COLORS.AUSTRALIAN_BLUE }}>
                Wedding Registry
              </NavLink>
            </CursorElement>
          </ElementBox>
        </ElementGrid>
      </Section>
    </DemoContainer>
  );
};

export default Demo; 