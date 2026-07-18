-- ====================================================================
-- REDEEM-N.FUN (RNF) SUPABASE DATABASE SCHEMA & SEED DATA
-- Run this in your Supabase SQL Editor to initialize the database tables.
-- ====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS rnf_redemptions;
DROP TABLE IF EXISTS rnf_activities;
DROP TABLE IF EXISTS rnf_faqs;
DROP TABLE IF EXISTS rnf_events;
DROP TABLE IF EXISTS rnf_partners;
DROP TABLE IF EXISTS rnf_categories;
DROP TABLE IF EXISTS rnf_settings;
DROP TABLE IF EXISTS rnf_users;

-- ==========================================
-- 1. SETTINGS TABLE
-- ==========================================
CREATE TABLE rnf_settings (
  id TEXT PRIMARY KEY,
  "splashLogo" TEXT
);

INSERT INTO rnf_settings (id, "splashLogo") 
VALUES ('default', '/favicon.png')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. CATEGORIES TABLE
-- ==========================================
CREATE TABLE rnf_categories (
  id TEXT PRIMARY KEY,
  name JSONB NOT NULL,
  color TEXT,
  icon TEXT
);

INSERT INTO rnf_categories (id, name, color, icon) VALUES 
('eat', '{"ko": "식당 / 카페", "en": "Eat / Cafe", "id": "Makan / Kafe"}'::jsonb, 'bg-yellow-400', 'Utensils'),
('nightlife', '{"ko": "나이트라이프", "en": "Nightlife", "id": "Dunia Malam"}'::jsonb, 'bg-blue-500', 'Moon'),
('stay', '{"ko": "숙소", "en": "Stay", "id": "Penginapan"}'::jsonb, 'bg-red-500', 'Bed'),
('wellness', '{"ko": "웰니스", "en": "Wellness", "id": "Kesehatan"}'::jsonb, 'bg-green-400', 'Heart')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. PARTNERS TABLE
-- ==========================================
CREATE TABLE rnf_partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "categoryId" TEXT REFERENCES rnf_categories(id) ON DELETE SET NULL,
  distance FLOAT,
  eta INTEGER,
  description JSONB,
  logo TEXT,
  instagram TEXT,
  whatsapp TEXT,
  website TEXT,
  bestsellers JSONB DEFAULT '[]'::jsonb,
  coupons JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  "googleMapsUrl" TEXT,
  latitude FLOAT,
  longitude FLOAT,
  tier TEXT DEFAULT 'basic',
  "isAdFeatured" BOOLEAN DEFAULT false,
  "adBannerUrl" TEXT,
  "adText" JSONB,
  banner TEXT
);

