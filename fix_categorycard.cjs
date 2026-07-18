const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  'className={cn(\n        "relative flex flex-col justify-end p-5 rounded-[32px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left overflow-hidden",',
  'className={cn(\n        "relative flex flex-col justify-end p-4 rounded-[20px] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left overflow-hidden",'
);

code = code.replace(
  '<div className="absolute top-4 left-4 bg-white rounded-[20px] p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">',
  '<div className="absolute top-3 left-3 bg-white rounded-[12px] p-2 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">'
);

code = code.replace(
  '<Icon size={32} strokeWidth={2.5} className="text-black" />',
  '<Icon size={20} strokeWidth={2.5} className="text-black" />'
);

code = code.replace(
  '<span className="font-black text-black text-2xl uppercase leading-tight tracking-tight z-10">{title}</span>',
  '<span className="font-black text-black text-lg md:text-xl uppercase leading-tight tracking-tight z-10">{title}</span>'
);

// Level up text
code = code.replace(
  '<p className="font-bold text-lg mt-2 uppercase tracking-wide">You reached Level 5</p>',
  '<p className="font-bold text-base mt-2 uppercase tracking-wide text-black">You reached Level 5</p>'
);

// Edit profile button text sizing
code = code.replace(
  '<h2 className="text-2xl font-black uppercase mb-4 text-black tracking-tighter">Edit Profile</h2>',
  '<h2 className="text-xl font-black uppercase mb-4 text-black tracking-tighter">Edit Profile</h2>'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
