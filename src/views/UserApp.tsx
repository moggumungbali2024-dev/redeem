import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { QrCode, ChevronLeft, LogOut, Scan, Plus, Minus, MapPin, Utensils, Moon, Bed, Heart, Phone, ArrowLeft, ArrowRight, Instagram, MessageCircle, Globe, Ticket, Clock, Star, Globe2, Search, X, History, TrendingUp, TrendingDown, Gift, Bell, HelpCircle, FileSpreadsheet, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../api';
import { Partner, Category, User, AppEvent, Activity, Faq } from '../types';
import { cn, triggerHaptic } from '../lib/utils';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useI18n, Language } from '../i18n';
import ProfileWizard from './ProfileWizard';
import PointAnimation from '../components/PointAnimation';
import { uploadImage } from '../supabase';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AdventureMap from '../components/AdventureMap';


// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


export default function UserApp() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("userId"));
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [localNotification, setLocalNotification] = useState<{ id: string; title: string; body: string } | null>(null);
  const [showBirthdayAlert, setShowBirthdayAlert] = useState(false);

  useEffect(() => {
    if (!user || !user.dob) return;
    
    const today = new Date();
    const dobDate = new Date(user.dob);
    
    const isBirthdayToday = today.getMonth() === dobDate.getMonth() && today.getDate() === dobDate.getDate();
    const currentYear = today.getFullYear();
    
    if (isBirthdayToday && user.lastBirthdayRewardYear !== currentYear) {
      const newPoints = user.points + 5000;
      api.updateUser({ 
        points: newPoints, 
        lastBirthdayRewardYear: currentYear 
      }).then(newUser => {
        setUser(newUser);
        setShowBirthdayAlert(true);
        triggerHaptic('heavy');
      }).catch(console.error);
    }
  }, [user?.dob, user?.lastBirthdayRewardYear]);

  useEffect(() => {
    api.getPartners().then(setPartners);
    api.getCategories().then(setCategories);
    api.getUser().then(setUser);
    api.getEvents().then(setEvents);
    api.getActivities().then(setActivities);
  }, []);

  // Trigger a simulated push notification after 4 seconds
  useEffect(() => {
    if (!user) return;
    const isSubscribed = user.subscribedToNotifications !== false;
    if (!isSubscribed) return;

    const timer = setTimeout(() => {
      const alerts = [
        { id: '1', title: '🎁 Daily Reward Unlocked!', body: 'Claim your 200 PTS login reward in your wallet today!' },
        { id: '2', title: '🔥 Acoustic Night Live!', body: 'Acoustic Night starts tonight at 8:00 PM at Lima Bay. Be there!' },
        { id: '3', title: '⚡ Flash Offer Alert!', body: 'Save 15% on bestsellers at redeem-n.fun for the next 2 hours!' }
      ];
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      setLocalNotification(randomAlert);
    }, 4000);

    return () => clearTimeout(timer);
  }, [user?.subscribedToNotifications, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#FFF8F0] relative">
        <Routes>
          <Route path="/register" element={<RegisterView onRegister={(u) => {
            localStorage.setItem('userId', u.id);
            setUser(u);
            setIsAuthenticated(true);
            navigate('/');
          }} onGoLogin={() => navigate('/login')} />} />
          <Route path="*" element={<LoginView onLogin={(u) => {
            localStorage.setItem('userId', u.id);
            setUser(u);
            setIsAuthenticated(true);
            navigate('/');
          }} onGoRegister={() => navigate('/register')} />} />
        </Routes>
      </div>
    );
  }

  if (!user) return <div className="flex-1 bg-[#FFF8F0] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin"></div></div>;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#FFF8F0] pb-20 overflow-x-hidden relative">
      {!user.profileCompleted && <ProfileWizard user={user} onComplete={setUser} />}

      {/* Birthday Celebration Overlay */}
      {showBirthdayAlert && (
        <div className="fixed inset-0 z-[1001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 text-black">
          <motion.div 
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white border-4 border-black p-8 rounded-[32px] text-center max-w-sm w-full shadow-[8px_8px_0px_rgba(0,0,0,1)] relative"
          >
            <div className="text-6xl mb-4">🎂🎉🎁</div>
            <h2 className="text-2xl font-black uppercase text-black mb-1">Selamat Ulang Tahun!</h2>
            <h3 className="text-xl font-black text-[#43A047] uppercase mb-4">Happy Birthday!</h3>
            <p className="text-sm font-bold text-gray-700 leading-relaxed mb-6">
              As a special birthday gift from redeem-n.fun, you have received <span className="text-[#E53935] font-black">+5,000 Points</span>! Enjoy your special day exploring Canggu!
            </p>
            <button 
              onClick={() => {
                setShowBirthdayAlert(false);
                triggerHaptic('tap');
              }}
              className="w-full bg-[#FDD835] text-black border-4 border-black py-4 rounded-xl font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              Claim Gift & Party!
            </button>
          </motion.div>
        </div>
      )}

      {/* Local Push Notification Banner */}
      <AnimatePresence>
        {localNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="fixed top-4 left-4 right-4 z-[999] max-w-[450px] mx-auto bg-[#FDD835] border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] flex gap-3 items-start cursor-pointer active:scale-98 transition-transform"
            onClick={() => {
              setLocalNotification(null);
            }}
          >
            <div className="bg-white p-2 border-2 border-black rounded-xl shrink-0">
              <Bell size={20} className="text-[#E53935] fill-[#E53935]" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-black text-sm uppercase leading-tight">{localNotification.title}</h4>
              <p className="text-xs font-bold text-gray-800 mt-0.5 leading-snug">{localNotification.body}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setLocalNotification(null); }}
              className="p-1.5 bg-white border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shrink-0"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<Home categories={categories} partners={partners} user={user} events={events} activities={activities} setUser={setUser} />} />
        <Route path="/category/:id" element={<CategoryView partners={partners} categories={categories} />} />
        <Route path="/partner/:id" element={<PartnerDetail partners={partners} categories={categories} user={user} setUser={setUser} />} />
        <Route path="/event/:id" element={<EventDetail events={events} />} />
        <Route path="/map" element={<MapView partners={partners} user={user} categories={categories} />} />
        <Route path="/scan" element={<ScanView user={user} updateUser={async (updates) => { const newUser = await api.updateUser(updates); if(newUser) setUser(newUser); }} partners={partners} />} />
        <Route path="/wallet" element={<WalletView user={user} partners={partners} />} />
        <Route path="/profile" element={<ProfileView user={user} updateUser={async (updates) => {
          const newUser = await api.updateUser(updates);
          if(newUser) setUser(newUser);
        }} />} />
        <Route path="/faq" element={<FaqView />} />
        <Route path="/notifications" element={<NotificationsView user={user} />} />
      </Routes>
    </div>
  );
}



// --- Profile Edit Modal ---

function LoginView({ onLogin, onGoRegister }: { onLogin: (u: User) => void, onGoRegister: () => void }) {
  const [whatsapp, setWhatsapp] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(whatsapp, password);
      if (res.success && res.user) {
        onLogin(res.user);
      } else {
        alert('Login failed: ' + (res.error || 'Invalid credentials'));
      }
    } catch (e) {
      alert('Error during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FFF8F0] min-h-full">
      <div className="w-full max-w-sm bg-[#FDD835] border-[4px] border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white border-[4px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
           <img src="/favicon.png?v=2" alt="Logo" className="w-full h-full object-cover p-2" />
        </div>
        <h2 className="text-3xl font-black text-center mt-6 mb-6 uppercase tracking-tighter">Welcome Back!</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-black uppercase tracking-wider mb-2 block">WhatsApp Number</label>
            <input 
              type="text" 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+6281234567890" 
              className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-wider mb-2 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1E88E5] text-white border-[4px] border-black p-4 rounded-xl font-black text-xl uppercase mt-4 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "Log In"}
          </button>
        </form>
        <p className="mt-8 text-center font-bold text-sm">
          Don't have an account? <br/>
          <button type="button" onClick={onGoRegister} className="mt-2 text-[#E53935] uppercase font-black border-b-[3px] border-[#E53935] hover:text-black hover:border-black transition-colors">Register here</button>
        </p>
      </div>
    </div>
  );
}

function RegisterView({ onRegister, onGoLogin }: { onRegister: (u: User) => void, onGoLogin: () => void }) {
  const [whatsapp, setWhatsapp] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.register(whatsapp, password, name, email);
      if (res.success && res.user) {
        onRegister(res.user);
      } else {
        alert('Registration failed: ' + (res.error || 'Unknown error'));
      }
    } catch (e) {
      alert('Error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FFF8F0] min-h-full">
      <div className="w-full max-w-sm bg-[#43A047] border-[4px] border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white border-[4px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
           <img src="/favicon.png?v=2" alt="Logo" className="w-full h-full object-cover p-2" />
        </div>
        <h2 className="text-3xl font-black text-center mt-6 mb-6 uppercase tracking-tighter text-white">Join the Fun!</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-black uppercase tracking-wider mb-2 block text-white">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe" 
              className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-wider mb-2 block text-white">WhatsApp Number</label>
            <input 
              type="text" 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+6281234567890" 
              className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-wider mb-2 block text-white">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com" 
              className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-wider mb-2 block text-white">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full border-4 border-black p-3.5 rounded-xl font-bold bg-white focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E53935] text-white border-[4px] border-black p-4 rounded-xl font-black text-xl uppercase mt-4 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "Register"}
          </button>
        </form>
        <p className="mt-8 text-center font-bold text-sm text-white">
          Already have an account? <br/>
          <button type="button" onClick={onGoLogin} className="mt-2 text-[#FDD835] uppercase font-black border-b-[3px] border-[#FDD835] hover:text-white hover:border-white transition-colors">Log In here</button>
        </p>
      </div>
    </div>
  );
}

