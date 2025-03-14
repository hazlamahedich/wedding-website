import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import CursorElement from '../components/CursorElement';
import { COLORS } from '../constants/theme';
import { saveRSVP, RSVPData, validateRSVPData } from '../utils/supabaseClient';

const PageContainer = styled.div`
  padding: 120px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

// Decorative elements
const DecorativeElement = styled.div`
  position: absolute;
  z-index: -1;
  opacity: 0.15;
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const TopLeftDecoration = styled(DecorativeElement)`
  top: 50px;
  left: 0;
  width: 150px;
  height: 150px;
  background: ${COLORS.FILIPINO_BLUE};
  border-radius: 50% 50% 0 50%;
  animation: ${floatAnimation} 8s ease-in-out infinite;
`;

const BottomRightDecoration = styled(DecorativeElement)`
  bottom: 50px;
  right: 0;
  width: 180px;
  height: 180px;
  background: ${COLORS.AUSTRALIAN_RED};
  border-radius: 50% 0 50% 50%;
  animation: ${floatAnimation} 10s ease-in-out infinite reverse;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, 
      ${COLORS.FILIPINO_BLUE}, 
      ${COLORS.FILIPINO_RED}
    );
  }
  
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

const FormContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(to right, 
      ${COLORS.FILIPINO_BLUE}, 
      ${COLORS.FILIPINO_RED}, 
      ${COLORS.AUSTRALIAN_BLUE}, 
      ${COLORS.AUSTRALIAN_RED}
    );
  }
`;

// Decorative corner elements
const Corner = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 1;
`;

const TopLeftCorner = styled(Corner)`
  top: 20px;
  left: 20px;
  border-top: 3px solid ${COLORS.FILIPINO_BLUE};
  border-left: 3px solid ${COLORS.FILIPINO_BLUE};
  border-top-left-radius: 8px;
`;

const TopRightCorner = styled(Corner)`
  top: 20px;
  right: 20px;
  border-top: 3px solid ${COLORS.FILIPINO_RED};
  border-right: 3px solid ${COLORS.FILIPINO_RED};
  border-top-right-radius: 8px;
`;

const BottomLeftCorner = styled(Corner)`
  bottom: 20px;
  left: 20px;
  border-bottom: 3px solid ${COLORS.AUSTRALIAN_BLUE};
  border-left: 3px solid ${COLORS.AUSTRALIAN_BLUE};
  border-bottom-left-radius: 8px;
`;

const BottomRightCorner = styled(Corner)`
  bottom: 20px;
  right: 20px;
  border-bottom: 3px solid ${COLORS.AUSTRALIAN_RED};
  border-right: 3px solid ${COLORS.AUSTRALIAN_RED};
  border-bottom-right-radius: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const Label = styled.label`
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  font-weight: 600;
`;

const Input = styled.input`
  font-family: 'Playfair Display', serif;
  padding: 12px 15px;
  border: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  }
`;

// Enhanced textarea with more width
const Textarea = styled.textarea`
  font-family: 'Playfair Display', serif;
  padding: 12px 15px;
  border: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  width: 100%;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  }
`;

const Select = styled.select`
  font-family: 'Playfair Display', serif;
  padding: 12px 15px;
  border: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.PRIMARY_RUSTY_BLUE};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  color: ${COLORS.WEATHERED_BLUE};
`;

const SubmitButton = styled.button`
  font-family: 'Playfair Display', serif;
  background-color: ${COLORS.FILIPINO_RED};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${COLORS.DARK_RUSTY_BLUE};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: ${COLORS.LIGHT_RUSTY_BLUE};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SubmitButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

// Enhanced step indicators
const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 2px;
    background-color: #f0f0f0;
    z-index: -1;
  }
`;

const stepPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(30, 136, 229, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(30, 136, 229, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 136, 229, 0); }
`;

const StepIndicator = styled.div<{ active: boolean; completed: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 15px;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  transition: all 0.5s ease;
  position: relative;
  z-index: 1;
  
  background-color: ${props => 
    props.completed 
      ? COLORS.FILIPINO_BLUE 
      : props.active 
        ? 'white' 
        : '#f0f0f0'};
  color: ${props => 
    props.completed 
      ? 'white' 
      : props.active 
        ? COLORS.FILIPINO_BLUE 
        : COLORS.WEATHERED_BLUE};
  
  border: 2px solid ${props => 
    props.completed 
      ? COLORS.FILIPINO_BLUE 
      : props.active 
        ? COLORS.FILIPINO_BLUE 
        : '#f0f0f0'};
  
  animation: ${props => props.active && !props.completed ? stepPulse : 'none'} 2s infinite;
  
  &:before {
    content: ${props => props.completed ? "'✓'" : "'" + props.children + "'"};
    font-size: ${props => props.completed ? '1.2rem' : '1rem'};
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StepContent = styled.div`
  animation: ${fadeIn} 0.6s ease forwards;
  padding: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const NavigationButton = styled.button<{ isPrimary?: boolean }>`
  font-family: 'Playfair Display', serif;
  background-color: ${props => props.isPrimary ? COLORS.FILIPINO_RED : 'transparent'};
  color: ${props => props.isPrimary ? 'white' : COLORS.DARK_RUSTY_BLUE};
  border: ${props => props.isPrimary ? 'none' : `1px solid ${COLORS.DARK_RUSTY_BLUE}`};
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.isPrimary ? COLORS.DARK_RUSTY_BLUE : COLORS.LIGHT_RUSTY_BLUE};
    color: white;
  }
  
  &:disabled {
    background-color: ${COLORS.LIGHT_RUSTY_BLUE};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Confetti animation
const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
`;

const Confetti = styled.div<{ delay: number; left: string; color: string }>`
  position: absolute;
  width: 10px;
  height: 20px;
  background-color: ${props => props.color};
  top: -20px;
  left: ${props => props.left};
  opacity: 0;
  animation: ${confettiAnimation} 3s ease-in-out forwards;
  animation-delay: ${props => props.delay}s;
`;

const ConfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
`;

// Enhanced form elements
const radioAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const RadioOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  flex: 1;
  min-width: 120px;
  
  background-color: ${props => props.selected ? COLORS.FILIPINO_BLUE : 'white'};
  color: ${props => props.selected ? 'white' : COLORS.DARK_RUSTY_BLUE};
  border: 2px solid ${props => props.selected ? COLORS.FILIPINO_BLUE : COLORS.LIGHT_RUSTY_BLUE};
  
  ${props => props.selected && css`
    animation: ${radioAnimation} 0.3s ease;
  `}
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: ${COLORS.FILIPINO_BLUE};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:active:before {
    opacity: 1;
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

// Guest counter with +/- buttons
const GuestCounter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const CounterButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background-color: white;
  border: 2px solid ${COLORS.LIGHT_RUSTY_BLUE};
  color: ${COLORS.DARK_RUSTY_BLUE};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${COLORS.LIGHT_RUSTY_BLUE};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CounterValue = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: ${COLORS.DARK_RUSTY_BLUE};
  width: 60px;
  text-align: center;
`;

// Enhanced checkbox
const CheckboxContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const checkboxCheck = keyframes`
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.checked ? COLORS.FILIPINO_BLUE : COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  background-color: ${props => props.checked ? COLORS.FILIPINO_BLUE : 'white'};
  
  svg {
    position: absolute;
    top: 2px;
    left: 2px;
    stroke-dasharray: 24;
    stroke-dashoffset: ${props => props.checked ? 0 : 24};
    transition: all 0.3s ease;
    animation: ${props => props.checked ? css`${checkboxCheck} 0.3s ease forwards` : 'none'};
  }
`;

// Define ConfettiPiece type outside the component
type ConfettiPiece = {
  id: number;
  left: string;
  delay: number;
  color: string;
};

// Countdown timer styles
const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CountdownValue = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${COLORS.PRIMARY_RUSTY_BLUE};
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, 
      ${COLORS.FILIPINO_BLUE}, 
      ${COLORS.FILIPINO_RED}
    );
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    width: 60px;
    height: 60px;
  }
