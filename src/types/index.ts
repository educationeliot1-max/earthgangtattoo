// ============================================
// EARTHGANG O.G. Tattoo Studio — Types
// ============================================

// ---------- User & Auth ----------
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  preferred_language: 'th' | 'en' | 'zh';
  membership_tier: MembershipTier;
  loyalty_points: number;
  created_at: string;
}

// ---------- Membership ----------
export type MembershipTier = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface MembershipPlan {
  tier: MembershipTier;
  name_th: string;
  name_en: string;
  name_zh: string;
  price_thb: number;
  price_per_month: number;
  discount_percent: number;
  free_touchups: number;
  points_multiplier: number;
  color: string;
  icon: string;
  badge_color: string;
  benefits_th: string[];
  benefits_en: string[];
  benefits_zh: string[];
}

// ---------- Loyalty Points ----------
export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earn' | 'redeem' | 'bonus' | 'expire';
  description: string;
  booking_id?: string;
  created_at: string;
}

export interface PointsRedemptionRate {
  tier: MembershipTier;
  points_per_100thb: number; // Points earned per 100 THB spent
  thb_per_100points: number; // THB discount per 100 points redeemed
}

// ---------- Artist ----------
export interface Artist {
  id: string;
  name: string;
  nickname: string;
  bio_th: string;
  bio_en: string;
  bio_zh: string;
  specialties: TattooStyle[];
  instagram?: string;
  avatar_url: string;
  portfolio_images: string[];
  is_active: boolean;
  available_days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  booking_lead_hours: number;
}

// ---------- Tattoo Styles ----------
export type TattooStyle =
  | 'blackwork'
  | 'fineline'
  | 'traditional'
  | 'neotraditional'
  | 'geometric'
  | 'watercolor'
  | 'japanese'
  | 'thai'
  | 'realism'
  | 'custom';

// ---------- Services ----------
export interface Service {
  id: string;
  name_th: string;
  name_en: string;
  name_zh: string;
  description_th: string;
  description_en: string;
  description_zh: string;
  style: TattooStyle;
  base_price_thb: number;
  price_unit: 'fixed' | 'per_hour' | 'per_piece' | 'quote';
  duration_hours: number;
  image_url: string;
  is_active: boolean;
}

// ---------- Booking ----------
export type BookingStatus =
  | 'pending'
  | 'deposit_paid'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface TimeSlot {
  time: string;       // "10:00"
  available: boolean;
  artist_id?: string;
}

export interface Booking {
  id: string;
  booking_ref: string; // EG-2026-0001
  user_id: string;
  user?: User;
  artist_id: string;
  artist?: Artist;
  service_id: string;
  service?: Service;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  duration_hours: number;
  total_price_thb: number;
  deposit_thb: number;
  remaining_thb: number;
  discount_applied: number;
  points_redeemed: number;
  status: BookingStatus;
  notes?: string;
  tattoo_placement?: string;
  tattoo_size?: string;
  reference_images?: string[];
  payment_method?: 'stripe' | 'promptpay' | 'cash';
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  artist_id: string;
  service_id: string;
  date: string;
  time: string;
  notes?: string;
  tattoo_placement: string;
  tattoo_size: string;
  reference_images?: File[];
  payment_method: 'stripe' | 'promptpay';
  redeem_points: number;
}

// ---------- Portfolio ----------
export interface PortfolioItem {
  id: string;
  artist_id: string;
  artist?: Artist;
  style: TattooStyle;
  image_url: string;
  thumbnail_url: string;
  title?: string;
  placement?: string;
  is_featured: boolean;
  created_at: string;
}

// ---------- Payment ----------
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount_thb: number;
  method: 'stripe' | 'promptpay' | 'cash';
  status: PaymentStatus;
  stripe_payment_intent_id?: string;
  promptpay_ref?: string;
  paid_at?: string;
  created_at: string;
}

// ---------- Notifications ----------
export interface NotificationPayload {
  booking: Booking;
  type: 'booking_created' | 'deposit_paid' | 'reminder_24h' | 'reminder_2h' | 'completed' | 'cancelled';
  channel: 'line' | 'whatsapp' | 'email';
}

// ---------- Admin ----------
export interface DashboardStats {
  total_bookings_today: number;
  total_revenue_month: number;
  active_members: number;
  total_loyalty_points_issued: number;
  bookings_by_status: Record<BookingStatus, number>;
  revenue_by_artist: { artist_name: string; revenue: number }[];
  popular_services: { service_name: string; count: number }[];
}

// ---------- i18n ----------
export type Locale = 'th' | 'en' | 'zh';
