import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Partner, ClickData, Category, AppSettings, AppEvent, Coupon, Faq } from '../types';
import { uploadImage } from '../supabase';
import { ArrowLeft, Plus, Edit2, Trash2, BarChart2, Users, LayoutList, Settings as SettingsIcon, Calendar, X, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminApp() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [tab, setTab] = useState<'partners' | 'categories' | 'events' | 'faqs' | 'settings' | 'analytics'>('partners');
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ splashLogo: '' });
  const [analytics, setAnalytics] = useState<ClickData>({});

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'partner' | 'category' | 'event' | 'faq' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    const p = await api.getPartners();
    setPartners(p);
    const c = await api.getCategories();
    setCategories(c);
    const e = await api.getEvents();
    setEvents(e);
    const f = await api.getFaqs();
    setFaqs(f);
    const s = await api.getSettings();
    setSettings(s);
    const a = await api.getAnalytics();
    setAnalytics(a);
  };

  useEffect(() => {
    if(auth) fetchData();
  }, [auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(username === 'admin' && password === 'admin') {
      setAuth(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!auth) {
    return (
      <div className="flex flex-col h-full bg-[#FFF8F0] font-sans items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black text-black mb-6 uppercase text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full border-4 border-black p-4 rounded-xl font-bold bg-[#FFF8F0]"
            />
            <input 
              type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border-4 border-black p-4 rounded-xl font-bold bg-[#FFF8F0]"
            />
            <button type="submit" className="w-full bg-[#1E88E5] text-white border-4 border-black py-4 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-4 uppercase">
              Login
            </button>
          </form>
          <button onClick={() => navigate('/')} className="mt-6 w-full text-center font-bold text-gray-500 underline">Return to App</button>
        </div>
      </div>
    );
  }

  const handleDeletePartner = async (id: string) => {
    if(confirm('Delete partner?')) {
      await api.deletePartner(id);
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if(confirm('Delete category?')) {
      await api.deleteCategory(id);
      fetchData();
    }
  };
  
  const handleDeleteEvent = async (id: string) => {
    if(confirm('Delete event?')) {
      await api.deleteEvent(id);
      fetchData();
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if(confirm('Delete FAQ?')) {
      await api.deleteFaq(id);
      fetchData();
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, 'splash_logo_' + Date.now());
    if (url) {
      await api.updateSettings({ splashLogo: url });
      fetchData();
    }
  };

  const handleResetDatabase = async () => {
    if (confirm("WARNING: This will delete all your data and reset the database to factory defaults! Are you absolutely sure?")) {
      const confirmation = prompt("Type 'RESET' to confirm:");
      if (confirmation === 'RESET') {
        try {
          await api.resetDatabase();
          alert("Database has been reset successfully. The page will now reload.");
          window.location.reload();
        } catch (err) {
          console.error("Failed to reset database", err);
          alert("An error occurred while resetting the database.");
        }
      } else {
        alert("Reset cancelled.");
      }
    }
  };

  const openModal = (type: 'partner' | 'category' | 'event' | 'faq', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF8F0] font-sans">
      <div className="bg-black text-white p-5 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="font-black text-xl tracking-tight uppercase">Admin Panel</h1>
      </div>

      <div className="flex bg-white border-b-4 border-black overflow-x-auto">
        <TabButton active={tab === 'partners'} onClick={() => setTab('partners')} icon={<Users size={18}/>} label="Partners" />
        <TabButton active={tab === 'categories'} onClick={() => setTab('categories')} icon={<LayoutList size={18}/>} label="Categories" />
        <TabButton active={tab === 'events'} onClick={() => setTab('events')} icon={<Calendar size={18}/>} label="Events" />
        <TabButton active={tab === 'faqs'} onClick={() => setTab('faqs')} icon={<HelpCircle size={18}/>} label="FAQs" />
        <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} icon={<SettingsIcon size={18}/>} label="Settings" />
        <TabButton active={tab === 'analytics'} onClick={() => setTab('analytics')} icon={<BarChart2 size={18}/>} label="Stats" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-20">
        <div className="max-w-4xl mx-auto">
          {tab === 'partners' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => openModal('partner')} className="bg-[#43A047] text-white border-4 border-black py-4 rounded-xl font-black flex justify-center items-center gap-2 mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase">
                <Plus size={20} strokeWidth={3} /> Add Partner
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <img src={p.logo} alt="logo" className="w-16 h-16 rounded-xl object-cover border-2 border-black" />
                      <div className="flex-1">
                        <h3 className="font-black text-black text-lg leading-tight uppercase">{p.name}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase">{categories.find(c => c.id === p.categoryId)?.name.en || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal('partner', p)} className="flex-1 p-3 text-white bg-[#1E88E5] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl uppercase font-black text-sm flex justify-center items-center"><Edit2 size={16} strokeWidth={3} className="mr-1"/> Edit</button>
                      <button onClick={() => handleDeletePartner(p.id)} className="p-3 text-white bg-[#E53935] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl flex justify-center items-center"><Trash2 size={16} strokeWidth={3}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'categories' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => openModal('category')} className="bg-[#43A047] text-white border-4 border-black py-4 rounded-xl font-black flex justify-center items-center gap-2 mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase">
                <Plus size={20} strokeWidth={3} /> Add Category
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex gap-4 items-center">
                    <div className={cn("w-12 h-12 rounded-full border-4 border-black", c.color)}></div>
                    <div className="flex-1">
                      <h3 className="font-black text-black uppercase">{c.name.en}</h3>
                      <p className="text-xs font-bold text-gray-500">{c.name.ko} / {c.name.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal('category', c)} className="p-3 text-white bg-[#1E88E5] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl"><Edit2 size={16} strokeWidth={3}/></button>
                      <button onClick={() => handleDeleteCategory(c.id)} className="p-3 text-white bg-[#E53935] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl"><Trash2 size={16} strokeWidth={3}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'events' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => openModal('event')} className="bg-[#43A047] text-white border-4 border-black py-4 rounded-xl font-black flex justify-center items-center gap-2 mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase">
                <Plus size={20} strokeWidth={3} /> Add Event
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(e => (
                  <div key={e.id} className="bg-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col gap-2">
                    <img src={e.image} alt="event" className="w-full h-32 rounded-xl object-cover border-2 border-black" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex-1 mr-2">
                        <h3 className="font-black text-black text-lg leading-tight uppercase">{e.title.en}</h3>
                        <p className="text-sm font-bold text-[#E53935] uppercase mt-1">{e.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openModal('event', e)} className="p-3 text-white bg-[#1E88E5] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl"><Edit2 size={16} strokeWidth={3}/></button>
                        <button onClick={() => handleDeleteEvent(e.id)} className="p-3 text-white bg-[#E53935] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl"><Trash2 size={16} strokeWidth={3}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'faqs' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => openModal('faq')} className="bg-[#43A047] text-white border-4 border-black py-4 rounded-xl font-black flex justify-center items-center gap-2 mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase">
                <Plus size={20} strokeWidth={3} /> Add FAQ
              </button>
              <div className="flex flex-col gap-4">
                {faqs.map(f => (
                  <div key={f.id} className="bg-white p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-[10px] font-black uppercase text-gray-400 block leading-none">Question (EN)</span>
                          <h4 className="font-black text-black text-base">{f.question.en}</h4>
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-gray-400 block leading-none">Answer (EN)</span>
                          <p className="font-bold text-gray-700 text-sm leading-relaxed">{f.answer.en}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <button onClick={() => openModal('faq', f)} className="p-3 text-white bg-[#1E88E5] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl"><Edit2 size={16} strokeWidth={3}/></button>
                        <button onClick={() => handleDeleteFaq(f.id)} className="p-3 text-white bg-[#E53935] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-xl"><Trash2 size={16} strokeWidth={3}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col items-center text-center gap-4">
                <h3 className="font-black text-xl uppercase">Splash Logo</h3>
                <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gray-100">
                  <img src={settings.splashLogo || '/favicon.png?v=2'} alt="Splash" className="w-full h-full object-cover" />
                </div>
                <label className="bg-[#FDD835] text-black border-4 border-black py-3 px-6 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase cursor-pointer">
                  Update Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>

              <div className="bg-[#FFEAEA] p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col items-center text-center gap-4 mt-4">
                <h3 className="font-black text-xl uppercase text-[#D32F2F]">Danger Zone</h3>
                <p className="text-sm font-bold text-gray-700">This action will wipe all data and restore factory defaults.</p>
                <button onClick={handleResetDatabase} className="bg-[#D32F2F] text-white border-4 border-black py-3 px-6 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase">
                  Factory Reset Data
                </button>
              </div>
            </div>
          )}

          {tab === 'analytics' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-center mb-4">
                <h3 className="text-sm font-black text-black uppercase mb-2 tracking-widest">Total Clicks</h3>
                <div className="text-5xl font-black text-[#E53935]">
                  {Object.values(analytics).reduce((a: number, b: number) => a + b, 0)}
                </div>
              </div>
              
              <h4 className="font-black text-black text-lg uppercase mb-2 border-b-4 border-black pb-2">Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analytics).map(([key, count]) => {
                  const [pid, type] = key.split('_');
                  const partner = partners.find(p => p.id === pid);
                  return (
                    <div key={key} className="bg-white p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex justify-between items-center">
                      <div>
                        <div className="font-black text-black text-base uppercase">{partner?.name || pid}</div>
                        <div className="text-sm font-bold text-[#1E88E5] capitalize">{type}</div>
                      </div>
                      <div className="font-black text-2xl text-black">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
              {Object.keys(analytics).length === 0 && (
                <div className="text-center py-10 font-black text-gray-400">
                  NO DATA
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Admin Editor Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setModalOpen(false)}
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
               onClick={e => e.stopPropagation()}
               className="bg-[#FFF8F0] border-4 border-black rounded-[32px] w-full max-w-2xl shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] flex flex-col my-8 relative"
             >
               <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white border-4 border-black rounded-full z-10 hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                 <X size={24} strokeWidth={3} />
               </button>
               
               <div className="p-6 border-b-4 border-black bg-white rounded-t-[28px]">
                 <h2 className="font-black text-2xl uppercase">
                   {editingItem ? `Edit ${modalType}` : `Add ${modalType}`}
                 </h2>
               </div>
               
               <div className="p-6">
                 {modalType === 'partner' && <PartnerForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) await api.updatePartner(editingItem.id, data);
                   else await api.createPartner(data);
                   fetchData();
                   setModalOpen(false);
                 }} categories={categories} />}
                 
                 {modalType === 'category' && <CategoryForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) await api.updateCategory(editingItem.id, data);
                   else await api.createCategory(data);
                   fetchData();
                   setModalOpen(false);
                 }} />}
                 
                 {modalType === 'event' && <EventForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) {
                     // We don't have updateEvent endpoint, let's delete and create or you can add one to API.
                     // For now, we will create a new one and delete old one if editing.
                     await api.updateEvent(editingItem.id, data); fetchData(); setModalOpen(false); return;
                   }
                   await api.createEvent(data);
                   fetchData();
                   setModalOpen(false);
                 }} />}

                 {modalType === 'faq' && <FaqForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) {
                     await api.updateFaq(editingItem.id, data);
                   } else {
                     await api.createFaq(data);
                   }
                   fetchData();
                   setModalOpen(false);
                 }} />}
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-4 px-2 text-xs font-black flex flex-col justify-center items-center gap-1 border-r-4 border-black shrink-0 min-w-[80px]",
        active ? "bg-[#FDD835] text-black" : "bg-white text-gray-500 hover:bg-gray-50"
      )}
    >
      {icon} <span className="uppercase">{label}</span>
    </button>
  );
}

