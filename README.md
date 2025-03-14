# Elaine & Toby's Wedding Website - Custom Cursor

This project implements a luxurious, culturally-inspired custom cursor system for Elaine & Toby's wedding website. The cursor blends Filipino and Australian design elements with a rusty blue color theme as the primary palette.

## Features

- 🖱️ **Elegant Custom Cursor**: A sophisticated cursor system with dot, ring, and trail elements
- 🌈 **Cultural Design Elements**: Incorporates design elements and colors from Filipino and Australian cultures
- 🔄 **Context-Aware Transformations**: Cursor changes based on the element being hovered (buttons, images, videos, forms, links)
- ✨ **Smooth Animations**: Fluid motion with spring effects, delays, and transitions
- 📝 **Text Labels**: Contextual text labels that appear when hovering over interactive elements
- 📱 **Accessibility Considerations**: Fallbacks and options for users who prefer standard cursors

## Technology Stack

- **React**: Frontend framework with TypeScript
- **Styled Components**: CSS-in-JS styling
- **GSAP**: Animation library for smooth cursor movements
- **Framer Motion**: React animation library for specialized transitions
- **anime.js**: Timeline-based animations for complex effects
- **react-spring**: Physics-based animations for natural cursor movement

## Custom Cursor Components

The custom cursor consists of several elements:

1. **Main Cursor Dot**: A small circular dot that follows the mouse cursor precisely
2. **Cursor Ring**: A larger ring that follows with a slight delay, creating an elegant trailing effect
3. **Background Trail**: A subtle glow that follows with significant delay
4. **Text Labels**: Contextual text that appears when hovering over interactive elements

## Cursor Transformations

The cursor transforms based on the element being hovered:

- **Buttons & CTAs**: Transforms to a circle with increased brightness and "Click" text
- **Gallery Areas**: Transforms into a magnifying glass with "View" text
- **Form Fields**: Transforms into a thin I-beam cursor
- **Navigation Elements**: Grows larger with directional indication
- **Videos**: Transforms into a play button shape with "Watch" text

## Cultural Design Elements

The cursor incorporates cultural elements from:

- **Filipino Culture**: Blue and red accents, sampaguita flower motifs, wave patterns
- **Australian Culture**: Blue and red accents, Southern Cross star patterns, boomerang-shaped trails

## Usage

To add cursor interactions to any component, wrap it with the `CursorElement` component:

```jsx
<CursorElement
  cursorType="button"
  cursorText="Click"
  cursorTheme="rustyBlue"
  cursorIntensity="medium"
  cursorTexture="weathered"
  cursorAccent="cultural"
>
  <Button>RSVP Now</Button>
</CursorElement>
```

## Available Props

The `CursorElement` component accepts the following props:

- **cursorType**: The type of cursor to display ('default', 'button', 'gallery', 'video', 'link', 'form')
- **cursorText**: Text to display near the cursor when hovering
- **cursorTheme**: The color theme to use ('rustyBlue', 'filipino', 'australian')
- **cursorIntensity**: The intensity of the cursor effect ('low', 'medium', 'high')
- **cursorTexture**: The texture style to apply ('smooth', 'weathered', 'patina', 'vintage')
- **cursorAccent**: Additional accent styling (e.g., 'cultural')

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view the demo

## Customization

The cursor system is highly customizable through the constants defined in `src/constants/theme.ts`. You can adjust colors, sizes, animations, and timing to achieve different effects.

## Accessibility

For users who prefer standard cursors or who use assistive technologies, the custom cursor can be disabled by setting the `enabled` prop to `false` on the `CustomCursor` component.

## Credits

- Design and Implementation: [Your Name]
- Inspired by Filipino and Australian cultural elements
- Created for Elaine & Toby's Wedding

### Travel Page
- Information about flights to Manila from various international locations
- Domestic flight options within the Philippines to popular tourist destinations
- Hotel recommendations near the wedding venue
- Transportation options in Manila
- Helpful travel tips for international and domestic travel
- Interactive elements like clickable airline logos and a Skyscanner widget
