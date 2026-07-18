const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

const oldPointsBanner = `{/* Points Banner */}
      <div className="bg-[#E53935] text-white border-4 border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden mt-2 cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all" onClick={() => navigate('/wallet')}>
         {/* Decorative shapes */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
         <div className="absolute bottom-0 left-10 w-24 h-24 bg-black/10 rounded-full -mb-10 blur-lg"></div>
         
         <div className="flex justify-between items-start z-10 relative">
           <div>
             <p className="text-xs font-black uppercase mb-1 tracking-widest text-white/90">{t({ ko: '나의 여정 포인트', en: 'Available Miles', id: 'Poin Tersedia' })}</p>
             <h2 className="text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">{user.points.toLocaleString()}</h2>
             <p className="text-sm font-black mt-2 text-[#FDD835] border-2 border-black bg-white/20 px-3 py-1 rounded-full inline-block backdrop-blur-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">+2,140 {t({ ko: '이번 달', en: 'this month', id: 'bulan ini' })}</p>
           </div>
           
           <div className="w-16 h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12">
              <Star size={32} className="text-[#FDD835] fill-[#FDD835]" strokeWidth={2} />
           </div>
         </div>
      </div>`;

const newPointsBanner = `{/* Action Row */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        {/* Points Banner */}
        <div className="bg-[#E53935] col-span-2 text-white border-4 border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all" onClick={() => navigate('/wallet')}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-black/10 rounded-full -mb-10 blur-lg"></div>
          
          <div className="flex justify-between items-start z-10 relative mb-4">
            <div>
              <p className="text-xs font-black uppercase mb-1 tracking-widest text-white/90">{t({ ko: '나의 여정 포인트', en: 'Available Miles', id: 'Poin Tersedia' })}</p>
              <h2 className="text-5xl font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-tighter">{user.points.toLocaleString()}</h2>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12 mb-1">
                  <Star size={32} className="text-[#FDD835] fill-[#FDD835]" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="z-10 relative bg-black/20 p-4 rounded-2xl border-4 border-black/40 backdrop-blur-sm">
             <div className="flex justify-between items-end mb-2">
               <span className="font-black text-[#FDD835] text-lg uppercase tracking-widest">Level 5</span>
               <span className="font-black text-xs uppercase opacity-80">{Math.min(user.points, 5000)} / 5000 PTS to next</span>
             </div>
             <div className="w-full h-4 bg-white/30 rounded-full border-2 border-black overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: \`\${Math.min(100, (user.points / 5000) * 100)}%\` }} 
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 bottom-0 bg-[#FDD835] border-r-2 border-black" 
                />
             </div>
             {user.points >= 5000 && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="mt-3 text-center bg-[#43A047] py-2 rounded-xl border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
               >
                 Level Up Available!
               </motion.div>
             )}
          </div>
        </div>
      </div>

      <button onClick={() => navigate('/scan')} className="bg-[#1E88E5] text-white border-4 border-black rounded-[24px] p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all mt-2">
         <QrCode size={24} strokeWidth={3} />
         <span className="font-black text-lg uppercase tracking-widest">{t({ ko: 'QR 스캔 및 체크인', en: 'Scan & Check In', id: 'Pindai & Check-in' })}</span>
      </button>
`;

code = code.replace(oldPointsBanner, newPointsBanner);
fs.writeFileSync('src/views/UserApp.tsx', code);
