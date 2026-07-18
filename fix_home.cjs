const fs = require('fs');

let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

const oldHeader = `{/* Header */}
      <div className="flex items-center justify-between mt-2">
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => { triggerHaptic('tap'); setShowProfile(true); }}
        >
           <div className="relative">
             <img src={user.avatar} className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" alt="Avatar" />
             <div className="absolute -bottom-0.5 -right-0.5 bg-[#43A047] w-4 h-4 rounded-full border-2 border-black"></div>
           </div>
           <div>
             <h1 className="text-sm md:text-lg font-black tracking-tight text-black leading-none uppercase">{user.name}</h1>
             <p className="text-[10px] md:text-xs text-[#1E88E5] font-black tracking-wide uppercase mt-0.5 bg-blue-100 inline-block px-1.5 py-0.5 rounded-full border-2 border-[#1E88E5]">Lvl. {userLevel}</p>
           </div>
        </div>
        
        {/* Language Selector */}
        <div className="relative">
          <select 
            value={lang}
            onChange={(e) => { triggerHaptic('tap'); setLang(e.target.value as Language); }}
            className="appearance-none bg-[#FDD835] border-4 border-black text-black py-1.5 pl-2.5 pr-7 rounded-xl font-black focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer uppercase text-xs"
          >
            <option value="ko">KOR</option>
            <option value="en">ENG</option>
            <option value="id">INA</option>
          </select>
          <Globe2 size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black" strokeWidth={3} />
        </div>
      </div>`;

const newHeader = `{/* Header */}
      <div className="flex items-center justify-between mt-2">
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => { triggerHaptic('tap'); navigate('/profile'); }}
        >
           <div className="relative">
             <img src={user.avatar} className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" alt="Avatar" />
             <div className="absolute -bottom-0.5 -right-0.5 bg-[#43A047] w-4 h-4 rounded-full border-2 border-black"></div>
           </div>
           <div>
             <h1 className="text-sm md:text-lg font-black tracking-tight text-black leading-none uppercase">{user.name}</h1>
             <p className="text-[10px] md:text-xs text-[#1E88E5] font-black tracking-wide uppercase mt-0.5 bg-blue-100 inline-block px-1.5 py-0.5 rounded-full border-2 border-[#1E88E5]">Lvl. {userLevel}</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:bg-stone-100 transition-colors">
            <Bell className="w-5 h-5 text-black" strokeWidth={3} />
            {(user.pointLogs?.length || 0) > 0 && (
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-black"></span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select 
              value={lang}
              onChange={(e) => { triggerHaptic('tap'); setLang(e.target.value as Language); }}
              className="appearance-none bg-[#FDD835] border-4 border-black text-black py-1.5 pl-2.5 pr-7 rounded-xl font-black focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer uppercase text-xs"
            >
              <option value="ko">KOR</option>
              <option value="en">ENG</option>
              <option value="id">INA</option>
            </select>
            <Globe2 size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black" strokeWidth={3} />
          </div>
        </div>
      </div>`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Fixed home header");
