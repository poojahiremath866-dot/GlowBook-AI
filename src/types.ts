export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  city?: string;
  parlorId?: string; // If owner
  createdAt: string;
}

export type ServiceCategory = 'hair' | 'skin' | 'nails' | 'makeup' | 'spa' | 'threading';

export interface Service {
  id: string;
  parlorId?: string;
  parlorName?: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  image: string;
  rating: number;
  reviewCount: number;
  popular?: boolean;
  benefits?: string[];
  genderSuitability?: 'all' | 'women' | 'men';
}

export interface Beautician {
  id: string;
  parlorId: string;
  parlorName: string;
  name: string;
  role?: string;
  avatar: string;
  experienceYears: number;
  specialization: string;
  rating: number;
  reviewCount: number;
  bio: string;
  servicesOffered: string[];
  workingHours: string;
  availableDays: string[];
  bookedSlots?: { [date: string]: string[] };
}

export interface Parlor {
  id: string;
  name: string;
  ownerId?: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  coverImage: string;
  gallery: string[];
  openingHours: string;
  distanceKm: number;
  availableToday: boolean;
  verified: boolean;
  featured?: boolean;
  type: 'Luxury Salon' | 'Boutique Parlor' | 'Eco Spa' | 'Bridal Studio' | 'Express Salon';
  amenities: string[];
  serviceCategories: ServiceCategory[];
}

export interface BeautyPackage {
  id: string;
  name: string;
  occasion: string;
  description: string;
  parlorId: string;
  parlorName: string;
  services?: { name: string; price: number; duration: number }[];
  servicesIncluded?: string[];
  includedServices?: string[];
  originalPrice: number;
  packagePrice: number;
  discountedPrice?: number;
  discountPercentage?: number;
  discountPercent?: number;
  estimatedDurationMinutes?: number;
  durationMinutes?: number;
  image: string;
  rating: number;
  reviewCount?: number;
  recommendedBeautician?: string;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  discount: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  validUntil: string;
  parlorId?: string;
  parlorName?: string;
  description: string;
  image: string;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  parlorId: string;
  parlorName: string;
  parlorAddress: string;
  serviceId?: string;
  serviceName: string;
  packageId?: string;
  packageName?: string;
  beauticianId: string;
  beauticianName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  durationMinutes: number;
  price: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'rescheduled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: 'stripe' | 'razorpay' | 'upi' | 'pay_at_salon';
  paymentId?: string;
  specialRequests?: string;
  createdAt: string;
  reviewed?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  parlorId: string;
  serviceName?: string;
  beauticianName?: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[];
  verifiedBooking?: boolean;
}

export interface AIRecommendation {
  id: string;
  occasion: string;
  budget: number;
  preferredStyle: string;
  availableTime: string;
  targetDate?: string;
  packageName: string;
  overview: string;
  recommendedServices: {
    name: string;
    description: string;
    estimatedCost: number;
    duration: string;
  }[];
  totalEstimatedCost: number;
  totalEstimatedDuration: string;
  suggestedParlor: {
    id: string;
    name: string;
    city: string;
    rating: number;
  };
  suggestedBeautician: {
    id: string;
    name: string;
    specialization: string;
  };
  proStylingTips: string[];
  prepChecklist: string[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string; payload?: any }[];
  suggestedPackage?: Partial<BeautyPackage>;
}

export interface StyleAnalysisResult {
  hairRecommendations: {
    style: string;
    description: string;
    maintenance: string;
  }[];
  makeupRecommendations: {
    look: string;
    palette: string[];
    description: string;
  }[];
  colorCoordination: {
    paletteName: string;
    hexCodes: string[];
    advice: string;
  };
  occasionGuidance: string;
  suggestedServices: string[];
  disclaimer: string;
}
