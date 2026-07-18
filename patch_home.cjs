const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  /<div className="w-16 h-16 rounded-full border-4 border-black overflow-hidden bg-white shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]">/g,
  '<div onClick={() => navigate("/profile")} className="w-16 h-16 rounded-full border-4 border-black overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-1 transition-all">'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
