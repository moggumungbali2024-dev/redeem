const fs = require('fs');

let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

const authViews = `
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
        alert(res.error || "Login failed");
      }
    } catch (err) {
      alert("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-indigo-50 to-white">
      <div className="w-full max-w-sm p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="flex justify-center mb-6">
          <img src="/favicon.png" alt="Logo" className="w-20 h-20 rounded-2xl shadow-lg" />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8 tracking-tight">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required placeholder="+628123456789" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-md">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <button onClick={onGoRegister} className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

function RegisterView({ onRegister, onGoLogin }: { onRegister: (u: User) => void, onGoLogin: () => void }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.register(whatsapp, password, name, email);
      if (res.success && res.user) {
        onRegister(res.user);
      } else {
        alert(res.error || "Registration failed");
      }
    } catch (err) {
      alert("Error registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-indigo-50 to-white">
      <div className="w-full max-w-sm p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="flex justify-center mb-6">
          <img src="/favicon.png" alt="Logo" className="w-16 h-16 rounded-2xl shadow-lg" />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8 tracking-tight">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required placeholder="+628123456789" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-md">
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button onClick={onGoLogin} className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors">
            Log in here
          </button>
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
            <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${log.points > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}\`}>
              {log.points > 0 ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm leading-tight mb-1">{log.title.ko}</p>
              <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
            </div>
            {log.points !== 0 && (
              <div className={\`ml-auto font-semibold \${log.points > 0 ? 'text-emerald-600' : 'text-rose-600'}\`}>
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
`;

content = content.replace('function ProfileModal', authViews + '\nfunction ProfileModal');

// Update UserApp to handle Auth
content = content.replace(
  'const [categories, setCategories] = useState<Category[]>([]);',
  'const [categories, setCategories] = useState<Category[]>([]);\n  const [authMode, setAuthMode] = useState<"login" | "register">("login");\n  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("userId"));'
);

content = content.replace(
  'if (loading) {',
  `if (!isAuthenticated) {
    if (authMode === "login") {
      return <LoginView onLogin={(u) => { localStorage.setItem("userId", u.id); setUser(u); setIsAuthenticated(true); }} onGoRegister={() => setAuthMode("register")} />;
    } else {
      return <RegisterView onRegister={(u) => { localStorage.setItem("userId", u.id); setUser(u); setIsAuthenticated(true); }} onGoLogin={() => setAuthMode("login")} />;
    }
  }

  if (loading) {`
);

// Add Notification Bell in Header of UserApp
const headerSearch = `<div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200">
            <img src={user?.avatar || "https://i.pravatar.cc/150?img=68"} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Welcome back</p>
            <p className="text-sm font-bold text-slate-800">{user?.name || "Explorer"}</p>
          </div>
        </div>`;

const headerReplace = `<div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200">
            <img src={user?.avatar || "https://i.pravatar.cc/150?img=68"} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Welcome back</p>
            <p className="text-sm font-bold text-slate-800">{user?.name || "Explorer"}</p>
          </div>
        </div>
        <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        </div>`;

content = content.replace(headerSearch, headerReplace);

// Add Notifications route
content = content.replace(
  '<Route path="/faq" element={<FaqView />} />',
  '<Route path="/faq" element={<FaqView />} />\n        <Route path="/notifications" element={<NotificationsView user={user} />} />'
);

fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Auth and Notifications Views injected.");
