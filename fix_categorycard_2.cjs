const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  '<div className="bg-white p-3 rounded-2xl border-4 border-black w-14 h-14 flex items-center justify-center mb-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10">',
  '<div className="bg-white p-2 rounded-xl border-[3px] border-black w-10 h-10 flex items-center justify-center mb-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">'
);
code = code.replace(
  '<Icon size={24} strokeWidth={3} className="text-black" />',
  '<Icon size={18} strokeWidth={3} className="text-black" />'
);
code = code.replace(
  '<span className="font-black text-black text-xl uppercase mt-4 relative z-10 leading-tight">{title}</span>',
  '<span className="font-black text-black text-sm uppercase mt-2 relative z-10 leading-tight">{title}</span>'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
