const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

const levelUpCode = `
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
          <p className="font-bold text-lg mt-2 uppercase tracking-wide">You reached Level 5</p>
          
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
`;

if (!code.includes('function LevelUpModal')) {
    code = code.replace('// --- Home View ---', levelUpCode + '\n// --- Home View ---');
}

const oldHomeStart = `function Home({ categories, partners, user, events }: { categories: Category[], partners: Partner[], user: User, events: AppEvent[] }) {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const [currentEvent, setCurrentEvent] = useState(0);`;

const newHomeStart = `function Home({ categories, partners, user, events }: { categories: Category[], partners: Partner[], user: User, events: AppEvent[] }) {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const [currentEvent, setCurrentEvent] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevPoints = useRef(user.points);

  useEffect(() => {
    if (prevPoints.current < 5000 && user.points >= 5000) {
      setTimeout(() => setShowLevelUp(true), 1000);
    }
    prevPoints.current = user.points;
  }, [user.points]);`;

code = code.replace(oldHomeStart, newHomeStart);

code = code.replace(
  'className="p-5 flex flex-col gap-6"',
  'className="p-5 flex flex-col gap-6"\n    >\n      <AnimatePresence>{showLevelUp && <LevelUpModal onClose={() => setShowLevelUp(false)} />}</AnimatePresence>'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
