import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  BarChart3, 
  Shield, 
  Users, 
  Zap, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Mapas Interactivos',
      description: 'Visualiza accidentes, tráfico y ciclovías en tiempo real',
    },
    {
      icon: BarChart3,
      title: 'Análisis de Datos',
      description: 'Estadísticas detalladas y reportes de la ciudad',
    },
    {
      icon: Shield,
      title: 'Gestión de Identidad',
      description: 'Sistema seguro de autenticación y perfiles ciudadanos',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Conecta con otros ciudadanos y autoridades',
    },
    {
      icon: Zap,
      title: 'Tiempo Real',
      description: 'Notificaciones instantáneas y actualizaciones en vivo',
    },
    {
      icon: Globe,
      title: 'Accesible',
      description: 'Interfaz intuitiva disponible en múltiples dispositivos',
    },
  ];

  const stats = [
    { label: 'Ciudadanos Registrados', value: '10,000+' },
    { label: 'Accidentes Reportados', value: '500+' },
    { label: 'Ciclovías Monitoreadas', value: '50+' },
    { label: 'Tiempo de Respuesta', value: '< 5 min' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenido a{' '}
              <span className="text-accent-400">Smart City</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              El futuro de la gestión urbana inteligente. Conecta, participa y 
              contribuye al desarrollo de tu ciudad.
            </p>
            
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg text-lg transition-colors shadow-lg"
              >
                Ir al Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg text-lg transition-colors shadow-lg"
                >
                  Registrarse
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold rounded-lg text-lg transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre todas las funcionalidades que hacen de Smart City 
              la plataforma más completa para la gestión urbana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-soft hover:shadow-medium transition-shadow border border-gray-100"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para ser parte del cambio?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de ciudadanos que ya están transformando su ciudad 
            con tecnología inteligente.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg text-lg transition-colors shadow-lg"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold rounded-lg text-lg transition-colors"
              >
                Ya tengo cuenta
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beneficios para la Ciudad
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma no solo beneficia a los ciudadanos, 
              sino que transforma la forma en que las ciudades operan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Mayor Seguridad
                </h3>
              </div>
              <p className="text-gray-600">
                Reportes rápidos de accidentes y respuesta inmediata de emergencias.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Eficiencia Urbana
                </h3>
              </div>
              <p className="text-gray-600">
                Optimización del tráfico y mejor planificación de infraestructura.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Participación Ciudadana
                </h3>
              </div>
              <p className="text-gray-600">
                Mayor involucramiento de los ciudadanos en la toma de decisiones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Smart City</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transformando ciudades a través de la tecnología inteligente
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Smart City Identity Management. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
