import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { COLORS } from '../constants/theme';

// Fix for default marker icons in Leaflet with webpack
// This is needed because webpack handles assets differently
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

const blueIcon = createCustomIcon('blue');
const redIcon = createCustomIcon('red');
const goldIcon = createCustomIcon('gold');

// Styled components
const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  margin: 40px 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const MapControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const MapButton = styled.button<{ active?: boolean }>`
  padding: 10px 15px;
  background-color: ${props => props.active ? COLORS.DARK_RUSTY_BLUE : 'white'};
  color: ${props => props.active ? 'white' : COLORS.DARK_RUSTY_BLUE};
  border: 1px solid ${COLORS.DARK_RUSTY_BLUE};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? COLORS.DARK_RUSTY_BLUE : COLORS.LIGHT_RUSTY_BLUE};
    color: ${props => props.active ? 'white' : COLORS.DARK_RUSTY_BLUE};
    transform: translateY(-2px);
  }
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

// Types
interface Location {
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  type: 'international' | 'domestic' | 'manila';
  description?: string;
}

interface FlightRoute {
  from: Location;
  to: Location;
  airline: string;
  flightNumber?: string;
  duration: string;
  price: string;
}

// Data
const locations: Location[] = [
  // Manila (destination hub)
  { name: 'Manila', coordinates: [14.5995, 120.9842], type: 'manila', description: 'Wedding Destination' },
  
  // International origins
  { name: 'Sydney', coordinates: [-33.8688, 151.2093], type: 'international', description: 'Direct flights available' },
  { name: 'Melbourne', coordinates: [-37.8136, 144.9631], type: 'international', description: 'Direct flights available' },
  { name: 'Toronto', coordinates: [43.6532, -79.3832], type: 'international', description: 'Direct flights via Philippine Airlines' },
  { name: 'Vancouver', coordinates: [49.2827, -123.1207], type: 'international', description: 'Direct flights available' },
  { name: 'Los Angeles', coordinates: [34.0522, -118.2437], type: 'international', description: 'Direct flights available' },
  { name: 'San Francisco', coordinates: [37.7749, -122.4194], type: 'international', description: 'Direct flights available' },
  { name: 'New York', coordinates: [40.7128, -74.0060], type: 'international', description: 'Connecting flights available' },
  
  // Domestic destinations
  { name: 'Cebu', coordinates: [10.3157, 123.8854], type: 'domestic', description: 'Pristine beaches and coral reefs' },
  { name: 'Bohol', coordinates: [9.8500, 124.1435], type: 'domestic', description: 'Famous for Chocolate Hills and tarsiers' },
  { name: 'Boracay', coordinates: [11.9674, 121.9248], type: 'domestic', description: 'White Beach and water activities' },
  { name: 'Palawan', coordinates: [10.1925, 118.9045], type: 'domestic', description: 'Underground River and limestone cliffs' },
  { name: 'Siargao', coordinates: [9.8482, 126.0458], type: 'domestic', description: 'Surfing capital of the Philippines' },
];

// Flight routes
const createFlightRoutes = (): FlightRoute[] => {
  const manila = locations.find(loc => loc.name === 'Manila')!;
  
  // Create routes from international locations to Manila
  const internationalRoutes = locations
    .filter(loc => loc.type === 'international')
    .map(loc => ({
      from: loc,
      to: manila,
      airline: getRandomAirline(loc.name),
      duration: getFlightDuration(loc.name),
      price: getFlightPrice(loc.name),
    }));
  
  // Create routes from Manila to domestic locations
  const domesticRoutes = locations
    .filter(loc => loc.type === 'domestic')
    .map(loc => ({
      from: manila,
      to: loc,
      airline: getRandomDomesticAirline(),
      duration: getDomesticFlightDuration(loc.name),
      price: getDomesticFlightPrice(loc.name),
    }));
  
  return [...internationalRoutes, ...domesticRoutes];
};

// Helper functions for flight data
const getRandomAirline = (origin: string): string => {
  const airlines = {
    'Sydney': 'Qantas, Philippine Airlines, Cebu Pacific',
    'Melbourne': 'Philippine Airlines, Cebu Pacific',
    'Toronto': 'Philippine Airlines, Cathay Pacific',
    'Vancouver': 'Philippine Airlines, Air Canada',
    'Los Angeles': 'Philippine Airlines, Cathay Pacific',
    'San Francisco': 'Philippine Airlines, United Airlines',
    'New York': 'Philippine Airlines, Korean Air',
  };
  return airlines[origin as keyof typeof airlines] || 'Multiple Airlines';
};

const getRandomDomesticAirline = (): string => {
  const airlines = ['Philippine Airlines', 'Cebu Pacific', 'AirAsia'];
  return airlines.join(', ');
};

const getFlightDuration = (origin: string): string => {
  const durations = {
    'Sydney': '~8-9 hours',
    'Melbourne': '~9-10 hours',
    'Toronto': '~16-17 hours',
    'Vancouver': '~13-16 hours',
    'Los Angeles': '~15-17 hours',
    'San Francisco': '~15-16 hours',
    'New York': '~20-22 hours',
  };
  return durations[origin as keyof typeof durations] || 'Varies';
};

const getDomesticFlightDuration = (destination: string): string => {
  const durations = {
    'Cebu': '~1h 20m',
    'Bohol': '~1h 30m',
    'Boracay': '~1h 10m',
    'Palawan': '~1h 30m',
    'Siargao': '~2h 30m',
  };
  return durations[destination as keyof typeof durations] || '~1-2 hours';
};

const getFlightPrice = (origin: string): string => {
  const prices = {
    'Sydney': 'AUD $600 - $1,200',
    'Melbourne': 'AUD $650 - $1,300',
    'Toronto': 'CAD $1,200 - $2,000',
    'Vancouver': 'CAD $1,000 - $1,800',
    'Los Angeles': 'USD $700 - $1,500',
    'San Francisco': 'USD $550 - $1,200',
    'New York': 'USD $800 - $1,700',
  };
  return prices[origin as keyof typeof prices] || 'Varies';
};

const getDomesticFlightPrice = (destination: string): string => {
  const prices = {
    'Cebu': 'PHP 1,500 - 5,000 (USD $30 - $100)',
    'Bohol': 'PHP 2,000 - 6,000 (USD $40 - $120)',
    'Boracay': 'PHP 1,800 - 6,500 (USD $35 - $130)',
    'Palawan': 'PHP 1,500 - 6,000 (USD $30 - $120)',
    'Siargao': 'PHP 3,000 - 8,000 (USD $60 - $160)',
  };
  return prices[destination as keyof typeof prices] || 'PHP 1,500 - 6,000';
};

// Main component
const InteractiveFlightMap: React.FC = () => {
  const [activeView, setActiveView] = useState<'all' | 'international' | 'domestic'>('all');
  const [flightRoutes] = useState<FlightRoute[]>(createFlightRoutes());
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  
  // Filter locations based on active view
  const filteredLocations = locations.filter(loc => {
    if (activeView === 'all') return true;
    if (activeView === 'international' && (loc.type === 'international' || loc.type === 'manila')) return true;
    if (activeView === 'domestic' && (loc.type === 'domestic' || loc.type === 'manila')) return true;
    return false;
  });
  
  // Filter routes based on active view
  const filteredRoutes = flightRoutes.filter(route => {
    if (activeView === 'all') return true;
    if (activeView === 'international' && route.from.type === 'international') return true;
    if (activeView === 'domestic' && route.to.type === 'domestic') return true;
    return false;
  });
  
  // Get appropriate icon for location type
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'manila':
        return goldIcon;
      case 'international':
        return blueIcon;
      case 'domestic':
        return redIcon;
      default:
        return blueIcon;
    }
  };
  
  // Calculate map bounds based on visible locations
  const getBounds = () => {
    if (filteredLocations.length === 0) return [[0, 0], [0, 0]];
    return filteredLocations.map(loc => loc.coordinates);
  };
  
  return (
    <>
      <MapControls>
        <MapButton 
          active={activeView === 'all'} 
          onClick={() => setActiveView('all')}
        >
          All Routes
        </MapButton>
        <MapButton 
          active={activeView === 'international'} 
          onClick={() => setActiveView('international')}
        >
          International Flights
        </MapButton>
        <MapButton 
          active={activeView === 'domestic'} 
          onClick={() => setActiveView('domestic')}
        >
          Domestic Flights
        </MapButton>
      </MapControls>
      
      <MapWrapper>
        <MapContainer 
          center={[14.5995, 120.9842]} // Manila coordinates
          zoom={3} 
          style={{ height: '100%', width: '100%' }}
          bounds={getBounds() as L.LatLngBoundsExpression}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render markers for each location */}
          {filteredLocations.map((location) => (
            <Marker 
              key={location.name} 
              position={location.coordinates}
              icon={getMarkerIcon(location.type)}
            >
              <Popup>
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.description}</p>
                  {location.type === 'international' && (
                    <p>
                      <strong>To Manila:</strong><br />
                      Duration: {getFlightDuration(location.name)}<br />
                      Price: {getFlightPrice(location.name)}<br />
                      Airlines: {getRandomAirline(location.name)}
                    </p>
                  )}
                  {location.type === 'domestic' && (
                    <p>
                      <strong>From Manila:</strong><br />
                      Duration: {getDomesticFlightDuration(location.name)}<br />
                      Price: {getDomesticFlightPrice(location.name)}<br />
                      Airlines: {getRandomDomesticAirline()}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Render flight routes */}
          {filteredRoutes.map((route, index) => (
            <Polyline 
              key={`${route.from.name}-${route.to.name}`}
              positions={[route.from.coordinates, route.to.coordinates]}
              color={route.from.type === 'international' ? COLORS.PRIMARY_RUSTY_BLUE : COLORS.RUSTY_BLUE_ACCENT}
              weight={selectedRoute === route ? 4 : 2}
              opacity={selectedRoute === route ? 0.8 : 0.5}
              dashArray={route.from.type === 'international' ? '' : '5, 5'}
              eventHandlers={{
                click: () => setSelectedRoute(route),
                mouseover: () => setSelectedRoute(route),
                mouseout: () => setSelectedRoute(null),
              }}
            />
          ))}
          
          {/* Map Legend */}
          <MapLegend>
            <h4 style={{ margin: '0 0 8px 0' }}>Legend</h4>
            <LegendItem>
              <LegendColor color={COLORS.PRIMARY_RUSTY_BLUE} />
              <span>International Flights</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color={COLORS.RUSTY_BLUE_ACCENT} />
              <span>Domestic Flights</span>
            </LegendItem>
            <LegendItem>
              <div style={{ width: '15px', height: '15px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'gold', borderRadius: '50%' }} />
              </div>
              <span>Manila (Wedding Location)</span>
            </LegendItem>
            <LegendItem>
              <div style={{ width: '15px', height: '15px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'blue', borderRadius: '50%' }} />
              </div>
              <span>International Cities</span>
            </LegendItem>
            <LegendItem>
              <div style={{ width: '15px', height: '15px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'red', borderRadius: '50%' }} />
              </div>
              <span>Domestic Destinations</span>
            </LegendItem>
          </MapLegend>
        </MapContainer>
      </MapWrapper>
      
      {/* Flight information display */}
      {selectedRoute && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          marginTop: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>
            {selectedRoute.from.type === 'international' 
              ? `${selectedRoute.from.name} to ${selectedRoute.to.name}` 
              : `${selectedRoute.from.name} to ${selectedRoute.to.name}`}
          </h3>
          <p><strong>Duration:</strong> {selectedRoute.duration}</p>
          <p><strong>Price Range:</strong> {selectedRoute.price}</p>
          <p><strong>Airlines:</strong> {selectedRoute.airline}</p>
          <p>{selectedRoute.to.description || selectedRoute.from.description}</p>
        </div>
      )}
    </>
  );
};

export default InteractiveFlightMap; 