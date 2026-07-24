export interface LocalizedString {
  ko: string;
  en: string;
  id: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  color: string;
  icon: string;
}

export interface Coupon {
  id: string;
  type: 'free' | 'redeem' | 'event';
  title: LocalizedString;
  code: string;
  cost?: number; // Cost in points if type is 'redeem'
}

export interface Promo {
  id: string;
  name: string;
  code: string;
  type: 'free' | 'discount_nominal' | 'discount_percent' | 'cashback' | 'bogo' | 'other';
  discountValue?: number; // for nominal or percent
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  terms: string;
  isActive: boolean;
}

export interface Partner {
  id: string;
  name: string;
  categoryId: string;
  distance: number;
  eta: number;
  description: LocalizedString;
  logo: string;
  instagram: string;
  whatsapp: string;
  website: string;
  bestsellers: { name: LocalizedString; price: string; image?: string; description?: string }[];
  coupons: Coupon[];
  images: string[];
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  tier?: 'basic' | 'premium' | 'vip';
  isAdFeatured?: boolean;
  adBannerUrl?: string;
  adText?: LocalizedString;
  banner?: string;
  videoUrl?: string;
  menuUrl?: string;
  // Vendor auth & approval
  vendorPassword?: string;
  vendorLoginWhatsapp?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  // Promos
  promos?: Promo[];
}

export interface AppEvent {
  id: string;
  title: LocalizedString;
  date: string;
  image: string;
  description?: LocalizedString;
  buttonText?: LocalizedString;
  buttonLink?: string;
  // Vendor-created events
  partnerId?: string;
}

export interface PointLog {
  id: string;
  title: LocalizedString;
  points: number; // Positive for earnings, negative for spend/redeem, 0 for saved only
  timestamp: number;
  partnerName?: string;
  couponCode?: string;
  isPromo?: boolean;
}

export interface ContactRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  profileCompleted: boolean;
  savedCoupons: string[]; // array of coupon codes or IDs
  checkedInAt?: { partnerId: string; timestamp: number };
  email?: string;
  pointLogs?: PointLog[];
  subscribedToNotifications?: boolean;
  whatsapp?: string;
  instagram?: string;
  dob?: string; // Birthdate YYYY-MM-DD
  lastBirthdayRewardYear?: number; // Year of last claimed birthday reward
  lastDailyClaimDate?: string; // YYYY-MM-DD
  contactRequests?: ContactRequest[]; // Incoming requests to share WhatsApp contact info
  claimedVipBenefits?: string[]; // VIP Partner IDs where visit benefit was claimed
  password?: string;
}

export interface Redemption {
  id: string;
  userId: string;
  userName: string;
  userAge: number;
  userEmail?: string;
  couponId: string;
  couponCode: string;
  couponTitle: LocalizedString;
  partnerId: string;
  partnerName: string;
  timestamp: number;
}

export interface Faq {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface Activity {
  id: string;
  userName: string;
  userAvatar: string;
  partnerName: string;
  timestamp: number;
}

export interface AppSettings {
  id?: string;
  splashLogo: string;
  adminId?: string;
  adminPassword?: string;
}

export interface ClickData {
  [key: string]: number;
}
