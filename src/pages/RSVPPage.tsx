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

const FormContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  position: relative;
  overflow: hidden;
  
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const Textarea = styled.textarea`
  font-family: 'Playfair Display', serif;
  padding: 12px 15px;
  border: 1px solid ${COLORS.LIGHT_RUSTY_BLUE};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
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

const RSVPPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    numberOfGuests: '1',
    dietaryRestrictions: '',
    message: '',
    needsAccommodation: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  if (isSubmitted) {
    return (
      <PageContainer>
        <SectionTitle>Thank You!</SectionTitle>
        <Subtitle>Your RSVP has been received</Subtitle>
        
        <FormContainer>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: COLORS.WEATHERED_BLUE }}>
              We're excited to celebrate our special day with you!
            </p>
            <p style={{ fontSize: '1rem', color: COLORS.WEATHERED_BLUE }}>
              We'll be in touch with more details as the big day approaches.
            </p>
          </div>
        </FormContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <SectionTitle>RSVP</SectionTitle>
      <Subtitle>Please respond by August 15, 2025</Subtitle>
      
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <CursorElement cursorType="form" cursorTheme="filipino">
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </CursorElement>
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
                required
                placeholder="Enter your email address"
              />
            </CursorElement>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="attending">Will you be attending?</Label>
            <CursorElement cursorType="form" cursorTheme="filipino">
              <Select
                id="attending"
                name="attending"
                value={formData.attending}
                onChange={handleChange}
                required
              >
                <option value="yes">Yes, I'll be there!</option>
                <option value="no">Sorry, I can't make it</option>
                <option value="maybe">Maybe, I'll confirm later</option>
              </Select>
            </CursorElement>
          </FormGroup>
          
          {formData.attending === 'yes' && (
            <>
              <FormGroup>
                <Label htmlFor="numberOfGuests">Number of Guests (including yourself)</Label>
                <CursorElement cursorType="form" cursorTheme="filipino">
                  <Select
                    id="numberOfGuests"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Select>
                </CursorElement>
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
              
              <FormGroup>
                <Label>Accommodation</Label>
                <CheckboxGroup>
                  <CursorElement cursorType="form" cursorTheme="filipino">
                    <Checkbox
                      type="checkbox"
                      id="needsAccommodation"
                      name="needsAccommodation"
                      checked={formData.needsAccommodation}
                      onChange={handleCheckboxChange}
                    />
                  </CursorElement>
                  <CheckboxLabel htmlFor="needsAccommodation">
                    I need information about accommodation options
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormGroup>
            </>
          )}
          
          <FormGroup>
            <Label htmlFor="message">Message for the Couple (Optional)</Label>
            <CursorElement cursorType="form" cursorTheme="filipino">
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share your well wishes or any message for Elaine and Toby"
              />
            </CursorElement>
          </FormGroup>
          
          <CursorElement
            cursorType="button"
            cursorText="Submit RSVP"
            cursorTheme="filipino"
            cursorTexture="patina"
          >
            <SubmitButton type="submit" disabled={isSubmitting}>
              <SubmitButtonContent>
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </SubmitButtonContent>
            </SubmitButton>
          </CursorElement>
        </Form>
      </FormContainer>
    </PageContainer>
  );
};

export default RSVPPage; 