// ──────────────────────────────────────────────
// TypeScript interfaces for Local Vendor Marketplace
// ──────────────────────────────────────────────

// ─── User Roles ─────────────────────────────
export type UserRole = 'customer' | 'vendor' | 'admin';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type VendorVerificationStatus = 'pending' | 'approved' | 'rejected';

// ─── GeoJSON ────────────────────────────────
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// ─── User ───────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location?: GeoPoint;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

// ─── Vendor Profile ─────────────────────────
export interface VendorProfile {
  _id: string;
  userId: string;
  user?: User;
  businessName: string;
  description: string;
  categories: string[];
  services: Service[];
  location: GeoPoint;
  address: string;
  coverImage?: string;
  gallery: string[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  verified: VendorVerificationStatus;
  availability: WeeklyAvailability;
  createdAt: string;
  updatedAt: string;
  distance?: number; // calculated from geo query
}

export interface WeeklyAvailability {
  monday: DaySlot[];
  tuesday: DaySlot[];
  wednesday: DaySlot[];
  thursday: DaySlot[];
  friday: DaySlot[];
  saturday: DaySlot[];
  sunday: DaySlot[];
}

export interface DaySlot {
  start: string; // "09:00"
  end: string;   // "17:00"
}

// ─── Service ────────────────────────────────
export interface Service {
  _id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Booking ────────────────────────────────
export interface Booking {
  _id: string;
  customerId: string;
  customer?: User;
  vendorId: string;
  vendor?: VendorProfile;
  serviceId: string;
  service?: Service;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  notes?: string;
  totalAmount: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  vendorId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  address: string;
}

// ─── Review ─────────────────────────────────
export interface Review {
  _id: string;
  bookingId: string;
  customerId: string;
  customer?: User;
  vendorId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  bookingId: string;
  vendorId: string;
  rating: number;
  text: string;
}

// ─── Chat ───────────────────────────────────
export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface ChatThread {
  _id: string;
  participant: User;
  lastMessage: ChatMessage;
  unreadCount: number;
}

// ─── Category ───────────────────────────────
export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

// ─── API Response ───────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Vendor Discovery Params ────────────────
export interface VendorSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // km
  category?: string;
  search?: string;
  minRating?: number;
  sortBy?: 'distance' | 'rating' | 'price';
  page?: number;
  limit?: number;
}

// ─── Admin Analytics ────────────────────────
export interface PlatformAnalytics {
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
  totalRevenue: number;
  activeVendors: number;
  pendingApprovals: number;
  bookingsToday: number;
  revenueToday: number;
}
