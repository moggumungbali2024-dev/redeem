const fs = require('fs');

let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

// Add react-leaflet imports at the top
const leafletImports = `import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';\nimport 'leaflet/dist/leaflet.css';\nimport L from 'leaflet';\n\n// Fix leaflet default icon issue\ndelete (L.Icon.Default.prototype as any)._getIconUrl;\nL.Icon.Default.mergeOptions({\n  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',\n  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',\n  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',\n});\n`;

content = content.replace("import { uploadImage } from '../supabase';", "import { uploadImage } from '../supabase';\n" + leafletImports);

// Replace MapView component
const startIdx = content.indexOf('function MapView(');
// Find the end of MapView function, which is the line before `function WalletView`
const endIdx = content.indexOf('// --- Wallet View ---');

if (startIdx !== -1 && endIdx !== -1) {
  const newMapView = `
// --- Map View ---
function MapView({ partners, user, categories }: { partners: Partner[], user: User, categories: Category[] }) {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>(['eat', 'nightlife', 'stay', 'wellness']);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

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
                className={cn("flex items-center gap-2 px-4 py-2 rounded-full border-4 border-black font-black text-xs uppercase tracking-tight transition-all flex-shrink-0 active:scale-95", isActive ? \`\${c.color} text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]\` : "bg-white/80 text-black/50 border-black/40 shadow-none")}
              >
                <span className={cn("transition-colors", isActive ? "text-black" : "text-black/40")}>{getCategoryIcon(c.icon, 16)}</span>
                <span>{t(c.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 w-full relative z-[10] border-t-[6px] border-black">
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
              onClick={() => navigate(\`/partner/\${selectedPartner.id}\`)}
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
`;
  content = content.substring(0, startIdx) + newMapView + content.substring(endIdx);
  fs.writeFileSync('src/views/UserApp.tsx', content);
  console.log("Replaced MapView");
} else {
  console.error("Could not find MapView bounds");
}
