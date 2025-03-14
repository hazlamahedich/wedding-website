import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { COLORS } from '../constants/theme';

// Fix for default marker icons in Leaflet with webpack
const defaultIcon = new L.Icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Custom marker icons
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Create larger icons for hover effect
const createLargeCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 49], // 20% larger
    iconAnchor: [15, 49],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const redIcon = createCustomIcon('red');
const goldIcon = createCustomIcon('gold');
const largeRedIcon = createLargeCustomIcon('red');
const largeGoldIcon = createLargeCustomIcon('gold');

// Styled components
const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  margin: 20px 0 40px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const MapLegend = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-size: 0.8rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 15px;
  height: 15px;
  background-color: ${props => props.color};
  margin-right: 8px;
  border-radius: 50%;
`;

const FlightInfoCard = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

// Types
interface Location {
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  type: 'manila' | 'domestic';
  description: string;
  highlights?: string[]; // What visitors can look forward to
}

interface FlightRoute {
  from: Location;
  to: Location;
  airline: string;
  duration: string;
  price: string;
}

// Data - Domestic destinations only
const locations: Location[] = [
  // Manila (hub)
  { 
    name: 'Manila', 
    coordinates: [14.5995, 120.9842], 
    type: 'manila', 
    description: 'Wedding Destination - The capital city of the Philippines and your wedding venue location.',
    highlights: ['Historic Intramuros', 'Vibrant nightlife', 'Shopping malls', 'Cultural museums']
  },
  
  // Domestic destinations
  { 
    name: 'Cebu', 
    coordinates: [10.3157, 123.8854], 
    type: 'domestic', 
    description: 'Known for pristine beaches, coral reefs, and historical sites like Magellan\'s Cross.',
    highlights: ['Swimming with whale sharks', 'Island hopping', 'Magellan\'s Cross', 'Lechon (roast pig)'] 
  },
  { 
    name: 'Bohol', 
    coordinates: [9.8500, 124.1435], 
    type: 'domestic', 
    description: 'Famous for the Chocolate Hills, tarsiers, and beautiful white sand beaches.',
    highlights: ['Chocolate Hills', 'Tarsier sanctuary', 'Loboc River cruise', 'Panglao beaches'] 
  },
  { 
    name: 'Boracay', 
    coordinates: [11.9674, 121.9248], 
    type: 'domestic', 
    description: 'Home to White Beach, consistently rated as one of the world\'s best beaches.',
    highlights: ['White Beach sunset', 'Water sports', 'Island hopping', 'Vibrant nightlife'] 
  },
  { 
    name: 'Palawan', 
    coordinates: [10.1925, 118.9045], 
    type: 'domestic', 
    description: 'Features the Underground River, limestone cliffs, and El Nido\'s lagoons.',
    highlights: ['Underground River', 'El Nido island hopping', 'Hidden lagoons', 'Pristine beaches'] 
  },
  { 
    name: 'El Nido', 
    coordinates: [11.1800, 119.4100], 
    type: 'domestic', 
    description: 'A paradise of limestone cliffs, crystal-clear lagoons, and secluded beaches.',
    highlights: ['Big and Small Lagoons', 'Island hopping tours', 'Nacpan Beach', 'Stunning limestone formations'] 
  },
  { 
    name: 'Coron', 
    coordinates: [12.0050, 120.2040], 
    type: 'domestic', 
    description: 'Famous for Japanese shipwrecks, pristine lakes, and breathtaking island scenery.',
    highlights: ['Kayangan Lake', 'Shipwreck diving', 'Twin Lagoon', 'Barracuda Lake'] 
  },
  { 
    name: 'Siargao', 
    coordinates: [9.8482, 126.0458], 
    type: 'domestic', 
    description: 'The surfing capital of the Philippines with its famous Cloud 9 wave.',
    highlights: ['Cloud 9 surfing', 'Island hopping', 'Sugba Lagoon', 'Magpupungko rock pools'] 
  },
  { 
    name: 'Davao', 
    coordinates: [7.1907, 125.4553], 
    type: 'domestic', 
    description: 'Home to Mount Apo, the highest mountain in the Philippines, and durian fruit.',
    highlights: ['Mount Apo hiking', 'Philippine Eagle Center', 'Eden Nature Park', 'Durian fruit tasting'] 
  },
  { 
    name: 'Iloilo', 
    coordinates: [10.7202, 122.5621], 
    type: 'domestic', 
    description: 'Known for its Spanish colonial churches, delicious food, and Dinagyang Festival.',
    highlights: ['Historic churches', 'La Paz Batchoy soup', 'Islas de Gigantes', 'Miagao Church (UNESCO site)'] 
  },
];

// Helper functions for flight data
const getDomesticFlightDuration = (destination: string): string => {
  const durations: Record<string, string> = {
    'Cebu': '~1h 20m',
    'Bohol': '~1h 30m',
    'Boracay': '~1h 10m',
    'Palawan': '~1h 30m',
    'El Nido': '~1h 15m',
    'Coron': '~1h 20m',
    'Siargao': '~2h 30m',
    'Davao': '~1h 45m',
    'Iloilo': '~1h 15m',
  };
  return durations[destination] || '~1-2 hours';
};

const getDomesticFlightPrice = (destination: string): string => {
  const prices: Record<string, string> = {
    'Cebu': 'PHP 1,500 - 5,000 (USD $30 - $100)',
    'Bohol': 'PHP 2,000 - 6,000 (USD $40 - $120)',
    'Boracay': 'PHP 1,800 - 6,500 (USD $35 - $130)',
    'Palawan': 'PHP 1,500 - 6,000 (USD $30 - $120)',
    'El Nido': 'PHP 4,000 - 9,000 (USD $80 - $180)',
    'Coron': 'PHP 3,500 - 8,000 (USD $70 - $160)',
    'Siargao': 'PHP 3,000 - 8,000 (USD $60 - $160)',
    'Davao': 'PHP 2,500 - 7,000 (USD $50 - $140)',
    'Iloilo': 'PHP 1,800 - 5,500 (USD $35 - $110)',
  };
  return prices[destination] || 'PHP 1,500 - 6,000';
};

const getRandomDomesticAirline = (): string => {
  return 'Philippine Airlines, Cebu Pacific, AirAsia';
};

// Main component
const PopularDestinations: React.FC = () => {
  const [flightRoutes, setFlightRoutes] = useState<FlightRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  
  // Create flight routes on component mount
  useEffect(() => {
    const manila = locations.find(loc => loc.name === 'Manila')!;
    
    // Create routes from Manila to popular destinations
    const domesticRoutes = locations
      .filter(loc => loc.type === 'domestic')
      .map(loc => ({
        from: manila,
        to: loc,
        airline: getRandomDomesticAirline(),
        duration: getDomesticFlightDuration(loc.name),
        price: getDomesticFlightPrice(loc.name),
      }));
    
    setFlightRoutes(domesticRoutes);
  }, []);
  
  // Get appropriate icon for location type, considering hover state
  const getMarkerIcon = (location: Location) => {
    if (hoveredLocation && hoveredLocation.name === location.name) {
      return location.type === 'manila' ? largeGoldIcon : largeRedIcon;
    }
    return location.type === 'manila' ? goldIcon : redIcon;
  };
  
  // Calculate map bounds to fit all locations
  const getBounds = () => {
    if (locations.length === 0) return [[0, 0], [0, 0]];
    return locations.map(loc => loc.coordinates);
  };
  
  return (
    <>
      <MapWrapper>
        <MapContainer 
          center={[12.8797, 121.7740]} // Center of Philippines
          zoom={6} 
          style={{ height: '100%', width: '100%' }}
          bounds={getBounds() as L.LatLngBoundsExpression}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render flight routes with hover effects */}
          {flightRoutes.map((route) => (
            <Polyline 
              key={`${route.from.name}-${route.to.name}`}
              positions={[route.from.coordinates, route.to.coordinates]}
              color={COLORS.RUSTY_BLUE_ACCENT}
              weight={selectedRoute === route || hoveredLocation === route.to ? 4 : 2}
              opacity={selectedRoute === route || hoveredLocation === route.to ? 0.9 : 0.5}
              dashArray="5, 5"
              eventHandlers={{
                click: () => setSelectedRoute(route),
                mouseover: () => setSelectedRoute(route),
                mouseout: () => setSelectedRoute(null),
              }}
            >
              <Tooltip direction="center" permanent={hoveredLocation === route.to} opacity={0.8}>
                {route.to.name}
              </Tooltip>
            </Polyline>
          ))}
          
          {/* Render markers for each location with hover effects */}
          {locations.map((location) => (
            <Marker 
              key={location.name} 
              position={location.coordinates}
              icon={getMarkerIcon(location)}
              eventHandlers={{
                mouseover: () => setHoveredLocation(location),
                mouseout: () => setHoveredLocation(null),
                click: () => {
                  if (location.type === 'domestic') {
                    const route = flightRoutes.find(r => r.to.name === location.name);
                    if (route) setSelectedRoute(route);
                  }
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                <strong>{location.name}</strong>
                {location.type === 'domestic' && (
                  <>
                    <div>
                      Flight time: {getDomesticFlightDuration(location.name)}
                    </div>
                    {location.highlights && (
                      <div style={{ marginTop: '5px' }}>
                        <strong>Look forward to:</strong>
                        <ul style={{ margin: '3px 0 0 15px', padding: 0, fontSize: '0.85rem' }}>
                          {location.highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </Tooltip>
              <Popup>
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.description}</p>
                  {location.type === 'domestic' && (
                    <>
                      <p>
                        <strong>From Manila:</strong><br />
                        Duration: {getDomesticFlightDuration(location.name)}<br />
                        Price: {getDomesticFlightPrice(location.name)}<br />
                        Airlines: {getRandomDomesticAirline()}
                      </p>
                      {location.highlights && (
                        <div>
                          <strong>What to look forward to:</strong>
                          <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                            {location.highlights.map((highlight, index) => (
                              <li key={index}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Map Legend */}
          <MapLegend>
            <h4 style={{ margin: '0 0 8px 0' }}>Legend</h4>
            <LegendItem>
              <LegendColor color={COLORS.RUSTY_BLUE_ACCENT} />
              <span>Flight Routes</span>
            </LegendItem>
            <LegendItem>
              <div style={{ width: '15px', height: '15px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'gold', borderRadius: '50%' }} />
              </div>
              <span>Manila (Wedding Location)</span>
            </LegendItem>
            <LegendItem>
              <div style={{ width: '15px', height: '15px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'red', borderRadius: '50%' }} />
              </div>
              <span>Popular Destinations</span>
            </LegendItem>
          </MapLegend>
        </MapContainer>
      </MapWrapper>
      
      {/* Flight information display with enhanced styling */}
      {selectedRoute && (
        <FlightInfoCard>
          <h3 style={{ margin: '0 0 10px 0', color: COLORS.DARK_RUSTY_BLUE }}>
            Manila to {selectedRoute.to.name}
          </h3>
          <p><strong>Duration:</strong> {selectedRoute.duration}</p>
          <p><strong>Price Range:</strong> {selectedRoute.price}</p>
          <p><strong>Airlines:</strong> {selectedRoute.airline}</p>
          <p style={{ fontStyle: 'italic', marginTop: '10px' }}>{selectedRoute.to.description}</p>
          
          {selectedRoute.to.highlights && (
            <div style={{ marginTop: '15px' }}>
              <strong style={{ color: COLORS.DARK_RUSTY_BLUE }}>What to look forward to in {selectedRoute.to.name}:</strong>
              <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 20px' }}>
                {selectedRoute.to.highlights.map((highlight, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}
          
          <p style={{ fontSize: '0.9rem', marginTop: '15px' }}>
            <strong>Travel Tip:</strong> Book domestic flights at least 2-3 months in advance for the best rates.
          </p>
        </FlightInfoCard>
      )}
    </>
  );
};

export default PopularDestinations;
