const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'className="w-full md:max-w-none bg-[#FFF8F0] md:shadow-none md:border-0 md:rounded-none shadow-none border-0 relative flex flex-col min-h-full overflow-hidden rounded-none"',
  'className="w-full bg-[#FFF8F0] relative flex flex-col min-h-full overflow-hidden"'
);

code = code.replace(
  'className="w-full md:max-w-none bg-[#FFF8F0] md:shadow-none md:border-0 md:rounded-none shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative flex flex-col min-h-full overflow-hidden rounded-[40px]"',
  'className="w-full bg-[#FFF8F0] relative flex flex-col min-h-full overflow-hidden"'
);

fs.writeFileSync('src/App.tsx', code);
