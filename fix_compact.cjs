const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// 1. Language default in option list (not really needed since useState is en, but we can make it default in UI or ensure it works). We'll leave select alone.

// 2. Make "Level Up Available" clickable
code = code.replace(
  '<motion.div \n                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} \n                 className="mt-3 text-center bg-[#43A047] py-2 rounded-xl border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"\n               >\n                 Level Up Available!\n               </motion.div>',
  '<motion.button \n                 onClick={(e) => { e.stopPropagation(); setShowLevelUp(true); }}\n                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} \n                 className="w-full mt-3 text-center bg-[#43A047] py-2 rounded-xl border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"\n               >\n                 Level Up Available!\n               </motion.button>'
);
// In case the spacing is slightly different, let's just replace based on the string:
const oldLevelUp = `             {user.points >= 5000 && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="mt-3 text-center bg-[#43A047] py-2 rounded-xl border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
               >
                 Level Up Available!
               </motion.div>
             )}`;
const newLevelUp = `             {user.points >= 5000 && (
               <motion.button 
                 onClick={(e) => { e.stopPropagation(); setShowLevelUp(true); }}
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="w-full mt-3 text-center bg-[#43A047] py-2 rounded-xl border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
               >
                 Level Up Available!
               </motion.button>
             )}`;
code = code.replace(oldLevelUp, newLevelUp);

fs.writeFileSync('src/views/UserApp.tsx', code);
