const fs = require('fs');
let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

const replacement = `  if (!isAuthenticated) {
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

  if (!user) return <div className="flex-1 bg-[#FFF8F0] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin"></div></div>;`;

content = content.replace(/  if \(\!user\) return <div className="flex-1 bg=\[\#FFF8F0\]" \/>;/, replacement);

// Let's also add Plus and Minus to lucide-react just in case
content = content.replace(/import \{ QrCode, ChevronLeft, LogOut, Scan/g, "import { QrCode, ChevronLeft, LogOut, Scan, Plus, Minus");

fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Auth fixed!");
