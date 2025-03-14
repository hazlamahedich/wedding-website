import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants/theme';

interface NavigationProps {
  currentPath: string;
}

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(5px);
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ active: boolean }>`
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  color: ${props => props.active ? COLORS.RUSTY_HIGHLIGHT : COLORS.PRIMARY_RUSTY_BLUE};
  text-decoration: none;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: ${COLORS.RUSTY_HIGHLIGHT};
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  return (
    <NavContainer>
      <NavInner>
        <Logo to="/">E&T</Logo>
        <NavLinks>
          <NavLink to="/" active={currentPath === '/'}>Home</NavLink>
          <NavLink to="/details" active={currentPath === '/details'}>Details</NavLink>
          <NavLink to="/venue" active={currentPath === '/venue'}>Venue</NavLink>
          <NavLink to="/travel" active={currentPath === '/travel'}>Travel</NavLink>
          <NavLink to="/rsvp" active={currentPath === '/rsvp'}>RSVP</NavLink>
        </NavLinks>
      </NavInner>
    </NavContainer>
  );
};

export default Navigation; 