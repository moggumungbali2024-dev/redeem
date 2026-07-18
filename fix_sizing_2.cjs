const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// PartnerDetail Header text
code = code.replace(
  '<h1 className="text-4xl font-black text-black mb-3 leading-none uppercase">{partner.name}</h1>',
  '<h1 className="text-3xl font-black text-black mb-3 leading-none uppercase">{partner.name}</h1>'
);

code = code.replace(
  '<div className="text-5xl font-black">{rating}</div>',
  '<div className="text-4xl font-black">{rating}</div>'
);

code = code.replace(
  '<div className="text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">{user.points.toLocaleString()}</div>',
  '<div className="text-4xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">{user.points.toLocaleString()}</div>'
);

// Map explore button
code = code.replace(
  '<div className="bg-white text-black border-4 border-black px-8 py-4 rounded-full font-black text-lg uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-auto active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer">',
  '<div className="bg-white text-black border-4 border-black px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-base md:text-lg uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-auto active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer">'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
