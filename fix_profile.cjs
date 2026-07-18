const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

const profileModalCode = `
// --- Profile Edit Modal ---
function ProfileModal({ user, onClose, onSave }: { user: User, onClose: () => void, onSave: (u: User) => void }) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
         className="bg-white border-4 border-black rounded-[24px] p-6 w-full max-w-[320px] relative z-10 flex flex-col items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
       >
          <h2 className="text-2xl font-black uppercase mb-4 text-black tracking-tighter">Edit Profile</h2>
          <div className="flex gap-2 mb-4 justify-center flex-wrap">
            {avatars.map((a, i) => (
              <img key={i} src={a} onClick={() => setAvatar(a)} className={\`w-12 h-12 rounded-full object-cover border-2 \${avatar === a ? 'border-[#E53935] border-4' : 'border-black'} cursor-pointer\`} alt="avatar option" />
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
`;

if (!code.includes('function ProfileModal')) {
    code = code.replace('// --- Level Up Modal ---', profileModalCode + '\n// --- Level Up Modal ---');
}

fs.writeFileSync('src/views/UserApp.tsx', code);
