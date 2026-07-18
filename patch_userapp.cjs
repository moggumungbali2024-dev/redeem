const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// Wrap root div
code = code.replace(/<div className="flex flex-col h-full bg-\[\#FFF8F0\] font-sans">/, 
`<div className="flex flex-col h-[100dvh] w-full bg-[#FFF8F0] md:bg-gray-100 font-sans items-center justify-center">
      <div className="w-full h-full max-w-md bg-[#FFF8F0] relative overflow-hidden flex flex-col md:rounded-3xl md:h-[90dvh] md:my-auto md:border-8 md:border-black md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">`);
code = code.replace(/<\/Routes>\n      <\/div>\n    <\/div>/, 
`</Routes>
        </div>
      </div>
    </div>`);

// Add /profile route
code = code.replace(/<Route path="\/wallet" element={<WalletView user={user} partners={partners} \/>} \/>/,
`<Route path="/wallet" element={<WalletView user={user} partners={partners} />} />
          <Route path="/profile" element={<ProfileView user={user} updateUser={async (updates) => {
            const newUser = await api.updateUser(updates);
            if(newUser) setUser(newUser);
          }} />} />`);

fs.writeFileSync('src/views/UserApp.tsx', code);
