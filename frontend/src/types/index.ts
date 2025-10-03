// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  role: 'CITIZEN' | 'ADMIN' | 'OPERATOR';
  isActive: boolean;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: boolean;
  language: string;
  theme: 'light' | 'dark';
  emailUpdates: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Accident Types
export interface Accident {
  id: string;
  location: string;
  type: 'COLLISION' | 'PEDESTRIAN' | 'ROLLOVER' | 'MOTORCYCLE' | 'BICYCLE' | 'OTHER';
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'FATAL';
  date: string;
  description?: string;
  latitude: number;
  longitude: number;
  reportedBy?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAccidentData {
  location: string;
  type: Accident['type'];
  severity: Accident['severity'];
  date: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export interface AccidentFilters {
  type?: Accident['type'];
  severity?: Accident['severity'];
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Bike Lane Types
export interface BikeLane {
  id: string;
  name: string;
  length: number;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  usage: number;
  latitude: number;
  longitude: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Traffic Data Types
export interface TrafficData {
  id: string;
  street: string;
  speed: number;
  volume: number;
  direction: string;
  timestamp: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalAccidents: number;
  accidentsThisMonth: number;
  averageResponseTime: number;
  bikeLaneUsage: number;
  trafficVolume: number;
}

export interface AccidentStats {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  thisMonth: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'stable';
}

// Map Types
export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: 'accident' | 'bikeLane' | 'traffic';
  data: any;
  popup?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
  value?: any;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Theme Types
export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title: string;
  requiresAuth?: boolean;
  roles?: string[];
}

// Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

// Filter Types
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface LocationFilter {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
}

// Search Types
export interface SearchParams {
  query: string;
  filters: Record<string, any>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}
