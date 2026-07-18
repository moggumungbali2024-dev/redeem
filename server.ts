import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Types
import { Partner, Category, AppSettings } from "./src/types";

// In-memory DB
let settings: AppSettings = {
  splashLogo: "/favicon.png",
  adminId: "admin",
  adminPassword: "admin123"
};

let categories: Category[] = [
  { id: "eat", name: { ko: "식당 / 카페", en: "Eat / Cafe", id: "Makan / Kafe" }, color: "bg-yellow-400", icon: "Utensils" },
  { id: "nightlife", name: { ko: "나이트라이프", en: "Nightlife", id: "Dunia Malam" }, color: "bg-blue-500", icon: "Moon" },
  { id: "stay", name: { ko: "숙소", en: "Stay", id: "Penginapan" }, color: "bg-red-500", icon: "Bed" },
  { id: "wellness", name: { ko: "웰니스", en: "Wellness", id: "Kesehatan" }, color: "bg-green-400", icon: "Heart" },
];

let partners: Partner[] = [
  {
    id: "p1",
    name: "Lima Bay",
    categoryId: "eat",
    distance: 1.5,
    eta: 6,
    description: { 
      ko: "아름다운 수영장이 있는 트렌디한 카페 & 풀 다이닝.", 
      en: "Trendy cafe & pool dining with a beautiful swimming pool.", 
      id: "Kafe & bersantap di tepi kolam yang trendi dengan kolam renang yang indah." 
    },
    logo: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=150&q=80",
    instagram: "https://www.instagram.com/limabay.bali?igsh=MTl1cXZ0YnlpZnVxZA==",
    whatsapp: "https://wa.me/",
    website: "",
    bestsellers: [
      { name: { ko: "브런치 플래터", en: "Brunch Platter", id: "Platter Brunch" }, price: "85K IDR", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=200&q=80" },
      { name: { ko: "아이스 라떼", en: "Iced Latte", id: "Es Latte" }, price: "45K IDR", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=200&q=80" }
    ],
    coupons: [
      { id: "c1", type: "free", title: { ko: "전체 메뉴 10% 할인", en: "10% off all menu", id: "Diskon 10% semua menu" }, code: "MOGGU-LIMA" },
      { id: "c1-redeem", type: "redeem", cost: 500, title: { ko: "무료 음료 교환권", en: "Free Drink Voucher", id: "Voucher Minuman Gratis" }, code: "LIMA-FREE-DRINK" }
    ],
    images: [
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"
    ],
    latitude: -8.6478,
    longitude: 115.1385,
    banner: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80",
    tier: "vip",
    isAdFeatured: true,
    adBannerUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80",
    adText: {
      ko: "🔥 이번 주말 리마 베이에서 선셋 풀 파티! 앱 회원 무료 웰컴 칵테일 증정!",
      en: "🔥 Sunset Pool Party at Lima Bay this weekend! Free Welcome Cocktails for App Members!",
      id: "🔥 Sunset Pool Party di Lima Bay akhir pekan ini! Koktail Selamat Datang Gratis untuk Anggota!"
    }
  },
  {
    id: "p2",
    name: "Word Bali",
    categoryId: "eat",
    distance: 2.1,
    eta: 8,
    description: {
      ko: "맛있는 커피와 디저트, 여유로운 분위기를 즐길 수 있는 카페.",
      en: "A cafe where you can enjoy delicious coffee, desserts, and a relaxed atmosphere.",
      id: "Kafe di mana Anda dapat menikmati kopi, makanan penutup yang lezat, dan suasana santai."
    },
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80",
    instagram: "https://www.instagram.com/word.bali?igsh=MTV4cG83eGhoamk5dg==",
    whatsapp: "https://wa.me/",
    website: "",
    bestsellers: [
      { name: { ko: "시그니처 커피", en: "Signature Coffee", id: "Kopi Khas" }, price: "50K IDR", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80" }
    ],
    coupons: [
      { id: "c2", type: "free", title: { ko: "음료 주문 시 쿠키 증정", en: "Free cookie with drink", id: "Kue gratis dengan minuman" }, code: "MOGGU-WORD" },
      { id: "c2-redeem", type: "redeem", cost: 1200, title: { ko: "무료 디저트 세트", en: "Free Dessert Set", id: "Set Makanan Penutup Gratis" }, code: "WORD-DESSERT" }
    ],
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"
    ],
    latitude: -8.6505,
    longitude: 115.1309,
    banner: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    tier: "premium"
  },
  {
    id: "p3",
    name: "Nude cafe",
    categoryId: "eat",
    distance: 0.9,
    eta: 3,
    description: {
      ko: "짱구에서 인기 있는 건강한 식단과 스무디볼을 제공하는 카페.",
      en: "A popular cafe in Canggu offering healthy meals and smoothie bowls.",
      id: "Kafe populer di Canggu yang menawarkan makanan sehat dan mangkuk smoothie."
    },
    logo: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=150&q=80",
    instagram: "https://www.instagram.com/nudebali?igsh=YXRxNnV6cWdsZTlz",
    whatsapp: "https://wa.me/",
    website: "",
    bestsellers: [
      { name: { ko: "누드볼 (Nude Bowl)", en: "Nude Bowl", id: "Nude Bowl" }, price: "70K IDR", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80" },
      { name: { ko: "건강 스무디", en: "Healthy Smoothie", id: "Smoothie Sehat" }, price: "55K IDR", image: "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=200&q=80" }
    ],
    coupons: [
      { id: "c3", type: "free", title: { ko: "식사 10% 할인", en: "10% off meals", id: "Diskon 10% untuk makanan" }, code: "MOGGU-NUDE" }
    ],
    images: [
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80"
    ],
    latitude: -8.6550,
    longitude: 115.1432,
    banner: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    tier: "basic"
  },
  {
    id: "p4",
    name: "Little Havana Bali",
    categoryId: "nightlife",
    distance: 1.8,
    eta: 7,
    description: {
      ko: "쿠바의 열기를 느낄 수 있는 짱구의 멋진 펍 & 바.",
      en: "A cool pub & bar in Canggu where you can feel the heat of Cuba.",
      id: "Pub & bar keren di Canggu di mana Anda bisa merasakan panasnya Kuba."
    },
    logo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&q=80",
    instagram: "https://www.instagram.com/littlehavanabali?igsh=ZnEzbGI3ZDNycmpv",
    whatsapp: "https://wa.me/",
    website: "",
    bestsellers: [
      { name: { ko: "모히또", en: "Mojito", id: "Mojito" }, price: "110K IDR", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&q=80" }
    ],
    coupons: [
      { id: "c4", type: "free", title: { ko: "무료 웰컴 샷", en: "Free welcome shot", id: "Tembakan sambutan gratis" }, code: "MOGGU-HAVANA" }
    ],
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80"
    ],
    latitude: -8.6490,
    longitude: 115.1400,
    banner: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    tier: "basic"
  },
  {
    id: "p5",
    name: "Boho canggu",
    categoryId: "stay",
    distance: 2.5,
    eta: 10,
    description: {
      ko: "보헤미안 스타일의 감성적인 숙박 시설. 완벽한 휴식을 위한 곳.",
      en: "Bohemian-style emotional accommodation. A place for perfect relaxation.",
      id: "Akomodasi emosional bergaya Bohemian. Tempat untuk relaksasi yang sempurna."
    },
    logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80",
    instagram: "https://www.instagram.com/boho_canggu?igsh=NGNzdzZqb2Z3dHBm",
    whatsapp: "https://wa.me/",
    website: "",
    bestsellers: [
      { name: { ko: "스탠다드 룸 (1박)", en: "Standard Room (1 night)", id: "Kamar Standar (1 malam)" }, price: "800K IDR", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80" }
    ],
    coupons: [
      { id: "c5", type: "free", title: { ko: "숙박 15% 할인", en: "15% off stay", id: "Diskon 15% menginap" }, code: "MOGGU-BOHO" }
    ],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
    ],
    latitude: -8.6420,
    longitude: 115.1450,
    banner: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    tier: "premium"
  },
  {
    id: "p6",
    name: "PUCO ROOFTOP Coworking Space & Eatery",
    categoryId: "wellness",
    distance: 1.1,
    eta: 4,
    description: {
      ko: "루프탑 코워킹 스페이스와 함께하는 여유로운 웰니스 및 다이닝 경험.",
      en: "A relaxing wellness and dining experience with a rooftop coworking space.",
      id: "Pengalaman kesehatan dan bersantap yang santai dengan ruang coworking di puncak gedung."
    },
    logo: "https://images.unsplash.com/photo-1497215898120-1d00cb81529d?auto=format&fit=crop&w=150&q=80",
    instagram: "https://www.instagram.com/pucorooftop?igsh=MXZoa2RkaWhsbzAzcQ==",
    whatsapp: "https://wa.me/",
    website: "",
    bestsellers: [
      { name: { ko: "원데이 코워킹 패스", en: "1-Day Coworking Pass", id: "Tiket Coworking 1 Hari" }, price: "100K IDR", image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=200&q=80" }
    ],
    coupons: [
      { id: "c6", type: "free", title: { ko: "코워킹 공간 10% 할인", en: "10% off coworking space", id: "Diskon 10% ruang coworking" }, code: "MOGGU-PUCO" }
    ],
    images: [
      "https://images.unsplash.com/photo-1497215898120-1d00cb81529d?auto=format&fit=crop&w=400&q=80"
    ],
    latitude: -8.6515,
    longitude: 115.1325,
    banner: "https://images.unsplash.com/photo-1497215898120-1d00cb81529d?auto=format&fit=crop&w=800&q=80",
    tier: "vip",
    isAdFeatured: true,
    adBannerUrl: "https://images.unsplash.com/photo-1497215898120-1d00cb81529d?auto=format&fit=crop&w=800&q=80",
    adText: {
      ko: "💻 푸코 루프탑: 최고의 디지털 노마드 전용 데일리 코워킹 스페이스 특가!",
      en: "💻 Puco Rooftop: Premium Digital Nomad Coworking Space & Eatery Promo!",
      id: "💻 Puco Rooftop: Ruang Kerja Bersama & Rumah Makan Digital Nomad Premium!"
    }
  }
];

import { User, AppEvent, Faq, Activity, Redemption } from "./src/types";

let users: User[] = [
  {
    id: "u1",
    name: "Explorer",
    avatar: "https://i.pravatar.cc/150?img=68",
    points: 84320,
    profileCompleted: false,
    savedCoupons: [],
    email: "hello.goplus@gmail.com",
    whatsapp: "+6281234567890",
    instagram: "explorer_bali",
    dob: "1997-07-14",
    lastBirthdayRewardYear: undefined,
    lastDailyClaimDate: "",
    contactRequests: [
      {
        id: "req1",
        requesterId: "u2",
        requesterName: "Nikki V.",
        requesterAvatar: "https://i.pravatar.cc/150?img=47",
        status: "pending",
        timestamp: Date.now() - 3600000
      },
      {
        id: "req2",
        requesterId: "u3",
        requesterName: "Ji-won Park",
        requesterAvatar: "https://i.pravatar.cc/150?img=32",
        status: "approved",
        timestamp: Date.now() - 7200000
      }
    ],
    pointLogs: [
      {
        id: "l1",
        title: {
          ko: "무료 맥주 쿠폰 교환",
          en: "Redeemed Coupon: Free Beer",
          id: "Penukaran Kupon: Bir Gratis"
        },
        points: -1000,
        timestamp: Date.now() - 3600000 * 24 * 2, // 2 days ago
        partnerName: "Lima Bay",
        couponCode: "LIMABEER"
      },
      {
        id: "l2",
        title: {
          ko: "구글 리뷰 작성 보상",
          en: "Google Review Reward",
          id: "Ulasan Google"
        },
        points: 500,
        timestamp: Date.now() - 3600000 * 24 * 2 + 1800000, // 2 days ago, slightly later
        partnerName: "Bull's Gym"
      },
      {
        id: "l3",
        title: {
          ko: "가맹점 체크인 보상",
          en: "Partner Check-in Reward",
          id: "Hadiah Check-in Mitra"
        },
        points: 50,
        timestamp: Date.now() - 3600000 * 12, // 12 hours ago
        partnerName: "Moggu Munch"
      },
      {
        id: "l4",
        title: {
          ko: "가맹점 QR 스캔 보상",
          en: "QR Scan Reward",
          id: "Hadiah Pemindaian QR"
        },
        points: 500,
        timestamp: Date.now() - 3600000 * 2, // 2 hours ago
        partnerName: "Remiere Hotel"
      },
      {
        id: "l5",
        title: {
          ko: "🎁 [프로모션] 신규 가입 웰컴 음료 쿠폰 획득",
          en: "🎁 [Promo] New Registration Free Welcome Drink",
          id: "🎁 [Promo] Kupon Minuman Selamat Datang Registrasi Baru"
        },
        points: 0,
        timestamp: Date.now() - 3600000 * 24 * 3, // 3 days ago
        partnerName: "redeem-n.fun",
        isPromo: true
      }
    ]
  },
  {
    id: "u2",
    name: "Nikki V.",
    avatar: "https://i.pravatar.cc/150?img=47",
    points: 95000,
    profileCompleted: true,
    savedCoupons: [],
    email: "nikki.v@outlook.com",
    whatsapp: "+6281299988877",
    instagram: "nikkiv_bali",
    dob: "1998-05-12",
    lastBirthdayRewardYear: 2026,
    lastDailyClaimDate: "",
    contactRequests: [],
    pointLogs: []
  },
  {
    id: "u3",
    name: "Ji-won Park",
    avatar: "https://i.pravatar.cc/150?img=32",
    points: 62400,
    profileCompleted: true,
    savedCoupons: [],
    email: "jiwon.p@naver.com",
    whatsapp: "+821012345678",
    instagram: "jiwon_travels",
    dob: "1999-11-20",
    lastDailyClaimDate: "",
    contactRequests: [],
    pointLogs: []
  },
  {
    id: "u4",
    name: "Agus Saputra",
    avatar: "https://i.pravatar.cc/150?img=11",
    points: 48900,
    profileCompleted: true,
    savedCoupons: [],
    email: "agus.s@gmail.com",
    whatsapp: "+628776543210",
    instagram: "agus_canggu",
    dob: "1995-03-08",
    lastDailyClaimDate: "",
    contactRequests: [],
    pointLogs: []
  },
  {
    id: "u5",
    name: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?img=35",
    points: 31200,
    profileCompleted: true,
    savedCoupons: [],
    email: "sarah.jenkins@gmail.com",
    whatsapp: "+14157778888",
    instagram: "sarah_j",
    dob: "2001-08-25",
    lastDailyClaimDate: "",
    contactRequests: [],
    pointLogs: []
  }
];

let redemptions: Redemption[] = [
  {
    id: "r1",
    userId: "u2",
    userName: "Nikki V.",
    userAge: 28,
    userEmail: "nikki.v@outlook.com",
    couponId: "c1",
    couponCode: "MOGGU-LIMA",
    couponTitle: { ko: "전체 메뉴 10% 할인", en: "10% off all menu", id: "Diskon 10% semua menu" },
    partnerId: "p1",
    partnerName: "Lima Bay",
    timestamp: Date.now() - 3600000 * 5 // 5 hours ago
  },
  {
    id: "r2",
    userId: "u3",
    userName: "Ji-won Park",
    userAge: 26,
    userEmail: "jiwon.p@naver.com",
    couponId: "c1-redeem",
    couponCode: "LIMA-FREE-DRINK",
    couponTitle: { ko: "무료 음료 교환권", en: "Free Drink Voucher", id: "Voucher Minuman Gratis" },
    partnerId: "p1",
    partnerName: "Lima Bay",
    timestamp: Date.now() - 3600000 * 24 // 1 day ago
  },
  {
    id: "r3",
    userId: "u4",
    userName: "Agus Saputra",
    userAge: 31,
    userEmail: "agus.s@gmail.com",
    couponId: "c4",
    couponCode: "MOGGU-HAVANA",
    couponTitle: { ko: "무료 웰컴 샷", en: "Free welcome shot", id: "Tembakan sambutan gratis" },
    partnerId: "p4",
    partnerName: "Little Havana Bali",
    timestamp: Date.now() - 3600000 * 12 // 12 hours ago
  }
];

let events: AppEvent[] = [
  { id: "e1", title: { ko: "비치 클럽 썸머 파티", en: "Beach Club Summer Party", id: "Pesta Musim Panas Klub Pantai" }, date: "2026-08-15", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80" },
  { id: "e2", title: { ko: "요가 앤 웰니스 리트릿", en: "Yoga & Wellness Retreat", id: "Retret Yoga & Kesehatan" }, date: "2026-09-01", image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=600&q=80" }
];

let faqs: Faq[] = [
  {
    id: "faq1",
    question: {
      ko: "어떻게 포인트를 적립하나요?",
      en: "How do I earn points?",
      id: "Bagaimana cara mengumpulkan poin?"
    },
    answer: {
      ko: "제휴점에 방문하여 체크인을 하거나 구글 리뷰를 남기면 각각 50P, 500P의 포인트를 적립받을 수 있습니다.",
      en: "You can earn points by checking in (50 PTS) or leaving a Google review (500 PTS) when visiting partner places.",
      id: "Anda dapat mengumpulkan poin dengan melakukan check-in (50 PTS) atau menulis ulasan Google (500 PTS) saat mengunjungi mitra kami."
    }
  },
  {
    id: "faq2",
    question: {
      ko: "적립된 포인트는 어디에 쓰나요?",
      en: "Where can I spend my points?",
      id: "Di mana saya bisa menukarkan poin?"
    },
    answer: {
      ko: "내 지갑 탭에서 적립한 포인트를 무료 음료나 특별 디저트 쿠폰 등으로 교환하여 가맹점에서 사용할 수 있습니다.",
      en: "You can redeem points for valuable discount coupons, free drinks, or dessert sets in your Wallet tab, then redeem them at partners.",
      id: "Anda dapat menukarkan poin dengan kupon diskon berharga, minuman gratis, atau set hidangan penutup di tab Dompet, lalu menukarkannya di mitra."
    }
  }
];

let activities: Activity[] = [
  {
    id: "act1",
    userName: "Nikki V.",
    userAvatar: "https://i.pravatar.cc/150?img=47",
    partnerName: "Lima Bay",
    timestamp: Date.now() - 300000 // 5 mins ago
  },
  {
    id: "act2",
    userName: "Ji-won Park",
    userAvatar: "https://i.pravatar.cc/150?img=32",
    partnerName: "Word Bali",
    timestamp: Date.now() - 900000 // 15 mins ago
  },
  {
    id: "act3",
    userName: "Agus Saputra",
    userAvatar: "https://i.pravatar.cc/150?img=11",
    partnerName: "Nude cafe",
    timestamp: Date.now() - 1800000 // 30 mins ago
  }
];

const defaultSnapshots = {
  settings: JSON.stringify(settings),
  categories: JSON.stringify(categories),
  partners: JSON.stringify(partners),
  users: JSON.stringify(users),
  redemptions: JSON.stringify(redemptions),
  events: JSON.stringify(events),
  faqs: JSON.stringify(faqs),
  activities: JSON.stringify(activities)
};

// Click analytics tracking (partnerId_platform -> count)
let clicks: Record<string, number> = {};

import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const hasSupabase = !!(supabaseUrl && supabaseAnonKey);
const supabase = hasSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function syncFromSupabase() {
  if (!supabase) {
    console.log("Supabase not configured in server.ts. Operating in-memory mode.");
    return;
  }
  console.log("Initializing sync with Supabase...");

  try {
    // 1. Settings
    const { data: sData, error: sErr } = await supabase.from('rnf_settings').select('*');
    if (!sErr && sData && sData.length > 0) {
      settings = sData[0];
      console.log("Synced settings from Supabase");
    } else if (!sErr) {
      await supabase.from('rnf_settings').insert([settings]);
    }

    // 2. Categories
    const { data: catData, error: catErr } = await supabase.from('rnf_categories').select('*');
    if (!catErr && catData && catData.length > 0) {
      categories = catData;
      console.log("Synced categories from Supabase");
    } else if (!catErr) {
      await supabase.from('rnf_categories').insert(categories);
    }

    // 3. Partners
    const { data: pData, error: pErr } = await supabase.from('rnf_partners').select('*');
    if (!pErr && pData && pData.length > 0) {
      partners = pData;
      console.log("Synced partners from Supabase");
    } else if (!pErr) {
      await supabase.from('rnf_partners').insert(partners);
    }

    // 4. Users
    const { data: uData, error: uErr } = await supabase.from('rnf_users').select('*');
    if (!uErr && uData && uData.length > 0) {
      users = uData;
      console.log("Synced users from Supabase");
    } else if (!uErr) {
      await supabase.from('rnf_users').insert(users);
    }

    // 5. Events
    const { data: eData, error: eErr } = await supabase.from('rnf_events').select('*');
    if (!eErr && eData && eData.length > 0) {
      events = eData;
      console.log("Synced events from Supabase");
    } else if (!eErr) {
      await supabase.from('rnf_events').insert(events);
    }

    // 6. FAQs
    const { data: faqData, error: faqErr } = await supabase.from('rnf_faqs').select('*');
    if (!faqErr && faqData && faqData.length > 0) {
      faqs = faqData;
      console.log("Synced faqs from Supabase");
    } else if (!faqErr) {
      await supabase.from('rnf_faqs').insert(faqs);
    }

    // 7. Redemptions
    const { data: rData, error: rErr } = await supabase.from('rnf_redemptions').select('*');
    if (!rErr && rData && rData.length > 0) {
      redemptions = rData;
      console.log("Synced redemptions from Supabase");
    } else if (!rErr && redemptions.length > 0) {
      await supabase.from('rnf_redemptions').insert(redemptions);
    }

    // 8. Activities
    const { data: actData, error: actErr } = await supabase.from('rnf_activities').select('*');
    if (!actErr && actData && actData.length > 0) {
      activities = actData;
      console.log("Synced activities from Supabase");
    } else if (!actErr && activities.length > 0) {
      await supabase.from('rnf_activities').insert(activities);
    }

    console.log("Supabase initialization and sync completed successfully.");
  } catch (err) {
    console.error("Failed to sync from Supabase. Defaulting to in-memory cache:", err);
  }
}

async function dbUpsert(table: string, data: any) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from(table).upsert(data);
    if (error) console.error(`Error upserting to ${table}:`, error);
  } catch (err) {
    console.error(`Exception upserting to ${table}:`, err);
  }
}

async function dbDelete(table: string, id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) console.error(`Error deleting from ${table}:`, error);
  } catch (err) {
    console.error(`Exception deleting from ${table}:`, err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Run initial sync from Supabase
  await syncFromSupabase();

  app.use(express.json());

  // --- API ROUTES ---

  app.post("/api/admin/reset", async (req, res) => {
    // 1. Reset in-memory states
    settings = JSON.parse(defaultSnapshots.settings);
    categories = JSON.parse(defaultSnapshots.categories);
    partners = JSON.parse(defaultSnapshots.partners);
    users = JSON.parse(defaultSnapshots.users);
    redemptions = JSON.parse(defaultSnapshots.redemptions);
    events = JSON.parse(defaultSnapshots.events);
    faqs = JSON.parse(defaultSnapshots.faqs);
    activities = JSON.parse(defaultSnapshots.activities);
    clicks = {};

    // 2. Wipe and re-insert into Supabase
    if (supabase) {
      try {
        // Delete all rows in order (ignoring foreign keys mostly because we delete all)
        // neq('id', 'nonexistent') is a trick to delete all rows
        await supabase.from('rnf_redemptions').delete().neq('id', 'nonexistent');
        await supabase.from('rnf_activities').delete().neq('id', 'nonexistent');
        await supabase.from('rnf_faqs').delete().neq('id', 'nonexistent');
        await supabase.from('rnf_events').delete().neq('id', 'nonexistent');
        await supabase.from('rnf_partners').delete().neq('id', 'nonexistent');
        await supabase.from('rnf_categories').delete().neq('id', 'nonexistent');
        await supabase.from('rnf_settings').delete().neq('id', 'nonexistent');
        await supabase.from('rnf_users').delete().neq('id', 'nonexistent');

        // Re-insert pristine defaults
        await supabase.from('rnf_settings').insert([settings]);
        await supabase.from('rnf_categories').insert(categories);
        await supabase.from('rnf_partners').insert(partners);
        await supabase.from('rnf_users').insert(users);
        await supabase.from('rnf_events').insert(events);
        await supabase.from('rnf_faqs').insert(faqs);
        await supabase.from('rnf_redemptions').insert(redemptions);
        await supabase.from('rnf_activities').insert(activities);
      } catch (err) {
        console.error("Failed to reset Supabase data:", err);
      }
    }

    res.json({ success: true, message: "Database reset to factory defaults." });
  });

  app.get("/favicon.png", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public/favicon.png"));
  });

  app.get("/api/settings", (req, res) => {
    res.json(settings);
  });

  app.put("/api/settings", async (req, res) => {
    settings = { ...settings, ...req.body };
    await dbUpsert('rnf_settings', settings);
    res.json(settings);
  });

  app.get("/api/categories", (req, res) => {
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const newCat: Category = {
      ...req.body,
      id: Date.now().toString(),
    };
    categories.push(newCat);
    await dbUpsert('rnf_categories', newCat);
    res.json(newCat);
  });

  app.put("/api/categories/:id", async (req, res) => {
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx >= 0) {
      categories[idx] = { ...categories[idx], ...req.body };
      await dbUpsert('rnf_categories', categories[idx]);
      res.json(categories[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    categories = categories.filter(c => c.id !== id);
    await dbDelete('rnf_categories', id);
    res.json({ success: true });
  });

  // Get all partners
  app.get("/api/partners", (req, res) => {
    res.json(partners);
  });

  // Create a partner
  app.post("/api/partners", async (req, res) => {
    const newPartner: Partner = {
      ...req.body,
      id: Date.now().toString(),
    };
    partners.push(newPartner);
    await dbUpsert('rnf_partners', newPartner);
    res.json(newPartner);
  });

  // Update a partner
  app.put("/api/partners/:id", async (req, res) => {
    const idx = partners.findIndex(p => p.id === req.params.id);
    if (idx >= 0) {
      partners[idx] = { ...partners[idx], ...req.body };
      await dbUpsert('rnf_partners', partners[idx]);
      res.json(partners[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // Delete a partner
  app.delete("/api/partners/:id", async (req, res) => {
    const { id } = req.params;
    partners = partners.filter(p => p.id !== id);
    await dbDelete('rnf_partners', id);
    res.json({ success: true });
  });

  // Approve a vendor
  app.put("/api/partners/:id/approve", async (req, res) => {
    const idx = partners.findIndex(p => p.id === req.params.id);
    if (idx >= 0) {
      partners[idx] = { ...partners[idx], approvalStatus: 'approved' };
      await dbUpsert('rnf_partners', partners[idx]);
      res.json({ success: true, partner: partners[idx] });
    } else {
      res.status(404).json({ error: "Partner not found" });
    }
  });

  // Reject a vendor
  app.put("/api/partners/:id/reject", async (req, res) => {
    const idx = partners.findIndex(p => p.id === req.params.id);
    if (idx >= 0) {
      partners[idx] = { ...partners[idx], approvalStatus: 'rejected' };
      await dbUpsert('rnf_partners', partners[idx]);
      res.json({ success: true, partner: partners[idx] });
    } else {
      res.status(404).json({ error: "Partner not found" });
    }
  });

  // Vendor self-registration (onboarding)
  app.post("/api/vendor/register", async (req, res) => {
    const { name, categoryId, description, vendorLoginWhatsapp, vendorPassword, logo, banner, instagram, whatsapp, website, googleMapsUrl } = req.body;
    if (!name || !vendorLoginWhatsapp || !vendorPassword) {
      return res.status(400).json({ error: "Name, WhatsApp and Password are required" });
    }
    // Check if already registered
    const existing = partners.find(p => p.vendorLoginWhatsapp === vendorLoginWhatsapp);
    if (existing) {
      return res.status(400).json({ error: "WhatsApp sudah terdaftar sebagai vendor" });
    }
    // Try geocoding from googleMapsUrl
    let lat = req.body.latitude || null;
    let lng = req.body.longitude || null;
    if (!lat && googleMapsUrl) {
      // Extract @lat,lng from Google Maps URL
      const match = googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) { lat = parseFloat(match[1]); lng = parseFloat(match[2]); }
    }
    const newPartner: Partner = {
      id: "p" + Date.now(),
      name,
      categoryId: categoryId || 'eat',
      distance: 1.0,
      eta: 10,
      description: description || { ko: '', en: '', id: '' },
      logo: logo || '',
      banner: banner || '',
      instagram: instagram || '',
      whatsapp: whatsapp || '',
      website: website || '',
      bestsellers: [],
      coupons: [],
      images: [],
      googleMapsUrl: googleMapsUrl || '',
      latitude: lat,
      longitude: lng,
      tier: 'basic',
      vendorLoginWhatsapp,
      vendorPassword,
      approvalStatus: 'pending',
      promos: []
    };
    partners.push(newPartner);
    await dbUpsert('rnf_partners', newPartner);
    res.json({ success: true, partner: newPartner });
  });

  // Vendor login
  app.post("/api/vendor/login", (req, res) => {
    const { whatsapp, password } = req.body;
    // Check if admin trying to login via vendor portal
    if (whatsapp === settings.adminId && password === settings.adminPassword) {
      return res.json({ success: true, role: 'admin', partner: null });
    }
    // Check vendor credentials
    const vendor = partners.find(p => p.vendorLoginWhatsapp === whatsapp && p.vendorPassword === password);
    if (!vendor) {
      return res.status(401).json({ error: "WhatsApp atau password salah" });
    }
    if (vendor.approvalStatus === 'pending') {
      return res.status(403).json({ error: "Akun vendor masih menunggu persetujuan admin", status: 'pending', partner: vendor });
    }
    if (vendor.approvalStatus === 'rejected') {
      return res.status(403).json({ error: "Pendaftaran vendor ditolak. Hubungi admin.", status: 'rejected' });
    }
    return res.json({ success: true, role: 'vendor', partner: vendor });
  });

  // Promo CRUD for a partner
  app.get("/api/partners/:id/promos", (req, res) => {
    const partner = partners.find(p => p.id === req.params.id);
    if (!partner) return res.status(404).json({ error: "Not found" });
    res.json(partner.promos || []);
  });

  app.post("/api/partners/:id/promos", async (req, res) => {
    const idx = partners.findIndex(p => p.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: "Not found" });
    const newPromo = { ...req.body, id: "promo_" + Date.now(), isActive: true };
    if (!partners[idx].promos) partners[idx].promos = [];
    partners[idx].promos!.push(newPromo);
    await dbUpsert('rnf_partners', partners[idx]);
    res.json(newPromo);
  });

  app.put("/api/partners/:id/promos/:promoId", async (req, res) => {
    const pIdx = partners.findIndex(p => p.id === req.params.id);
    if (pIdx < 0) return res.status(404).json({ error: "Partner not found" });
    const promos = partners[pIdx].promos || [];
    const prIdx = promos.findIndex(pr => pr.id === req.params.promoId);
    if (prIdx < 0) return res.status(404).json({ error: "Promo not found" });
    promos[prIdx] = { ...promos[prIdx], ...req.body };
    partners[pIdx].promos = promos;
    await dbUpsert('rnf_partners', partners[pIdx]);
    res.json(promos[prIdx]);
  });

  app.delete("/api/partners/:id/promos/:promoId", async (req, res) => {
    const pIdx = partners.findIndex(p => p.id === req.params.id);
    if (pIdx < 0) return res.status(404).json({ error: "Partner not found" });
    partners[pIdx].promos = (partners[pIdx].promos || []).filter(pr => pr.id !== req.params.promoId);
    await dbUpsert('rnf_partners', partners[pIdx]);
    res.json({ success: true });
  });

  // Track click
  app.post("/api/analytics/click", (req, res) => {
    const { partnerId, type } = req.body; // type: 'instagram', 'whatsapp', 'website'
    if (partnerId && type) {
      const key = `${partnerId}_${type}`;
      clicks[key] = (clicks[key] || 0) + 1;
    }
    res.json({ success: true });
  });

  // Get analytics
  app.get("/api/analytics", (req, res) => {
    res.json(clicks);
  });

  // Auth

  app.post("/api/auth/register", async (req, res) => {
    const { whatsapp, password, name, email } = req.body;
    const existing = users.find(u => u.whatsapp === whatsapp);
    if (existing) {
      return res.status(400).json({ error: "WhatsApp already registered" });
    }
    const newUser = {
      id: "u" + Date.now(),
      name: name || "New User",
      avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
      points: 0,
      profileCompleted: false,
      savedCoupons: [],
      email: email || "",
      whatsapp,
      password,
      instagram: "",
      dob: "",
      contactRequests: [],
      pointLogs: []
    };
    users.push(newUser);
    await dbUpsert('rnf_users', newUser);
    res.json({ success: true, user: newUser });
  });

  app.post("/api/auth/login", (req, res) => {
    const { whatsapp, password } = req.body;
    const user = users.find(u => u.whatsapp === whatsapp && u.password === password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // User Profile
  app.get("/api/user", (req, res) => {
    let currentUser = users.find(u => u.id === (req.query.userId || req.body.userId));
    if (!currentUser) return res.status(404).json({ error: "User not found" });
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    res.json(currentUser);
  });

  app.put("/api/user", async (req, res) => {
    let currentUser = users.find(u => u.id === (req.query.userId || req.body.userId));
    if (!currentUser) return res.status(404).json({ error: "User not found" });
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    const oldPoints = currentUser.points;
    const newPoints = req.body.points;
    
    if (newPoints !== undefined && newPoints !== oldPoints) {
       const diff = newPoints - oldPoints;
       let title = { ko: "포인트 변경", en: "Points Adjusted", id: "Penyesuaian Poin" };
       let partnerName = undefined;
       
       if (diff === 50) {
         title = { ko: "가맹점 체크인 보상", en: "Partner Check-in Reward", id: "Hadiah Check-in Mitra" };
         const pId = req.body.checkedInAt?.partnerId || currentUser.checkedInAt?.partnerId;
         if (pId) {
           const p = partners.find(x => x.id === pId);
           if (p) partnerName = p.name;
         }
       } else if (diff === 500) {
         const pId = req.body.checkedInAt?.partnerId || currentUser.checkedInAt?.partnerId;
         if (pId) {
           const p = partners.find(x => x.id === pId);
           if (p) partnerName = p.name;
           title = { ko: "가맹점 구글 리뷰 보상", en: "Google Review Reward", id: "Hadiah Ulasan Google" };
         } else {
           title = { ko: "가맹점 QR 스캔 보상", en: "QR Scan Reward", id: "Hadiah Pemindaian QR" };
         }
       }
       
       if (!currentUser.pointLogs) currentUser.pointLogs = [];
       currentUser.pointLogs.unshift({
         id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
         title,
         points: diff,
         timestamp: Date.now(),
         partnerName
       });
    }

    users[userIndex] = { ...currentUser, ...req.body };
    currentUser = users[userIndex];
    await dbUpsert('rnf_users', currentUser);
    res.json(currentUser);
  });

  app.post("/api/user/save_coupon", async (req, res) => {
    let currentUser = users.find(u => u.id === (req.query.userId || req.body.userId));
    if (!currentUser) return res.status(404).json({ error: "User not found" });
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    const { couponId } = req.body;
    if(!currentUser.savedCoupons.includes(couponId)) {
       currentUser.savedCoupons.push(couponId);
       
       let couponDetails: any = null;
       for (const p of partners) {
         const found = p.coupons.find(c => c.id === couponId);
         if (found) {
           couponDetails = { coupon: found, partner: p };
           break;
         }
       }

       if (couponDetails) {
         if (!currentUser.pointLogs) currentUser.pointLogs = [];
         currentUser.pointLogs.unshift({
           id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
           title: {
             ko: `무료 쿠폰 저장: ${couponDetails.coupon.title.ko}`,
             en: `Saved Free Coupon: ${couponDetails.coupon.title.en}`,
             id: `Kupon Gratis Disimpan: ${couponDetails.coupon.title.id}`
           },
           points: 0,
           timestamp: Date.now(),
           partnerName: couponDetails.partner.name,
           couponCode: couponDetails.coupon.code
         });
       }
       await dbUpsert('rnf_users', currentUser);
    }
    res.json(currentUser);
  });

  app.post("/api/user/redeem_coupon", async (req, res) => {
    let currentUser = users.find(u => u.id === (req.query.userId || req.body.userId));
    if (!currentUser) return res.status(404).json({ error: "User not found" });
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    const { couponId, cost } = req.body;
    if(currentUser.points >= cost) {
       currentUser.points -= cost;
       if(!currentUser.savedCoupons.includes(couponId)) {
         currentUser.savedCoupons.push(couponId);
       }
       
       let couponDetails: any = null;
       for (const p of partners) {
         const found = p.coupons.find(c => c.id === couponId);
         if (found) {
           couponDetails = { coupon: found, partner: p };
           break;
         }
       }

       if (!currentUser.pointLogs) currentUser.pointLogs = [];
       currentUser.pointLogs.unshift({
         id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
         title: couponDetails ? {
           ko: `쿠폰 교환: ${couponDetails.coupon.title.ko}`,
           en: `Redeemed Coupon: ${couponDetails.coupon.title.en}`,
           id: `Penukaran Kupon: ${couponDetails.coupon.title.id}`
         } : { ko: "쿠폰 교환", en: "Redeemed Coupon", id: "Penukaran Kupon" },
         points: -cost,
         timestamp: Date.now(),
         partnerName: couponDetails?.partner?.name || "Partner",
         couponCode: couponDetails?.coupon?.code
       });

       await dbUpsert('rnf_users', currentUser);
       res.json({ success: true, user: currentUser });
    } else {
       res.status(400).json({ error: "Not enough points" });
    }
  });

  // Get all users
  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  // Claim Daily Mission Reward (+100 Points)
  app.post("/api/user/claim_daily", async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    if (currentUser.lastDailyClaimDate === today) {
      return res.status(400).json({ error: "Daily mission already claimed today" });
    }

    currentUser.lastDailyClaimDate = today;
    currentUser.points += 100;

    if (!currentUser.pointLogs) currentUser.pointLogs = [];
    currentUser.pointLogs.unshift({
      id: "daily-" + Date.now(),
      title: {
        ko: "일일 미션 완료 보상",
        en: "Daily Mission Completed",
        id: "Misi Harian Selesai"
      },
      points: 100,
      timestamp: Date.now()
    });

    await dbUpsert('rnf_users', currentUser);
    res.json({ success: true, user: currentUser });
  });

  // Claim VIP Visit Scan Benefit
  app.post("/api/user/claim_vip_visit", async (req, res) => {
    const { partnerId } = req.body;
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) {
      return res.status(404).json({ error: "Partner venue not found" });
    }
    if (partner.tier !== 'vip') {
      return res.status(400).json({ error: "This vendor is not a VIP vendor" });
    }

    if (!currentUser.claimedVipBenefits) {
      currentUser.claimedVipBenefits = [];
    }

    if (currentUser.claimedVipBenefits.includes(partnerId)) {
      return res.status(400).json({ error: "Already claimed VIP benefits for this venue" });
    }

    // Mark as claimed
    currentUser.claimedVipBenefits.push(partnerId);

    // Award +250 Points
    currentUser.points += 250;

    // Award a special VIP coupon to their saved coupons!
    const vipCouponId = "vip-gift-" + partnerId;
    const hasCouponAlready = partner.coupons.some(c => c.id === vipCouponId);
    
    const vipCoupon = {
      id: vipCouponId,
      type: "free" as const,
      title: {
        ko: `🎁 [VIP 방문 선물] 무료 웰컴 맥주/음료 & 디저트 세트!`,
        en: `🎁 [VIP Visit Gift] Free Welcome Beer/Drink & Dessert Set!`,
        id: `🎁 [Hadiah Kunjungan VIP] Bir/Minuman Selamat Datang & Set Hidangan Penutup Gratis!`
      },
      code: `VIP-FUN-${partner.name.toUpperCase().replace(/\s+/g, '')}`
    };

    if (!hasCouponAlready) {
      partner.coupons.push(vipCoupon);
    }

    if (!currentUser.savedCoupons.includes(vipCouponId)) {
      currentUser.savedCoupons.push(vipCouponId);
    }

    // Add point log entry
    if (!currentUser.pointLogs) currentUser.pointLogs = [];
    currentUser.pointLogs.unshift({
      id: "vip-visit-" + Date.now(),
      title: {
        ko: `✨ VIP 가맹점 방문 혜택 적립 (${partner.name})`,
        en: `✨ VIP Partner Visit Benefit claimed (${partner.name})`,
        id: `✨ Manfaat Kunjungan Mitra VIP diklaim (${partner.name})`
      },
      points: 250,
      timestamp: Date.now(),
      partnerName: partner.name,
      couponCode: vipCoupon.code
    });

    await dbUpsert('rnf_users', currentUser);
    await dbUpsert('rnf_partners', partner);
    res.json({ success: true, user: currentUser });
  });

  // Request user's WhatsApp contact info
  app.post("/api/user/request_contact", async (req, res) => {
    const { targetUserId } = req.body;
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (!targetUser.contactRequests) targetUser.contactRequests = [];
    const existing = targetUser.contactRequests.find(r => r.requesterId === currentUser.id);
    
    if (!existing) {
      const newRequest = {
        id: "req-" + Date.now(),
        requesterId: currentUser.id,
        requesterName: currentUser.name,
        requesterAvatar: currentUser.avatar,
        status: "pending" as const,
        timestamp: Date.now()
      };
      targetUser.contactRequests.push(newRequest);
      await dbUpsert('rnf_users', targetUser);
      
      // For mock users (any user other than u1), let's automatically approve the request after 1.5 seconds!
      // This is a beautiful simulation so the user can see it work instantly!
      if (targetUserId !== "u1") {
        setTimeout(async () => {
          const req = targetUser.contactRequests?.find(r => r.id === newRequest.id);
          if (req) {
            req.status = "approved";
            await dbUpsert('rnf_users', targetUser);
          }
        }, 1500);
      }
    }
    res.json({ success: true, targetUser });
  });

  // Respond to a contact request (Approve / Reject)
  app.post("/api/user/respond_contact_request", async (req, res) => {
    const { requestId, status } = req.body; // status: 'approved' | 'rejected'
    if (!currentUser.contactRequests) currentUser.contactRequests = [];
    const reqIndex = currentUser.contactRequests.findIndex(r => r.id === requestId);
    
    if (reqIndex >= 0) {
      currentUser.contactRequests[reqIndex].status = status;
      await dbUpsert('rnf_users', currentUser);
      res.json({ success: true, user: currentUser });
    } else {
      res.status(404).json({ error: "Request not found" });
    }
  });

  // Get Top 5 Explorers Leaderboard
  app.get("/api/leaderboard", (req, res) => {
    // Sort users by points descending
    const sorted = [...users].sort((a, b) => b.points - a.points);
    // Take top 5
    res.json(sorted.slice(0, 5));
  });

  // Helper function to calculate age from DOB
  function getAge(dobString?: string): number {
    if (!dobString) return 25;
    try {
      const birthDate = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return isNaN(age) ? 25 : age;
    } catch (e) {
      return 25;
    }
  }

  // Get redemptions history (optionally filtered by partnerId)
  app.get("/api/redemptions", (req, res) => {
    const { partnerId } = req.query;
    if (partnerId) {
      const filtered = redemptions.filter(r => r.partnerId === partnerId);
      res.json(filtered);
    } else {
      res.json(redemptions);
    }
  });

  // Vendor scanning redemption endpoint
  app.post("/api/vendor/scan_redeem", async (req, res) => {
    const { qrData } = req.body;
    if (!qrData) {
      return res.status(400).json({ success: false, message: "Missing QR data" });
    }

    try {
      const parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
      const { userId, couponId, partnerId } = parsed;

      if (!userId || !couponId || !partnerId) {
        return res.status(400).json({ success: false, message: "Invalid QR code structure" });
      }

      // Find user
      const user = users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Find partner & coupon
      const partner = partners.find(p => p.id === partnerId);
      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner/vendor not found" });
      }

      const coupon = partner.coupons.find(c => c.id === couponId);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Coupon not found for this partner" });
      }

      // Remove from saved coupons so it's consumed/used!
      user.savedCoupons = user.savedCoupons.filter(cid => cid !== couponId);

      // Create redemption record
      const redemptionId = "red-" + Date.now() + Math.random().toString(36).substr(2, 5);
      const userAge = getAge(user.dob);

      const newRedemption: Redemption = {
        id: redemptionId,
        userId: user.id,
        userName: user.name,
        userAge: userAge,
        userEmail: user.email,
        couponId: coupon.id,
        couponCode: coupon.code,
        couponTitle: coupon.title,
        partnerId: partner.id,
        partnerName: partner.name,
        timestamp: Date.now()
      };

      redemptions.unshift(newRedemption);

      // Create a point log entry for usage
      if (!user.pointLogs) user.pointLogs = [];
      user.pointLogs.unshift({
        id: "log-" + Date.now() + Math.random().toString(36).substr(2, 5),
        title: {
          ko: `[사용완료] ${coupon.title.ko}`,
          en: `[Used] ${coupon.title.en}`,
          id: `[Digunakan] ${coupon.title.id}`
        },
        points: 0, // already spent during saving, or free coupon
        timestamp: Date.now(),
        partnerName: partner.name,
        couponCode: coupon.code
      });

      // Update users array in-memory for the first element sync
      if (user.id === currentUser.id) {
        currentUser = { ...user };
      }

      await dbUpsert('rnf_redemptions', newRedemption);
      await dbUpsert('rnf_users', user);

      res.json({
        success: true,
        message: `Success! ${coupon.title.en} has been redeemed by ${user.name}.`,
        redemption: newRedemption,
        user: user
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: "Failed to parse or process QR code" });
    }
  });

  // Events
  app.get("/api/events", (req, res) => {
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    const newEvent = { ...req.body, id: Date.now().toString() };
    events.push(newEvent);
    await dbUpsert('rnf_events', newEvent);
    res.json(newEvent);
  });

  app.put("/api/events/:id", async (req, res) => {
    const idx = events.findIndex(e => e.id === req.params.id);
    if (idx >= 0) {
      events[idx] = { ...events[idx], ...req.body };
      await dbUpsert('rnf_events', events[idx]);
      res.json(events[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/events/:id", async (req, res) => {
    const { id } = req.params;
    events = events.filter(e => e.id !== id);
    await dbDelete('rnf_events', id);
    res.json({ success: true });
  });

  // FAQs API
  app.get("/api/faqs", (req, res) => {
    res.json(faqs);
  });

  app.post("/api/faqs", async (req, res) => {
    const newFaq = { ...req.body, id: Date.now().toString() };
    faqs.push(newFaq);
    await dbUpsert('rnf_faqs', newFaq);
    res.json(newFaq);
  });

  app.put("/api/faqs/:id", async (req, res) => {
    const idx = faqs.findIndex(f => f.id === req.params.id);
    if (idx >= 0) {
      faqs[idx] = { ...faqs[idx], ...req.body };
      await dbUpsert('rnf_faqs', faqs[idx]);
      res.json(faqs[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    const { id } = req.params;
    faqs = faqs.filter(f => f.id !== id);
    await dbDelete('rnf_faqs', id);
    res.json({ success: true });
  });

  // Activities API
  app.get("/api/activities", (req, res) => {
    res.json(activities);
  });

  app.post("/api/activities", async (req, res) => {
    const { partnerName } = req.body;
    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      userName: currentUser.name || "Explorer",
      userAvatar: currentUser.avatar || "https://i.pravatar.cc/150?img=68",
      partnerName: partnerName || "Partner Place",
      timestamp: Date.now()
    };
    activities.unshift(newActivity);
    // Keep last 20
    if (activities.length > 20) {
      activities = activities.slice(0, 20);
    }
    await dbUpsert('rnf_activities', newActivity);
    res.json(newActivity);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

