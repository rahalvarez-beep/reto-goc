import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { apiService } from '@/services/api';
import { Accident, BikeLane, MapMarker } from '@/types';
import { AlertTriangle, Bike, Car, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color: string, icon: any) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <div style="transform: rotate(45deg); color: white; font-size: 14px;">
        ${icon}
      </div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const accidentIcon = createCustomIcon('#ef4444', '⚠️');
const bikeLaneIcon = createCustomIcon('#22c55e', '🚴');
const trafficIcon = createCustomIcon('#3b82f6', '🚗');

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  showAccidents?: boolean;
  showBikeLanes?: boolean;
  showTraffic?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
}

const MapView: React.FC<MapViewProps> = ({
  center = [40.7128, -74.0060], // Default to NYC coordinates
  zoom = 13,
  showAccidents = true,
  showBikeLanes = true,
  showTraffic = false,
  onMarkerClick,
}) => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [bikeLanes, setBikeLanes] = useState<BikeLane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = [];
        
        if (showAccidents) {
          promises.push(apiService.accidents.getAll({ limit: 100 }));
        }
        
        if (showBikeLanes) {
          // Mock bike lanes data (in a real app, this would come from an API)
          const mockBikeLanes: BikeLane[] = [
            {
              id: '1',
              name: 'Main Street Bike Lane',
              length: 2.5,
              condition: 'EXCELLENT',
              usage: 150,
              latitude: 40.7128,
              longitude: -74.0060,
              description: 'Protected bike lane with barriers',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Oak Avenue Cycle Path',
              length: 1.8,
              condition: 'GOOD',
              usage: 120,
              latitude: 40.7589,
              longitude: -73.9851,
              description: 'Shared bike lane with markings',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: '3',
              name: 'Park Avenue Bikeway',
              length: 3.2,
              condition: 'FAIR',
              usage: 95,
              latitude: 40.7505,
              longitude: -73.9934,
              description: 'Bike lane with some maintenance needed',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          setBikeLanes(mockBikeLanes);
        }

        if (promises.length > 0) {
          const results = await Promise.all(promises);
          if (showAccidents && results[0]) {
            setAccidents(results[0].data.data || []);
          }
        }
      } catch (err: any) {
        console.error('Error fetching map data:', err);
        setError(err.message || 'Error al cargar los datos del mapa');
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [showAccidents, showBikeLanes, showTraffic]);

  const getAccidentColor = (severity: string) => {
    switch (severity) {
      case 'MINOR': return '#22c55e';
      case 'MODERATE': return '#f59e0b';
      case 'SEVERE': return '#ef4444';
      case 'FATAL': return '#991b1b';
      default: return '#6b7280';
    }
  };

  const getBikeLaneColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT': return '#22c55e';
      case 'GOOD': return '#84cc16';
      case 'FAIR': return '#f59e0b';
      case 'POOR': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Accident Markers */}
        {showAccidents && accidents.map((accident) => (
          <Marker
            key={`accident-${accident.id}`}
            position={[accident.latitude, accident.longitude]}
            icon={createCustomIcon(getAccidentColor(accident.severity), '⚠️')}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick({
                    id: accident.id,
                    latitude: accident.latitude,
                    longitude: accident.longitude,
                    type: 'accident',
                    data: accident,
                    popup: `${accident.type} - ${accident.severity}`,
                  });
                }
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {accident.location}
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Tipo:</strong> {accident.type}</p>
                  <p><strong>Severidad:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      accident.severity === 'MINOR' ? 'bg-green-100 text-green-800' :
                      accident.severity === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                      accident.severity === 'SEVERE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {accident.severity}
                    </span>
                  </p>
                  <p><strong>Fecha:</strong> {new Date(accident.date).toLocaleDateString()}</p>
                  {accident.description && (
                    <p><strong>Descripción:</strong> {accident.description}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bike Lane Markers */}
        {showBikeLanes && bikeLanes.map((bikeLane) => (
          <Marker
            key={`bike-${bikeLane.id}`}
            position={[bikeLane.latitude, bikeLane.longitude]}
            icon={createCustomIcon(getBikeLaneColor(bikeLane.condition), '🚴')}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick({
                    id: bikeLane.id,
                    latitude: bikeLane.latitude,
                    longitude: bikeLane.longitude,
                    type: 'bikeLane',
                    data: bikeLane,
                    popup: `${bikeLane.name} - ${bikeLane.condition}`,
                  });
                }
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {bikeLane.name}
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Longitud:</strong> {bikeLane.length} km</p>
                  <p><strong>Condición:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      bikeLane.condition === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                      bikeLane.condition === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                      bikeLane.condition === 'FAIR' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bikeLane.condition}
                    </span>
                  </p>
                  <p><strong>Uso:</strong> {bikeLane.usage} usuarios/día</p>
                  {bikeLane.description && (
                    <p><strong>Descripción:</strong> {bikeLane.description}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