-- Seed Initial Partners
INSERT INTO rnf_partners (id, name, "categoryId", distance, eta, description, logo, instagram, whatsapp, website, bestsellers, coupons, images, latitude, longitude, tier, "isAdFeatured", "adBannerUrl", "adText", banner) VALUES
(
  'p1',
  'Lima Bay',
  'eat',
  1.5,
  6,
  '{"ko": "아름다운 수영장이 있는 트렌디한 카페 & 풀 다이닝.", "en": "Trendy cafe & pool dining with a beautiful swimming pool.", "id": "Kafe & bersantap di tepi kolam yang trendi dengan kolam renang yang indah."}'::jsonb,
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=150&q=80',
  'https://www.instagram.com/limabay.bali',
  'https://wa.me/',
  '',
  '[{"name": {"ko": "브런치 플래터", "en": "Brunch Platter", "id": "Platter Brunch"}, "price": "85K IDR", "image": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=200&q=80"}, {"name": {"ko": "아이스 라떼", "en": "Iced Latte", "id": "Es Latte"}, "price": "45K IDR", "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=200&q=80"}]'::jsonb,
  '[{"id": "c1", "type": "free", "title": {"ko": "전체 메뉴 10% 할인", "en": "10% off all menu", "id": "Diskon 10% semua menu"}, "code": "MOGGU-LIMA"}, {"id": "c1-redeem", "cost": 500, "type": "redeem", "title": {"ko": "무료 음료 교환권", "en": "Free Drink Voucher", "id": "Voucher Minuman Gratis"}, "code": "LIMA-FREE-DRINK"}]'::jsonb,
  '["https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=400&q=80", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"]'::jsonb,
  -8.6478,
  115.1385,
  'vip',
  true,
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
  '{"ko": "🔥 이번 주말 리마 베이에서 선셋 풀 파티! 앱 회원 무료 웰컴 칵테일 증정!", "en": "🔥 Sunset Pool Party at Lima Bay this weekend! Free Welcome Cocktails for App Members!", "id": "🔥 Sunset Pool Party di Lima Bay akhir pekan ini! Koktail Selamat Datang Gratis untuk Anggota!"}'::jsonb,
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80'
),
(
  'p2',
  'Word Bali',
  'eat',
  2.1,
  8,
  '{"ko": "맛있는 커피와 디저트, 여유로운 분위기를 즐길 수 있는 카페.", "en": "A cafe where you can enjoy delicious coffee, desserts, and a relaxed atmosphere.", "id": "Kafe di mana Anda dapat menikmati kopi, makanan penutup yang lezat, dan suasana santai."}'::jsonb,
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80',
  'https://www.instagram.com/word.bali',
  'https://wa.me/',
  '',
  '[{"name": {"ko": "시그니처 커피", "en": "Signature Coffee", "id": "Kopi Khas"}, "price": "50K IDR", "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80"}]'::jsonb,
  '[{"id": "c2", "type": "free", "title": {"ko": "음료 주문 시 쿠키 증정", "en": "Free cookie with drink", "id": "Kue gratis dengan minuman"}, "code": "MOGGU-WORD"}, {"id": "c2-redeem", "cost": 1200, "type": "redeem", "title": {"ko": "무료 디저트 세트", "en": "Free Dessert Set", "id": "Set Makanan Penutup Gratis"}, "code": "WORD-DESSERT"}]'::jsonb,
  '["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"]'::jsonb,
  -8.6505,
  115.1309,
  'premium',
  false,
  NULL,
  NULL,
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
),
(
  'p3',
  'Nude cafe',
  'eat',
  0.9,
  3,
  '{"ko": "식단과 스무디볼을 제공하는 인기 카페.", "en": "A popular cafe in Canggu offering healthy meals and smoothie bowls.", "id": "Kafe populer di Canggu yang menawarkan makanan sehat dan mangkuk smoothie."}'::jsonb,
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=150&q=80',
  'https://www.instagram.com/nudebali',
  'https://wa.me/',
  '',
  '[{"name": {"ko": "누드볼 (Nude Bowl)", "en": "Nude Bowl", "id": "Nude Bowl"}, "price": "70K IDR", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80"}]'::jsonb,
  '[{"id": "c3", "type": "free", "title": {"ko": "식사 10% 할인", "en": "10% off meals", "id": "Diskon 10% untuk makanan"}, "code": "MOGGU-NUDE"}]'::jsonb,
  '["https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80"]'::jsonb,
  -8.6550,
  115.1432,
  'basic',
  false,
  NULL,
  NULL,
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. EVENTS TABLE
-- ==========================================
CREATE TABLE rnf_events (
  id TEXT PRIMARY KEY,
  title JSONB NOT NULL,
  date TEXT NOT NULL,
  image TEXT NOT NULL,
  description JSONB,
  "buttonText" JSONB,
  "buttonLink" TEXT
);

INSERT INTO rnf_events (id, title, date, image, description, "buttonText", "buttonLink") VALUES
(
  'e1',
  '{"ko": "어쿠스틱 라이브 나이트", "en": "Acoustic Live Night", "id": "Malam Live Akustik"}'::jsonb,
  'Every Friday 7PM',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  '{"ko": "감미로운 음악과 함께하는 금요일 밤.", "en": "Unwind with sweet acoustic melodies under the stars.", "id": "Santai dengan melodi akustik yang manis di bawah bintang-bintang."}'::jsonb,
  '{"ko": "테이블 예약", "en": "Book Table", "id": "Pesan Meja"}'::jsonb,
  'https://wa.me/'
),
(
  'e2',
  '{"ko": "선셋 요가 클래스", "en": "Sunset Yoga Session", "id": "Sesi Yoga Matahari Terbenam"}'::jsonb,
  'Wed & Sat 5PM',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
  '{"ko": "바다 전망의 웰니스 힐링 요가.", "en": "Find your inner peace with Canggu ocean views.", "id": "Temukan kedamaian batin Anda dengan pemandangan laut Canggu."}'::jsonb,
  '{"ko": "지금 참가하기", "en": "Join Now", "id": "Gabung Sekarang"}'::jsonb,
  'https://wa.me/'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. FAQS TABLE
-- ==========================================
CREATE TABLE rnf_faqs (
  id TEXT PRIMARY KEY,
  question JSONB NOT NULL,
  answer JSONB NOT NULL
);

INSERT INTO rnf_faqs (id, question, answer) VALUES
(
  'faq1',
  '{"ko": "포인트를 어떻게 적립하나요?", "en": "How do I earn points?", "id": "Bagaimana cara mengumpulkan poin?"}'::jsonb,
  '{"ko": "앱 가입, 프로필 완성, 매일 출석체크, 제휴 가맹점 방문 시 QR 코드를 스캔하여 적립할 수 있습니다.", "en": "You can earn points by completing your profile, claiming daily check-ins, or scanning QR codes when visiting partner venues.", "id": "Anda dapat mengumpulkan poin dengan melengkapi profil, klaim check-in harian, atau memindai kode QR saat mengunjungi mitra."}'::jsonb
),
(
  'faq2',
  '{"ko": "포인트는 어떻게 사용하나요?", "en": "How can I spend my points?", "id": "Bagaimana cara menukarkan poin saya?"}'::jsonb,
  '{"ko": "적립된 포인트로 지갑 탭의 유료 교환 상품 쿠폰을 구매한 뒤 가맹점에서 제시하여 혜택을 받을 수 있습니다.", "en": "Navigate to the Wallet tab, buy any high-value discount vouchers with your points, and show them to the vendor staff to redeem.", "id": "Buka tab Dompet, beli voucher diskon bernilai tinggi dengan poin Anda, dan tunjukkan ke staf mitra untuk ditukarkan."}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. USERS TABLE
-- ==========================================
CREATE TABLE rnf_users (
  id TEXT PRIMARY KEY,
  name TEXT,
  avatar TEXT,
  points INTEGER DEFAULT 0,
  "profileCompleted" BOOLEAN DEFAULT false,
  "savedCoupons" JSONB DEFAULT '[]'::jsonb,
  "checkedInAt" JSONB,
  email TEXT,
  "pointLogs" JSONB DEFAULT '[]'::jsonb,
  "subscribedToNotifications" BOOLEAN DEFAULT false,
  whatsapp TEXT,
  instagram TEXT,
  dob TEXT,
  "lastBirthdayRewardYear" INTEGER,
  "lastDailyClaimDate" TEXT,
  "contactRequests" JSONB DEFAULT '[]'::jsonb,
  "claimedVipBenefits" JSONB DEFAULT '[]'::jsonb,
  password TEXT
);

INSERT INTO rnf_users (id, name, avatar, points, "profileCompleted", "savedCoupons", email, whatsapp, instagram, dob, "pointLogs", "contactRequests", password) VALUES
(
  'u1',
  'Explorer',
  'https://i.pravatar.cc/150?img=68',
  84320,
  false,
  '[]'::jsonb,
  'hello.goplus@gmail.com',
  '+6281234567890',
  'explorer_bali',
  '1997-07-14',
  '[{"id": "l1", "title": {"ko": "무료 맥주 쿠폰 교환", "en": "Redeemed Coupon: Free Beer", "id": "Penukaran Kupon: Bir Gratis"}, "points": -1000, "timestamp": 1784320000000, "partnerName": "Lima Bay", "couponCode": "LIMABEER"}, {"id": "l5", "title": {"ko": "🎁 [프로모션] 신규 가입 웰컴 음료 쿠폰 획득", "en": "🎁 [Promo] New Registration Free Welcome Drink", "id": "🎁 [Promo] Kupon Minuman Selamat Datang Registrasi Baru"}, "points": 0, "timestamp": 1784100000000, "partnerName": "redeem-n.fun", "isPromo": true}]'::jsonb,
  '[]'::jsonb,
  '123456'
),
(
  'u2',
  'Nikki V.',
  'https://i.pravatar.cc/150?img=47',
  95000,
  true,
  '[]'::jsonb,
  'nikki.v@outlook.com',
  '+6281299988877',
  'nikki_bali',
  '1998-05-12',
  '[]'::jsonb,
  '[]'::jsonb,
  '123456'
),
(
  'u3',
  'Ji-won Park',
  'https://i.pravatar.cc/150?img=32',
  72100,
  true,
  '[]'::jsonb,
  'jiwon@naver.com',
  '+821012345678',
  'jiwon_bali',
  '1995-11-20',
  '[]'::jsonb,
  '[]'::jsonb,
  '123456'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 7. ACTIVITIES TABLE
-- ==========================================
CREATE TABLE rnf_activities (
  id TEXT PRIMARY KEY,
  "partnerName" TEXT,
  timestamp BIGINT,
  action TEXT
);

-- ==========================================
-- 8. REDEMPTIONS TABLE
-- ==========================================
CREATE TABLE rnf_redemptions (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES rnf_users(id) ON DELETE SET NULL,
  "userName" TEXT,
  "userAge" INTEGER,
  "userEmail" TEXT,
  "couponId" TEXT,
  "couponTitle" JSONB,
  "partnerId" TEXT REFERENCES rnf_partners(id) ON DELETE SET NULL,
  "partnerName" TEXT,
  timestamp BIGINT,
  "pointsSpent" INTEGER,
  status TEXT
);

-- Disable RLS for all tables to allow server access via Anon Key
ALTER TABLE rnf_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE rnf_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE rnf_partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE rnf_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE rnf_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE rnf_faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE rnf_redemptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE rnf_activities DISABLE ROW LEVEL SECURITY;
