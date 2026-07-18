const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

const oldMapRender = `        {partners.map((p, i) => {
          // Generate pseudo-random positions in a circle based on index and distance
          const angle = (i * Math.PI * 2) / partners.length;
          const radius = 180 + p.distance * 100; 
          const x = 600 + Math.cos(angle) * radius;
          const y = 600 + Math.sin(angle) * radius;
          
          return (
            <motion.div 
              key={p.id}
              className="absolute flex flex-col items-center group cursor-pointer"
              style={{ left: x, top: y, x: '-50%', y: '-50%' }}
              whileHover={{ scale: 1.15, zIndex: 30 }}
              onClick={() => navigate(\`/partner/\${p.id}\`)}
            >
              <div className="bg-white p-1.5 rounded-[24px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-3 relative overflow-hidden transition-transform group-hover:-translate-y-2 group-hover:shadow-[8px_12px_0px_0px_rgba(0,0,0,1)]">
                <img src={p.logo} className="w-20 h-20 rounded-[16px] object-cover" alt={p.name} />
                <div className="absolute -bottom-2 -right-2 bg-[#FDD835] w-10 h-10 rounded-full border-4 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {p.eta}m
                </div>
              </div>
              <div className="bg-white text-black text-sm font-black px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase">
                {p.name}
              </div>
            </motion.div>
          )
        })}`;

const newMapRender = `        {partners.map((p, i) => {
          const category = categories.find(c => c.id === p.categoryId);
          const colorClass = category?.color || 'bg-white';
          
          // Generate pseudo-random positions in a circle based on index and distance
          const angle = (i * Math.PI * 2) / partners.length;
          const radius = 180 + p.distance * 100; 
          const x = 600 + Math.cos(angle) * radius;
          const y = 600 + Math.sin(angle) * radius;
          
          return (
            <motion.div 
              key={p.id}
              className="absolute flex flex-col items-center group cursor-pointer"
              style={{ left: x, top: y, x: '-50%', y: '-50%' }}
              whileHover={{ scale: 1.15, zIndex: 30 }}
              onClick={() => navigate(\`/partner/\${p.id}\`)}
            >
              <div className={cn("p-1.5 rounded-[24px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-3 relative overflow-hidden transition-transform group-hover:-translate-y-2 group-hover:shadow-[8px_12px_0px_0px_rgba(0,0,0,1)]", colorClass)}>
                <img src={p.logo} className="w-20 h-20 rounded-[16px] object-cover bg-white" alt={p.name} />
                <div className={cn("absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white", colorClass.replace('bg-', 'bg-').replace('text-', 'text-').includes('bg-white') || colorClass.includes('yellow') ? 'text-black' : 'text-white', colorClass)}>
                  {p.eta}m
                </div>
              </div>
              <div className={cn("text-black text-sm font-black px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase", colorClass.includes('blue') || colorClass.includes('red') || colorClass.includes('black') ? 'text-white' : 'text-black', colorClass)}>
                {p.name}
              </div>
            </motion.div>
          )
        })}`;

code = code.replace(oldMapRender, newMapRender);
fs.writeFileSync('src/views/UserApp.tsx', code);
