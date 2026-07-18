const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  "const heightClass = index % 3 === 0 ? 'h-48' : 'h-40';",
  "const heightClass = index % 3 === 0 ? 'h-[160px] md:h-48' : 'h-[140px] md:h-40';"
);

code = code.replace(
  "className={cn(\"rounded-[32px] border-4 border-black p-4 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer\", bgClass, heightClass, marginTopClass)}",
  "className={cn(\"rounded-[24px] md:rounded-[32px] border-4 border-black p-3 md:p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] md:hover:translate-y-[-4px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer\", bgClass, heightClass, marginTopClass)}"
);

code = code.replace(
  "className=\"bg-white rounded-[24px] p-3 border-4 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\"",
  "className=\"bg-white rounded-[20px] md:rounded-[24px] p-2 md:p-3 border-4 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\""
);

code = code.replace(
  "className=\"font-black text-black text-xl uppercase leading-tight tracking-tight mt-2\"",
  "className=\"font-black text-black text-base md:text-xl uppercase leading-tight tracking-tight mt-2\""
);

fs.writeFileSync('src/views/UserApp.tsx', code);