`;

const CountdownLabel = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  color: ${COLORS.WEATHERED_BLUE};
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Text editor components
const TextEditorContainer = styled.div`
  border: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:focus-within {
    border-color: ${COLORS.PRIMARY_RUSTY_BLUE};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TextEditorToolbar = styled.div`
  display: flex;
  padding: 8px;
  background-color: #f8f8f8;
  border-bottom: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? COLORS.LIGHT_RUSTY_BLUE : 'transparent'};
  color: ${props => props.active ? 'white' : COLORS.DARK_RUSTY_BLUE};
  border: 1px solid ${props => props.active ? COLORS.LIGHT_RUSTY_BLUE : '#ddd'};
  border-radius: 4px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${COLORS.LIGHT_RUSTY_BLUE};
    color: white;
  }
`;

const TextEditorContent = styled.div`
  min-height: 150px;
  padding: 12px 15px;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  line-height: 1.5;
  
  &:focus {
    outline: none;
  }
  
  &:empty:before {
    content: 'Share your well wishes or any message for Elaine and Toby';
    color: #aaa;
    font-style: italic;
  }
  
  p {
    margin: 0 0 10px 0;
  }
  
  ul, ol {
    margin-left: 20px;
  }
  
  blockquote {
    border-left: 3px solid ${COLORS.LIGHT_RUSTY_BLUE};
    margin-left: 0;
    padding-left: 15px;
    color: #666;
    font-style: italic;
  }
`;

const ErrorMessage = styled.div`
  color: ${COLORS.FILIPINO_RED};
  font-size: 0.9rem;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.05);
  border-radius: 4px;
  border-left: 3px solid ${COLORS.FILIPINO_RED};
`;

const SuccessMessage = styled.div`
  color: #2e7d32;
  font-size: 0.9rem;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(46, 125, 50, 0.05);
  border-radius: 4px;
  border-left: 3px solid #2e7d32;
`;

const RSVPPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    numberOfGuests: 1,
    dietaryRestrictions: '',
    message: '',
    needsAccommodation: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Text editor state
  const [editorContent, setEditorContent] = useState('');
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  
  // Validation state
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    attending?: string;
    numberOfGuests?: string;
  }>({});
  
  // Calculate countdown to wedding date (August 15, 2025)
  useEffect(() => {
    const weddingDate = new Date('August 15, 2025 00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setCountdown({
          days,
          hours,
          minutes,
          seconds
        });
      }
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Validate a specific field
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'name':
        return !value || value.trim() === '' ? 'Name is required' : undefined;
      case 'email':
        if (!value || value.trim() === '') return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : undefined;
      case 'numberOfGuests':
        return formData.attending === 'yes' && (value < 1 || value > 4) 
          ? 'Number of guests must be between 1 and 4' 
          : undefined;
      default:
        return undefined;
    }
  };
  
  // Handle field blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleGuestCount = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      numberOfGuests: increment 
        ? Math.min(prev.numberOfGuests + 1, 4) 
        : Math.max(prev.numberOfGuests - 1, 1)
    }));
  };
  
  const nextStep = () => {
    // Validate current step before proceeding
    let hasErrors = false;
    const newErrors: any = {};
    
    if (currentStep === 1) {
      // Validate step 1 fields
      const nameError = validateField('name', formData.name);
      const emailError = validateField('email', formData.email);
      
      if (nameError) {
        newErrors.name = nameError;
        hasErrors = true;
      }
      
      if (emailError) {
        newErrors.email = emailError;
        hasErrors = true;
      }
    } else if (currentStep === 2 && formData.attending === 'yes') {
      // Validate step 2 fields if attending
      const guestsError = validateField('numberOfGuests', formData.numberOfGuests);
      
      if (guestsError) {
        newErrors.numberOfGuests = guestsError;
        hasErrors = true;
      }
    }
    
    if (hasErrors) {
      setFormErrors(newErrors);
      return;
    }
    
    // Proceed to next step if validation passes
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare the data for Supabase
      const rsvpData: RSVPData = {
        name: formData.name,
        email: formData.email,
        attending: formData.attending,
        numberOfGuests: formData.numberOfGuests,
        dietaryRestrictions: formData.dietaryRestrictions,
        message: editorContent, // Use the rich text editor content
        needsAccommodation: formData.needsAccommodation
      };
      
      // Validate the data before submitting
      const validation = validateRSVPData(rsvpData);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // Save to Supabase
      const { success, error } = await saveRSVP(rsvpData);
      
      if (!success) {
        throw new Error(error || 'Failed to save RSVP');
      }
      
      console.log('RSVP saved successfully');
      setIsSubmitted(true);
      
      // Generate confetti
      const confettiPieces: ConfettiPiece[] = [];
      const colors = [
        COLORS.FILIPINO_BLUE, 
        COLORS.FILIPINO_RED, 
        COLORS.AUSTRALIAN_BLUE, 
        COLORS.AUSTRALIAN_RED,
        COLORS.FILIPINO_YELLOW
      ];
      
      for (let i = 0; i < 50; i++) {
        confettiPieces.push({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setConfetti(confettiPieces);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Text editor functions
  const handleFormat = (format: string) => {
    const contentEditableDiv = document.getElementById('message-editor');
    if (!contentEditableDiv) return;
    
    // Toggle format in active formats
    setActiveFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format) 
        : [...prev, format]
    );
    
    // Special handling for blockquote
    if (format === 'formatBlock') {
      document.execCommand('formatBlock', false, '<blockquote>');
    } else {
      // Apply formatting
      document.execCommand(format, false);
    }
    
    // Update message in form data
    setFormData(prev => ({ ...prev, message: contentEditableDiv.innerHTML }));
    setEditorContent(contentEditableDiv.innerHTML);
    
    // Focus back on the editor
    contentEditableDiv.focus();
  };
  
  const handleEditorChange = () => {
    const contentEditableDiv = document.getElementById('message-editor');
    if (contentEditableDiv) {
      setFormData(prev => ({ ...prev, message: contentEditableDiv.innerHTML }));
      setEditorContent(contentEditableDiv.innerHTML);
    }
  };
  
  // Render different form steps based on currentStep
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <StepContent>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <CursorElement cursorType="form" cursorTheme="filipino">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter your full name"
                  style={{ borderColor: formErrors.name ? COLORS.FILIPINO_RED : undefined }}
                />
              </CursorElement>
              {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <CursorElement cursorType="form" cursorTheme="filipino">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter your email address"
                  style={{ borderColor: formErrors.email ? COLORS.FILIPINO_RED : undefined }}
                />
              </CursorElement>
              {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
            </FormGroup>
            
            <ButtonsContainer>
              <div></div> {/* Empty div for spacing */}
              <CursorElement cursorType="button" cursorText="Next Step" cursorTheme="filipino">
                <NavigationButton 
                  type="button" 
                  onClick={nextStep} 
                  isPrimary
                >
                  Next Step
                </NavigationButton>
              </CursorElement>
            </ButtonsContainer>
          </StepContent>
        );
      
      case 2:
        return (
          <StepContent>
            <FormGroup>
              <Label>Will you be attending?</Label>
              <CursorElement cursorType="form" cursorTheme="filipino">
                <RadioContainer>
                  <RadioOption selected={formData.attending === 'yes'}>
                    <HiddenRadio
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={() => handleRadioChange('attending', 'yes')}
                    />
                    Yes, I'll be there!
                  </RadioOption>
                  <RadioOption selected={formData.attending === 'no'}>
                    <HiddenRadio
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={() => handleRadioChange('attending', 'no')}
                    />
                    Sorry, I can't make it
                  </RadioOption>
                  <RadioOption selected={formData.attending === 'maybe'}>
                    <HiddenRadio
                      type="radio"
                      name="attending"
                      value="maybe"
                      checked={formData.attending === 'maybe'}
                      onChange={() => handleRadioChange('attending', 'maybe')}
                    />
                    Maybe, I'll confirm later
                  </RadioOption>
                </RadioContainer>
              </CursorElement>
              {formErrors.attending && <ErrorMessage>{formErrors.attending}</ErrorMessage>}
            </FormGroup>
            
            {formData.attending === 'yes' && (
              <>
                <FormGroup>
                  <Label>Number of Guests (including yourself)</Label>
                  <CursorElement cursorType="form" cursorTheme="filipino">
                    <GuestCounter>
                      <CounterButton 
                        type="button" 
                        onClick={() => handleGuestCount(false)}
                        disabled={formData.numberOfGuests <= 1}
                      >
                        -
                      </CounterButton>
                      <CounterValue>{formData.numberOfGuests}</CounterValue>
                      <CounterButton 
                        type="button" 
                        onClick={() => handleGuestCount(true)}
                        disabled={formData.numberOfGuests >= 4}
                      >
                        +
                      </CounterButton>
                    </GuestCounter>
                  </CursorElement>
                  {formErrors.numberOfGuests && <ErrorMessage>{formErrors.numberOfGuests}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <CursorElement cursorType="form" cursorTheme="filipino">
                    <Input
                      type="text"
                      id="dietaryRestrictions"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      placeholder="Any dietary restrictions or allergies?"
                    />
                  </CursorElement>
                </FormGroup>
              </>
            )}
            
            <ButtonsContainer>
              <CursorElement cursorType="button" cursorText="Previous" cursorTheme="filipino">
                <NavigationButton type="button" onClick={prevStep}>
                  Previous
                </NavigationButton>
              </CursorElement>
              <CursorElement cursorType="button" cursorText="Next Step" cursorTheme="filipino">
                <NavigationButton type="button" onClick={nextStep} isPrimary>
                  Next Step
                </NavigationButton>
              </CursorElement>
            </ButtonsContainer>
          </StepContent>
        );
      
      case 3:
        return (
          <StepContent>
            <FormGroup>
              <Label>Accommodation</Label>
              <CheckboxGroup>
                <CursorElement cursorType="form" cursorTheme="filipino">
                  <CheckboxContainer onClick={() => setFormData(prev => ({ ...prev, needsAccommodation: !prev.needsAccommodation }))}>
                    <StyledCheckbox checked={formData.needsAccommodation}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <Checkbox
                        type="checkbox"
                        id="needsAccommodation"
                        name="needsAccommodation"
                        checked={formData.needsAccommodation}
                        onChange={handleCheckboxChange}
                        style={{ opacity: 0, position: 'absolute' }}
                      />
                    </StyledCheckbox>
                  </CheckboxContainer>
                </CursorElement>
                <CheckboxLabel htmlFor="needsAccommodation">
                  I need information about accommodation options
                </CheckboxLabel>
              </CheckboxGroup>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">Message for the Couple (Optional)</Label>
              <CursorElement cursorType="form" cursorTheme="filipino">
                <TextEditorContainer>
                  <TextEditorToolbar>
                    <ToolbarButton 
                      type="button" 
                      onClick={() => handleFormat('bold')}
                      active={activeFormats.includes('bold')}
                    >
                      Bold
                    </ToolbarButton>
                    <ToolbarButton 
                      type="button" 
                      onClick={() => handleFormat('italic')}
                      active={activeFormats.includes('italic')}
                    >
                      Italic
                    </ToolbarButton>
                    <ToolbarButton 
                      type="button" 
                      onClick={() => handleFormat('underline')}
                      active={activeFormats.includes('underline')}
                    >
                      Underline
                    </ToolbarButton>
                    <ToolbarButton 
                      type="button" 
                      onClick={() => handleFormat('insertUnorderedList')}
                      active={activeFormats.includes('insertUnorderedList')}
                    >
                      Bullet List
                    </ToolbarButton>
                    <ToolbarButton 
                      type="button" 
                      onClick={() => handleFormat('insertOrderedList')}
                      active={activeFormats.includes('insertOrderedList')}
                    >
                      Numbered List
                    </ToolbarButton>
                    <ToolbarButton 
                      type="button" 
                      onClick={() => handleFormat('formatBlock')}
                      active={activeFormats.includes('formatBlock')}
                    >
                      Quote
                    </ToolbarButton>
                  </TextEditorToolbar>
                  <TextEditorContent
                    id="message-editor"
                    contentEditable
                    onInput={handleEditorChange}
                    dangerouslySetInnerHTML={{ __html: editorContent }}
                  />
                </TextEditorContainer>
              </CursorElement>
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <ButtonsContainer>
              <CursorElement cursorType="button" cursorText="Previous" cursorTheme="filipino">
                <NavigationButton type="button" onClick={prevStep}>
                  Previous
                </NavigationButton>
              </CursorElement>
              <CursorElement cursorType="button" cursorText="Submit RSVP" cursorTheme="filipino" cursorTexture="patina">
                <NavigationButton 
                  type="button" 
                  onClick={handleSubmit} 
                  isPrimary
                  disabled={isSubmitting}
                >
                  <SubmitButtonContent>
                    {isSubmitting ? "Submitting..." : "Submit RSVP"}
                  </SubmitButtonContent>
                </NavigationButton>
              </CursorElement>
            </ButtonsContainer>
          </StepContent>
        );
      
      default:
        return null;
    }
  };
  
  // Return the JSX for the component
  return isSubmitted ? (
    <PageContainer>
      <TopLeftDecoration />
      <BottomRightDecoration />
      
      <ConfettiContainer>
        {confetti.map(piece => (
          <Confetti 
            key={piece.id} 
            left={piece.left} 
            delay={piece.delay} 
            color={piece.color} 
          />
        ))}
      </ConfettiContainer>
      
      <SectionTitle>Thank You!</SectionTitle>
      <Subtitle>Your RSVP has been received</Subtitle>
      
      <FormContainer>
        <TopLeftCorner />
        <TopRightCorner />
        <BottomLeftCorner />
        <BottomRightCorner />
        
        <div style={{ textAlign: 'center' }}>
          <SuccessMessage>Your RSVP has been successfully saved!</SuccessMessage>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: COLORS.WEATHERED_BLUE }}>
            We're excited to celebrate our special day with you!
          </p>
          <p style={{ fontSize: '1rem', color: COLORS.WEATHERED_BLUE }}>
            We'll be in touch with more details as the big day approaches.
          </p>
        </div>
      </FormContainer>
    </PageContainer>
  ) : (
    <PageContainer>
      <TopLeftDecoration />
      <BottomRightDecoration />
      
      <SectionTitle>RSVP</SectionTitle>
      <Subtitle>Please respond by August 15, 2025</Subtitle>
      
      <CountdownContainer>
        <CountdownItem>
          <CountdownValue>{countdown.days}</CountdownValue>
          <CountdownLabel>Days</CountdownLabel>
        </CountdownItem>
        <CountdownItem>
          <CountdownValue>{countdown.hours}</CountdownValue>
          <CountdownLabel>Hours</CountdownLabel>
        </CountdownItem>
        <CountdownItem>
          <CountdownValue>{countdown.minutes}</CountdownValue>
          <CountdownLabel>Minutes</CountdownLabel>
        </CountdownItem>
        <CountdownItem>
          <CountdownValue>{countdown.seconds}</CountdownValue>
          <CountdownLabel>Seconds</CountdownLabel>
        </CountdownItem>
      </CountdownContainer>
      
      <FormContainer>
        <TopLeftCorner />
        <TopRightCorner />
        <BottomLeftCorner />
        <BottomRightCorner />
        
        <StepsContainer>
          <StepIndicator active={currentStep === 1} completed={currentStep > 1}>1</StepIndicator>
          <StepIndicator active={currentStep === 2} completed={currentStep > 2}>2</StepIndicator>
          <StepIndicator active={currentStep === 3} completed={false}>3</StepIndicator>
        </StepsContainer>
        
        <Form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}
        </Form>
      </FormContainer>
    </PageContainer>
  );
};

export default RSVPPage; 