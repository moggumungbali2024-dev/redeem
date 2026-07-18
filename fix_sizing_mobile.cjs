const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// Container padding
code = code.replace(
  'className="p-4 md:p-5 flex flex-col gap-4 md:gap-6 flex-1 overflow-y-auto"',
  'className="p-3 md:p-5 flex flex-col gap-3 md:gap-6 flex-1 overflow-y-auto max-w-[600px] mx-auto w-full"'
);

// Level Up Progress Banner
code = code.replace(
  'className="bg-[#E53935] col-span-2 text-white border-4 border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"',
  'className="bg-[#E53935] col-span-2 text-white border-4 border-black rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"'
);

code = code.replace(
  '<h2 className="text-4xl md:text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">',
  '<h2 className="text-3xl md:text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">'
);

code = code.replace(
  '<div className="w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12 mb-1">',
  '<div className="w-10 h-10 md:w-16 md:h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12 mb-1">'
);

code = code.replace(
  '<Star size={32} className="text-[#FDD835] fill-[#FDD835]" strokeWidth={2} />',
  '<Star size={24} className="text-[#FDD835] fill-[#FDD835]" strokeWidth={2} />'
); // this might affect other Stars, let's fix only the specific one.

fs.writeFileSync('src/views/UserApp.tsx', code);
