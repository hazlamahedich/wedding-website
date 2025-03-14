# Wedding Website Pages

This directory contains the main pages for the wedding website.

## VenuePage.tsx

The Venue page showcases Alta d' Tagaytay, the wedding venue, with the following features:

### Interactive Elements
- Animated hero section with a call-to-action button
- Live countdown timer to the wedding date
- Interactive gallery with hover effects
- Expandable FAQ section
- Parallax scrolling sections
- Floating animation cards
- Weather forecast cards with hover effects
- Google Maps integration with custom styling
- Custom cursor interactions on all interactive elements

### Technical Features
- Responsive design for all screen sizes
- Optimized image loading
- Smooth scrolling navigation
- Custom animations and transitions
- Dynamic content rendering
- Interactive UI elements

### Required Images
The venue page requires the following images in the `/public/images/` directory:
- `venue-hero.jpg` - Hero background image
- `venue-1.jpg` through `venue-6.jpg` - Gallery images
- `venue-parallax-1.jpg` and `venue-parallax-2.jpg` - Parallax section backgrounds

### Google Maps Integration
The venue page includes an interactive map showing the location of Alta d' Tagaytay. To enable this feature, you need to:
1. Get a Google Maps API key
2. Replace `YOUR_API_KEY` in the VenuePage.tsx file with your actual API key

## Other Pages
- HomePage.tsx - The main landing page
- OurStoryPage.tsx - The couple's love story
- GalleryPage.tsx - Photo gallery
- RSVPPage.tsx - RSVP form
- Demo.tsx - Demo of UI components 