import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Accident, AccidentFilters } from '@/types';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  MapPin,
  Clock,
  User
} from 'lucide-react';

const AccidentsPage: React.FC = () => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AccidentFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAccidents();
  }, [filters]);

  const fetchAccidents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.accidents.getAll(filters);
      setAccidents(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching accidents:', err);
      setError(err.message || 'Error al cargar los accidentes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'MINOR': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'SEVERE': return 'bg-red-100 text-red-800';
      case 'FATAL': return 'bg-red-900 text-red-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'COLLISION': return 'bg-blue-100 text-blue-800';
      case 'PEDESTRIAN': return 'bg-purple-100 text-purple-800';
      case 'MOTORCYCLE': return 'bg-orange-100 text-orange-800';
      case 'BICYCLE': return 'bg-green-100 text-green-800';
      case 'ROLLOVER': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando accidentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reportes de Accidentes
          </h1>
          <p className="text-gray-600">
            Gestiona y visualiza todos los accidentes reportados en la ciudad
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ubicación, tipo o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  type: e.target.value || undefined,
                  page: 1 
                }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los tipos</option>
                <option value="COLLISION">Colisión</option>
                <option value="PEDESTRIAN">Atropello</option>
                <option value="MOTORCYCLE">Motocicleta</option>
                <option value="BICYCLE">Bicicleta</option>
                <option value="ROLLOVER">Volcamiento</option>
                <option value="OTHER">Otro</option>
              </select>

              <select
                value={filters.severity || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  severity: e.target.value || undefined,
                  page: 1 
                }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas las severidades</option>
                <option value="MINOR">Leve</option>
                <option value="MODERATE">Moderado</option>
                <option value="SEVERE">Grave</option>
                <option value="FATAL">Fatal</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {accidents.length} accidentes encontrados
            </span>
          </div>
          
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Reportar Accidente
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Accidents List */}
        {accidents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron accidentes
            </h3>
            <p className="text-gray-600">
              {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay accidentes reportados aún'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accidents.map((accident) => (
              <div key={accident.id} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {accident.location}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(accident.type)}`}>
                        {accident.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(accident.severity)}`}>
                        {accident.severity}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(accident.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(accident.date).toLocaleTimeString()}
                      </div>
                    </div>

                    {accident.description && (
                      <p className="text-gray-600 mb-3">{accident.description}</p>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {accident.user ? (
                        <span>Reportado por {accident.user.firstName} {accident.user.lastName}</span>
                      ) : (
                        <span>Reporte anónimo</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <MapPin className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {accidents.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
                disabled={filters.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700">
                Página {filters.page}
              </span>
              
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccidentsPage;
