const fs = require('fs');
let content = fs.readFileSync('src/views/AdminApp.tsx', 'utf8');

const oldUpdateLogo = `  const updateLogo = async () => {
    const newLogo = prompt('Enter new logo URL:', settings.splashLogo);
    if(newLogo !== null) {
      await api.updateSettings({ splashLogo: newLogo });
      fetchData();
    }
  };`;

const newUpdateLogo = `  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, 'splash_logo_' + Date.now());
    if (url) {
      await api.updateSettings({ splashLogo: url });
      fetchData();
    }
  };`;

content = content.replace(oldUpdateLogo, newUpdateLogo);

const oldButton = `<button onClick={updateLogo} className="bg-[#FDD835] text-black border-4 border-black py-3 px-6 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase">
                  Update Logo
                </button>`;

const newButton = `<label className="bg-[#FDD835] text-black border-4 border-black py-3 px-6 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all uppercase cursor-pointer">
                  Update Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/views/AdminApp.tsx', content);
console.log("AdminApp splash upload fixed!");
