const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

const oldHomeStart = `function Home({ categories, partners, user, events }: { categories: Category[], partners: Partner[], user: User, events: AppEvent[] }) {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const [currentEvent, setCurrentEvent] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevPoints = useRef(user.points);`;

const newHomeStart = `function Home({ categories, partners, user, events, setUser }: { categories: Category[], partners: Partner[], user: User, events: AppEvent[], setUser?: (u: User) => void }) {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const [currentEvent, setCurrentEvent] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const prevPoints = useRef(user.points);`;

code = code.replace(oldHomeStart, newHomeStart);

code = code.replace(
  '<AnimatePresence>{showLevelUp && <LevelUpModal onClose={() => setShowLevelUp(false)} />}</AnimatePresence>',
  '<AnimatePresence>{showLevelUp && <LevelUpModal onClose={() => setShowLevelUp(false)} />}\n      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onSave={(u) => { if(setUser) setUser(u); api.updateUser(u); }} />}</AnimatePresence>'
);

// Allow clicking header avatar to open profile modal
code = code.replace(
  '<div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(\'/wallet\')}>',
  '<div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfile(true)}>'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
