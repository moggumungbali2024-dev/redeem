import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserApp from './views/UserApp';
import AdminApp from './views/AdminApp';
import VendorApp from './views/VendorApp';
import Splash from './views/Splash';
import { Settings, Store } from 'lucide-react';
import { triggerHaptic } from './lib/utils';

export default function App() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-[100dvh] bg-stone-200 font-sans text-black flex justify-center p-0">
      {/* Mobile Frame Simulator - Bauhaus Style */}
      <div className="w-full bg-[#FFF8F0] relative flex flex-col min-h-full overflow-hidden">
        
        {showSplash && <Splash onFinish={() => setShowSplash(false)} />}
        
        {!showSplash && (
          <Routes>
            <Route path="/*" element={<UserApp />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/vendor/*" element={<VendorApp />} />
          </Routes>
        )}

        {/* Hidden Admin & Vendor Portal Toggles in Bottom Corners */}
        <div className="absolute bottom-6 left-6 z-[100] flex gap-2">
          <button 
            onClick={() => { triggerHaptic('tap'); navigate('/vendor'); }}
            className="opacity-10 hover:opacity-100 p-2.5 bg-black text-white rounded-full transition-opacity flex items-center gap-1 text-xs font-black uppercase"
            title="Vendor Dashboard Access"
          >
            <Store size={14} />
            <span className="hidden group-hover:inline">Vendor</span>
          </button>
          <button 
            onClick={() => { triggerHaptic('tap'); navigate('/admin'); }}
            className="opacity-10 hover:opacity-100 p-2.5 bg-black text-white rounded-full transition-opacity flex items-center gap-1 text-xs font-black uppercase"
            title="Admin Dashboard Access"
          >
            <Settings size={14} />
            <span className="hidden group-hover:inline">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

