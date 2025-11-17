// User types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  photoURL?: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string | any;
  updatedAt: string | any;
  lastLogin?: string | any;
  profileComplete?: boolean;
  preferences?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  };
}

// Booking types
export interface Booking {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  vehicleId?: string;
  vehicleType: string;
  vehicleName?: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation?: string;
  returnLocation?: string;
  message?: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  totalPrice?: number;
  totalDays?: number;
  insuranceAdded?: boolean;
  insurancePrice?: number;
  advancePayment?: number;
  remainingAmount?: number;
  paymentStatus: "pending" | "partial" | "completed";
  paymentMethod?: string;
  notes?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

// Vehicle types
export interface Vehicle {
  id?: string;
  name: string;
  type: "car" | "bike";
  category: string;
  brand?: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  price: number;
  discount?: number;
  discountType?: "percentage" | "fixed";
  finalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  specifications?: {
    fuelType?: string;
    transmission?: string;
    seats?: number;
    mileage?: string;
    color?: string;
  };
  isAvailable: boolean;
  bookings?: string[]; // Array of booking IDs
  maintenanceHistory?: MaintenanceRecord[];
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  documents?: {
    registrationCert?: string;
    insurancePolicy?: string;
    pollutionCert?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Maintenance record
export interface MaintenanceRecord {
  id?: string;
  vehicleId: string;
  date: string;
  type: "regular" | "repair" | "inspection";
  cost: number;
  description: string;
  nextDueDate?: string;
  completedBy?: string;
}

// Contact message
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  reply?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Admin dashboard stats
export interface DashboardStats {
  totalUsers: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalVehicles: number;
  availableVehicles: number;
  pendingMessages: number;
  bookingsByStatus: {
    pending: number;
    confirmed: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  revenueByMonth: Array<{
    month: string;
    amount: number;
  }>;
}

// Email templates
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email notification
export interface EmailNotification {
  id?: string;
  to: string;
  subject: string;
  template: string;
  templateData: Record<string, any>;
  status: "pending" | "sent" | "failed";
  sentAt?: string;
  failureReason?: string;
}

// Admin settings
export interface AdminSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  notificationEmail: string;
  smtpSettings?: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  smsSettings?: {
    provider: string;
    apiKey: string;
  };
  bookingSettings?: {
    minAdvancePaymentPercentage: number;
    cancellationChargePercentage: number;
    maxDaysInAdvance: number;
  };
  emailNotifications?: {
    newBooking: boolean;
    bookingConfirmed: boolean;
    bookingCompleted: boolean;
    bookingCancelled: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
  };
}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query filters
export interface BookingFilter {
  status?: Booking["status"];
  vehicleType?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  sortBy?: "createdAt" | "pickupDate" | "totalPrice";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface UserFilter {
  role?: "user" | "admin";
  isActive?: boolean;
  sortBy?: "createdAt" | "displayName" | "email";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface VehicleFilter {
  type?: "car" | "bike";
  category?: string;
  isAvailable?: boolean;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  search?: string;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}
