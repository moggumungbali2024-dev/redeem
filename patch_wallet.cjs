const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

const walletStart = code.indexOf('function WalletView');
const profileStart = code.indexOf('// --- Profile View ---');

const before = code.substring(0, walletStart);
const after = code.substring(profileStart);

const newWallet = `function WalletView({ user, partners }: { user: User, partners: Partner[] }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'saved' | 'redeem'>('saved');
    
  // Gather all saved coupons from user
  const allCoupons = partners.flatMap(p => p.coupons.map(c => ({...c, partnerName: p.name, partnerId: p.id})));
  const saved = allCoupons.filter(c => user.savedCoupons.includes(c.id));
  const redeemable = allCoupons.filter(c => c.type === 'redeem');

  const handleRedeem = async (coupon: any) => {
    if (user.points < coupon.cost) {
      alert('Not enough points!');
      return;
    }
    if (confirm(\`Redeem \${coupon.title.en} for \${coupon.cost} points?\`)) {
      const res = await api.redeemCoupon(coupon.id, coupon.cost);
      if (res.success) {
        alert('Coupon redeemed and saved to your wallet!');
        window.location.reload(); // Quick way to refresh state
      } else {
        alert(res.error || 'Failed to redeem');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-[#FFF8F0] overflow-hidden">
      <div className="p-5 flex items-center gap-4 border-b-4 border-black bg-[#FFF8F0] z-20 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black bg-white border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-2xl font-black uppercase text-black">My Wallet</h1>
      </div>
      
      <div className="flex bg-white border-b-4 border-black shrink-0">
        <button 
          onClick={() => setActiveTab('saved')}
          className={cn("flex-1 py-4 font-black text-sm uppercase tracking-widest border-r-4 border-black", activeTab === 'saved' ? "bg-[#FDD835] text-black" : "text-gray-500")}
        >
          My Coupons
        </button>
        <button 
          onClick={() => setActiveTab('redeem')}
          className={cn("flex-1 py-4 font-black text-sm uppercase tracking-widest", activeTab === 'redeem' ? "bg-[#FDD835] text-black" : "text-gray-500")}
        >
          Redeem Store
        </button>
      </div>
            
      <div className="p-5 flex flex-col gap-6 flex-1 overflow-y-auto">
         <div className="bg-[#1E88E5] text-white border-4 border-black p-6 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <p className="text-sm font-black uppercase mb-1">Total Points</p>
            <h2 className="text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">{user.points.toLocaleString()}</h2>
         </div>
         
         {activeTab === 'saved' && (
           <div className="flex flex-col gap-4">
             {saved.length === 0 ? (
                <div className="text-center p-8 bg-gray-200 border-4 border-black rounded-[24px] font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">No coupons yet.</div>
             ) : (
                saved.map((c, i) => (
                  <div key={i} onClick={() => navigate(\`/partner/\${c.partnerId}\`)} className="bg-white p-5 border-4 border-black rounded-[32px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2 cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all">
                     <span className="text-xs font-black uppercase bg-[#FDD835] px-2 py-1 border-2 border-black rounded-full self-start shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{c.partnerName}</span>
                     <h4 className="text-xl font-black text-black leading-tight mt-1">{c.title.en}</h4>
                     <div className="mt-2 text-lg font-black tracking-widest bg-gray-100 border-4 border-dashed border-black p-3 rounded-2xl text-center text-black">
                       {c.code}
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
                     <h4 className="text-xl font-black text-black leading-tight mt-1">{c.title.en}</h4>
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
      </div>
    </motion.div>
  );
}
\n`;

fs.writeFileSync('src/views/UserApp.tsx', before + newWallet + after);
