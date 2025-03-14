import { createClient } from '@supabase/supabase-js';

// These will be replaced with actual environment variables
// For development, you can use these directly, but for production
// you should use environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for RSVP data
export interface RSVPData {
  id?: string;
  name: string;
  email: string;
  attending: string;
  numberOfGuests: number;
  dietaryRestrictions?: string;
  message?: string;
  needsAccommodation: boolean;
  createdAt?: string;
}

// Validation function for RSVP data
export const validateRSVPData = (data: RSVPData): { valid: boolean; error?: string } => {
  // Check required fields
  if (!data.name || data.name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  
  if (!data.email || data.email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  // Validate attending status
  if (!['yes', 'no', 'maybe'].includes(data.attending)) {
    return { valid: false, error: 'Please select a valid attendance option' };
  }
  
  // Validate number of guests
  if (data.attending === 'yes' && (data.numberOfGuests < 1 || data.numberOfGuests > 4)) {
    return { valid: false, error: 'Number of guests must be between 1 and 4' };
  }
  
  return { valid: true };
};

// Function to save RSVP data to Supabase
export const saveRSVP = async (rsvpData: RSVPData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate the data first
    const validation = validateRSVPData(rsvpData);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    const { data, error } = await supabase
      .from('rsvps')
      .insert([
        {
          name: rsvpData.name,
          email: rsvpData.email,
          attending: rsvpData.attending,
          number_of_guests: rsvpData.numberOfGuests,
          dietary_restrictions: rsvpData.dietaryRestrictions,
          message: rsvpData.message,
          needs_accommodation: rsvpData.needsAccommodation,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error saving RSVP:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception saving RSVP:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 