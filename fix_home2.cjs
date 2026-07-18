const fs = require('fs');
let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

const regex = /\{\/\* Header \*\/\}\s*<div className="flex items-center justify-between mt-2">\s*<div\s*className="flex items-center gap-2.5 cursor-pointer select-none"\s*onClick=\{\(\) => \{ triggerHaptic\('tap'\); setShowProfile\(true\); \}\}\s*>/;

content = content.replace(regex, `{/* Header */}
      <div className="flex items-center justify-between mt-2">
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => { triggerHaptic('tap'); navigate('/profile'); }}
        >`);

const notifRegex = /\{\/\* Language Selector \*\/\}\s*<div className="relative">/;

content = content.replace(notifRegex, `<div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:bg-stone-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {(user.pointLogs?.length || 0) > 0 && (
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-black"></span>
            )}
          </button>
          
          {/* Language Selector */}
          <div className="relative">`);

const globeRegex = /<Globe2 size=\{12\} className="absolute right-2\.5 top-1\/2 -translate-y-1\/2 pointer-events-none text-black" strokeWidth=\{3\} \/>\s*<\/div>\s*<\/div>/;

content = content.replace(globeRegex, `<Globe2 size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black" strokeWidth={3} />
          </div>
        </div>
      </div>`);

fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Replaced successfully!");
