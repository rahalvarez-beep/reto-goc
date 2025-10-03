import React, { useState } from 'react';
import MapView from '@/components/Map/MapView';
import { MapPin, Filter, Layers, RefreshCw } from 'lucide-react';

const MapPage: React.FC = () => {
  const [showAccidents, setShowAccidents] = useState(true);
  const [showBikeLanes, setShowBikeLanes] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mapa Interactivo
          </h1>
          <p className="text-gray-600">
            Explora accidentes, ciclovías y tráfico en tiempo real
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAccidents}
                  onChange={(e) => setShowAccidents(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Accidentes</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showBikeLanes}
                  onChange={(e) => setShowBikeLanes(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Ciclovías</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showTraffic}
                  onChange={(e) => setShowTraffic(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Tráfico</span>
              </label>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mapa de la Ciudad
                </h2>
              </div>
              
              <MapView
                center={[40.7128, -74.0060]}
                zoom={13}
                showAccidents={showAccidents}
                showBikeLanes={showBikeLanes}
                showTraffic={showTraffic}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Legend */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Leyenda
                </h3>
                
                <div className="space-y-3">
                  {showAccidents && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Accidentes
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Leve</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Moderado</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Grave</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-800 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Fatal</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {showBikeLanes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Ciclovías
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Excelente</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Bueno</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Regular</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">Malo</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Marker Info */}
              {selectedMarker && (
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información Detallada
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        {selectedMarker.type === 'accident' ? 'Accidente' : 
                         selectedMarker.type === 'bikeLane' ? 'Ciclovía' : 'Tráfico'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedMarker.popup}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Coordenadas: {selectedMarker.latitude.toFixed(4)}, {selectedMarker.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas Rápidas
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accidentes hoy</span>
                    <span className="text-sm font-medium text-gray-900">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ciclovías activas</span>
                    <span className="text-sm font-medium text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Velocidad promedio</span>
                    <span className="text-sm font-medium text-gray-900">35 km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
