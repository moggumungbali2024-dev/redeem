const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// Partner detail header image
code = code.replace(
  'className="relative h-72 w-full border-b-4 border-black"',
  'className="relative h-48 md:h-72 w-full border-b-4 border-black"'
);

// Map explore button (if I missed it previously)

// Event banner height
code = code.replace(
  'className="relative w-full h-40 border-4 border-black rounded-[32px] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-2 bg-white"',
  'className="relative w-full h-32 md:h-40 border-4 border-black rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2 bg-white"'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
