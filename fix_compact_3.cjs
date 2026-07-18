const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  'className="p-6 bg-[#FFF8F0] flex-1 flex flex-col gap-8 relative z-10"',
  'className="p-4 bg-[#FFF8F0] flex-1 flex flex-col gap-4 relative z-10 w-full max-w-[600px] mx-auto"'
);
code = code.replace(
  'className="relative h-48 md:h-72 w-full border-b-4 border-black"',
  'className="relative h-48 md:h-72 w-full border-b-4 border-black max-w-[600px] mx-auto"'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
