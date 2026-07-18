const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// Container padding
code = code.replace(
  'className="p-3 md:p-5 flex flex-col gap-3 md:gap-6 w-full max-w-[600px] mx-auto"',
  'className="p-3 flex flex-col gap-3 w-full max-w-[600px] mx-auto"'
);

// Level Up Progress Banner padding and text size
code = code.replace(
  'className="bg-[#E53935] col-span-2 text-white border-4 border-black rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"',
  'className="bg-[#E53935] col-span-2 text-white border-[3px] border-black rounded-[20px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden cursor-pointer active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"'
);
code = code.replace(
  '<h2 className="text-3xl md:text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">',
  '<h2 className="text-3xl font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tighter">'
);

// Action buttons (Scan QR, Map, Call)
code = code.replace(
  'className="bg-[#1E88E5] text-white border-4 border-black rounded-[24px] p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-2"',
  'className="bg-[#1E88E5] text-white border-[3px] border-black rounded-[20px] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"'
);

code = code.replace(
  'className="flex-1 bg-[#1E88E5] text-white border-4 border-black py-4 px-4 rounded-[24px] flex flex-col items-center justify-center gap-1 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"',
  'className="flex-1 bg-[#1E88E5] text-white border-[3px] border-black py-2 px-2 rounded-[20px] flex flex-col items-center justify-center font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-xs"'
);
code = code.replace(
  'className="flex-1 bg-white text-black border-4 border-black py-4 px-4 rounded-[24px] flex flex-col items-center justify-center gap-1 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"',
  'className="flex-1 bg-white text-black border-[3px] border-black py-2 px-2 rounded-[20px] flex flex-col items-center justify-center font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-xs"'
);

// Map explore button 
code = code.replace(
  'className="w-full bg-[#FDD835] border-4 border-black text-black py-5 px-5 rounded-[24px] flex items-center justify-between font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"',
  'className="w-full bg-[#FDD835] border-[3px] border-black text-black py-3 px-4 rounded-[20px] flex items-center justify-between font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"'
);
code = code.replace(
  'className="w-full bg-white border-4 border-black text-black py-4 px-5 rounded-[24px] flex items-center justify-between font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"',
  'className="w-full bg-white border-[3px] border-black text-black py-3 px-4 rounded-[20px] flex items-center justify-between font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"'
);

// Event banner height
code = code.replace(
  'className="relative w-full h-32 md:h-40 border-4 border-black rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2 bg-white"',
  'className="relative w-full h-24 border-[3px] border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"'
);

// Category cards height
code = code.replace(
  'const heightClass = index % 3 === 0 ? \'h-[160px] md:h-48\' : \'h-[140px] md:h-40\';',
  'const heightClass = index % 3 === 0 ? \'h-[120px]\' : \'h-[100px]\';'
);

code = code.replace(
  'className={cn("rounded-[24px] md:rounded-[32px] border-4 border-black p-3 md:p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] md:hover:translate-y-[-4px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer", bgClass, heightClass, marginTopClass)}',
  'className={cn("rounded-[16px] border-[3px] border-black p-3 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer", bgClass, heightClass, marginTopClass)}'
);

code = code.replace(
  '<h2 className="text-xl md:text-2xl font-black text-black uppercase leading-none">',
  '<h2 className="text-xl font-black text-black uppercase leading-none">'
);

// Category icon circle
code = code.replace(
  'className="bg-white rounded-[20px] md:rounded-[24px] p-2 md:p-3 border-4 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"',
  'className="bg-white rounded-[12px] p-2 border-[3px] border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
