import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { CursorProvider } from './contexts/CursorContext';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import OurStoryPage from './pages/OurStoryPage';
import RSVPPage from './pages/RSVPPage';
import GalleryPage from './pages/GalleryPage';
import VenuePage from './pages/VenuePage';
import DetailsPage from './pages/DetailsPage';
import TravelPage from './pages/TravelPage';
import { COLORS } from './constants/theme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Playfair Display', serif;
    background-color: #f8f9fa;
    color: ${COLORS.DARK_RUSTY_BLUE};
    overflow-x: hidden;
    line-height: 1.6;
  }
  
  a {
    color: ${COLORS.PRIMARY_RUSTY_BLUE};
    text-decoration: none;
  }
  
  button {
    cursor: none;
  }
  
  a, input, button, textarea, select {
    cursor: none;
  }
`;

// Temporary placeholder page
const RegistryPage = () => (
  <div style={{ padding: '120px 40px 80px', maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '40px', color: COLORS.PRIMARY_RUSTY_BLUE }}>
      Gift Registry
    </h2>
    <p style={{ textAlign: 'center', marginBottom: '20px' }}>
      This page is coming soon with registry information.
    </p>
  </div>
);

// Wrapper to handle current path for navigation
const AppWrapper = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <>
      <Navigation currentPath={location.pathname} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/venue" element={<VenuePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/travel" element={<TravelPage />} />
        <Route path="/rsvp" element={<RSVPPage />} />
        <Route path="/registry" element={<RegistryPage />} />
      </Routes>
    </>
  );
};

function App() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  useEffect(() => {
    // Preload common images
    const imageUrls = [
      '/images/hero-bg.jpg',
      '/images/venue-hero.jpg',
      '/images/venue-parallax-1.jpg',
      '/images/venue-parallax-2.jpg',
      '/images/details-hero.jpg',
      '/images/ceremony.jpg',
      '/images/cocktail.jpg',
      '/images/reception.jpg',
      '/images/accommodations.jpg',
      '/images/transportation.jpg',
      '/images/afterparty.jpg',
      '/images/travel-hero.jpg',
      // Add other important images here
    ];
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
    const preloadImages = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve(url);
        };
        img.onerror = reject;
      });
    });
    
    Promise.all(preloadImages)
      .then(() => setImagesLoaded(true))
      .catch((error) => {
        console.error('Failed to preload images', error);
        setImagesLoaded(true); // Continue anyway
      });
    
    // Add font for the website
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  if (!imagesLoaded) {
    // Loading screen
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            color: COLORS.PRIMARY_RUSTY_BLUE,
            marginBottom: '20px',
          }}>
            Elaine & Toby
          </h1>
          <p style={{ color: COLORS.WEATHERED_BLUE }}>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <CursorProvider>
        <GlobalStyle />
        <CustomCursor enabled={true} />
        <AppWrapper />
      </CursorProvider>
    </Router>
  );
}

export default App;
