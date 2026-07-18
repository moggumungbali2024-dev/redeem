const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'className="w-full max-w-md bg-[#FFF8F0] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative flex flex-col min-h-full overflow-hidden rounded-[40px]"',
  'className="w-full md:max-w-none bg-[#FFF8F0] md:shadow-none md:border-0 md:rounded-none shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative flex flex-col min-h-full overflow-hidden rounded-[40px]"'
);

code = code.replace(
  'className="min-h-screen bg-stone-200 font-sans text-black flex justify-center p-4 sm:p-8"',
  'className="min-h-[100dvh] bg-stone-200 font-sans text-black flex justify-center md:p-0 p-4 sm:p-8"'
);

fs.writeFileSync('src/App.tsx', code);