function NotificationsView({ user }: { user: User }) {
  const navigate = useNavigate();
  return (
    <div className="pb-24 pt-4 px-4 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Notifications</h2>
      </div>
      <div className="space-y-3">
        {user.pointLogs && user.pointLogs.length > 0 ? user.pointLogs.map((log: any) => (
          <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.points > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {log.points > 0 ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm leading-tight mb-1">{log.title.ko}</p>
              <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
            </div>
            {log.points !== 0 && (
              <div className={`ml-auto font-semibold ${log.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {log.points > 0 ? '+' : ''}{log.points}
              </div>
            )}
          </div>
        )) : (
          <div className="text-center text-slate-500 py-12">No notifications yet.</div>
        )}
      </div>
    </div>
  );
}

function ProfileModal({ user, onClose, onSave }: { user: User, onClose: () => void, onSave: (u: User) => void }) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [uploading, setUploading] = useState(false);
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadImage(file, 'avatars/' + user.id);
        setAvatar(url);
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
         className="bg-white border-4 border-black rounded-[24px] p-6 w-full max-w-[320px] relative z-10 flex flex-col items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
       >
          <h2 className="text-xl font-black uppercase mb-4 text-black tracking-tighter">Edit Profile</h2>
          
          <div className="relative mb-4">
            <img src={avatar} className="w-24 h-24 rounded-full object-cover border-4 border-black" alt="avatar" />
            <label className="absolute bottom-0 right-0 bg-[#FDD835] p-2 rounded-full border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FBC02D]">
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </label>
            {uploading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}
          </div>

          <p className="text-xs font-bold text-gray-500 mb-2">Or choose an avatar:</p>
          <div className="flex gap-2 mb-4 justify-center flex-wrap">
            {avatars.map((a, i) => (
              <img key={i} src={a} onClick={() => setAvatar(a)} className={`w-10 h-10 rounded-full object-cover border-2 ${avatar === a ? 'border-[#E53935] border-4' : 'border-black'} cursor-pointer`} alt="avatar option" />
            ))}
          </div>

          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-4 border-black rounded-xl px-4 py-2 font-bold mb-6 outline-none focus:border-[#E53935]" placeholder="Your Name" />
          
          <button onClick={() => { onSave({ ...user, name, avatar }); onClose(); }} className="w-full bg-[#FDD835] text-black border-4 border-black py-3 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
             Save Profile
          </button>
       </motion.div>
    </div>
  )
}

// --- Level Up Modal ---
function LevelUpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <motion.div 
         initial={{ scale: 0.5, y: 100, rotate: -10 }} 
         animate={{ scale: 1, y: 0, rotate: 0 }} 
         exit={{ scale: 0.5, y: 100, opacity: 0 }}
         transition={{ type: 'spring', damping: 12 }}
         className="bg-[#FDD835] border-8 border-black rounded-[40px] p-8 max-w-sm w-full relative z-10 flex flex-col items-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center"
       >
          <div className="absolute -top-12 bg-white border-4 border-black w-24 h-24 rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <Star size={48} className="text-[#E53935] fill-[#E53935]" />
          </div>
          <h2 className="text-4xl font-black uppercase mt-8 text-black tracking-tighter">Level Up!</h2>
          <p className="font-bold text-base mt-2 uppercase tracking-wide text-black">You reached Level 5</p>
          
          <div className="bg-white border-4 border-black p-4 rounded-2xl w-full mt-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <p className="font-black uppercase text-[#E53935] mb-1">Reward Unlocked</p>
             <p className="font-bold text-sm">Free Drink at Lima Bay</p>
          </div>

          <button onClick={onClose} className="mt-8 w-full bg-[#1E88E5] text-white border-4 border-black py-4 rounded-2xl font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all">
             Awesome!
          </button>
       </motion.div>
    </div>
  )
}

// --- Public Profile Modal ---
interface PublicProfileModalProps {
  user: User;
  currentUser: User;
  onClose: () => void;
}

export function PublicProfileModal({ user, currentUser, onClose }: PublicProfileModalProps) {
  const { t } = useI18n();
  const userLevel = Math.floor(user.points / 10000) + 1;
  const isBirthday = (() => {
    if (!user.dob) return false;
    const today = new Date();
    const dobDate = new Date(user.dob);
    return today.getMonth() === dobDate.getMonth() && today.getDate() === dobDate.getDate();
  })();

  const isCurrentUserLvl100 = (Math.floor(currentUser.points / 10000) + 1) >= 100;
  const existingRequest = user.contactRequests?.find(r => r.requesterId === currentUser.id);
  const initialStatus = isCurrentUserLvl100 
    ? 'approved' 
    : (existingRequest ? existingRequest.status : 'none');

  const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>(initialStatus);

  const handleRequestContact = async () => {
    if (isCurrentUserLvl100 || status === 'approved') {
      window.open(`https://wa.me/${user.whatsapp?.replace('+', '').replace(/\s+/g, '')}`, '_blank');
      return;
    }
    
    if (status === 'pending') {
      alert('Contact request is already pending approval.');
      return;
    }

    triggerHaptic('tap');
    setStatus('pending');
    
    try {
      const res = await api.requestContact(user.id);
      if (res.success) {
        // Mock-simulation for other users: automatic approval after 1.5 seconds so user can see it unblurred!
        if (user.id !== 'u1') {
          setTimeout(() => {
            setStatus('approved');
            triggerHaptic('success');
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
      setStatus('none');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white border-4 border-black rounded-[32px] w-full max-w-sm overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative p-6 flex flex-col gap-5 text-black"
      >
        <button 
          onClick={() => { triggerHaptic('tap'); onClose(); }} 
          className="absolute top-4 right-4 p-2 bg-white border-2 border-black rounded-full hover:bg-stone-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Header Avatar */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="relative mb-3">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
              className="w-24 h-24 rounded-full border-4 border-black object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-stone-100" 
              alt="Avatar" 
            />
            {isBirthday && (
              <span className="absolute -top-2 -right-2 text-3xl animate-bounce">🎂</span>
            )}
          </div>
          <h3 className="font-black text-2xl uppercase tracking-tight text-black">{user.name}</h3>
          <p className="text-xs font-black text-[#1E88E5] tracking-wide uppercase mt-1 bg-blue-100 border-2 border-[#1E88E5] px-3 py-1 rounded-full">
            Level {userLevel} Explorer
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#FFF8F0] p-4 border-4 border-black rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 block leading-none">Total points</span>
            <span className="font-black text-xl text-[#E53935]">{user.points.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 block leading-none">Current level</span>
            <span className="font-black text-xl text-[#43A047]">{userLevel}</span>
          </div>
        </div>

        {/* Bio & Social Details */}
        <div className="flex flex-col gap-3">
          {user.dob && (
            <div className="flex items-center justify-between gap-2 bg-stone-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-stone-500">📅 DOB:</span>
                <span>
                  <span className="text-black font-black blur-[4px] select-none pointer-events-none">
                    {user.dob.substring(0, 4)}
                  </span>
                  <span className="text-black font-black">
                    {user.dob.substring(4)}
                  </span>
                </span>
              </div>
              {isBirthday && <span className="text-xs text-rose-600 font-black uppercase tracking-wider">🎉 Birthday!</span>}
            </div>
          )}
          {user.email && (
            <div className="flex items-center gap-2 bg-stone-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold truncate">
              <span className="text-stone-500">✉️ Email:</span>
              <span className="text-black font-black truncate blur-[4px] select-none pointer-events-none">
                {user.email}
              </span>
            </div>
          )}

          {/* Social Contact actions */}
          <div className="flex flex-col gap-3 mt-1">
            {user.instagram && (
              <a 
                href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                target="_blank" rel="noopener noreferrer"
                onClick={() => triggerHaptic('tap')}
                className="w-full bg-white hover:bg-stone-50 text-black border-2 border-black py-2 rounded-xl font-black text-center text-xs flex justify-center items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] transition-colors"
              >
                <Instagram size={14} /> @{user.instagram.replace('@', '')}
              </a>
            )}

            {user.whatsapp && (
              <div className="flex flex-col gap-1.5 bg-stone-50 border-2 border-black p-3 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-500 flex items-center gap-1">💬 WhatsApp:</span>
                  {status === 'approved' && (
                    <span className="text-[#43A047] font-black text-[10px] uppercase tracking-wider">🟢 Access Approved</span>
                  )}
                  {status === 'pending' && (
                    <span className="text-amber-600 font-black text-[10px] uppercase tracking-wider animate-pulse">🟡 Pending Approval</span>
                  )}
                  {status === 'none' && (
                    <span className="text-rose-600 font-black text-[10px] uppercase tracking-wider">🔴 Locked (Under Level 100)</span>
                  )}
                </div>

                {status === 'approved' ? (
                  <a 
                    href={`https://wa.me/${user.whatsapp.replace('+', '').replace(/\s+/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => triggerHaptic('tap')}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white border-2 border-black py-2.5 rounded-xl font-black text-center text-xs flex justify-center items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] transition-all"
                  >
                    <MessageCircle size={14} className="fill-current" />
                    Chat WhatsApp ({user.whatsapp})
                  </a>
                ) : (
                  <button
                    onClick={handleRequestContact}
                    className={cn(
                      "w-full border-2 border-black py-2.5 rounded-xl font-black text-center text-xs flex justify-center items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] transition-all",
                      status === 'pending' 
                        ? "bg-stone-200 text-stone-500 cursor-not-allowed shadow-none translate-y-0" 
                        : "bg-[#FDD835] text-black hover:bg-amber-400"
                    )}
                  >
                    <MessageCircle size={14} />
                    {status === 'pending' ? (
                      <span className="flex items-center gap-1">
                        Requesting Access... (Simulating...)
                      </span>
                    ) : (
                      <span>Request WhatsApp Access</span>
                    )}
                  </button>
                )}

                {status !== 'approved' && (
                  <div className="flex items-center gap-1 mt-1 justify-center text-center">
                    <span className="text-[10px] text-stone-400 font-bold leading-tight">
                      {status === 'pending' 
                        ? "Approval request is sent to user. This simulation auto-approves mock profiles." 
                        : "WhatsApp is locked to avoid scams. Reach Level 100 or request approval."}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Home View ---
function Home({ categories, partners, user, events, activities, setUser }: { categories: Category[], partners: Partner[], user: User, events: AppEvent[], activities: Activity[], setUser?: (u: User) => void }) {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const [currentEvent, setCurrentEvent] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const prevPoints = useRef(user.points);

  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedExplorer, setSelectedExplorer] = useState<User | null>(null);

  useEffect(() => {
    api.getLeaderboard().then(setLeaderboard).catch(console.error);
    api.getUsers().then(setAllUsers).catch(console.error);
  }, [user.points]);

  useEffect(() => {
    const currentLvl = Math.floor(user.points / 10000) + 1;
    const prevLvl = Math.floor(prevPoints.current / 10000) + 1;
    if (prevPoints.current > 0 && currentLvl > prevLvl) {
      setTimeout(() => {
        triggerHaptic('success');
        setShowLevelUp(true);
      }, 1000);
    }
    prevPoints.current = user.points;
  }, [user.points]);

  useEffect(() => {
    if (events.length === 0) return;
    const int = setInterval(() => {
      setCurrentEvent(prev => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(int);
  }, [events]);

  const userLevel = Math.floor(user.points / 10000) + 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="p-2.5 flex flex-col gap-2.5 w-full max-w-[600px] mx-auto"
    >
      <AnimatePresence>
        {showLevelUp && <LevelUpModal onClose={() => setShowLevelUp(false)} />}
        {showProfile && (
          <ProfileModal 
            user={user} 
            onClose={() => setShowProfile(false)} 
            onSave={(u) => { 
              if(setUser) setUser(u); 
              api.updateUser(u); 
            }} 
          />
        )}
        {selectedExplorer && (
          <PublicProfileModal 
            user={selectedExplorer} 
            currentUser={user}
            onClose={() => setSelectedExplorer(null)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mt-2">
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => { triggerHaptic('tap'); navigate('/profile'); }}
        >
           <div className="relative">
             <img src={user.avatar} className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" alt="Avatar" />
             <div className="absolute -bottom-0.5 -right-0.5 bg-[#43A047] w-4 h-4 rounded-full border-2 border-black"></div>
           </div>
           <div>
             <h1 className="text-sm md:text-lg font-black tracking-tight text-black leading-none uppercase">{user.name}</h1>
             <p className="text-[10px] md:text-xs text-[#1E88E5] font-black tracking-wide uppercase mt-0.5 bg-blue-100 inline-block px-1.5 py-0.5 rounded-full border-2 border-[#1E88E5]">Lvl. {userLevel}</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:bg-stone-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {(user.pointLogs?.length || 0) > 0 && (
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-black"></span>
            )}
          </button>
          
          {/* Language Selector */}
          <div className="relative">
          <select 
            value={lang}
            onChange={(e) => { triggerHaptic('tap'); setLang(e.target.value as Language); }}
            className="appearance-none bg-[#FDD835] border-4 border-black text-black py-1.5 pl-2.5 pr-7 rounded-xl font-black focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer uppercase text-xs"
          >
            <option value="ko">KOR</option>
            <option value="en">ENG</option>
            <option value="id">IND</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-black">
            <Globe2 size={14} strokeWidth={3} />
          </div>
        </div>
      </div>
      </div>

      {/* Action Row */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        {/* Points Banner */}
        <div 
          className="bg-[#E53935] col-span-2 text-white border-[3px] border-black rounded-[16px] p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden cursor-pointer active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all" 
          onClick={() => { triggerHaptic('tap'); navigate('/wallet'); }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
          <div className="absolute bottom-0 left-10 w-20 h-20 bg-black/10 rounded-full -mb-8 blur-md"></div>
          
          <div className="flex justify-between items-start z-10 relative mb-3">
            <div>
              <p className="text-[10px] font-black uppercase mb-0.5 tracking-widest text-white/90">{t({ ko: '나의 여정 포인트', en: 'Available Miles', id: 'Poin Tersedia' })}</p>
              <h2 className="text-2xl md:text-3xl font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tighter">{user.points.toLocaleString()}</h2>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 md:w-14 md:h-14 bg-white border-4 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12 mb-0.5">
                  <Star size={18} className="text-[#FDD835] fill-[#FDD835]" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="z-10 relative bg-black/20 p-3 rounded-xl border-2 border-black/30 backdrop-blur-sm">
             <div className="flex justify-between items-end mb-1">
               <span className="font-black text-[#FDD835] text-sm uppercase tracking-widest">Level {userLevel}</span>
               <span className="font-black text-[9px] uppercase opacity-80">{(user.points % 10000).toLocaleString()} / 10,000 PTS to next</span>
             </div>
             <div className="w-full h-3 bg-white/30 rounded-full border-2 border-black overflow-hidden relative">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${((user.points % 10000) / 10000) * 100}%` }} 
                   transition={{ duration: 1, ease: "easeOut" }}
                   className="absolute top-0 left-0 bottom-0 bg-[#FDD835] border-r-2 border-black" 
                 />
             </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => { triggerHaptic('tap'); navigate('/scan'); }} 
        className="bg-[#1E88E5] text-white border-[3px] border-black rounded-[16px] p-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all"
      >
         <QrCode size={20} strokeWidth={3} />
         <span className="font-black text-sm uppercase tracking-widest">{t({ ko: 'QR 스캔 및 체크인', en: 'Scan & Check In', id: 'Pindai & Check-in' })}</span>
      </button>

      {/* Sponsored VIP Ads */}
      {(() => {
        const vipAds = partners.filter(p => p.tier === 'vip' && p.isAdFeatured && p.adBannerUrl);
        if (vipAds.length === 0) return null;

        return (
          <div className="flex flex-col gap-1.5 mt-1 text-left">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h3 className="text-[10px] font-black uppercase text-stone-500 tracking-wider">
                  {t({ ko: '🔥 VIP 추천 프로모션', en: '🔥 Featured VIP Specials', id: '🔥 Promosi Spesial VIP' })}
                </h3>
              </div>
              <span className="text-[8px] font-black uppercase bg-black text-[#FDD835] px-1.5 py-0.5 rounded border border-[#FDD835] tracking-widest">VIP ADS</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-hide snap-x">
              {vipAds.map(ad => (
                <div 
                  key={ad.id}
                  onClick={() => {
                    triggerHaptic('tap');
                    api.trackClick(ad.id, 'ad_click');
                    navigate(`/partner/${ad.id}`);
                  }}
                  className="relative min-w-full md:min-w-[480px] h-28 border-[3px] border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-stone-900 cursor-pointer active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all snap-center shrink-0 flex flex-col justify-end"
                >
                  {(ad.adBannerUrl || '').endsWith('.mp4') ? (
                    <video src={ad.adBannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" autoPlay loop muted playsInline />
                  ) : (
                    <img src={ad.adBannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="VIP Ad" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent flex items-center p-4">
                    <div className="flex gap-3.5 items-center w-4/5">
                      <img src={ad.logo} className="w-12 h-12 rounded-xl border-2 border-black object-cover shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-white" alt="logo" />
                      <div className="text-left">
                        <span className="text-[9px] font-black bg-[#FDD835] text-black px-2 py-0.5 rounded border-2 border-black uppercase tracking-wider mb-1.5 inline-block">
                          {ad.name}
                        </span>
                        <p className="text-white font-black text-xs leading-tight line-clamp-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          {t(ad.adText || { ko: "특별 혜택을 확인하려면 탭하세요!", en: "Tap to unlock exclusive VIP benefits!", id: "Ketuk untuk membuka keuntungan VIP eksklusif!" })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white text-black border-2 border-black text-[9px] font-black uppercase px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 select-none">
                    {t({ ko: '가기 ➔', en: 'Visit ➔', id: 'Kunjungi ➔' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Events Banner */}
      {events.length > 0 && (
        <div 
          onClick={() => { triggerHaptic('tap'); navigate(`/event/${events[currentEvent].id}`); }}
          className="relative w-full h-20 border-[3px] border-black rounded-[16px] overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white cursor-pointer active:scale-98 transition-transform"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentEvent}
              src={events[currentEvent].image}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
            <div className="bg-[#E53935] text-white text-[9px] font-black uppercase px-1.5 py-0.5 inline-block rounded border-2 border-black self-start mb-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]">{events[currentEvent].date}</div>
            <h3 className="text-white font-black text-base leading-tight truncate">{t(events[currentEvent].title)}</h3>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-0.5">
        <button 
          onClick={() => { triggerHaptic('tap'); window.open('https://maps.google.com/?q=Canggu+Bali', '_blank'); }}
          className="flex-1 bg-[#1E88E5] text-white border-[3px] border-black py-1.5 px-1.5 rounded-[16px] flex flex-col items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all text-[10px]"
        >
          <MapPin size={22} strokeWidth={3} /> {t({ ko: '구글맵', en: 'Google Maps', id: 'Google Maps' })}
        </button>
        <button 
          onClick={() => triggerHaptic('tap')}
          className="flex-1 bg-white text-black border-[3px] border-black py-1.5 px-1.5 rounded-[16px] flex flex-col items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all text-[10px]"
        >
          <Clock size={22} strokeWidth={3} /> {t({ ko: '테이블 예약', en: 'Book Table', id: 'Pesan Meja' })}
        </button>
      </div>

      {/* Daily Mission Card */}
      {(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const hasClaimedToday = user.lastDailyClaimDate === todayStr;

        return (
          <div className="bg-white border-[3px] border-black rounded-[16px] p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF9C4] border-2 border-black flex items-center justify-center text-xl shrink-0">
                🎁
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-black leading-tight tracking-tight">
                  {t({ ko: '일일 로그인 미션', en: 'Daily Login Mission', id: 'Misi Login Harian' })}
                </h4>
                <p className="text-[10px] font-bold text-stone-500 mt-0.5 leading-tight">
                  {hasClaimedToday 
                    ? t({ ko: '오늘의 보상을 받았습니다! (+100 PTS)', en: 'Today reward claimed! (+100 PTS)', id: 'Hadiah hari ini sudah diklaim! (+100 PTS)' })
                    : t({ ko: '매일 앱을 열고 무료 +100 포인트를 받으세요!', en: 'Open redeem-n.fun daily to claim free +100 PTS!', id: 'Buka redeem-n.fun tiap hari untuk klaim gratis +100 PTS!' })
                  }
                </p>
              </div>
            </div>

            {hasClaimedToday ? (
              <span className="bg-[#E8F5E9] text-[#2E7D32] border-2 border-[#2E7D32] text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
                ✅ {t({ ko: '완료됨', en: 'Claimed', id: 'Selesai' })}
              </span>
            ) : (
              <button
                onClick={async () => {
                  triggerHaptic('heavy');
                  try {
                    const res = await api.claimDailyMission();
                    if (res.success && setUser) {
                      setUser(res.user);
                      alert('🎉 Daily Mission Completed! +100 Points added!');
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="bg-[#FDD835] text-black hover:bg-amber-400 border-2 border-black text-xs font-black uppercase px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
              >
                {t({ ko: '받기', en: 'Claim', id: 'Klaim' })}
              </button>
            )}
          </div>
        );
      })()}

      {/* Incoming Contact Share Requests Notifications */}
      {user.contactRequests && user.contactRequests.some(r => r.status === 'pending') && (
        <div className="bg-[#E1F5FE] border-[3px] border-black rounded-[16px] p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-tight text-[#0288D1]">
            <MessageCircle size={15} className="fill-current" strokeWidth={3} />
            <span>{t({ ko: '연락처 공유 요청', en: 'Contact Share Requests', id: 'Permintaan Kontak' })}</span>
          </div>

          <div className="flex flex-col gap-2">
            {user.contactRequests
              .filter(r => r.status === 'pending')
              .map(req => (
                <div key={req.id} className="bg-white border-2 border-black p-2.5 rounded-xl flex items-center justify-between gap-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={req.requesterAvatar} className="w-8 h-8 rounded-full border border-black object-cover shrink-0" alt="avatar" />
                    <div className="min-w-0">
                      <p className="font-black text-xs text-black leading-tight">{req.requesterName}</p>
                      <p className="text-[9px] font-bold text-stone-400 leading-tight mt-0.5">
                        {t({ ko: 'WhatsApp 공유를 요청했습니다.', en: 'Requested your WhatsApp info', id: 'Minta info WhatsApp Anda' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={async () => {
                        triggerHaptic('success');
                        try {
                          const res = await api.respondContactRequest(req.id, 'approved');
                          if (res.success && setUser) {
                            setUser(res.user);
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="bg-[#43A047] text-white border border-black text-[10px] font-black uppercase px-2 py-1 rounded-lg hover:bg-[#388E3C] shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={async () => {
                        triggerHaptic('tap');
                        try {
                          const res = await api.respondContactRequest(req.id, 'rejected');
                          if (res.success && setUser) {
                            setUser(res.user);
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="bg-[#E53935] text-white border border-black text-[10px] font-black uppercase px-2 py-1 rounded-lg hover:bg-[#D32F2F] shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Category Creative Grid */}
      <div className="mt-1">
        <div className="flex justify-between items-end mb-2">
           <h2 className="text-sm font-black text-black uppercase leading-none">{t({ ko: '탐험하기', en: 'Explore', id: 'Jelajahi' })}</h2>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{categories.length} quests</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((c, i) => (
            // @ts-ignore
            <CategoryCard key={c.id} id={c.id} title={t(c.name) as string} iconName={c.icon} color={c.color} index={i} />
          ))}
        </div>
      </div>

      {/* Top Explorers Leaderboard - Relocated below Explore */}
      <div className="bg-white border-[3px] border-black rounded-[16px] p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-tight text-black mb-2.5 border-b-2 border-black/5 pb-1">
          <Star size={15} strokeWidth={3} className="text-[#FDD835] fill-[#FDD835]" />
          <span>{t({ ko: '탑 익스플로러 랭킹', en: 'Top Explorers', id: 'Peringkat Penjelajah' })}</span>
        </div>
        <div className="flex flex-col gap-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-4 text-xs font-bold text-stone-400">Loading leaderboard...</div>
          ) : (
            leaderboard.map((explorer, index) => {
              const explorerLevel = Math.floor(explorer.points / 10000) + 1;
              const isCurrentUser = explorer.id === user.id;
              
              return (
                <div 
                  key={explorer.id}
                  onClick={() => {
                    triggerHaptic('tap');
                    setSelectedExplorer(explorer);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 p-1.5 rounded-xl border-2 transition-all cursor-pointer active:scale-98",
                    isCurrentUser 
                      ? "bg-[#FFF9C4] border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" 
                      : "bg-stone-50 hover:bg-stone-100 border-stone-200"
                  )}
                >
                  {/* Rank badge */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 border-black flex items-center justify-center font-black text-xs shrink-0 text-black",
                    index === 0 ? "bg-[#FDD835]" : index === 1 ? "bg-stone-300" : index === 2 ? "bg-[#CD7F32]" : "bg-white"
                  )}>
                    {index + 1}
                  </div>
                  
                  {/* Avatar */}
                  <img src={explorer.avatar} className="w-8 h-8 rounded-full border border-black object-cover shrink-0" alt={explorer.name} />
                  
                  {/* Name and Level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("font-black text-xs uppercase leading-none truncate text-black", isCurrentUser && "text-[#E53935]")}>
                        {explorer.name}
                      </span>
                      {isCurrentUser && (
                        <span className="bg-[#E53935] text-white text-[8px] font-black uppercase px-1 rounded-sm leading-none py-0.5">YOU</span>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-stone-500 uppercase">Lvl. {explorerLevel}</span>
                  </div>
                  
                  {/* Points */}
                  <div className="text-right shrink-0">
                    <span className="font-black text-xs text-black block">{explorer.points.toLocaleString()}</span>
                    <span className="text-[8px] font-bold text-stone-400 uppercase leading-none block">PTS</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="mt-1.5 flex flex-col gap-2 mb-4">
        <button onClick={() => navigate('/map')} className="w-full bg-[#FDD835] border-[3px] border-black text-black py-2.5 px-3 rounded-[16px] flex items-center justify-between font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
            <MapPin size={20} strokeWidth={3} /> {t({ ko: '주변 모험 지도', en: 'Adventure Map', id: 'Peta Petualangan' })}
          </div>
          <ArrowRight size={20} strokeWidth={3} />
        </button>

        <button onClick={() => navigate('/faq')} className="w-full bg-[#43A047] border-[3px] border-black text-white py-2.5 px-3 rounded-[16px] flex items-center justify-between font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
            <HelpCircle size={20} strokeWidth={3} /> {t({ ko: '도움말 및 FAQ', en: 'Help & FAQ', id: 'Bantuan & FAQ' })}
          </div>
          <ArrowRight size={20} strokeWidth={3} />
        </button>

        <button className="w-full bg-white border-[3px] border-black text-black py-2.5 px-3 rounded-[16px] flex items-center justify-between font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
            <Phone size={20} strokeWidth={3} /> {t({ ko: '비상 연락망', en: 'Emergency Contact', id: 'Kontak Darurat' })}
          </div>
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>

    </motion.div>
  );
}

const categoryColors: Record<string, string> = {
  eat: 'bg-[#FDD835]',
  nightlife: 'bg-[#1E88E5]',
  stay: 'bg-[#E53935]',
  wellness: 'bg-[#43A047]'
};

function CategoryCard({ id, title, iconName, color, index }: { id: string, title: string, iconName: string, color: string, index: number }) {
  const navigate = useNavigate();
  let Icon = Utensils;
  if(iconName === 'Moon') Icon = Moon;
  if(iconName === 'Bed') Icon = Bed;
  if(iconName === 'Heart') Icon = Heart;

  const bgClass = categoryColors[id] || 'bg-gray-200';
  const heightClass = index % 3 === 0 ? 'h-[120px]' : 'h-[100px]';
  const marginTopClass = index % 2 === 1 ? 'mt-6' : 'mt-0';

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(`/category/${id}`)}
      className={cn(
        "relative flex flex-col justify-end p-4 rounded-[20px] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left overflow-hidden",
        bgClass, heightClass, marginTopClass
      )}
    >
      <div className="absolute top-4 right-4 bg-white/30 w-16 h-16 rounded-full blur-md"></div>
      <div className="absolute -top-4 -left-4 bg-black/5 w-24 h-24 rounded-full"></div>
      
      <div className="bg-white p-2 rounded-xl border-[3px] border-black w-10 h-10 flex items-center justify-center mb-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">
        <Icon size={18} strokeWidth={3} className="text-black" />
      </div>
      <span className="font-black text-black text-sm uppercase mt-2 relative z-10 leading-tight">{title}</span>
    </motion.button>
  );
}

// --- Category View ---
function CategoryView({ partners, categories }: { partners: Partner[], categories: Category[] }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const id = window.location.pathname.split('/').pop();
  const filtered = partners.filter(p => p.categoryId === id).sort((a, b) => a.distance - b.distance);
  
  const category = categories.find(c => c.id === id);
  const bgClass = categoryColors[id || ''] || 'bg-white';

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-[#FFF8F0]">
      <div className={cn("p-5 flex items-center gap-4 border-b-4 border-black sticky top-0 z-20", bgClass)}>
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black bg-white border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-2xl font-black uppercase text-black">{category ? t(category.name) : ''}</h1>
      </div>
      
      <div className="p-3 md:p-5 flex flex-col gap-3 md:gap-6 w-full max-w-[600px] mx-auto">
        {filtered.map(p => (
          <div 
            key={p.id} 
            onClick={() => navigate(`/partner/${p.id}`)}
            className="bg-white p-4 rounded-[32px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col gap-4 cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all group"
          >
            <div className="relative">
              <img src={p.logo} alt={p.name} className="w-full h-40 rounded-2xl object-cover border-4 border-black group-hover:scale-[1.02] transition-transform" />
              <div className="absolute -bottom-4 right-4 bg-[#FDD835] border-4 border-black rounded-2xl px-3 py-1 font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <MapPin size={16} strokeWidth={3}/> {p.distance}km
              </div>
            </div>
            <div className="flex-1 flex flex-col mt-2">
              <h3 className="font-black text-black text-2xl mb-1 uppercase leading-none">{p.name}</h3>
              <p className="text-sm font-bold text-gray-600 line-clamp-2 mt-1 leading-snug">{t(p.description)}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-10 text-black font-black uppercase tracking-widest bg-gray-200 border-4 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">No places found.</div>
        )}
      </div>
    </motion.div>
  );
}

function PartnerDetail({ partners, categories, user, setUser }: { partners: Partner[], categories: Category[], user: User, setUser: (u: User) => void }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const id = window.location.pathname.split('/').pop();
  const partner = partners.find(p => p.id === id);

  const [couponOpen, setCouponOpen] = useState(false);
  const [pointAnim, setPointAnim] = useState<{amount: number, type: 'earn'|'spend'} | null>(null);
  const [checkInTime, setCheckInTime] = useState<number | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  // Reviews feature state
  const [reviews, setReviews] = useState<{ id: string, userName: string, rating: number, comment: string, date: string }[]>([
    { id: '1', userName: 'Alex K.', rating: 5, comment: 'Hands down the best place! The vibes are absolutely immaculate and staff is friendly.', date: '3 days ago' },
    { id: '2', userName: 'Sarah M.', rating: 4, comment: 'Great service, loved the atmosphere. The recommendations were spot on!', date: '1 week ago' },
  ]);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);

  if (!partner) return <div className="p-5 font-black text-black">Not found</div>;

  const handleLink = async (type: string, url: string) => {
    if(!url) return;
    await api.trackClick(partner.id, type);
    window.open(url, '_blank');
  };

  const handleCheckIn = () => {
    setCheckInTime(Date.now());
    setPointAnim({ amount: 50, type: 'earn' });
    api.updateUser({ ...user, points: user.points + 50 }).then(setUser);
    
    // Simulate 30min stay (show review reward prompt after 3 sec)
    setTimeout(() => {
      setShowReviewPrompt(true);
    }, 3000);
  };

  const handleReview = () => {
    setShowReviewPrompt(false);
    // Focus review input element or scroll to review section
    const revSec = document.getElementById('reviews-section');
    if (revSec) {
      revSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRedeem = async (coupon: any) => {
    if (coupon.type === 'redeem') {
       if (user.points >= (coupon.cost || 0)) {
           const res = await api.redeemCoupon(coupon.id, coupon.cost || 0);
           if (res.success && res.user) {
             setPointAnim({ amount: coupon.cost || 0, type: 'spend' });
             setUser(res.user);
           }
       } else {
           alert('Not enough points!');
           setCouponOpen(false);
       }
    } else {
       const updated = await api.saveCoupon(coupon.id);
       setUser(updated);
       alert('Coupon saved to wallet!');
       setCouponOpen(false);
    }
  };

  const handleSubmitReview = () => {
    if (!userComment.trim()) return;
    const newRev = {
      id: Date.now().toString(),
      userName: user.name || 'Explorer',
      rating: userRating,
      comment: userComment.trim(),
      date: 'Just now'
    };
    setReviews([newRev, ...reviews]);
    setUserComment('');
    setHasReviewed(true);
    setPointAnim({ amount: 500, type: 'earn' });
    api.updateUser({ ...user, points: user.points + 500 }).then(setUser);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-[#FFF8F0] relative overflow-y-auto">
      {pointAnim && <PointAnimation amount={pointAnim.amount} type={pointAnim.type} onComplete={() => setPointAnim(null)} />}
      
      {/* Header Image / Video */}
      <div className="relative h-48 md:h-64 w-full border-b-[3px] border-black max-w-[600px] mx-auto shrink-0 bg-stone-900">
        {(partner.banner || partner.images[0] || partner.logo || '').endsWith('.mp4') ? (
          <video src={partner.banner || partner.images[0] || partner.logo} className="w-full h-full object-cover" autoPlay loop muted playsInline />
        ) : (
          <img src={partner.banner || partner.images[0] || partner.logo} className="w-full h-full object-cover" alt="header" />
        )}
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2.5 bg-white border-[3px] border-black rounded-full text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all z-20">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="p-4 bg-[#FFF8F0] flex-1 flex flex-col gap-4 w-full max-w-[600px] mx-auto pb-12">
        {/* Info Header */}
        <div className="bg-white p-4 border-[3px] border-black rounded-[24px] shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          
          <div className="flex items-start gap-3 mb-3">
            <img src={partner.logo} alt="logo" className="w-16 h-16 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] object-cover bg-white shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h1 className="text-xl md:text-2xl font-black text-black uppercase leading-tight line-clamp-2">{partner.name}</h1>
                <div className="flex items-center gap-1 text-[#FDD835] font-black shrink-0 text-sm">
                  <Star size={16} fill="#FDD835" stroke="black" strokeWidth={2.5} />
                  <span className="text-black">4.8</span>
                </div>
              </div>
              
              <div className="flex gap-2 items-center mt-2">
                {/* Clickable Location Badge */}
                <button 
                  onClick={() => handleLink('maps', partner.googleMapsUrl || '')}
                  className="flex items-center gap-1.5 text-xs font-black text-[#1E88E5] bg-stone-50 hover:bg-stone-100 border-2 border-black px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all shrink-0"
                  title="Open in Google Maps"
                >
                  <MapPin size={12} strokeWidth={3} /> {partner.distance}km ({partner.eta}m)
                </button>
                
                {!checkInTime && (
                  <button onClick={handleCheckIn} className="flex-1 bg-[#FDD835] hover:bg-[#FBC02D] border-2 border-black py-1 rounded-xl font-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all uppercase whitespace-nowrap min-w-[70px]">
                    {t({ ko: "체크인", en: "Check In", id: "Check-In" })}
                  </button>
                )}
                {checkInTime && (
                  <div className="flex-1 bg-[#43A047] text-white border-2 border-black py-1 rounded-xl font-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase text-center flex items-center justify-center gap-1.5 whitespace-nowrap min-w-[70px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {t({ ko: "완료", en: "Done", id: "Selesai" })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm font-semibold text-stone-600 leading-relaxed border-t-2 border-dashed border-stone-200 pt-3">
            {t(partner.description)}
          </p>
        </div>

        {/* Compact Social Row */}
        <div className="flex gap-2">
          <button onClick={() => handleLink('instagram', partner.instagram)} className="flex-1 py-2 px-3 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white border-[3px] border-black flex items-center justify-center gap-1.5 font-black text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
            <Instagram size={16} strokeWidth={3} /> INSTA
          </button>
          <button onClick={() => handleLink('whatsapp', partner.whatsapp)} className="flex-1 py-2 px-3 rounded-xl bg-[#43A047] hover:bg-[#388E3C] text-white border-[3px] border-black flex items-center justify-center gap-1.5 font-black text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
            <MessageCircle size={16} strokeWidth={3} /> CHAT
          </button>
          <button onClick={() => handleLink('website', partner.website)} className="flex-1 py-2 px-3 rounded-xl bg-[#FDD835] hover:bg-[#FBC02D] text-black border-[3px] border-black flex items-center justify-center gap-1.5 font-black text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
            <Globe size={16} strokeWidth={3} /> WEB
          </button>
        </div>

        {/* Coupons - Sleek Ticket Style */}
        {partner.coupons && partner.coupons.length > 0 && (
          <div className="flex flex-col gap-2.5">
             <h3 className="font-black text-lg uppercase text-black tracking-wider flex items-center gap-2">
               <Ticket size={18} strokeWidth={3} /> {t({ ko: "쿠폰 혜택", en: "Coupons", id: "Kupon" })}
             </h3>
             {partner.coupons.map(c => (
               <div key={c.id} className={cn(
                 "rounded-[20px] border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden relative",
                 c.type === 'redeem' ? 'bg-[#E53935] text-white' : 'bg-[#1E88E5] text-white'
               )}>
                  {/* Coupon layout with dotted line */}
                  <div className="p-4 flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#FDD835] border-2 border-black px-2 py-0.5 rounded-full inline-block self-start shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      {c.type.toUpperCase()}
                    </span>
                    <h4 className="font-black text-lg md:text-xl leading-tight">{t(c.title)}</h4>
                  </div>
                  
                  {/* Decorative cut-outs on sides with dashed border */}
                  <div className="relative h-1.5 flex items-center justify-between">
                    <div className="w-3 h-3 rounded-full bg-[#FFF8F0] border-r-2 border-black -ml-1.5"></div>
                    <div className="flex-1 border-t-2 border-dashed border-black/30 mx-1"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFF8F0] border-l-2 border-black -mr-1.5"></div>
                  </div>

                  <div className="p-3 bg-black/10">
                    {user.savedCoupons.includes(c.id) ? (
                      <div className="bg-white/40 text-black border-2 border-black border-dashed py-2 rounded-xl font-black text-xs uppercase text-center">
                         {t({ ko: "내 지갑에 저장됨", en: "Saved in Wallet", id: "Tersimpan di Dompet" })}
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setCouponOpen(true); handleRedeem(c); }} 
                        className="w-full bg-white text-black border-[3px] border-black py-2 rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-stone-50 active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all"
                      >
                         {c.type === 'redeem' ? `${t({ ko: "교환하기", en: "Redeem", id: "Tukar" })} (${c.cost} pts)` : t({ ko: "쿠폰 받기", en: "Save Coupon", id: "Simpan Kupon" })}
                      </button>
                    )}
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Recommended Menu with Images */}
        {partner.bestsellers && partner.bestsellers.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="font-black text-lg uppercase text-black tracking-wider flex items-center gap-2">
              <Utensils size={18} strokeWidth={3} /> {t({ ko: '인기 메뉴', en: 'Best Sellers', id: 'Menu Populer' })}
            </h3>
            <div className="flex flex-col gap-2.5">
              {partner.bestsellers.map((item, i) => (
                <div key={i} className="flex gap-3 items-center p-3 rounded-[20px] border-[3px] border-black bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name.en} 
                      className="w-14 h-14 object-cover rounded-xl border-2 border-black shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,1)]" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#FDD835] border-2 border-black rounded-xl shrink-0 flex items-center justify-center font-black text-lg">
                      🍽️
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-black text-base leading-tight truncate">{t(item.name)}</h4>
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      {partner.categoryId.toUpperCase()} FAVORITE
                    </span>
                  </div>
                  <span className="font-black text-black bg-[#FDD835] text-xs md:text-sm px-3 py-1.5 border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        <div className="flex flex-col gap-2.5">
          <h3 className="font-black text-lg uppercase text-black tracking-wider">{t({ ko: '갤러리', en: 'Gallery', id: 'Galeri' })}</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {partner.images.map((img, i) => (
              <img key={i} src={img} alt="gallery" className="w-32 h-32 rounded-[20px] object-cover border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] snap-start shrink-0" />
            ))}
          </div>
        </div>

        {/* Interactive Reviews and Ratings */}
        <div id="reviews-section" className="bg-white p-4 border-[3px] border-black rounded-[24px] shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
          <h3 className="font-black text-lg uppercase text-black tracking-wider flex items-center gap-2">
            <Star size={18} strokeWidth={3} fill="#FDD835" /> {t({ ko: "고객 후기", en: "Customer Reviews", id: "Ulasan Pelanggan" })}
          </h3>

          {/* Form to leave a review */}
          {!hasReviewed ? (
            <div className="p-3 bg-[#FFF8F0] border-2 border-dashed border-black rounded-xl flex flex-col gap-2.5">
              <span className="text-xs font-black uppercase text-stone-700 tracking-wide">
                💬 {t({ ko: "리뷰 남기고 500P 얻기", en: "Leave review to earn 500 PTS", id: "Tulis ulasan dapat 500 PTS" })}
              </span>
              
              {/* Star selector */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => setUserRating(val)}
                    className="transform active:scale-125 transition-transform"
                  >
                    <Star 
                      size={24} 
                      fill={val <= userRating ? "#FDD835" : "transparent"} 
                      stroke="black" 
                      strokeWidth={2.5} 
                    />
                  </button>
                ))}
              </div>

              {/* Text area */}
              <textarea
                value={userComment}
                onChange={e => setUserComment(e.target.value)}
                placeholder={t({ ko: "리뷰 내용을 적어주세요...", en: "Write your honest review...", id: "Tulis ulasan jujur Anda..." })}
                className="w-full p-2.5 border-2 border-black rounded-lg text-xs font-bold text-black focus:outline-none bg-white placeholder-stone-400"
                rows={2}
              />

              {/* Submit button */}
              <button 
                onClick={handleSubmitReview}
                disabled={!userComment.trim()}
                className={cn(
                  "py-2 px-4 rounded-xl border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all",
                  userComment.trim() ? "bg-[#1E88E5] text-white" : "bg-stone-200 text-stone-400 cursor-not-allowed"
                )}
              >
                {t({ ko: "리뷰 제출", en: "Submit Review (+500P)", id: "Kirim Ulasan (+500P)" })}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-[#E8F5E9] border-2 border-[#43A047] rounded-xl text-center">
              <span className="font-black text-[#2E7D32] text-xs uppercase block">
                🎉 {t({ ko: "소중한 후기 감사드립니다! +500P 획득", en: "Review submitted! +500 PTS rewarded", id: "Terima kasih atas ulasan Anda! +500 PTS" })}
              </span>
            </div>
          )}

          {/* List of reviews */}
          <div className="flex flex-col gap-3 mt-1.5">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b border-dashed border-stone-200 pb-2.5 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-xs text-black">{rev.userName}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          size={10} 
                          fill={idx < rev.rating ? "#FDD835" : "transparent"} 
                          stroke="black" 
                          strokeWidth={2} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold">{rev.date}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Review Prompt Notification */}
      <AnimatePresence>
        {showReviewPrompt && (
           <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-24 left-4 right-4 bg-white border-4 border-black rounded-[24px] p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] z-50 text-center max-w-[500px] mx-auto">
             <h4 className="font-black text-lg mb-1 uppercase text-black">Enjoying your stay?</h4>
             <p className="text-xs font-bold text-gray-600 mb-3">Leave a review to earn 500 points instantly!</p>
             <button onClick={handleReview} className="w-full bg-[#1E88E5] text-white py-2.5 border-4 border-black rounded-xl font-black uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all">
               Review Now
             </button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Coupon Modal */}
      <AnimatePresence>
        {couponOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setCouponOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#FFF8F0] border-[4px] border-black rounded-[32px] w-full max-w-sm overflow-hidden shadow-[12px_12px_0px_rgba(255,255,255,1)] flex flex-col"
            >
              <div className="bg-[#E53935] p-6 text-center border-b-[4px] border-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <Ticket size={48} strokeWidth={2.5} className="mx-auto mb-3 text-white relative z-10" />
                <h3 className="text-2xl font-black mb-1 text-white uppercase relative z-10">VIP Pass</h3>
              </div>
              <div className="p-6 text-center bg-white flex-1">
                <div className="text-3xl font-black tracking-widest text-[#43A047] mb-3 py-3 border-4 border-dashed border-black rounded-2xl bg-gray-50">
                  SUCCESS
                </div>
                <p className="text-black font-black text-lg mb-6 leading-snug">Coupon Saved/Redeemed</p>
                
                <button 
                  onClick={() => setCouponOpen(false)} 
                  className="w-full py-3 bg-[#FDD835] text-black border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-2xl font-black text-xl active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// --- Map View ---

// --- Map View ---
function MapView({ partners, user, categories }: { partners: Partner[], user: User, categories: Category[] }) {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>(['eat', 'nightlife', 'stay', 'wellness']);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');

  const toggleCategory = (id: string) => {
    setSelectedCats(prev => {
      if (prev.includes(id)) return prev.filter(cId => cId !== id);
      return [...prev, id];
    });
  };

  const getCategoryIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'Utensils': return <Utensils size={size} strokeWidth={2.5} />;
      case 'Moon': return <Moon size={size} strokeWidth={2.5} />;
      case 'Bed': return <Bed size={size} strokeWidth={2.5} />;
      case 'Heart': return <Heart size={size} strokeWidth={2.5} />;
      default: return <MapPin size={size} strokeWidth={2.5} />;
    }
  };

  const filteredPartners = partners.filter(p => {
    if (!p.latitude || !p.longitude) return false;
    if (!selectedCats.includes(p.categoryId)) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(query) || 
           (p.description?.ko?.toLowerCase().includes(query)) ||
           (p.description?.en?.toLowerCase().includes(query)) ||
           (p.description?.id?.toLowerCase().includes(query));
  });

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#E3F2FD] overflow-hidden">
      <div className="absolute top-4 left-4 right-4 z-[999] flex flex-col gap-3 pointer-events-none">
        <div className="flex gap-2 items-center w-full pointer-events-auto">
          <button onClick={() => navigate(-1)} className="p-3 bg-white border-4 border-black rounded-full text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex-shrink-0">
            <ArrowLeft size={22} strokeWidth={3} />
          </button>
          <div className="flex-1 flex items-center bg-white border-4 border-black rounded-full px-4 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative gap-2">
            <Search size={20} className="text-black/70 flex-shrink-0" strokeWidth={2.5} />
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t({ ko: "장소 검색...", en: "Search spots...", id: "Cari tempat..." }) as string}
              className="w-full bg-transparent border-none outline-none font-bold text-sm text-black placeholder-black/50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                <X size={16} className="text-black" strokeWidth={3} />
              </button>
            )}
          </div>
          <button 
            onClick={() => { triggerHaptic('tap'); setMapMode(prev => prev === '3d' ? '2d' : '3d'); }}
            className="bg-[#1E88E5] text-white border-4 border-black p-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex-shrink-0 font-black text-xs uppercase flex items-center gap-1.5"
          >
            <Compass size={16} className={cn(mapMode === '3d' && "animate-spin-slow")} />
            <span>{mapMode === '3d' ? '2D Map' : '3D Play'}</span>
          </button>
          <div className="bg-[#FDD835] border-4 border-black px-3.5 py-2.5 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black flex items-center gap-1.5 text-black text-sm flex-shrink-0">
            <Star className="text-black fill-black" size={18} /> 
            <span>{(user.points/1000).toFixed(1)}k</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none pointer-events-auto px-1 -mx-1 mask-linear-r">
          {categories.map((c) => {
            const isActive = selectedCats.includes(c.id);
            return (
              <button
                key={c.id} onClick={() => toggleCategory(c.id)}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-full border-4 border-black font-black text-xs uppercase tracking-tight transition-all flex-shrink-0 active:scale-95", isActive ? `${c.color} text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]` : "bg-white/80 text-black/50 border-black/40 shadow-none")}
              >
                <span className={cn("transition-colors", isActive ? "text-black" : "text-black/40")}>{getCategoryIcon(c.icon, 16)}</span>
                <span>{t(c.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 w-full relative z-[10] border-t-[6px] border-black">
        {mapMode === '3d' ? (
          <AdventureMap
            partners={filteredPartners}
            selectedPartner={selectedPartner}
            onSelectPartner={(p) => {
              triggerHaptic('success');
              setSelectedPartner(p);
            }}
          />
        ) : (
          <MapContainer center={[-8.6478, 115.1385]} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPartners.map(p => (
              <Marker key={p.id} position={[p.latitude!, p.longitude!]} eventHandlers={{ click: () => setSelectedPartner(p) }}>
                <Popup>
                  <div className="font-bold">{p.name}</div>
                  {p.googleMapsUrl && <a href={p.googleMapsUrl} target="_blank" className="text-blue-500 underline text-xs">Open in Maps</a>}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>


      <AnimatePresence>
        {selectedPartner && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-[1000] bg-white border-t-4 border-black rounded-t-[32px] shadow-[0_-8px_0px_rgba(0,0,0,0.1)] pb-8 pt-2 px-4"
          >
            <div className="w-12 h-2 bg-stone-300 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setSelectedPartner(null)} />
            <div className="flex gap-4">
              <img src={selectedPartner.logo} alt={selectedPartner.name} className="w-20 h-20 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover" />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">{t(categories.find(c => c.id === selectedPartner.categoryId)?.name || {ko:'',en:'',id:''})}</span>
                <h3 className="font-black text-2xl uppercase text-black leading-none truncate">{selectedPartner.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 border-2 border-green-700 font-bold text-xs rounded-full">{selectedPartner.distance}km</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-stone-600 line-clamp-2">{t(selectedPartner.description)}</p>
            <button 
              onClick={() => navigate(`/partner/${selectedPartner.id}`)}
              className="mt-5 w-full py-4 bg-[#1E88E5] border-4 border-black text-white font-black uppercase tracking-widest text-lg rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
            >
              View Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// --- Wallet View ---
function WalletView({ user, partners }: { user: User, partners: Partner[] }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'saved' | 'redeem' | 'history'>('saved');
  const [selectedCouponForQR, setSelectedCouponForQR] = useState<any | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'earned' | 'spent' | 'promotional'>('all');

  const filterLabel = (type: 'all' | 'earned' | 'spent' | 'promotional') => {
    switch (type) {
      case 'all':
        return t({ ko: '전체', en: 'All', id: 'Semua' });
      case 'earned':
        return t({ ko: '적립됨', en: 'Earned', id: 'Diterima' });
      case 'spent':
        return t({ ko: '사용됨', en: 'Spent', id: 'Digunakan' });
      case 'promotional':
        return t({ ko: '프로모션', en: 'Promotional', id: 'Promosi' });
    }
  };

  const handleExportStatement = () => {
    triggerHaptic('success');
    const border = "========================================\n";
    let text = "";
    text += border;
    text += "       M-TOWN LOYALTY STATEMENT        \n";
    text += `   Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    text += `   User: ${user.name}\n`;
    text += `   Balance: ${user.points} PTS\n`;
    text += border;
    text += "  DATE      | TYPE  | PTS   | DETAIL\n";
    text += border;
    
    pointLogs.forEach(log => {
      const dateStr = new Date(log.timestamp).toLocaleDateString(undefined, {month: '2-digit', day: '2-digit'});
      const typeStr = log.points > 0 ? "EARN" : log.points < 0 ? "SPEND" : "PROMO";
      const ptsStr = String(log.points);
      const titleStr = t(log.title);
      text += `${dateStr.padEnd(11)} | ${typeStr.padEnd(5)} | ${ptsStr.padEnd(5)} | ${titleStr}\n`;
    });
    text += border;
    text += "        Thank you for choosing M-Town!     \n";
    text += border;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `m_town_statement_${user.name.toLowerCase().replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  // Gather all saved coupons from user
  const allCoupons = partners.flatMap(p => p.coupons.map(c => ({...c, partnerName: p.name, partnerId: p.id})));
  const saved = allCoupons.filter(c => user.savedCoupons.includes(c.id));
  const redeemable = allCoupons.filter(c => c.type === 'redeem');

  const handleRedeem = async (coupon: any) => {
    triggerHaptic('tap');
    if (user.points < coupon.cost) {
      alert('Not enough points!');
      return;
    }
    if (confirm(`Redeem ${coupon.title.en} for ${coupon.cost} points?`)) {
      const res = await api.redeemCoupon(coupon.id, coupon.cost);
      if (res.success) {
        triggerHaptic('success');
        alert('Coupon redeemed and saved to your wallet!');
        window.location.reload(); // Quick way to refresh state
      } else {
        alert(res.error || 'Failed to redeem');
      }
    }
  };

  const handleSimulateScan = async () => {
    if (!selectedCouponForQR) return;
    setRedeeming(true);
    triggerHaptic('tap');
    try {
      const qrDataStr = JSON.stringify({
        userId: user.id,
        couponId: selectedCouponForQR.id,
        partnerId: selectedCouponForQR.partnerId
      });
      const res = await api.scanQRRedeem(qrDataStr);
      if (res.success) {
        triggerHaptic('success');
        alert(`Success! The vendor at ${selectedCouponForQR.partnerName} has scanned the QR code. Coupon redeemed successfully!`);
        setSelectedCouponForQR(null);
        window.location.reload();
      } else {
        triggerHaptic('error');
        alert(res.message || 'Scanning failed');
      }
    } catch (e) {
      triggerHaptic('error');
      alert('Error scanning');
    } finally {
      setRedeeming(false);
    }
  };

  // Safe reference to point logs
  const pointLogs = user.pointLogs || [];
  const filteredLogs = pointLogs.filter(log => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'earned') return log.points > 0;
    if (historyFilter === 'spent') return log.points < 0;
    if (historyFilter === 'promotional') return log.points === 0;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-[#FFF8F0] overflow-hidden text-black relative">
      {/* QR Code Modal for Saved Coupons */}
      <AnimatePresence>
        {selectedCouponForQR && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white border-4 border-black p-6 rounded-[32px] max-w-sm w-full text-center shadow-[8px_8px_0px_rgba(0,0,0,1)] relative flex flex-col gap-4 text-black"
            >
              <button 
                onClick={() => { triggerHaptic('tap'); setSelectedCouponForQR(null); }}
                className="absolute top-4 right-4 p-2 bg-white border-2 border-black rounded-full hover:bg-stone-100 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              >
                <X size={16} strokeWidth={3} />
              </button>

              <div className="mt-4">
                <span className="bg-[#FDD835] text-xs font-black uppercase px-2.5 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] inline-block mb-1">
                  {selectedCouponForQR.partnerName}
                </span>
                <h3 className="font-black text-xl uppercase tracking-tight text-black mt-2 leading-tight">
                  {t(selectedCouponForQR.title)}
                </h3>
              </div>

              {/* QR Image Container */}
              <div className="bg-stone-50 border-4 border-black p-4 rounded-2xl mx-auto flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ userId: user.id, couponId: selectedCouponForQR.id, partnerId: selectedCouponForQR.partnerId }))}`}
                  alt="Redemption QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="text-xs font-bold text-gray-500 leading-snug px-2">
                Show this QR Code to the vendor at <span className="font-black text-black">{selectedCouponForQR.partnerName}</span>. They will scan it to instantly process your redemption!
              </div>

              {/* Simulation Option */}
              <div className="border-t-2 border-stone-200 pt-4 mt-2">
                <button 
                  onClick={handleSimulateScan}
                  disabled={redeeming}
                  className="w-full bg-[#1E88E5] text-white border-4 border-black py-3 rounded-xl font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-[#1565C0] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <QrCode size={16} strokeWidth={3} />
                  {redeeming ? 'PROCESSING REDEMPTION...' : 'SIMULATE VENDOR SCAN'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-4 md:p-5 flex items-center gap-3 md:gap-4 border-b-4 border-black bg-[#FFF8F0] z-20 shrink-0">
        <button onClick={() => { triggerHaptic('tap'); navigate(-1); }} className="p-2 -ml-2 text-black bg-white border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-2xl font-black uppercase text-black">My Wallet</h1>
      </div>
      
      <div className="flex bg-white border-b-4 border-black shrink-0">
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('saved'); }}
          className={cn(
            "flex-1 py-4 font-black text-xs md:text-sm uppercase tracking-wider border-r-4 border-black transition-all", 
            activeTab === 'saved' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          {t({ ko: "내 쿠폰", en: "My Coupons", id: "Kupon Saya" })}
        </button>
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('redeem'); }}
          className={cn(
            "flex-1 py-4 font-black text-xs md:text-sm uppercase tracking-wider border-r-4 border-black transition-all", 
            activeTab === 'redeem' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          {t({ ko: "리딤 숍", en: "Redeem Store", id: "Toko Penukaran" })}
        </button>
        <button 
          onClick={() => { triggerHaptic('tap'); setActiveTab('history'); }}
          className={cn(
            "flex-1 py-4 font-black text-xs md:text-sm uppercase tracking-wider transition-all", 
            activeTab === 'history' ? "bg-[#FDD835] text-black" : "text-gray-500 hover:text-black"
          )}
        >
          {t({ ko: "이용 내역", en: "History", id: "Riwayat" })}
        </button>
      </div>
            
      <div className="p-3 md:p-5 flex flex-col gap-3 md:gap-6 flex-1 overflow-y-auto max-w-[600px] mx-auto w-full">
         <div className="bg-[#1E88E5] text-white border-4 border-black p-6 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <p className="text-sm font-black uppercase mb-1">Total Points</p>
            <h2 className="text-4xl md:text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">{user.points.toLocaleString()}</h2>
         </div>
         
         {activeTab === 'saved' && (
           <div className="flex flex-col gap-4">
             {saved.length === 0 ? (
                <div className="text-center p-8 bg-gray-200 border-4 border-black rounded-[24px] font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">No coupons yet.</div>
             ) : (
                saved.map((c, i) => (
                  <div 
                    key={i} 
                    onClick={() => { triggerHaptic('tap'); setSelectedCouponForQR(c); }} 
                    className="bg-white p-5 border-4 border-black rounded-[32px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2 cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all group hover:border-[#1E88E5]"
                  >
                     <div className="flex justify-between items-center w-full">
                       <span className="text-xs font-black uppercase bg-[#FDD835] px-2 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{c.partnerName}</span>
                       <span className="text-[10px] font-black text-[#1E88E5] uppercase tracking-wide group-hover:underline">Click to Use ➔</span>
                     </div>
                     <h4 className="text-xl font-black text-black leading-tight mt-1">{t(c.title)}</h4>
                     <div className="mt-2 text-lg font-black tracking-widest bg-gray-100 border-4 border-dashed border-black p-3 rounded-2xl text-center text-black group-hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2">
                       <QrCode size={20} strokeWidth={3} className="text-[#1E88E5]" />
                       <span>{c.code}</span>
                     </div>
                  </div>
                ))
             )}
           </div>
         )}
         
         {activeTab === 'redeem' && (
           <div className="flex flex-col gap-4">
             {redeemable.length === 0 ? (
                <div className="text-center p-8 bg-gray-200 border-4 border-black rounded-[24px] font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">No rewards available.</div>
             ) : (
                redeemable.map((c, i) => (
                  <div key={i} className="bg-white p-5 border-4 border-black rounded-[32px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
                     <span className="text-xs font-black uppercase bg-[#FDD835] px-2 py-1 border-2 border-black rounded-full self-start shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{c.partnerName}</span>
                     <h4 className="text-xl font-black text-black leading-tight mt-1">{t(c.title)}</h4>
                     <div className="mt-4 flex justify-between items-center">
                       <span className="font-black text-[#E53935] text-xl">{c.cost} PTS</span>
                       <button 
                         onClick={() => handleRedeem(c)}
                         disabled={user.savedCoupons.includes(c.id)}
                         className={cn("px-4 py-2 border-4 border-black font-black uppercase rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all", user.savedCoupons.includes(c.id) ? "bg-gray-300 text-gray-500 shadow-none translate-y-[4px] translate-x-[4px]" : "bg-[#43A047] text-white")}
                       >
                         {user.savedCoupons.includes(c.id) ? 'Claimed' : 'Redeem'}
                       </button>
                     </div>
                  </div>
                ))
             )}
           </div>
         )}

         {activeTab === 'history' && (
           <div className="flex flex-col gap-4 animate-in fade-in duration-200">
             {/* Category Filter & Utility Header */}
             <div className="bg-white p-4 border-4 border-black rounded-[28px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
               <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Filter Transactions</span>
                 <div className="flex flex-wrap gap-2">
                   {(['all', 'earned', 'spent', 'promotional'] as const).map((type) => (
                     <button
                       key={type}
                       type="button"
                       onClick={() => {
                         triggerHaptic('tap');
                         setHistoryFilter(type);
                       }}
                       className={cn(
                         "px-3 py-1.5 border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-tight transition-all",
                         historyFilter === type 
                           ? "bg-[#FDD835] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                           : "bg-stone-50 text-stone-500 hover:text-black hover:bg-stone-100 shadow-none active:translate-y-[1px]"
                       )}
                     >
                       {type === 'all' && '🌍 '}
                       {type === 'earned' && '📈 '}
                       {type === 'spent' && '📉 '}
                       {type === 'promotional' && '🎁 '}
                       {filterLabel(type)}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Sub-bar with statement export button */}
               <div className="flex items-center justify-between border-t-2 border-black/10 pt-3 mt-1.5">
                 <span className="text-[9px] font-mono text-stone-500 font-bold">
                   Showing {filteredLogs.length} of {pointLogs.length} logs
                 </span>
                 
                 <button
                   onClick={handleExportStatement}
                   type="button"
                   className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-stone-800 text-white border-2 border-black rounded-xl text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
                 >
                   <FileSpreadsheet size={11} strokeWidth={2.5} />
                   Export Statement (.txt)
                 </button>
               </div>
             </div>

             {filteredLogs.length === 0 ? (
                <div className="text-center p-8 bg-gray-100 border-4 border-dashed border-stone-300 rounded-[24px] font-black uppercase text-stone-400">
                  {t({ 
                    ko: "필터링된 내역이 없습니다.", 
                    en: "No matching records found.", 
                    id: "Tidak ada riwayat dengan filter ini." 
                  })}
                </div>
             ) : (
                filteredLogs.map((log) => {
                  const isEarn = log.points > 0;
                  const isFree = log.points === 0;
                  
                  return (
                    <div key={log.id} className="bg-white p-4 border-4 border-black rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-center">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl border-4 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]",
                        isEarn ? "bg-[#81C784]" : isFree ? "bg-[#64B5F6]" : "bg-[#E57373]"
                      )}>
                        {isEarn ? <TrendingUp size={20} className="text-black" strokeWidth={2.5} /> : isFree ? <Gift size={20} className="text-black" strokeWidth={2.5} /> : <TrendingDown size={20} className="text-black" strokeWidth={2.5} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-black leading-snug text-sm uppercase tracking-tight md:text-base">
                          {t(log.title)}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-stone-500 font-bold">
                          {log.partnerName && (
                            <span className="text-black bg-[#FDD835] px-1.5 py-0.5 border-2 border-black rounded-md text-[10px] font-black uppercase">
                              {log.partnerName}
                            </span>
                          )}
                          <span>
                            {new Date(log.timestamp).toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {log.couponCode && (
                          <div className="mt-1.5 text-[11px] font-black tracking-wider bg-stone-100 border-2 border-dashed border-stone-400 px-2 py-1 rounded-lg inline-block text-stone-700">
                            CODE: {log.couponCode}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className={cn(
                          "font-black text-sm md:text-lg block drop-shadow-[1px_1px_0px_rgba(0,0,0,0.15)]",
                          isEarn ? "text-[#2E7D32]" : isFree ? "text-[#1565C0]" : "text-[#C62828]"
                        )}>
                          {isEarn ? `+${log.points}` : isFree ? "FREE" : `${log.points}`}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                          {isFree ? "Coupons" : "PTS"}
                        </span>
                      </div>
                    </div>
                  );
                })
             )}
           </div>
         )}
      </div>
    </motion.div>
  );
}

// --- Profile View ---
function ProfileView({ user, updateUser }: { user: User, updateUser: (updates: Partial<User>) => Promise<void> }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || '');
  const [instagram, setInstagram] = useState(user.instagram || '');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(user.dob || '');
  const [subscribed, setSubscribed] = useState(user.subscribedToNotifications !== false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHaptic('tap');
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');

    let finalAvatar = avatar;
    if (avatar && avatar.startsWith('data:')) {
      try {
        finalAvatar = await uploadImage(avatar, `avatars/user_${user.id}`);
      } catch (err) {
        console.error("Avatar upload failed:", err);
      }
    }

    await updateUser({ 
      name, 
      email, 
      avatar: finalAvatar,
      whatsapp, 
      instagram, 
      password: password ? password : user.password,
      dob,
      subscribedToNotifications: subscribed 
    });
    alert('Profile updated!');
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.reload();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-[#FFF8F0] text-black">
      <div className="p-5 flex items-center gap-4 border-b-4 border-black bg-[#FFF8F0] sticky top-0 z-20">
        <button 
          onClick={() => { triggerHaptic('tap'); navigate(-1); }} 
          className="p-2 -ml-2 text-black bg-white border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-2xl font-black uppercase text-black">Edit Profile</h1>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[500px] mx-auto">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => { triggerHaptic('tap'); fileInputRef.current?.click(); }}
              className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gray-200 cursor-pointer group relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
               <img src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-white text-xs font-black uppercase tracking-wider text-center p-2">Upload Photo</span>
               </div>
            </div>
            <button 
              type="button"
              onClick={() => { triggerHaptic('tap'); fileInputRef.current?.click(); }}
              className="text-xs font-black uppercase text-[#1E88E5] underline mt-1"
            >
              Change Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-black text-sm uppercase">Name</label>
            <input 
              required type="text" value={name} onChange={e => setName(e.target.value)} 
              className="border-4 border-black rounded-xl p-4 font-bold bg-white text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-black text-sm uppercase">Email (optional)</label>
            <input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} 
              className="border-4 border-black rounded-xl p-4 font-bold bg-white text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-black text-sm uppercase">Date of Birth (Untuk Reward Ultah 🎁)</label>
            <input 
              type="date" value={dob} onChange={e => setDob(e.target.value)} 
              className="border-4 border-black rounded-xl p-4 font-bold bg-white text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            />
            <p className="text-[10px] font-bold text-gray-400">Set DOB to today's date to test the automatic +5000 Birthday Points reward celebration!</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-black text-sm uppercase">WhatsApp (e.g. +62812345678)</label>
            <input 
              type="text" placeholder="+62..." value={whatsapp} onChange={e => setWhatsapp(e.target.value)} 
              className="border-4 border-black rounded-xl p-4 font-bold bg-white text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-black text-sm uppercase">Instagram Username (e.g. @username)</label>
            <input 
              type="text" placeholder="@username" value={instagram} onChange={e => setInstagram(e.target.value)} 
              className="border-4 border-black rounded-xl p-4 font-bold bg-white text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-black text-sm uppercase">Change Password</label>
            <input 
              type="password" placeholder="Leave empty to keep current" value={password} onChange={e => setPassword(e.target.value)} 
              className="border-4 border-black rounded-xl p-4 font-bold bg-white text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            />
          </div>

          {/* Simulated Push Notification Toggle */}
          <div className="flex items-center justify-between bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFF8F0] p-2 border-2 border-black rounded-xl text-black">
                <Bell size={20} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <span className="font-black text-xs uppercase block leading-none text-black">Push Notifications</span>
                <span className="text-[10px] font-bold text-gray-400 mt-1 block leading-none">Simulate daily reward alerts & news</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { triggerHaptic('tap'); setSubscribed(!subscribed); }}
              className={cn(
                "w-12 h-6 rounded-full border-2 border-black relative transition-colors duration-200 focus:outline-none shrink-0",
                subscribed ? "bg-[#43A047]" : "bg-stone-300"
              )}
            >
              <span 
                className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 bg-white border-2 border-black rounded-full transition-transform duration-200",
                  subscribed ? "translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>

          <button type="submit" className="w-full bg-[#43A047] text-white border-4 border-black py-4 rounded-xl font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-4 uppercase">
            Save Changes
          </button>

          <button type="button" onClick={handleLogout} className="w-full bg-black text-white border-4 border-black py-4 rounded-xl font-black text-xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase">
            <LogOut size={24} /> Logout
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// --- Scan View ---
function ScanView({ user, updateUser, partners }: { user: User, updateUser: (updates: Partial<User>) => Promise<void>, partners: Partner[] }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [scanned, setScanned] = useState(false);
  const [pointAnim, setPointAnim] = useState<{amount: number, type: 'earn'|'spend'} | null>(null);
  const [showMockChooser, setShowMockChooser] = useState(false);

  const handleScan = async (text: string) => {
    if (scanned) return;

    try {
      const parsed = JSON.parse(text);
      
      // Check if it's a VIP Visit Scan benefit QR code
      if (parsed && parsed.type === 'vip_visit') {
        setScanned(true);
        const partnerId = parsed.partnerId;
        const partner = partners.find(p => p.id === partnerId);
        if (!partner) {
          alert("VIP Partner venue not found!");
          setScanned(false);
          return;
        }

        // Check if user already claimed
        if (user.claimedVipBenefits && user.claimedVipBenefits.includes(partnerId)) {
          alert(`You have already claimed your VIP visit benefits for ${partner.name}!`);
          setScanned(false);
          return;
        }

        const res = await api.claimVipVisit(partnerId);
        if (res.success && res.user) {
          triggerHaptic('heavy');
          setPointAnim({ amount: 250, type: 'earn' });
          await updateUser({}); // reload state
          alert(`🎉 VIP Check-In Successful!\n\nYou visited ${partner.name} and unlocked:\n\n✨ +250 PTS VIP Visit Bonus!\n🎁 VIP Mystery Welcome Gift Coupon (added to Wallet)!`);
          setTimeout(() => navigate('/wallet'), 2500);
        } else {
          alert(res.error || 'Failed to claim VIP visit benefits');
          setScanned(false);
        }
        return;
      }

      // Check if it's a claim_coupon QR code
      if (parsed && parsed.action === 'claim_coupon' && parsed.couponId) {
        setScanned(true);
        const partner = partners.find(p => p.id === parsed.partnerId);
        const coupon = partner?.coupons.find(c => c.id === parsed.couponId);
        if (coupon) {
          if (coupon.type === 'redeem') {
            const cost = coupon.cost || 0;
            if (user.points >= cost) {
              const res = await api.redeemCoupon(coupon.id, cost);
              if (res.success && res.user) {
                setPointAnim({ amount: cost, type: 'spend' });
                await updateUser({}); // reload state
                alert(`🎉 Success! Redeemed "${coupon.title.en}" directly via QR!`);
              } else {
                alert(res.error || 'Failed to redeem coupon');
                setScanned(false);
                return;
              }
            } else {
              alert(`Not enough points to redeem "${coupon.title.en}"! Needs ${cost} PTS.`);
              setScanned(false);
              return;
            }
          } else {
            const updated = await api.saveCoupon(coupon.id);
            await updateUser({}); // reload
            alert(`🎉 Success! Saved "${coupon.title.en}" to your wallet!`);
          }
          setTimeout(() => navigate('/wallet'), 2000);
          return;
        }
      }
    } catch (e) {
      // Not JSON, fall back to standard point scan
    }

    setScanned(true);
    setPointAnim({ amount: 500, type: 'earn' });
    await updateUser({ points: user.points + 500 });
    setTimeout(() => navigate(-1), 2000);
  };

  const handleMockClick = () => {
    setShowMockChooser(true);
  };

  const executeMockScenario = (type: 'standard' | 'vip_lima' | 'vip_puco') => {
    setShowMockChooser(false);
    triggerHaptic('tap');
    
    if (type === 'standard') {
      const nudePartner = partners.find(p => p.id === 'p3');
      const coupon = nudePartner?.coupons[0];
      if (coupon && nudePartner) {
        handleScan(JSON.stringify({
          action: 'claim_coupon',
          couponId: coupon.id,
          partnerId: nudePartner.id
        }));
      } else {
        handleScan('mock');
      }
    } else if (type === 'vip_lima') {
      handleScan(JSON.stringify({
        type: 'vip_visit',
        partnerId: 'p1',
        partnerName: 'Lima Bay'
      }));
    } else if (type === 'vip_puco') {
      handleScan(JSON.stringify({
        type: 'vip_visit',
        partnerId: 'p6',
        partnerName: 'PUCO ROOFTOP Coworking Space & Eatery'
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col h-full bg-black text-white relative">
      {pointAnim && <PointAnimation amount={pointAnim.amount} type={pointAnim.type} onComplete={() => setPointAnim(null)} />}
      <div className="absolute top-5 left-5 z-20">
        <button onClick={() => navigate(-1)} className="p-2 text-black bg-white border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <h2 className="text-2xl font-black uppercase mb-8 tracking-widest text-center">{t({ ko: '가맹점 QR 스캔', en: 'Scan Partner QR', id: 'Pindai QR Mitra' })}</h2>
        
        <div className="w-full max-w-sm aspect-square bg-gray-800 rounded-3xl border-8 border-white overflow-hidden relative shadow-[0_0_0_8px_rgba(0,0,0,1)] flex items-center justify-center">
            {/* Using mock scanner or library here */}
            <Scanner 
              onScan={(result) => handleScan(result[0].rawValue)} 
              onError={(e) => console.error(e)} 
              components={{ finder: false, audio: false }}
            />
            {/* Animated Scanning Line */}
            <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }} 
               transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} 
               className="absolute left-0 right-0 h-1 bg-[#FDD835] shadow-[0_0_10px_#FDD835] z-10" 
            />
        </div>
        
        <p className="mt-8 text-center text-sm font-bold opacity-80 uppercase tracking-wide">
          {t({ ko: '카메라가 자동으로 켜집니다', en: 'Camera will activate automatically', id: 'Kamera akan aktif secara otomatis' })}
        </p>

        <button onClick={handleMockClick} className="mt-8 px-6 py-3 bg-[#43A047] text-white border-4 border-white font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 transition-all active:translate-y-0.5">
           Mock Scan (Test Options)
        </button>

        {/* Mock Chooser Drawer */}
        <AnimatePresence>
          {showMockChooser && (
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-white border-t-8 border-black rounded-t-[32px] p-6 z-30 text-black shadow-[0_-10px_30px_rgba(0,0,0,0.5)] max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-stone-200">
                <span className="font-black uppercase text-sm tracking-wide">Choose QR Code Scenario</span>
                <button onClick={() => setShowMockChooser(false)} className="p-1 font-bold hover:bg-stone-100 rounded-lg">✕</button>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => executeMockScenario('standard')} 
                  className="w-full text-left bg-stone-50 border-4 border-black p-3.5 rounded-xl font-black text-xs flex justify-between items-center hover:bg-stone-100 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  <span>🎫 SCAN STANDARD 10% OFF COUPON</span>
                  <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 border border-black rounded">Nude Cafe</span>
                </button>

                <button 
                  onClick={() => executeMockScenario('vip_lima')} 
                  className="w-full text-left bg-amber-50 border-4 border-[#F57F17] p-3.5 rounded-xl font-black text-xs flex justify-between items-center hover:bg-amber-100 shadow-[2px_2px_0px_#F57F17]"
                >
                  <span className="text-[#E65100]">✨ SCAN VIP VISIT QR (LIMA BAY)</span>
                  <span className="text-[9px] bg-amber-200 text-amber-800 px-1.5 py-0.5 border border-amber-800 rounded">250 PTS + Gift</span>
                </button>

                <button 
                  onClick={() => executeMockScenario('vip_puco')} 
                  className="w-full text-left bg-purple-50 border-4 border-purple-800 p-3.5 rounded-xl font-black text-xs flex justify-between items-center hover:bg-purple-100 shadow-[2px_2px_0px_purple]"
                >
                  <span className="text-purple-800">✨ SCAN VIP VISIT QR (PUCO ROOFTOP)</span>
                  <span className="text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.5 border border-purple-800 rounded">250 PTS + Gift</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// --- Event Detail View ---
export function EventDetail({ events }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="flex flex-col h-full bg-[#FFF8F0] items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-black uppercase mb-4">{t({ ko: "이벤트를 찾을 수 없습니다", en: "Event Not Found", id: "Acara Tidak Ditemukan" })}</h2>
        <button onClick={() => navigate('/')} className="bg-black text-white border-4 border-black px-6 py-3 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
          {t({ ko: "홈으로 돌아가기", en: "Go Home", id: "Kembali ke Beranda" })}
        </button>
      </div>
    );
  }

  const handleAction = () => {
    if (event.buttonLink) {
      window.open(event.buttonLink, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FFF8F0] pb-24">
      <div className="p-4 flex items-center justify-between border-b-4 border-black bg-white sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border-4 border-black rounded-full text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <span className="font-black text-lg uppercase tracking-tight text-black">{t({ ko: "이벤트 상세", en: "Event Info", id: "Detail Acara" })}</span>
        <div className="w-11" /> {/* Spacer */}
      </div>

      <div className="p-4 max-w-[600px] mx-auto w-full flex flex-col gap-5">
        <div className="relative w-full aspect-video border-4 border-black rounded-[32px] overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)] bg-white">
          {(event.image || '').endsWith('.mp4') ? (
            <video src={event.image} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : (
            <img src={event.image} className="w-full h-full object-cover" alt="Event Banner" />
          )}
          <div className="absolute top-4 left-4 bg-[#E53935] text-white text-xs font-black uppercase px-3 py-1.5 rounded-full border-2 border-white shadow-lg">
            {event.date}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6 rounded-[32px] shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-black uppercase leading-tight">
            {t(event.title)}
          </h1>
          
          <div className="w-full h-1 bg-black/10 rounded-full" />

          {event.description && (event.description.en || event.description.ko || event.description.id) ? (
            <p className="text-gray-700 font-bold text-base whitespace-pre-wrap leading-relaxed">
              {t(event.description)}
            </p>
          ) : (
            <p className="text-gray-400 font-bold text-sm italic">
              {t({ 
                ko: "추가 정보가 곧 제공될 예정입니다.", 
                en: "More details will be shared soon.", 
                id: "Detail selengkapnya akan segera dibagikan." 
              })}
            </p>
          )}

          {event.buttonLink && (
            <button
              onClick={handleAction}
              className="w-full bg-[#E53935] text-white border-4 border-black py-4 rounded-[20px] font-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all text-center uppercase tracking-wider text-base mt-2 flex items-center justify-center gap-2"
            >
              <span>{event.buttonText && (event.buttonText.en || event.buttonText.ko || event.buttonText.id) ? t(event.buttonText) : t({ ko: "참여하기", en: "Join Now", id: "Ikuti Sekarang" })}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- FaqView ---
export function FaqView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    api.getFaqs().then(setFaqs);
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#FFF8F0] pb-24">
      <div className="p-4 flex items-center justify-between border-b-4 border-black bg-white sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border-4 border-black rounded-full text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <span className="font-black text-lg uppercase tracking-tight text-black">{t({ ko: "도움말 및 FAQ", en: "Help & FAQ", id: "Bantuan & FAQ" })}</span>
        <div className="w-11" />
      </div>

      <div className="p-4 max-w-[600px] mx-auto w-full flex flex-col gap-4">
        {faqs.length === 0 ? (
          <div className="text-center p-8 bg-gray-200 border-4 border-black rounded-[24px] font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
            {t({ ko: "FAQ가 없습니다.", en: "No FAQs available yet.", id: "Belum ada FAQ." })}
          </div>
        ) : (
          faqs.map((f) => {
            const isExpanded = expandedFaq === f.id;
            return (
              <div key={f.id} className="bg-white border-4 border-black rounded-[24px] overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                <button 
                  onClick={() => setExpandedFaq(isExpanded ? null : f.id)}
                  className="w-full p-4 text-left font-black text-black text-base flex justify-between items-center bg-white hover:bg-stone-50 select-none"
                >
                  <span className="leading-snug">{t(f.question)}</span>
                  <span className="text-xl shrink-0 ml-4 font-black">{isExpanded ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t-2 border-black bg-[#FFF8F0]"
                    >
                      <p className="p-4 text-sm font-bold text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {t(f.answer)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
