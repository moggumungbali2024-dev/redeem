const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  'className="w-16 h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12 mb-1"',
  'className="w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12 mb-1"'
);

code = code.replace(
  'className="p-5 flex flex-col gap-6 flex-1 overflow-y-auto"',
  'className="p-4 md:p-5 flex flex-col gap-4 md:gap-6 flex-1 overflow-y-auto"'
);

code = code.replace(
  'className="p-5 flex items-center gap-4 border-b-4 border-black bg-[#FFF8F0] z-20 shrink-0"',
  'className="p-4 md:p-5 flex items-center gap-3 md:gap-4 border-b-4 border-black bg-[#FFF8F0] z-20 shrink-0"'
);

code = code.replace(
  '<h2 className="text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">{user.points.toLocaleString()}</h2>',
  '<h2 className="text-4xl md:text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">{user.points.toLocaleString()}</h2>'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
