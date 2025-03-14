# Travel Page

This page provides travel information for wedding guests, including flight options, accommodations, and local transportation details.

## Page Structure

1. **Hero Section**
   - Background image with overlay
   - Title and subtitle with enhanced text effects
   - Decorative floating elements
   - Wedding animations (hearts, rings, confetti, flowers)
   - Scroll down indicator

2. **Flight Information Section**
   - Cards for different flight routes
   - Each card includes:
     - Origin and destination
     - Flight duration
     - Direct flight availability
     - Price range
     - Airlines with logos
     - Clickable airline logos that link to official websites

3. **Domestic Philippines Flights Section**
   - Cards for popular domestic routes
   - Each card includes:
     - Origin and destination
     - Flight duration
     - Price range
     - Airlines with logos
     - Brief description of the destination

4. **Accommodation Options Section**
   - Cards for different accommodation booking platforms
   - Each card includes:
     - Platform logo
     - Brief description of the platform
     - Link to the platform's website
   - Accommodation tips section with helpful advice

5. **Skyscanner Integration Section**
   - Link to Skyscanner for real-time flight searches
   - Styled call-to-action button
   - Information about checking for the latest flight updates

6. **Travel Tips Section**
   - List of helpful tips for travelers

## Flight Routes

### United States to Manila
- Los Angeles to Manila
- San Francisco to Manila
- New York to Manila

### Domestic Philippines Flights
- Manila to Cebu
- Manila to Bohol
- Manila to Boracay (Caticlan)
- Manila to Palawan (Puerto Princesa)
- Manila to Siargao

## Required Assets

- `/images/travel-hero.jpg` - Hero background image
- `/images/travel-bg.jpg` - Background image
- `/images/hotels/*.jpg` - Hotel images
- `/images/airlines/*.png` - Airline logo images
- `/images/logos/*.png` - Accommodation platform logos
- `/images/transport/*.svg` - Transportation icons

## Airline Logos

The page displays logos for the following airlines:
- Qantas
- Philippine Airlines
- Cebu Pacific
- Cathay Pacific
- Korean Air
- ANA
- Emirates
- EVA Air
- Air Canada
- United Airlines
- Singapore Airlines
- Zip Air
- China Airlines

Each logo is clickable and links to the respective airline's official website. If logo images are not available, the page displays text-based fallbacks with airline abbreviations that are also clickable.

## Interactive Features

The page includes several interactive elements:
- Clickable airline logos that link to official airline websites
- Detailed flight information tooltips on hover over airline logos, including:
  - Flight numbers
  - Aircraft types
  - Flight durations
  - Schedules
  - Terminal information
  - Special notes about the service
- Skyscanner button that links to flight search results
- Scroll down indicator in the hero section
- Hover effects on flight cards, airline logos, and buttons
- Hotel cards that link to hotel booking pages
- Expandable sections with more information about local transportation

## Styling

The page follows the wedding website's blue color theme:
- Primary blue: #1E88E5
- Dark blue: #0D47A1
- Light blue: #64B5F6
- Accent blue: #2962FF

## Animations

The page includes the following animations:
- Floating elements with subtle movement
- Fade-in and slide-up effects for hero content
- Wedding-themed animations (hearts, rings, confetti, flowers)
- Pulse effects on text elements
- Hover effects on flight cards, airline logos, and Skyscanner button

## Responsive Design

The page is fully responsive with specific adjustments for:
- Desktop (default)
- Tablet (max-width: 768px)
- Mobile (max-width: 480px)

## Component Dependencies

- React
- styled-components
- react-router-dom
- CursorElement (custom component)
- WeddingAnimations (custom component)

## External Integrations

- **Airline Websites**: Links to official airline websites for:
  - Qantas (https://www.qantas.com/)
  - Philippine Airlines (https://www.philippineairlines.com/)
  - Cebu Pacific (https://www.cebupacificair.com/)
  - Cathay Pacific (https://www.cathaypacific.com/)
  - Korean Air (https://www.koreanair.com/)
  - ANA (https://www.ana.co.jp/en/us/)
  - Emirates (https://www.emirates.com/)
  - EVA Air (https://www.evaair.com/)
  - Air Canada (https://www.aircanada.com/)
  - United Airlines (https://www.united.com/)
  - Singapore Airlines (https://www.singaporeair.com/)
  - Zip Air (https://www.zipair.net/en/)
  - China Airlines (https://www.china-airlines.com/en-us/)
- **Accommodation Websites**: Links to booking platforms:
  - Airbnb (https://www.airbnb.com/s/Philippines)
  - Agoda (https://www.agoda.com/country/philippines.html)
  - Booking.com (https://www.booking.com/country/ph.html)
  - TripAdvisor (https://www.tripadvisor.com/Tourism-g294245-Philippines-Vacations.html)
- **Skyscanner Integration**: Button linking to Skyscanner search for flights to Manila
- **Hotel booking links**: Each hotel card links to the hotel's booking page
- **Transportation icons**: Expandable sections with more information about local transportation

## Future Enhancements

Potential future additions to this page:
- Interactive map with airport locations
- More detailed accommodation recommendations for specific destinations
- Local transportation options
- Currency exchange information
- Weather information for the wedding date

## Notes

- Flight prices are approximate and subject to change.
- Direct flight availability may vary by season.
- Hotel rates are approximate and subject to change.
- Local transportation options and prices are approximate and subject to change.

## Domestic Travel Tips
The page includes a section with helpful tips for domestic travel within the Philippines, covering:
- Booking recommendations
- Baggage policies
- Airport information
- Seasonal considerations
- Local transportation 