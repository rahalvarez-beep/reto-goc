import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { 
  BarChart3, 
  MapPin, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  Bike,
  Car
} from 'lucide-react';
import { DashboardStats, AccidentStats } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [accidentStats, setAccidentStats] = useState<AccidentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch accident statistics
        const accidentResponse = await apiService.accidents.getStats();
        setAccidentStats(accidentResponse.data.data);
        
        // Mock dashboard stats (in a real app, this would come from an API)
        setStats({
          totalUsers: 10247,
          totalAccidents: 523,
          accidentsThisMonth: 45,
          averageResponseTime: 4.2,
          bikeLaneUsage: 78,
          trafficVolume: 1250
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats?.totalUsers.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Accidentes Reportados',
      value: stats?.totalAccidents.toLocaleString() || '0',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '-8%',
      changeType: 'negative' as const,
    },
    {
      title: 'Tiempo de Respuesta',
      value: `${stats?.averageResponseTime || 0} min`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '-15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Uso de Ciclovías',
      value: `${stats?.bikeLaneUsage || 0}%`,
      icon: Bike,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+5%',
      changeType: 'positive' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Ver Mapa',
      description: 'Explora accidentes y tráfico en tiempo real',
      icon: MapPin,
      href: '/map',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Reportar Accidente',
      description: 'Notifica un incidente de tráfico',
      icon: AlertTriangle,
      href: '/accidents/new',
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      title: 'Ver Estadísticas',
      description: 'Análisis detallados de la ciudad',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Gestionar Perfil',
      description: 'Actualiza tu información personal',
      icon: Users,
      href: '/profile',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Aquí tienes un resumen de la actividad de tu ciudad
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className={`${action.color} text-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-1`}
                >
                  <div className="flex items-center mb-3">
                    <Icon className="h-6 w-6 mr-3" />
                    <h3 className="font-semibold">{action.title}</h3>
                  </div>
                  <p className="text-sm opacity-90">{action.description}</p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accident Types Chart */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tipos de Accidentes
            </h3>
            {accidentStats ? (
              <div className="space-y-3">
                {Object.entries(accidentStats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {type.toLowerCase().replace('_', ' ')}
                    </span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${(count / accidentStats.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>

          {/* Accident Severity Chart */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Severidad de Accidentes
            </h3>
            {accidentStats ? (
              <div className="space-y-3">
                {Object.entries(accidentStats.bySeverity).map(([severity, count]) => {
                  const colors = {
                    MINOR: 'bg-green-500',
                    MODERATE: 'bg-yellow-500',
                    SEVERE: 'bg-orange-500',
                    FATAL: 'bg-red-500',
                  };
                  return (
                    <div key={severity} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {severity.toLowerCase()}
                      </span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`${colors[severity as keyof typeof colors]} h-2 rounded-full`}
                            style={{
                              width: `${(count / accidentStats.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Nuevo accidente reportado en Main St & Oak Ave
                </p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Ciclovía en Park Ave actualizada
                </p>
                <p className="text-xs text-gray-500">Hace 1 hora</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Tráfico pesado reportado en Broadway
                </p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