// --- Forms ---
function PartnerForm({ initialData, onSave, categories }: { initialData: any, onSave: (data: any) => void, categories: Category[] }) {
  const [langTab, setLangTab] = useState<'en' | 'ko' | 'id'>('en');
  const [formData, setFormData] = useState(() => {
    const base = initialData || {
      name: '',
      categoryId: categories[0]?.id || '',
      logo: '',
      banner: '',
      description: { ko: '', en: '', id: '' },
      distance: 0,
      eta: 0,
      instagram: '',
      whatsapp: '',
      website: '',
      coupons: [],
      bestsellers: [],
      images: []
    };
    return {
      googleMapsUrl: '',
      latitude: -8.6500,
      longitude: 115.1300,
      ...base
    };
  });

  const handleChange = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };
  
  const handleLocalized = (field: string, lang: string, val: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: { ...prev[field], [lang]: val } }));
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(formData); }}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Name</label>
           <input required type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Category</label>
           <select value={formData.categoryId} onChange={e => handleChange('categoryId', e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]">
             {categories.map(c => <option key={c.id} value={c.id}>{c.name.en}</option>)}
           </select>
         </div>
       </div>

       {/* Language Tabs Selector for Description */}
       <div className="flex items-center justify-between border-b-2 border-black pb-1">
         <span className="font-black text-sm uppercase">Description Translation</span>
         <div className="flex gap-1">
           {(['en', 'ko', 'id'] as const).map(l => (
             <button
               key={l}
               type="button"
               onClick={() => setLangTab(l)}
               className={cn(
                 "px-2 py-1 text-xs font-black border-2 border-black rounded-lg uppercase transition-all",
                 langTab === l ? "bg-[#FDD835] text-black" : "bg-white text-gray-500"
               )}
             >
               {l}
             </button>
           ))}
         </div>
       </div>

       <div className="flex flex-col gap-1">
         <textarea
           required
           value={formData.description[langTab] || ''}
           onChange={e => handleLocalized('description', langTab, e.target.value)}
           placeholder={`Description in ${langTab.toUpperCase()}`}
           className="border-4 border-black rounded-xl p-3 font-bold h-24 bg-[#FFF8F0]"
         />
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Logo URL</label>
           <div className="flex gap-2">
             <input required type="text" value={formData.logo} onChange={e => handleChange('logo', e.target.value)} className="flex-1 border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
             <label className="bg-[#1E88E5] text-white border-4 border-black py-3 px-4 rounded-xl font-black uppercase cursor-pointer hover:bg-[#1976D2] active:translate-y-[2px] active:translate-x-[2px]">
               Upload
               <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                   try {
                     const url = await uploadImage(file, 'vendors/logo_' + (formData.id || Date.now()));
                     handleChange('logo', url);
                   } catch (err) {
                     console.error("Upload failed", err);
                   }
                 }
               }} />
             </label>
           </div>
         </div>
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Distance (km)</label>
           <input required type="number" step="0.1" value={formData.distance} onChange={e => handleChange('distance', parseFloat(e.target.value))} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">ETA (minutes)</label>
           <input required type="number" value={formData.eta} onChange={e => handleChange('eta', parseInt(e.target.value))} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-black/10 pt-2">
         <div className="flex flex-col gap-1 md:col-span-1">
           <label className="font-black text-sm uppercase">Google Maps Link</label>
           <input type="text" value={formData.googleMapsUrl || ''} onChange={e => handleChange('googleMapsUrl', e.target.value)} placeholder="https://maps.app.goo.gl/..." className="border-4 border-black rounded-xl p-3 font-bold text-sm bg-[#FFF8F0]" />
         </div>
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Latitude</label>
           <input type="number" step="0.000001" value={formData.latitude !== undefined ? formData.latitude : ''} onChange={e => handleChange('latitude', parseFloat(e.target.value))} placeholder="-8.6500" className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Longitude</label>
           <input type="number" step="0.000001" value={formData.longitude !== undefined ? formData.longitude : ''} onChange={e => handleChange('longitude', parseFloat(e.target.value))} placeholder="115.1300" className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
       </div>
       
       <div className="flex flex-col gap-1">
            <label className="font-black text-sm uppercase">Coupons JSON</label>
            <textarea value={JSON.stringify(formData.coupons, null, 2)} onChange={e => {
              try {
                handleChange('coupons', JSON.parse(e.target.value));
              } catch(err) { /* ignore parse errors while typing */ }
            }} className="border-4 border-black rounded-xl p-3 font-mono text-sm h-32 bg-[#FFF8F0]" />
       </div>

       <button type="submit" className="w-full bg-[#1E88E5] text-white border-4 border-black py-4 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-4 uppercase">
         Save Partner
       </button>
    </form>
  )
}

