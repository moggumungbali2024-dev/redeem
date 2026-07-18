const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// Category card sizes
code = code.replace(
  'className="bg-white rounded-[24px] md:rounded-[32px] border-4 border-black p-3 md:p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] md:hover:translate-y-[-4px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer h-32 md:h-40"',
  'className="bg-white rounded-[20px] md:rounded-[32px] border-4 border-black p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer h-[120px] md:h-40"'
);

// Map explore button
code = code.replace(
  '<h2 className="text-2xl font-black text-black uppercase leading-none">{t({ ko: \'탐험하기\', en: \'Explore\', id: \'Jelajahi\' })}</h2>',
  '<h2 className="text-xl md:text-2xl font-black text-black uppercase leading-none">{t({ ko: \'탐험하기\', en: \'Explore\', id: \'Jelajahi\' })}</h2>'
);

code = code.replace(
  '<div className="bg-white text-black border-4 border-black px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-base md:text-lg uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-auto active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer">',
  '<div className="bg-white text-black border-4 border-black px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-sm md:text-lg uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-auto active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer">'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
