const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// Home Points Banner
code = code.replace(
  'className="text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter"',
  'className="text-4xl md:text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter"'
);

// Home Header Username
code = code.replace(
  '<h1 className="text-lg font-black tracking-tight text-black leading-none uppercase">{user.name}</h1>',
  '<h1 className="text-base md:text-lg font-black tracking-tight text-black leading-none uppercase">{user.name}</h1>'
);
// Home Header Avatar
code = code.replace(
  '<img src={user.avatar} className="w-14 h-14 rounded-full object-cover border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" alt="Avatar" />',
  '<img src={user.avatar} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" alt="Avatar" />'
);

// Category Grid
code = code.replace(
  'className="grid grid-cols-2 gap-4"',
  'className="grid grid-cols-2 gap-3 md:gap-4"'
);

// PartnerDetail Header text
code = code.replace(
  '<h1 className="text-4xl font-black text-black uppercase tracking-tighter leading-none mt-2">{partner.name}</h1>',
  '<h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none mt-2">{partner.name}</h1>'
);

code = code.replace(
  '<div className="text-5xl font-black">{partner.rating}</div>',
  '<div className="text-4xl md:text-5xl font-black">{partner.rating}</div>'
);

// CategoryCard sizes
code = code.replace(
  'className="bg-white rounded-[32px] border-4 border-black p-4 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer h-40"',
  'className="bg-white rounded-[24px] md:rounded-[32px] border-4 border-black p-3 md:p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] md:hover:translate-y-[-4px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer h-32 md:h-40"'
);

code = code.replace(
  'className="font-black text-black text-lg uppercase leading-tight tracking-tight mt-2"',
  'className="font-black text-black text-base md:text-lg uppercase leading-tight tracking-tight mt-2"'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