function CategoryForm({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(initialData || {
    name: { ko: '', en: '', id: '' },
    color: 'bg-[#FDD835]',
    icon: 'Utensils'
  });

  const handleLocalized = (lang: string, val: string) => {
    setFormData((prev: any) => ({ ...prev, name: { ...prev.name, [lang]: val } }));
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(formData); }}>
       <div className="flex flex-col gap-1">
         <label className="font-black text-sm uppercase">Name (EN)</label>
         <input required type="text" value={formData.name.en} onChange={e => handleLocalized('en', e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
       </div>
       <div className="flex flex-col gap-1">
         <label className="font-black text-sm uppercase">Color Class</label>
         <input required type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
       </div>
       <div className="flex flex-col gap-1">
         <label className="font-black text-sm uppercase">Icon Name</label>
         <input required type="text" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
       </div>

       <button type="submit" className="w-full bg-[#1E88E5] text-white border-4 border-black py-4 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-4 uppercase">
         Save Category
       </button>
    </form>
  )
}

function FaqForm({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [langTab, setLangTab] = useState<'en' | 'ko' | 'id'>('en');
  const [formData, setFormData] = useState(() => {
    return initialData || {
      question: { ko: '', en: '', id: '' },
      answer: { ko: '', en: '', id: '' }
    };
  });
  
  const handleLocalized = (field: 'question' | 'answer', lang: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: { ...prev[field] || {}, [lang]: val }
    }));
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(formData); }}>
       <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
         <span className="font-black text-sm uppercase">Content Translations</span>
         <div className="flex gap-1">
           {(['en', 'ko', 'id'] as const).map(l => (
             <button
               key={l}
               type="button"
               onClick={() => setLangTab(l)}
               className={cn(
                 "px-3 py-1.5 text-xs font-black border-2 border-black rounded-xl uppercase transition-all",
                 langTab === l ? "bg-[#FDD835] text-black" : "bg-white text-gray-500"
               )}
             >
               {l === 'en' ? 'English' : l === 'ko' ? 'Korean' : 'Indonesian'}
             </button>
           ))}
         </div>
       </div>

       <div className="flex flex-col gap-1">
         <label className="font-black text-sm uppercase">Question ({langTab.toUpperCase()})</label>
         <input required type="text" value={formData.question[langTab] || ''} onChange={e => handleLocalized('question', langTab, e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
       </div>

       <div className="flex flex-col gap-1">
         <label className="font-black text-sm uppercase">Answer ({langTab.toUpperCase()})</label>
         <textarea required value={formData.answer[langTab] || ''} onChange={e => handleLocalized('answer', langTab, e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold h-24 bg-[#FFF8F0]" />
       </div>

       <button type="submit" className="w-full bg-[#1E88E5] text-white border-4 border-black py-4 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-4 uppercase">
         Save FAQ
       </button>
    </form>
  );
}

function EventForm({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [langTab, setLangTab] = useState<'en' | 'ko' | 'id'>('en');
  const [formData, setFormData] = useState(() => {
    const base = initialData || {
      title: { ko: '', en: '', id: '' },
      date: '',
      image: ''
    };
    return {
      description: { ko: '', en: '', id: '' },
      buttonText: { ko: '', en: '', id: '' },
      buttonLink: '',
      ...base
    };
  });
  
  const handleLocalized = (field: 'title' | 'description' | 'buttonText', lang: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: { ...prev[field] || {}, [lang]: val }
    }));
  };

  const handleChange = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(formData); }}>
       {/* Language Tabs Selector */}
       <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
         <span className="font-black text-sm uppercase">Content Translations</span>
         <div className="flex gap-1">
           {(['en', 'ko', 'id'] as const).map(l => (
             <button
               key={l}
               type="button"
               onClick={() => setLangTab(l)}
               className={cn(
                 "px-3 py-1.5 text-xs font-black border-2 border-black rounded-xl uppercase transition-all",
                 langTab === l ? "bg-[#FDD835] text-black" : "bg-white text-gray-500"
               )}
             >
               {l === 'en' ? 'English' : l === 'ko' ? 'Korean' : 'Indonesian'}
             </button>
           ))}
         </div>
       </div>

       <div className="flex flex-col gap-1">
         <label className="font-black text-sm uppercase">Title ({langTab.toUpperCase()})</label>
         <input required type="text" value={formData.title[langTab] || ''} onChange={e => handleLocalized('title', langTab, e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
       </div>

       <div className="flex flex-col gap-1">
         <label className="font-black text-sm uppercase">Description ({langTab.toUpperCase()})</label>
         <textarea required value={formData.description[langTab] || ''} onChange={e => handleLocalized('description', langTab, e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold h-24 bg-[#FFF8F0]" />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Button Text ({langTab.toUpperCase()})</label>
           <input required type="text" value={formData.buttonText[langTab] || ''} onChange={e => handleLocalized('buttonText', langTab, e.target.value)} placeholder="e.g. Register / Info" className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Button Link</label>
           <input type="text" value={formData.buttonLink || ''} onChange={e => handleChange('buttonLink', e.target.value)} placeholder="https://..." className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Date (YYYY-MM-DD)</label>
           <input required type="text" value={formData.date} onChange={e => handleChange('date', e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
         <div className="flex flex-col gap-1">
           <label className="font-black text-sm uppercase">Image URL</label>
           <input required type="text" value={formData.image} onChange={e => handleChange('image', e.target.value)} className="border-4 border-black rounded-xl p-3 font-bold bg-[#FFF8F0]" />
         </div>
       </div>

       <button type="submit" className="w-full bg-[#1E88E5] text-white border-4 border-black py-4 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-4 uppercase">
         Save Event
       </button>
    </form>
  )
}
