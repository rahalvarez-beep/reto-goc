import { UserRole, AccidentType, AccidentSeverity, BikeLaneCondition } from '@prisma/client';

// User Types
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  notifications: boolean;
  language: string;
  theme: 'light' | 'dark';
  emailUpdates: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
  refreshToken: string;
}

// Accident Types
export interface IAccident {
  id: string;
  location: string;
  type: AccidentType;
  severity: AccidentSeverity;
  date: Date;
  description?: string;
  latitude: number;
  longitude: number;
  reportedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccidentDto {
  location: string;
  type: AccidentType;
  severity: AccidentSeverity;
  date: Date;
  description?: string;
  latitude: number;
  longitude: number;
}

export interface AccidentFilters {
  type?: AccidentType;
  severity?: AccidentSeverity;
  startDate?: Date;
  endDate?: Date;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

// Traffic Data Types
export interface ITrafficData {
  id: string;
  street: string;
  speed: number;
  volume: number;
  direction: string;
  timestamp: Date;
}

export interface CreateTrafficDataDto {
  street: string;
  speed: number;
  volume: number;
  direction: string;
}

// Bike Lane Types
export interface IBikeLane {
  id: string;
  name: string;
  length: number;
  condition: BikeLaneCondition;
  usage: number;
  latitude: number;
  longitude: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBikeLaneDto {
  name: string;
  length: number;
  condition: BikeLaneCondition;
  latitude: number;
  longitude: number;
  description?: string;
}

// City Zone Types
export interface ICityZone {
  id: string;
  name: string;
  type: string;
  coordinates: any; // GeoJSON.Polygon
  population?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface INotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  userId: string;
  createdAt: Date;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: string;
  userId: string;
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

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Request Types
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Dashboard Analytics
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
  byType: Record<AccidentType, number>;
  bySeverity: Record<AccidentSeverity, number>;
  thisMonth: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: 'accident' | 'bikeLane' | 'traffic';
  data: any;
  popup?: string;
}
