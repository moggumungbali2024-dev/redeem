const fs = require('fs');
let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

const loginRegex = /function LoginView\(\{.*?\} \{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/;
const registerRegex = /function RegisterView\(\{.*?\} \{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/;

const newLoginView = `function LoginView({ onLogin, onGoRegister }: { onLogin: (u: User) => void, onGoRegister: () => void }) {
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
           <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover p-2" />
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
}`;

const newRegisterView = `function RegisterView({ onRegister, onGoLogin }: { onRegister: (u: User) => void, onGoLogin: () => void }) {
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
           <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover p-2" />
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
}`;

content = content.replace(loginRegex, newLoginView);
content = content.replace(registerRegex, newRegisterView);

fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Auth UI updated!");
