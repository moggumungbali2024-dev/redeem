import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Partner, Category, AppEvent, Redemption, User, Promo } from '../types';
import { 
  ArrowLeft, Store, Calendar, QrCode, FileSpreadsheet, 
  Settings, Users, Edit3, Trash2, Plus, LogOut, CheckCircle, 
  MapPin, Clock, Instagram, Phone, Globe, Upload, X,
  TrendingUp, Bell, Download, RefreshCw, Sparkles, Ticket, Printer,
  Tag, Percent, Gift, ChevronRight, ChevronLeft, Eye, EyeOff, ToggleLeft, ToggleRight,
  Video
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { cn, triggerHaptic } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { uploadImage } from '../supabase';

// ========== VENDOR LOGIN SCREEN ==========
function VendorLoginScreen({ onLogin }: { onLogin: (role: 'admin' | 'vendor', partner: Partner | null) => void }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingPartner, setPendingPartner] = useState<Partner | null>(null);

  // Onboarding wizard state
  const [step, setStep] = useState(1);
  const [obName, setObName] = useState('');
  const [obCategory, setObCategory] = useState('eat');
  const [obDescEn, setObDescEn] = useState('');
  const [obDescId, setObDescId] = useState('');
  const [obDescKo, setObDescKo] = useState('');
  const [obMapsUrl, setObMapsUrl] = useState('');
  const [obInstagram, setObInstagram] = useState('');
  const [obWhatsapp, setObWhatsapp] = useState('');
  const [obWebsite, setObWebsite] = useState('');
  const [obLogo, setObLogo] = useState('');
  const [obBanner, setObBanner] = useState('');
  const [obLoginWa, setObLoginWa] = useState('');
  const [obLoginPass, setObLoginPass] = useState('');
  const [obLoginPass2, setObLoginPass2] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitDone, setSubmitDone] = useState(false);

  useEffect(() => { api.getCategories().then(setCategories); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.vendorLogin(whatsapp, password);
      if (res.success) {
        if (res.role === 'admin') {
          onLogin('admin', null);
        } else if (res.partner) {
          onLogin('vendor', res.partner);
        }
      } else if (res.status === 'pending' && res.partner) {
        setPendingPartner(res.partner);
      } else {
        alert(res.error || 'Login gagal');
      }
    } catch {
      alert('Error saat login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUploadOb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setObLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleBannerUploadOb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setObBanner(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = async () => {
    if (!obName || !obLoginWa || !obLoginPass) { alert('Nama, WhatsApp login, dan Password wajib diisi'); return; }
    if (obLoginPass !== obLoginPass2) { alert('Password tidak cocok!'); return; }
    setLoading(true);
    try {
      const res = await api.vendorRegister({
        name: obName,
        categoryId: obCategory,
        description: { ko: obDescKo || obDescEn, en: obDescEn, id: obDescId || obDescEn },
        vendorLoginWhatsapp: obLoginWa,
        vendorPassword: obLoginPass,
        logo: obLogo,
        banner: obBanner,
        instagram: obInstagram,
        whatsapp: obWhatsapp,
        website: obWebsite,
        googleMapsUrl: obMapsUrl,
      });
      if (res.success) {
        setSubmitDone(true);
      } else {
        alert(res.error || 'Registrasi gagal');
      }
    } catch {
      alert('Error saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  // Pending approval screen
  if (pendingPartner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FFF8F0] min-h-full">
        <div className="w-full max-w-sm bg-[#FDD835] border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-black uppercase mb-2">Menunggu Persetujuan</h2>
          <p className="font-bold text-sm mb-6">Akun vendor <strong>{pendingPartner.name}</strong> masih dalam proses review oleh admin. Anda akan mendapat konfirmasi segera.</p>
          <button onClick={() => setPendingPartner(null)} className="w-full bg-black text-white border-4 border-black p-3 rounded-xl font-black uppercase hover:bg-stone-800 transition-all">Kembali ke Login</button>
        </div>
      </div>
    );
  }

  // Onboarding wizard
  if (mode === 'register') {
    if (submitDone) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FFF8F0] min-h-full">
          <div className="w-full max-w-sm bg-[#43A047] border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black uppercase mb-2 text-white">Pendaftaran Terkirim!</h2>
            <p className="font-bold text-sm mb-6 text-white">Bisnis Anda sedang direview oleh tim kami. Kami akan menghubungi Anda via WhatsApp <strong>{obLoginWa}</strong> setelah disetujui.</p>
            <button onClick={() => { setMode('login'); setSubmitDone(false); setStep(1); }} className="w-full bg-[#FDD835] text-black border-4 border-black p-3 rounded-xl font-black uppercase hover:opacity-90 transition-all">Kembali ke Login</button>
          </div>
        </div>
      );
    }

    const stepTitles = ['Info Bisnis', 'Kontak & Lokasi', 'Foto & Media', 'Akun Vendor'];
    return (
      <div className="flex-1 flex flex-col bg-[#FFF8F0] min-h-full">
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b-4 border-black bg-white shrink-0">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : setMode('login')} className="p-2 bg-white border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
            <ArrowLeft size={18} strokeWidth={3} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black uppercase tracking-tight">Daftar sebagai Vendor</h1>
            <p className="text-xs font-bold text-stone-500 uppercase">Langkah {step} dari 4 · {stepTitles[step-1]}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-stone-200 shrink-0">
          <div className="h-full bg-[#FDD835] border-r-4 border-black transition-all" style={{ width: `${(step/4)*100}%` }} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-black uppercase">Ceritakan bisnis kamu! 🏪</h2>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Nama Bisnis *</label>
                <input value={obName} onChange={e => setObName(e.target.value)} placeholder="e.g. Warung Sari Bali" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Kategori</label>
                <select value={obCategory} onChange={e => setObCategory(e.target.value)} className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name.en}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Deskripsi (English)</label>
                <textarea value={obDescEn} onChange={e => setObDescEn(e.target.value)} rows={3} placeholder="Tell customers about your place..." className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Deskripsi (Indonesia)</label>
                <textarea value={obDescId} onChange={e => setObDescId(e.target.value)} rows={3} placeholder="Ceritakan tentang tempat kamu..." className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none resize-none" />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-black uppercase">Kontak & Lokasi 📍</h2>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Link Google Maps</label>
                <input value={obMapsUrl} onChange={e => setObMapsUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                <p className="text-xs text-stone-500 font-bold mt-1">💡 Copy link dari Google Maps → koordinat otomatis terset</p>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">WhatsApp Bisnis</label>
                <input value={obWhatsapp} onChange={e => setObWhatsapp(e.target.value)} placeholder="+6281234567890" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Instagram</label>
                <input value={obInstagram} onChange={e => setObInstagram(e.target.value)} placeholder="@namabisnis" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Website (opsional)</label>
                <input value={obWebsite} onChange={e => setObWebsite(e.target.value)} placeholder="https://..." className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-black uppercase">Foto & Media 📸</h2>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-2">Logo Bisnis</label>
                {obLogo ? <img src={obLogo} className="w-24 h-24 rounded-2xl border-4 border-black object-cover mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" /> : null}
                <label className="flex items-center gap-2 bg-[#FDD835] border-4 border-black p-3 rounded-xl font-black text-sm cursor-pointer hover:opacity-90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Upload size={16} /> Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUploadOb} />
                </label>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-2">Banner / Cover Photo</label>
                {obBanner ? <img src={obBanner} className="w-full h-32 rounded-2xl border-4 border-black object-cover mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" /> : null}
                <label className="flex items-center gap-2 bg-[#1E88E5] text-white border-4 border-black p-3 rounded-xl font-black text-sm cursor-pointer hover:opacity-90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Upload size={16} /> Upload Banner
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleBannerUploadOb} />
                </label>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-black uppercase">Akun Vendor 🔐</h2>
              <p className="text-sm font-bold text-stone-600">Buat kredensial untuk login ke dashboard vendor kamu.</p>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">WhatsApp untuk Login *</label>
                <input value={obLoginWa} onChange={e => setObLoginWa(e.target.value)} placeholder="+6281234567890" type="tel" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Password *</label>
                <input value={obLoginPass} onChange={e => setObLoginPass(e.target.value)} placeholder="Min. 6 karakter" type="password" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">Konfirmasi Password *</label>
                <input value={obLoginPass2} onChange={e => setObLoginPass2(e.target.value)} placeholder="Ulangi password" type="password" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
              <div className="bg-[#FFF8F0] border-4 border-black rounded-2xl p-4">
                <p className="text-xs font-black uppercase tracking-wider text-stone-600 mb-2">Review Pendaftaran</p>
                <p className="text-sm font-bold">🏪 {obName || '(Belum diisi)'}</p>
                <p className="text-sm font-bold">📱 {obLoginWa || '(Belum diisi)'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t-4 border-black bg-white shrink-0">
          {step < 4 ? (
            <button onClick={() => { if (step === 1 && !obName) { alert('Nama bisnis wajib diisi'); return; } setStep(s => s + 1); }} className="w-full bg-[#FDD835] border-4 border-black p-4 rounded-xl font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2">
              Lanjut <ChevronRight size={20} strokeWidth={3} />
            </button>
          ) : (
            <button onClick={handleRegisterSubmit} disabled={loading} className="w-full bg-[#43A047] text-white border-4 border-black p-4 rounded-xl font-black text-xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 transition-all disabled:opacity-60">
              {loading ? '⏳ Mendaftar...' : '🚀 Kirim Pendaftaran'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Login screen
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FFF8F0] min-h-full">
      <div className="w-full max-w-sm bg-[#FDD835] border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mt-10">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <img src="/favicon.png?v=2" alt="Logo" className="w-full h-full object-cover p-2" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          <Store size={32} className="absolute" />
        </div>
        <h2 className="text-3xl font-black text-center mt-6 mb-2 uppercase tracking-tighter">Vendor Portal</h2>
        <p className="text-center text-sm font-bold text-stone-700 mb-6">Masuk sebagai vendor atau admin</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider mb-2 block">WhatsApp / Admin ID</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+6281234... atau admin" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" required />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pr-12" required />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#1E88E5] text-white border-4 border-black p-4 rounded-xl font-black text-xl uppercase mt-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[4px] active:shadow-none flex items-center justify-center disabled:opacity-70">
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : 'Masuk'}
          </button>
        </form>
        <p className="mt-6 text-center font-bold text-sm">
          Belum punya akun vendor? <br/>
          <button type="button" onClick={() => { setMode('register'); setStep(1); }} className="mt-2 text-[#E53935] uppercase font-black border-b-3 border-[#E53935] hover:text-black transition-colors">Daftar Sekarang →</button>
        </p>
      </div>
      <button onClick={() => navigate('/')} className="mt-8 text-stone-500 font-bold text-sm flex items-center gap-1 hover:text-black transition-colors">
        <ArrowLeft size={14} /> Kembali ke User App
      </button>
    </div>
  );
}

export default function VendorApp() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Auth State: null = not logged in, 'admin' = admin, 'vendor' = vendor
  const [authRole, setAuthRole] = useState<'admin' | 'vendor' | null>(() => {
    return (localStorage.getItem('v_role') as 'admin' | 'vendor' | null) || null;
  });
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(() => {
    return localStorage.getItem('m_vendor_id') || null;
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'qr_generator' | 'profile' | 'events' | 'promos'>('dashboard');
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);

  // Toast notifications state
  interface Toast { id: string; message: string; type: 'success' | 'info' | 'warning'; }
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Peak Hour simulation toggle
  const [simulatePeakHours, setSimulatePeakHours] = useState(false);

  // QR Generator state
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [qrType, setQrType] = useState<'claim' | 'verify'>('claim');

  // Promo modal state
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promoName, setPromoName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoType, setPromoType] = useState<Promo['type']>('discount_percent');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [promoStart, setPromoStart] = useState('');
  const [promoEnd, setPromoEnd] = useState('');
  const [promoTerms, setPromoTerms] = useState('');

  // Event button fields
  const [eventButtonTextEn, setEventButtonTextEn] = useState('');
  const [eventButtonLink, setEventButtonLink] = useState('');

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, message, type };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    triggerHaptic('success');
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const getChartData = () => {
    const data = [];
    const today = new Date();
    
    // Seed stable multiplier based on vendor ID so the chart looks fully populated and distinctive
    const vendorIdSeed = activeVendor ? activeVendor.id.charCodeAt(0) : 65;
    const seedMultiplier = (vendorIdSeed % 5) + 3; // 3 to 7
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dateKey = d.toISOString().split('T')[0];
      
      // Count actual redemptions for this day
      const actualCount = redemptions.filter(r => {
        const rDate = new Date(r.timestamp).toISOString().split('T')[0];
        return rDate === dateKey;
      }).length;
      
      const dayOfWeek = d.getDay();
      const baseline = (dayOfWeek === 0 || dayOfWeek === 6) 
        ? seedMultiplier * 2 + 4 
        : seedMultiplier + (dayOfWeek % 3);
        
      data.push({
        date: dateStr,
        Redemptions: baseline + actualCount,
        Actual: actualCount,
        Revenue: (baseline + actualCount) * 15,
      });
    }
    return data;
  };
  
  // Editing profile state
  const [vendorName, setVendorName] = useState('');
  const [vendorLogo, setVendorLogo] = useState('');
  const [vendorBanner, setVendorBanner] = useState('');
  const [vendorDescriptionKo, setVendorDescriptionKo] = useState('');
  const [vendorDescriptionEn, setVendorDescriptionEn] = useState('');
  const [vendorDescriptionId, setVendorDescriptionId] = useState('');
  const [vendorEta, setVendorEta] = useState(10);
  const [vendorDistance, setVendorDistance] = useState(1.2);
  const [vendorInstagram, setVendorInstagram] = useState('');
  const [vendorWhatsapp, setVendorWhatsapp] = useState('');
  const [vendorWebsite, setVendorWebsite] = useState('');
  const [vendorTier, setVendorTier] = useState<'basic' | 'premium' | 'vip'>('basic');
  const [vendorIsAdFeatured, setVendorIsAdFeatured] = useState(false);
  const [vendorAdBannerUrl, setVendorAdBannerUrl] = useState('');
  const [vendorAdTextKo, setVendorAdTextKo] = useState('');
  const [vendorAdTextEn, setVendorAdTextEn] = useState('');
  const [vendorAdTextId, setVendorAdTextId] = useState('');
  
  // Managing Events State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [eventTitleKo, setEventTitleKo] = useState('');
  const [eventTitleEn, setEventTitleEn] = useState('');
  const [eventTitleId, setEventTitleId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [eventDescKo, setEventDescKo] = useState('');
  const [eventDescEn, setEventDescEn] = useState('');
  const [eventDescId, setEventDescId] = useState('');

  // Scanning simulation state
  const [manualQRInput, setManualQRInput] = useState('');
  const [processingScan, setProcessingScan] = useState(false);

  const activeVendor = authRole === 'admin' ? null : partners.find(p => p.id === selectedVendorId);

  const handleLogin = (role: 'admin' | 'vendor', partner: Partner | null) => {
    setAuthRole(role);
    localStorage.setItem('v_role', role);
    if (partner) {
      setSelectedVendorId(partner.id);
      localStorage.setItem('m_vendor_id', partner.id);
    }
  };

  const handleLogout = () => {
    triggerHaptic('tap');
    setAuthRole(null);
    setSelectedVendorId(null);
    localStorage.removeItem('v_role');
    localStorage.removeItem('m_vendor_id');
  };

  const loadData = async () => {
    try {
      const p = await api.getPartners();
      setPartners(p);
      const c = await api.getCategories();
      setCategories(c);
      const e = await api.getEvents();
      setEvents(e);
      const u = await api.getUsers();
      setUsers(u);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (selectedVendorId) {
      api.getRedemptions(selectedVendorId).then(setRedemptions);
      api.getPromos(selectedVendorId).then(setPromos);
    }
  }, [selectedVendorId]);

  useEffect(() => {
    if (activeVendor) {
      setVendorName(activeVendor.name);
      setVendorLogo(activeVendor.logo);
      setVendorBanner(activeVendor.banner || '');
      setVendorDescriptionKo(activeVendor.description?.ko || '');
      setVendorDescriptionEn(activeVendor.description?.en || '');
      setVendorDescriptionId(activeVendor.description?.id || '');
      setVendorEta(activeVendor.eta || 10);
      setVendorDistance(activeVendor.distance || 1.2);
      setVendorInstagram(activeVendor.instagram || '');
      setVendorWhatsapp(activeVendor.whatsapp || '');
      setVendorWebsite(activeVendor.website || '');
      setVendorTier(activeVendor.tier || 'basic');
      setVendorIsAdFeatured(activeVendor.isAdFeatured || false);
      setVendorAdBannerUrl(activeVendor.adBannerUrl || '');
      setVendorAdTextKo(activeVendor.adText?.ko || '');
      setVendorAdTextEn(activeVendor.adText?.en || '');
      setVendorAdTextId(activeVendor.adText?.id || '');
    }
  }, [activeVendor]);

  useEffect(() => {
    if (activeVendor && activeVendor.coupons && activeVendor.coupons.length > 0) {
      setSelectedCouponId(activeVendor.coupons[0].id);
    }
  }, [activeVendor]);

  useEffect(() => {
    if (!simulatePeakHours || !selectedVendorId || !activeVendor) return;
    const interval = setInterval(async () => {
      if (users.length === 0) return;
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCoupon = activeVendor.coupons[Math.floor(Math.random() * activeVendor.coupons.length)];
      if (randomUser && randomCoupon) {
        try {
          await api.saveCoupon(randomCoupon.id);
          const qrDataStr = JSON.stringify({ userId: randomUser.id, couponId: randomCoupon.id, partnerId: activeVendor.id });
          const res = await api.scanQRRedeem(qrDataStr);
          if (res.success) {
            showToast(`⚡ Peak Hour: ${randomUser.name} redeemed "${randomCoupon.title.en}"!`, 'success');
            const updatedReds = await api.getRedemptions(selectedVendorId);
            setRedemptions(updatedReds);
            loadData();
          }
        } catch (e) { console.error("Auto scan simulation error:", e); }
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [simulatePeakHours, selectedVendorId, activeVendor, users]);

  // Export redemptions data to CSV

  const handleExportCSV = () => {
    if (!activeVendor) return;
    triggerHaptic('success');

    const headers = [
      'Redemption ID',
      'User Name',
      'User Email',
      'User Age',
      'User WhatsApp',
      'User Instagram',
      'Coupon Title (EN)',
      'Coupon Code',
      'Redemption Timestamp',
      'Redeemed Date'
    ];

    const rows = redemptions.map(r => {
      // Find the user details in our user list to get WhatsApp/Instagram demographics
      const matchingUser = users.find(u => u.id === r.userId);
      const userWA = matchingUser?.whatsapp || '-';
      const userIG = matchingUser?.instagram || '-';
      const formattedDate = new Date(r.timestamp).toISOString();

      return [
        r.id,
        r.userName,
        r.userEmail || '-',
        r.userAge,
        userWA,
        userIG,
        r.couponTitle?.en || '',
        r.couponCode,
        r.timestamp,
        formattedDate
      ];
    });

    // Construct CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `redemptions_marketing_data_${activeVendor.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save changes to vendor details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendorId || !activeVendor) return;
    triggerHaptic('success');

    try {
      let finalLogo = vendorLogo;
      if (vendorLogo && vendorLogo.startsWith('data:')) {
        try {
          finalLogo = await uploadImage(vendorLogo, `vendors/logo_${selectedVendorId}`);
        } catch (err) {
          console.error("Logo upload failed:", err);
        }
      }

      
      let finalBanner = vendorBanner;
      if (vendorBanner && vendorBanner.startsWith('data:')) {
        try {
          finalBanner = await uploadImage(vendorBanner, `vendors/banner_${selectedVendorId}`);
        } catch (err) {
          console.error("Banner upload failed:", err);
        }
      }

      await api.updatePartner(selectedVendorId, {
        name: vendorName,
        logo: finalLogo,
        banner: finalBanner,

        eta: Number(vendorEta),
        distance: Number(vendorDistance),
        instagram: vendorInstagram,
        whatsapp: vendorWhatsapp,
        website: vendorWebsite,
        description: {
          ko: vendorDescriptionKo,
          en: vendorDescriptionEn,
          id: vendorDescriptionId
        },
        tier: vendorTier,
        isAdFeatured: vendorIsAdFeatured,
        adBannerUrl: vendorAdBannerUrl,
        adText: {
          ko: vendorAdTextKo,
          en: vendorAdTextEn,
          id: vendorAdTextId
        }
      });
      alert('Venue profile updated successfully!');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to update venue profile');
    }
  };

  // QR Scanning Simulation
  const handleScanQRString = async (qrString: string) => {
    if (!qrString) return;
    setProcessingScan(true);
    triggerHaptic('tap');
    try {
      const res = await api.scanQRRedeem(qrString);
      if (res.success) {
        triggerHaptic('success');
        showToast(res.message || 'QR Code Scanned and Redeemed Successfully!', 'success');
        setManualQRInput('');
        // reload redemptions list
        if (selectedVendorId) {
          const updatedReds = await api.getRedemptions(selectedVendorId);
          setRedemptions(updatedReds);
        }
        loadData(); // reload users/coupons
      } else {
        triggerHaptic('error');
        showToast(res.message || 'Scanning/Redemption failed', 'warning');
      }
    } catch (e) {
      triggerHaptic('error');
      showToast('Invalid QR Data or Network Error', 'warning');
    } finally {
      setProcessingScan(false);
    }
  };

  // Filter events specific to this venue (events that have matching terms in title/desc)
  const venueEvents = events.filter(e => {
    if (!activeVendor) return false;
    const nameLower = activeVendor.name.toLowerCase();
    return (
      (e.title?.en || '').toLowerCase().includes(nameLower) ||
      (e.title?.ko || '').toLowerCase().includes(nameLower) ||
      (e.title?.id || '').toLowerCase().includes(nameLower) ||
      (e.description?.en || '').toLowerCase().includes(nameLower) ||
      (e.description?.ko || '').toLowerCase().includes(nameLower) ||
      (e.description?.id || '').toLowerCase().includes(nameLower)
    );
  });

  // Handle Event Creation/Edit
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVendor) return;
    triggerHaptic('success');

    try {
      let finalEventImage = eventImage;
      if (eventImage && eventImage.startsWith('data:')) {
        try {
          finalEventImage = await uploadImage(eventImage, `events/flyer_${activeVendor.id}`);
        } catch (err) {
          console.error("Event flyer upload failed:", err);
        }
      }

      const eventPayload = {
        title: { ko: eventTitleKo, en: eventTitleEn, id: eventTitleId },
        date: eventDate,
        image: finalEventImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        description: { ko: eventDescKo, en: eventDescEn, id: eventDescId },
        buttonText: { ko: '상세 정보', en: 'View Details', id: 'Lihat Detail' },
        buttonLink: ''
      };

      if (editingEvent) {
        await api.updateEvent(editingEvent.id, eventPayload);
        alert('Event updated successfully!');
      } else {
        await api.createEvent(eventPayload);
        alert('Event created successfully!');
      }
      setEventModalOpen(false);
      setEditingEvent(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving event');
    }
  };

  const handleOpenAddEvent = () => {
    triggerHaptic('tap');
    setEditingEvent(null);
    setEventTitleKo('');
    setEventTitleEn(`Exclusive Event at ${activeVendor?.name}`);
    setEventTitleId('');
    setEventDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setEventImage('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800');
    setEventDescKo('');
    setEventDescEn(`Join us for a wonderful event at ${activeVendor?.name}! Special perks inside!`);
    setEventDescId('');
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: AppEvent) => {
    triggerHaptic('tap');
    setEditingEvent(evt);
    setEventTitleKo(evt.title?.ko || '');
    setEventTitleEn(evt.title?.en || '');
    setEventTitleId(evt.title?.id || '');
    setEventDate(evt.date || '');
    setEventImage(evt.image || '');
    setEventDescKo(evt.description?.ko || '');
    setEventDescEn(evt.description?.en || '');
    setEventDescId(evt.description?.id || '');
    setEventModalOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      triggerHaptic('tap');
      await api.deleteEvent(id);
      loadData();
    }
  };

  // Convert uploaded event banner file to Base64
  const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHaptic('tap');
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert vendor logo image file to Base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHaptic('tap');
      const reader = new FileReader();
      reader.onloadend = () => {
        setVendorLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate Average Age of Redeemers
  const avgAge = redemptions.length > 0
    ? Math.round(redemptions.reduce((acc, curr) => acc + curr.userAge, 0) / redemptions.length)
    : 0;


  // Auth guard: show login screen if not authenticated
  if (!authRole) {
    return <VendorLoginScreen onLogin={handleLogin} />;
  }

  // If admin logged in via vendor portal, redirect to admin
  if (authRole === 'admin') {
    // Navigate to admin
    navigate('/admin');
    return null;
  }

  return (
    <div className="flex-1 bg-[#FFF8F0] min-h-full flex flex-col text-black font-sans relative">
      {/* Header Panel */}
      <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <img src={activeVendor.logo} alt={activeVendor.name} className="w-10 h-10 rounded-xl border-2 border-white object-cover" />
          <div>
            <h1 className="font-black text-base uppercase leading-none tracking-tight">{activeVendor.name}</h1>
            <span className="text-[9px] font-black uppercase text-[#FDD835] tracking-widest bg-yellow-950 px-2 py-0.5 border border-[#FDD835] rounded-full inline-block mt-1">Vendor Console</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { triggerHaptic('tap'); navigate('/'); }} 
            className="p-2 bg-stone-800 text-white border-2 border-stone-600 rounded-xl font-bold text-xs uppercase hover:bg-stone-700 transition-all active:translate-y-0.5"
          >
            User App
          </button>
          <button 
            onClick={handleLogout} 
            className="p-2 bg-rose-600 text-white border-2 border-rose-900 rounded-xl font-bold text-xs uppercase hover:bg-rose-500 transition-all active:translate-y-0.5 flex items-center gap-1"
          >
            <LogOut size={12} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex bg-white border-b-4 border-black shrink-0 overflow-x-auto">
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('dashboard'); }}
          className={cn(
            "flex-1 py-4.5 font-black text-xs uppercase tracking-wider border-r-4 border-black transition-all flex items-center justify-center gap-1.5 min-w-[100px]", 
            activeTab === 'dashboard' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          <FileSpreadsheet size={14} strokeWidth={2.5} />
          Marketing
        </button>
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('qr_generator'); }}
          className={cn(
            "flex-1 py-4.5 font-black text-xs uppercase tracking-wider border-r-4 border-black transition-all flex items-center justify-center gap-1.5 min-w-[120px]", 
            activeTab === 'qr_generator' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          <Printer size={14} strokeWidth={2.5} />
          QR Generator
        </button>
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('scan'); }}
          className={cn(
            "flex-1 py-4.5 font-black text-xs uppercase tracking-wider border-r-4 border-black transition-all flex items-center justify-center gap-1.5 min-w-[100px]", 
            activeTab === 'scan' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          <QrCode size={14} strokeWidth={2.5} />
          Scan QR
        </button>
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('profile'); }}
          className={cn(
            "flex-1 py-4.5 font-black text-xs uppercase tracking-wider border-r-4 border-black transition-all flex items-center justify-center gap-1.5 min-w-[100px]", 
            activeTab === 'profile' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          <Store size={14} strokeWidth={2.5} />
          My Profile
        </button>
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('events'); }}
          className={cn(
            "flex-1 py-4.5 font-black text-xs uppercase tracking-wider border-r-4 border-black transition-all flex items-center justify-center gap-1.5 min-w-[100px]", 
            activeTab === 'events' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          <Calendar size={14} strokeWidth={2.5} />
          Events
        </button>
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('promos'); }}
          className={cn(
            "flex-1 py-4.5 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-w-[100px]", 
            activeTab === 'promos' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          <Tag size={14} strokeWidth={2.5} />
          Promos
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="p-4 flex-1 overflow-y-auto max-w-[800px] mx-auto w-full pb-20">
        
        {/* TAB 1: DASHBOARD & MARKETING ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-5">
            {/* Bento Insights Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E8F5E9] border-4 border-black p-5 rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-stone-500 leading-none">Total redeemed</span>
                <span className="font-black text-4xl text-[#2E7D32] mt-2 leading-none">{redemptions.length}</span>
                <span className="text-[9px] font-bold text-stone-400 mt-1 uppercase">Coupons consumed</span>
              </div>
              <div className="bg-[#FFF8F0] border-4 border-black p-5 rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-stone-500 leading-none">Average customer age</span>
                <span className="font-black text-4xl text-[#E53935] mt-2 leading-none">{avgAge || 'N/A'}</span>
                <span className="text-[9px] font-bold text-stone-400 mt-1 uppercase">Years old</span>
              </div>
            </div>

            {/* PERFORMANCE OVERVIEW CHART */}
            <div className="bg-white border-4 border-black p-5 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={18} className="text-[#43A047]" strokeWidth={3} />
                    <h3 className="font-black text-lg uppercase leading-none">Performance Overview</h3>
                  </div>
                  <p className="text-[10px] font-bold text-stone-400 mt-1">Daily promotional conversion & coupon redemption trends</p>
                </div>
                
                {/* Peak Hours Auto-Simulation Controller */}
                <div className="flex items-center gap-2 bg-[#FFF9C4] border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] self-stretch sm:self-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      {simulatePeakHours && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      )}
                      <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", simulatePeakHours ? "bg-red-500" : "bg-stone-400")}></span>
                    </span>
                    <span className="text-[9px] font-black uppercase">Simulate Peak Hours</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('heavy');
                      setSimulatePeakHours(!simulatePeakHours);
                    }}
                    className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black rounded-lg transition-all shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none",
                      simulatePeakHours ? "bg-red-500 text-white" : "bg-white text-black"
                    )}
                  >
                    {simulatePeakHours ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Recharts Component */}
              <div className="w-full h-[220px] mt-1 font-mono text-[9px] select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getChartData()}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRedemptions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FDD835" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#FDD835" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '3px solid #000000', 
                        borderRadius: '12px',
                        boxShadow: '2px 2px 0px rgba(0,0,0,1)',
                        fontWeight: 'bold',
                        color: '#000000'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Redemptions" 
                      stroke="#000000" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorRedemptions)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 border-2 border-black p-3 bg-stone-50 rounded-2xl text-center">
                <div>
                  <span className="text-[8px] font-black uppercase text-stone-400 block">Peak Day</span>
                  <span className="font-black text-xs text-black block mt-0.5">Saturday</span>
                </div>
                <div className="border-x-2 border-black/10">
                  <span className="text-[8px] font-black uppercase text-stone-400 block">Conv. Rate</span>
                  <span className="font-black text-xs text-[#43A047] block mt-0.5">87.5%</span>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-stone-400 block">Est. Reach</span>
                  <span className="font-black text-xs text-[#E53935] block mt-0.5">
                    {getChartData().reduce((acc, curr) => acc + curr.Redemptions, 0)} scans
                  </span>
                </div>
              </div>
            </div>

            {/* Demographics Card */}
            <div className="bg-white border-4 border-black p-5 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-black text-lg uppercase leading-none">Marketing Intelligence</h3>
                  <p className="text-[10px] font-bold text-stone-400 mt-1">Real-time user demographics data</p>
                </div>
                <button 
                  onClick={handleExportCSV}
                  disabled={redemptions.length === 0}
                  className="bg-[#43A047] hover:bg-[#388E3C] disabled:bg-stone-300 disabled:shadow-none text-white border-4 border-black px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                >
                  <FileSpreadsheet size={14} />
                  Export CSV
                </button>
              </div>

              {redemptions.length === 0 ? (
                <div className="text-center p-8 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl font-bold text-xs text-stone-400 uppercase mt-2">
                  No redemption data available to analyze yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-1">
                  {/* Persona Builder */}
                  <div className="bg-[#FFF8F0] border-2 border-black p-3.5 rounded-xl text-xs">
                    <span className="font-black uppercase block text-[#E53935]">💡 Target Demographic Insight:</span>
                    <p className="font-bold text-stone-600 mt-1 leading-relaxed">
                      Your venue is highly popular among young explorers around <span className="text-black font-black">{avgAge} years old</span>. Retarget them using special discounts on weekends!
                    </p>
                  </div>

                  {/* History table */}
                  <div className="overflow-x-auto border-2 border-black rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-100 border-b-2 border-black font-black uppercase text-stone-700">
                          <th className="p-3">User</th>
                          <th className="p-3">Age</th>
                          <th className="p-3">Coupon</th>
                          <th className="p-3">Code</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-stone-200">
                        {redemptions.map((r, i) => (
                          <tr key={i} className="hover:bg-stone-50 font-medium">
                            <td className="p-3 font-black">{r.userName}</td>
                            <td className="p-3 font-black text-[#E53935]">{r.userAge} y/o</td>
                            <td className="p-3 text-stone-600 font-bold truncate max-w-[120px]">{r.couponTitle?.en}</td>
                            <td className="p-3 font-mono font-black">{r.couponCode}</td>
                            <td className="p-3 text-stone-400 font-bold">{new Date(r.timestamp).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SCAN QR CODES */}
        {activeTab === 'scan' && (
          <div className="flex flex-col gap-5">
            {/* Quick simulator */}
            <div className="bg-white border-4 border-black p-5 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div>
                <h3 className="font-black text-lg uppercase leading-none">Instant QR Simulator</h3>
                <p className="text-[10px] font-bold text-stone-400 mt-1">Click to simulate the customer scanning their coupon QR Code in front of you</p>
              </div>

              {/* Find active user coupons */}
              {(() => {
                const activeCoupons: { user: User; coupon: any }[] = [];
                users.forEach(u => {
                  u.savedCoupons.forEach(cid => {
                    const match = activeVendor.coupons.find(c => c.id === cid);
                    if (match) {
                      activeCoupons.push({ user: u, coupon: match });
                    }
                  });
                });

                if (activeCoupons.length === 0) {
                  return (
                    <div className="p-6 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl text-center text-xs font-bold text-stone-400 uppercase leading-relaxed">
                      No active customers currently hold coupons for your venue.<br/>
                      <span className="text-[#1E88E5] font-black underline cursor-pointer" onClick={() => navigate('/wallet')}>
                        Go to User App, claim a coupon, then return here to test!
                      </span>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-3 mt-1">
                    {activeCoupons.map((item, i) => {
                      const qrDataStr = JSON.stringify({
                        userId: item.user.id,
                        couponId: item.coupon.id,
                        partnerId: activeVendor.id
                      });

                      return (
                        <div key={i} className="bg-[#FFF8F0] border-2 border-black p-4 rounded-xl flex justify-between items-center gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase text-stone-400 block leading-none">Customer</span>
                            <span className="font-black text-sm text-black block truncate mt-1">{item.user.name}</span>
                            <span className="text-[10px] font-bold text-stone-500 mt-0.5 block truncate">
                              Hold Coupon: {item.coupon.title.en} ({item.coupon.code})
                            </span>
                          </div>
                          <button
                            onClick={() => handleScanQRString(qrDataStr)}
                            disabled={processingScan}
                            className="bg-[#1E88E5] hover:bg-[#1565C0] text-white border-2 border-black px-3.5 py-2 rounded-lg font-black text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 flex items-center gap-1 shrink-0"
                          >
                            <QrCode size={14} />
                            Scan Coupon
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Manual paste box */}
            <div className="bg-white border-4 border-black p-5 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
              <div>
                <h3 className="font-black text-lg uppercase leading-none">Paste QR Payload Manually</h3>
                <p className="text-[10px] font-bold text-stone-400 mt-1">Input QR Code raw payload to process manually</p>
              </div>

              <textarea
                placeholder='{"userId": "u1", "couponId": "c1", "partnerId": "p1"}'
                value={manualQRInput}
                onChange={e => setManualQRInput(e.target.value)}
                className="w-full border-2 border-black p-3.5 rounded-xl font-mono text-xs h-24 focus:outline-none"
              />

              <button
                onClick={() => handleScanQRString(manualQRInput)}
                disabled={processingScan || !manualQRInput}
                className="w-full bg-[#43A047] text-white border-4 border-black py-3.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-[#388E3C] active:translate-y-[2px]"
              >
                {processingScan ? 'REDEEMING...' : 'PROCESS PAYLOAD'}
              </button>
            </div>
          </div>
        )}

        {/* TAB: QR GENERATOR FOR CUSTOMERS */}
        {activeTab === 'qr_generator' && activeVendor && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black p-5 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-5">
              <div>
                <h3 className="font-black text-lg uppercase leading-none text-black">Promotion QR Generator</h3>
                <p className="text-[10px] font-bold text-stone-400 mt-1">Generate dynamic QR codes for customers to scan and claim specific promotions directly</p>
              </div>

              {activeVendor.coupons.length === 0 ? (
                <div className="text-center p-8 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl font-bold text-xs text-stone-400 uppercase">
                  No coupons found for your venue. Please configure coupons in your profile.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Select Coupon Form */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase text-black">1. Choose Promotional Coupon</label>
                    <select
                      value={selectedCouponId}
                      onChange={(e) => {
                        triggerHaptic('tap');
                        setSelectedCouponId(e.target.value);
                      }}
                      className="w-full border-3 border-black p-3 rounded-xl bg-[#FFF8F0] font-black text-xs uppercase focus:outline-none"
                    >
                      {activeVendor.coupons.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title.en} ({c.code} - {c.type === 'redeem' ? `${c.cost} PTS` : 'FREE'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Choose QR Mode */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase text-black">2. Select QR Action Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => { triggerHaptic('tap'); setQrType('claim'); }}
                        className={cn(
                          "p-3 rounded-xl border-3 border-black font-black text-[11px] uppercase transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5",
                          qrType === 'claim' ? "bg-[#FFF9C4]" : "bg-white text-stone-500"
                        )}
                      >
                        🎁 Direct Claim & Save
                      </button>
                      <button
                        type="button"
                        onClick={() => { triggerHaptic('tap'); setQrType('verify'); }}
                        className={cn(
                          "p-3 rounded-xl border-3 border-black font-black text-[11px] uppercase transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5",
                          qrType === 'verify' ? "bg-[#FFF9C4]" : "bg-white text-stone-500"
                        )}
                      >
                        ⚡ Staff Quick Scan
                      </button>
                    </div>
                  </div>

                  {/* QR Display Card */}
                  {(() => {
                    const selectedCoupon = activeVendor.coupons.find(c => c.id === selectedCouponId) || activeVendor.coupons[0];
                    if (!selectedCoupon) return null;

                    const qrPayload = qrType === 'claim' 
                      ? {
                          action: 'claim_coupon',
                          couponId: selectedCoupon.id,
                          partnerId: activeVendor.id
                        }
                      : {
                          userId: users[0]?.id || 'mock-user',
                          couponId: selectedCoupon.id,
                          partnerId: activeVendor.id
                        };

                    const qrString = JSON.stringify(qrPayload);
                    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qrString)}&color=0-0-0&bgcolor=fff&margin=20`;

                    return (
                      <div className="bg-[#FFF8F0] border-3 border-black p-5 rounded-[24px] flex flex-col items-center text-center shadow-[4px_4px_0px_rgba(0,0,0,1)] gap-4 mt-2">
                        {/* QR Code Frame */}
                        <div className="relative p-3 bg-white border-4 border-black rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] max-w-[180px] w-full aspect-square flex items-center justify-center overflow-hidden">
                          <img src={qrCodeUrl} alt="Generated QR Code" className="w-full h-full object-contain" />
                          <div className="absolute top-1 right-1 bg-black text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            LIVE QR
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Generated Code</span>
                          <h4 className="font-black text-sm text-black uppercase mt-1 leading-tight">{selectedCoupon.title.en}</h4>
                          <span className="font-mono text-xs font-black bg-stone-200 border-2 border-black px-2 py-0.5 rounded-md inline-block mt-1">
                            {selectedCoupon.code}
                          </span>
                        </div>

                        <p className="text-[10px] font-bold text-stone-500 leading-snug max-w-xs">
                          {qrType === 'claim'
                            ? "Customers scan this QR code on their phone to claim and save this promotion directly to their digital wallets."
                            : "Scan this directly inside the Vendor Portal to simulate instant redemption checks."
                          }
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              triggerHaptic('success');
                              window.open(qrCodeUrl, '_blank');
                            }}
                            className="flex-1 bg-white hover:bg-stone-50 border-3 border-black py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 text-black"
                          >
                            <Download size={14} /> Download PNG
                          </button>
                          
                          <button
                            type="button"
                            onClick={async () => {
                              triggerHaptic('heavy');
                              if (qrType === 'claim') {
                                try {
                                  await api.saveCoupon(selectedCoupon.id);
                                  showToast(`🎉 Simulation: Customer saved "${selectedCoupon.title.en}"!`, 'success');
                                  loadData();
                                } catch (e) {
                                  showToast("Failed to simulate coupon claim", "warning");
                                }
                              } else {
                                handleScanQRString(qrString);
                              }
                            }}
                            className="flex-1 bg-[#1E88E5] text-white hover:bg-[#1565C0] border-3 border-black py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                          >
                            <Sparkles size={14} /> Simulate Scan
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE SHOP & VENUE PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white border-4 border-black p-5 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-5">
            <div>
              <h3 className="font-black text-lg uppercase leading-none">Venue Customization</h3>
              <p className="text-[10px] font-bold text-stone-400 mt-1">Edit venue info instantly visible on the explorer map</p>
            </div>

            {/* Logo Upload Box */}
            <div className="flex flex-col items-center gap-2 border-2 border-dashed border-stone-300 p-4 rounded-xl">
              <label className="text-xs font-black uppercase text-stone-500">Venue Logo</label>
              <div className="relative w-20 h-20 rounded-full border-2 border-black overflow-hidden bg-stone-100 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <img src={vendorLogo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <label className="bg-[#1E88E5] text-white px-3 py-1.5 border-2 border-black rounded-lg font-black text-xs uppercase cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1 active:translate-y-0.5 select-none">
                  <Upload size={12} strokeWidth={2.5} />
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase">Venue Name</label>
              <input 
                type="text" required value={vendorName} onChange={e => setVendorName(e.target.value)}
                className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase">ETA (mins)</label>
                <input 
                  type="number" required value={vendorEta} onChange={e => setVendorEta(Number(e.target.value))}
                  className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase">Distance (km)</label>
                <input 
                  type="number" step="0.1" required value={vendorDistance} onChange={e => setVendorDistance(Number(e.target.value))}
                  className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase">Description (English)</label>
              <textarea 
                required value={vendorDescriptionEn} onChange={e => setVendorDescriptionEn(e.target.value)}
                className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm h-20 resize-none focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase">Description (Bahasa Indonesia)</label>
              <textarea 
                required value={vendorDescriptionId} onChange={e => setVendorDescriptionId(e.target.value)}
                className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm h-20 resize-none focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase">Description (Korean)</label>
              <textarea 
                required value={vendorDescriptionKo} onChange={e => setVendorDescriptionKo(e.target.value)}
                className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm h-20 resize-none focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase">Instagram Handle</label>
              <input 
                type="text" placeholder="@username" value={vendorInstagram} onChange={e => setVendorInstagram(e.target.value)}
                className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase">WhatsApp Number</label>
              <input 
                type="text" placeholder="+62..." value={vendorWhatsapp} onChange={e => setVendorWhatsapp(e.target.value)}
                className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase">Website Link</label>
              <input 
                type="url" placeholder="https://..." value={vendorWebsite} onChange={e => setVendorWebsite(e.target.value)}
                className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
              />
            </div>

            {/* VENDOR SUBSCRIPTION TIER */}
            <div className="border-4 border-black p-4.5 rounded-[24px] bg-[#FAF9F6] flex flex-col gap-3 text-left">
              <div>
                <h4 className="font-black text-sm uppercase leading-none text-[#2E7D32] flex items-center gap-1.5">
                  🛡️ Subscription Partner Tier
                </h4>
                <p className="text-[9px] font-bold text-stone-400 mt-1 uppercase">Select your tier to unlock advanced capabilities</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'basic', label: 'Basic', color: 'bg-stone-100', text: 'text-stone-800', desc: 'Coupons only' },
                  { id: 'premium', label: 'Plus', color: 'bg-blue-50 text-blue-800', desc: 'Coupons + Events' },
                  { id: 'vip', label: 'VIP', color: 'bg-amber-100 text-amber-900 border-[#FF8F00]', desc: 'Ads + Visits' }
                ].map((tOption) => {
                  const isSelected = vendorTier === tOption.id;
                  return (
                    <button
                      key={tOption.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap');
                        setVendorTier(tOption.id as any);
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center ${
                        isSelected 
                          ? 'border-black bg-stone-900 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                          : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      <span className="font-black text-xs uppercase tracking-wide">{tOption.label}</span>
                      <span className={`text-[8px] mt-0.5 font-bold opacity-80 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{tOption.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VIP FEATURES CONFIGURATION (ONLY SHOWN OR ACCESSIBLE FOR VIP TIER) */}
            {vendorTier === 'vip' ? (
              <div className="border-4 border-[#FF8F00] p-4.5 rounded-[24px] bg-amber-50/30 flex flex-col gap-4 text-left">
                <div>
                  <h4 className="font-black text-sm uppercase leading-none text-[#E65100] flex items-center gap-1">
                    👑 VIP Advertising Panel
                  </h4>
                  <p className="text-[9px] font-bold text-stone-400 mt-1">Configure live sponsor ads shown on the customer explorer home</p>
                </div>

                <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                  <span className="text-xs font-black uppercase text-stone-700">Display Featured Ad Slider</span>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap');
                      setVendorIsAdFeatured(!vendorIsAdFeatured);
                    }}
                    className={`px-3 py-1 rounded-lg border-2 border-black font-black text-[10px] uppercase transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${
                      vendorIsAdFeatured 
                        ? 'bg-[#43A047] text-white' 
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {vendorIsAdFeatured ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-[#E65100]">Ad Banner Image URL</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={vendorAdBannerUrl} 
                    onChange={e => setVendorAdBannerUrl(e.target.value)}
                    className="border-2 border-[#FF8F00] p-3 rounded-lg font-bold bg-[#FFFBF0] text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase text-[#E65100]">Ad Banner Copy (English)</label>
                  <input 
                    type="text" 
                    placeholder="🔥 Sunset Pool Party this weekend! Free cocktail for app members!" 
                    value={vendorAdTextEn} 
                    onChange={e => setVendorAdTextEn(e.target.value)}
                    className="border-2 border-[#FF8F00] p-3 rounded-lg font-bold bg-[#FFFBF0] text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase text-[#E65100]">Ad Banner Copy (Bahasa Indonesia)</label>
                  <input 
                    type="text" 
                    placeholder="🔥 Sunset Pool Party di akhir pekan! Koktail gratis!" 
                    value={vendorAdTextId} 
                    onChange={e => setVendorAdTextId(e.target.value)}
                    className="border-2 border-[#FF8F00] p-3 rounded-lg font-bold bg-[#FFFBF0] text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase text-[#E65100]">Ad Banner Copy (Korean)</label>
                  <input 
                    type="text" 
                    placeholder="🔥 이번 주말 선셋 풀 파티! 앱 회원 무료 웰컴 드링크!" 
                    value={vendorAdTextKo} 
                    onChange={e => setVendorAdTextKo(e.target.value)}
                    className="border-2 border-[#FF8F00] p-3 rounded-lg font-bold bg-[#FFFBF0] text-xs focus:outline-none"
                  />
                </div>

                {/* VIP VISIT BENEFIT INFO */}
                <div className="mt-1 border-t border-amber-200 pt-3 flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-amber-800">✨ Post-Visit Scan Benefit QR</span>
                  <div className="bg-white border-2 border-[#FF8F00] p-3 rounded-xl flex gap-3 items-center">
                    <QrCode size={36} className="text-amber-700 shrink-0" strokeWidth={2.5} />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase leading-tight text-stone-900">Live Visit QR Enabled</p>
                      <p className="text-[8px] font-bold text-stone-500 leading-normal mt-0.5">
                        Customers scanning this QR at your venue will earn an instant **250 PTS bonus** & unlock an exclusive **VIP Welcome Gift Coupon** in their wallets automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <button type="submit" className="w-full bg-[#43A047] text-white border-4 border-black py-4 rounded-xl font-black text-sm uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all mt-2">
              Save Profile Changes
            </button>
          </form>
        )}

        {/* TAB 4: MANAGE EVENTS */}
        {activeTab === 'events' && (
          activeVendor?.tier === 'basic' ? (
            <div className="bg-white border-4 border-black p-8 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-black flex items-center justify-center text-stone-700 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Lock size={32} strokeWidth={3} />
              </div>
              <div className="max-w-md">
                <h3 className="font-black text-xl uppercase leading-none text-stone-900">👑 Plus/VIP Tier Required</h3>
                <p className="text-xs font-bold text-stone-500 mt-3 leading-relaxed">
                  Basic partner accounts can only distribute standard checking coupons. Upgrade your subscription to a <span className="text-[#1E88E5] font-black">Plus</span> or <span className="text-[#D84315] font-black">VIP</span> partner tier under the Profile tab to publish local events, guest DJs, pool parties, and custom venue activities!
                </p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  triggerHaptic('tap');
                  setActiveTab('profile');
                }}
                className="bg-[#1E88E5] text-white border-4 border-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                Upgrade Tier in Profile Settings
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center bg-white border-4 border-black p-5 rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <h3 className="font-black text-base uppercase leading-none">Venue Events</h3>
                  <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase">Manage promotional happenings</p>
                </div>
                <button 
                  onClick={handleOpenAddEvent}
                  className="bg-[#43A047] text-white border-2 border-black px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                >
                  <Plus size={14} strokeWidth={3} /> Add Event
                </button>
              </div>

              {venueEvents.length === 0 ? (
                <div className="text-center p-12 bg-white border-4 border-black rounded-[32px] font-black uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] text-stone-400 text-xs">
                  No active events listed for your venue.<br/>
                  <span className="text-[#1E88E5] underline cursor-pointer mt-1 inline-block" onClick={handleOpenAddEvent}>
                    Click here to create your first event!
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venueEvents.map(e => (
                    <div key={e.id} className="bg-white p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
                      <div className="relative aspect-video border-2 border-black rounded-xl overflow-hidden bg-stone-100">
                        <img src={e.image} className="w-full h-full object-cover" alt="Event Banner" />
                        <span className="absolute top-2 left-2 bg-[#E53935] text-white font-black uppercase text-[9px] px-2 py-0.5 border border-white rounded-full">
                          {e.date}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase text-black line-clamp-1">{e.title?.en}</h4>
                        <p className="text-[10px] text-stone-500 font-bold line-clamp-2 mt-1 leading-normal">{e.description?.en}</p>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button 
                          onClick={() => handleOpenEditEvent(e)}
                          className="flex-1 bg-stone-100 hover:bg-stone-200 border-2 border-black py-2 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-1"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(e.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-900 px-3 py-2 rounded-lg font-black text-[10px] uppercase flex items-center justify-center"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Event edit modal */}
      <AnimatePresence>
        {eventModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-4 border-black rounded-[32px] w-full max-w-md overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative p-6 flex flex-col gap-4 text-black max-h-[90vh] overflow-y-auto"
            >
              <button 
                type="button"
                onClick={() => { triggerHaptic('tap'); setEventModalOpen(false); }}
                className="absolute top-4 right-4 p-2 bg-white border-2 border-black rounded-full hover:bg-stone-100 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              >
                <X size={16} strokeWidth={3} />
              </button>

              <h3 className="font-black text-xl uppercase tracking-tight text-black">
                {editingEvent ? 'Edit Event Details' : 'Create Venue Event'}
              </h3>

              <form onSubmit={handleSaveEvent} className="flex flex-col gap-4">
                
                {/* Image upload box */}
                <div className="flex flex-col items-center gap-2 border-2 border-dashed border-stone-300 p-4 rounded-xl">
                  <label className="text-xs font-black uppercase text-stone-500">Event Banner</label>
                  <div className="relative aspect-video w-full max-w-[200px] border-2 border-black rounded-lg overflow-hidden bg-stone-100 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <img src={eventImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <label className="bg-[#1E88E5] text-white px-3 py-1.5 border-2 border-black rounded-lg font-black text-xs uppercase cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1 active:translate-y-0.5 select-none">
                      <Upload size={12} strokeWidth={2.5} />
                      Upload Banner
                      <input type="file" accept="image/*" onChange={handleEventImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">Event Title (English)</label>
                  <input 
                    type="text" required value={eventTitleEn} onChange={e => setEventTitleEn(e.target.value)}
                    className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">Event Title (Bahasa Indonesia)</label>
                  <input 
                    type="text" value={eventTitleId} onChange={e => setEventTitleId(e.target.value)}
                    className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">Event Date (e.g., Oct 25, 8:00 PM)</label>
                  <input 
                    type="text" required value={eventDate} onChange={e => setEventDate(e.target.value)}
                    className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">Event Description (English)</label>
                  <textarea 
                    required value={eventDescEn} onChange={e => setEventDescEn(e.target.value)}
                    className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm h-16 resize-none focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">Event Description (Bahasa Indonesia)</label>
                  <textarea 
                    value={eventDescId} onChange={e => setEventDescId(e.target.value)}
                    className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm h-16 resize-none focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black uppercase">Button Text (EN)</label>
                    <input 
                      type="text" value={eventButtonTextEn} onChange={e => setEventButtonTextEn(e.target.value)}
                      placeholder="e.g. Register / Buy Ticket"
                      className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black uppercase">Button Link</label>
                    <input 
                      type="text" value={eventButtonLink} onChange={e => setEventButtonLink(e.target.value)}
                      placeholder="https://..."
                      className="border-2 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] text-sm"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#43A047] text-white border-4 border-black py-3.5 rounded-xl font-black text-sm uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all mt-2">
                  Save Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROMO TAB */}
      {activeTab === 'promos' && (
        <div className="p-4 flex-1 overflow-y-auto max-w-[800px] mx-auto w-full pb-20">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase">Promo Manager</h2>
                <p className="text-xs font-bold text-stone-500">Kelola kode promo untuk pelanggan kamu</p>
              </div>
              <button onClick={() => { setEditingPromo(null); setPromoName(''); setPromoCode(''); setPromoType('discount_percent'); setPromoDiscount(''); setPromoStart(''); setPromoEnd(''); setPromoTerms(''); setPromoModalOpen(true); }} className="bg-[#FDD835] border-4 border-black px-3 py-2.5 rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center gap-1.5">
                <Plus size={14} strokeWidth={3}/> Tambah Promo
              </button>
            </div>

            {promos.length === 0 ? (
              <div className="text-center py-16 bg-white border-4 border-dashed border-stone-300 rounded-3xl">
                <div className="text-5xl mb-3">🏷️</div>
                <h3 className="font-black uppercase">Belum Ada Promo</h3>
                <p className="text-sm text-stone-500 font-bold mt-1">Buat promo pertama untuk menarik pelanggan!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {promos.map(p => (
                  <div key={p.id} className="bg-white border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#FDD835] border-2 border-black font-mono font-black text-sm px-2.5 py-0.5 rounded-lg">{p.code}</span>
                          <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-full border-2 ${p.isActive ? 'bg-green-100 border-green-700 text-green-800' : 'bg-stone-100 border-stone-400 text-stone-500'}`}>{p.isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </div>
                        <p className="font-black text-base mt-1">{p.name}</p>
                        <p className="text-xs font-bold text-stone-500">{p.type === 'discount_percent' ? `${p.discountValue}% off` : p.type === 'discount_nominal' ? `Rp${p.discountValue?.toLocaleString()} off` : p.type === 'free' ? 'Free Item' : p.type === 'bogo' ? 'Buy 1 Get 1' : p.type === 'cashback' ? `${p.discountValue}% cashback` : 'Special'}</p>
                        <p className="text-xs font-bold text-stone-400">{p.startDate} → {p.endDate}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={async () => { await api.updatePromo(selectedVendorId!, p.id, { isActive: !p.isActive }); api.getPromos(selectedVendorId!).then(setPromos); }} className="p-2 border-2 border-black rounded-lg bg-stone-50 hover:bg-stone-100 transition-all">{p.isActive ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} className="text-stone-400" />}</button>
                        <button onClick={() => { setEditingPromo(p); setPromoName(p.name); setPromoCode(p.code); setPromoType(p.type); setPromoDiscount(String(p.discountValue || '')); setPromoStart(p.startDate); setPromoEnd(p.endDate); setPromoTerms(p.terms); setPromoModalOpen(true); }} className="p-2 border-2 border-black rounded-lg bg-stone-50 hover:bg-stone-100 transition-all"><Edit3 size={16} /></button>
                        <button onClick={async () => { if (confirm('Hapus promo ini?')) { await api.deletePromo(selectedVendorId!, p.id); api.getPromos(selectedVendorId!).then(setPromos); } }} className="p-2 border-2 border-rose-900 rounded-lg bg-rose-50 hover:bg-rose-100 transition-all text-rose-700"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    {p.terms && <p className="text-[11px] font-bold text-stone-500 bg-stone-50 border border-stone-200 p-2 rounded-lg">{p.terms}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promo Modal */}
      <AnimatePresence>
        {promoModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-4 border-black rounded-[32px] w-full max-w-md overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative p-6 flex flex-col gap-4 text-black max-h-[90vh] overflow-y-auto"
            >
              <button type="button" onClick={() => setPromoModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white border-2 border-black rounded-full hover:bg-stone-100 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <X size={16} strokeWidth={3} />
              </button>
              <h3 className="font-black text-xl uppercase">{editingPromo ? 'Edit Promo' : 'Buat Promo Baru 🏷️'}</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const data = { name: promoName, code: promoCode, type: promoType, discountValue: Number(promoDiscount) || 0, startDate: promoStart, endDate: promoEnd, terms: promoTerms, isActive: true };
                if (editingPromo) {
                  await api.updatePromo(selectedVendorId!, editingPromo.id, data);
                } else {
                  await api.createPromo(selectedVendorId!, data);
                }
                api.getPromos(selectedVendorId!).then(setPromos);
                setPromoModalOpen(false);
              }} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-black uppercase block mb-1">Nama Promo *</label>
                  <input required value={promoName} onChange={e => setPromoName(e.target.value)} placeholder="e.g. Promo Akhir Pekan" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase block mb-1">Kode Promo *</label>
                  <input required value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="e.g. WEEKEND20" className="w-full border-4 border-black p-3.5 rounded-xl font-bold font-mono bg-[#FFF8F0] focus:outline-none uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase block mb-1">Tipe Promo</label>
                    <select value={promoType} onChange={e => setPromoType(e.target.value as Promo['type'])} className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] focus:outline-none">
                      <option value="discount_percent">% Diskon</option>
                      <option value="discount_nominal">Rp Potongan</option>
                      <option value="free">Free Item</option>
                      <option value="bogo">Buy 1 Get 1</option>
                      <option value="cashback">Cashback</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  {(promoType === 'discount_percent' || promoType === 'discount_nominal' || promoType === 'cashback') && (
                    <div>
                      <label className="text-xs font-black uppercase block mb-1">{promoType === 'discount_nominal' ? 'Nominal (Rp)' : 'Persen (%)'}</label>
                      <input type="number" value={promoDiscount} onChange={e => setPromoDiscount(e.target.value)} placeholder="0" className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] focus:outline-none" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase block mb-1">Berlaku Mulai</label>
                    <input type="date" required value={promoStart} onChange={e => setPromoStart(e.target.value)} className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase block mb-1">Berlaku Hingga</label>
                    <input type="date" required value={promoEnd} onChange={e => setPromoEnd(e.target.value)} className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase block mb-1">Syarat & Ketentuan</label>
                  <textarea value={promoTerms} onChange={e => setPromoTerms(e.target.value)} rows={3} placeholder="Berlaku untuk minimum pembelian Rp100.000, tidak dapat digabungkan dengan promo lain..." className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-[#FFF8F0] focus:outline-none resize-none" />
                </div>
                <button type="submit" className="w-full bg-[#FDD835] border-4 border-black p-4 rounded-xl font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all">
                  {editingPromo ? '✏️ Simpan Perubahan' : '🚀 Buat Promo'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={cn(
                "pointer-events-auto border-3 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3 bg-white text-black",
                toast.type === 'success' && "bg-[#E8F5E9] border-green-900",
                toast.type === 'info' && "bg-[#E1F5FE] border-blue-900",
                toast.type === 'warning' && "bg-[#FFF9C4] border-amber-900"
              )}
            >
              <div className="text-xl">
                {toast.type === 'success' ? '🎉' : toast.type === 'warning' ? '⚠️' : '🔔'}
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase leading-tight text-black">
                  {toast.type === 'success' ? 'Redemption Notice' : 'Notification'}
                </p>
                <p className="text-[10px] font-black text-stone-700 mt-0.5 leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setToasts(prev => prev.filter(t => t.id !== toast.id));
                }}
                className="text-stone-400 hover:text-black font-black text-xs px-1 shrink-0"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
