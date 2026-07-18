const fs = require('fs');

let vendorContent = fs.readFileSync('src/views/VendorApp.tsx', 'utf8');

// Add vendorBanner state
vendorContent = vendorContent.replace(
  "const [vendorLogo, setVendorLogo] = useState('');",
  "const [vendorLogo, setVendorLogo] = useState('');\n  const [vendorBanner, setVendorBanner] = useState('');"
);

// Add to handleVendorSelect
vendorContent = vendorContent.replace(
  "setVendorLogo(partner.logo || '');",
  "setVendorLogo(partner.logo || '');\n    setVendorBanner(partner.banner || '');"
);

// Add to handleUpdateVendor
const vendorUploadReplace = `
      let finalBanner = vendorBanner;
      if (vendorBanner && vendorBanner.startsWith('data:')) {
        try {
          finalBanner = await uploadImage(vendorBanner, \`vendors/banner_\${selectedVendorId}\`);
        } catch (err) {
          console.error("Banner upload failed:", err);
        }
      }

      await api.updatePartner(selectedVendorId, {
        name: vendorName,
        logo: finalLogo,
        banner: finalBanner,
`;
vendorContent = vendorContent.replace(
  "await api.updatePartner(selectedVendorId, {\n        name: vendorName,\n        logo: finalLogo,",
  vendorUploadReplace
);

// Add to UI Profile form
const vendorLogoUI = `<div className="flex flex-col gap-2">
                <label className="font-bold text-sm uppercase">Venue Logo URL</label>
                <input type="text" value={vendorLogo} onChange={e => setVendorLogo(e.target.value)} className="border-4 border-black p-3 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                {vendorLogo && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-black mt-2 bg-white">
                    <img src={vendorLogo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>`;

const newVendorLogoUI = `<div className="flex flex-col gap-2">
                <label className="font-bold text-sm uppercase">Venue Logo Image</label>
                <div className="flex items-center gap-4">
                  {vendorLogo && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-black bg-white shrink-0">
                      <img src={vendorLogo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setVendorLogo(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} className="text-sm font-bold w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm uppercase">Venue Banner Image</label>
                <div className="flex items-center gap-4">
                  {vendorBanner && (
                    <div className="w-32 h-20 rounded-xl overflow-hidden border-4 border-black bg-white shrink-0">
                      {vendorBanner.endsWith('.mp4') ? (
                         <video src={vendorBanner} autoPlay loop muted className="w-full h-full object-cover" />
                      ) : (
                         <img src={vendorBanner} alt="Banner" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <input type="file" accept="image/*,video/mp4" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setVendorBanner(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} className="text-sm font-bold w-full" />
                </div>
              </div>`;

vendorContent = vendorContent.replace(vendorLogoUI, newVendorLogoUI);
fs.writeFileSync('src/views/VendorApp.tsx', vendorContent);

// --- AdminApp.tsx ---
let adminContent = fs.readFileSync('src/views/AdminApp.tsx', 'utf8');

// Add banner to editFormData
adminContent = adminContent.replace(
  "logo: '',",
  "logo: '',\n      banner: '',"
);

// Replace partner update
adminContent = adminContent.replace(
  "logo: editFormData.logo,",
  "logo: editFormData.logo,\n        banner: editFormData.banner,"
);

// Replace partner create
adminContent = adminContent.replace(
  "logo: editFormData.logo,",
  "logo: editFormData.logo,\n        banner: editFormData.banner,"
);

const adminLogoUI = `<div className="flex flex-col gap-1">
                      <label className="font-bold text-xs uppercase text-gray-600">Logo URL</label>
                      <input type="text" value={editFormData.logo} onChange={e => setEditFormData({ ...editFormData, logo: e.target.value })} className="border-4 border-black p-3 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-bold" />
                    </div>`;

const newAdminLogoUI = `<div className="flex flex-col gap-1">
                      <label className="font-bold text-xs uppercase text-gray-600">Logo URL or Data</label>
                      <input type="text" value={editFormData.logo} onChange={e => setEditFormData({ ...editFormData, logo: e.target.value })} className="border-4 border-black p-3 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-bold" />
                      <input type="file" accept="image/*" onChange={(e) => {
                         const file = e.target.files?.[0];
                         if(file) {
                           const reader = new FileReader();
                           reader.onloadend = () => setEditFormData({ ...editFormData, logo: reader.result as string });
                           reader.readAsDataURL(file);
                         }
                      }} className="mt-2 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <label className="font-bold text-xs uppercase text-gray-600">Banner URL or Data</label>
                      <input type="text" value={editFormData.banner || ''} onChange={e => setEditFormData({ ...editFormData, banner: e.target.value })} className="border-4 border-black p-3 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-bold" />
                      <input type="file" accept="image/*,video/mp4" onChange={(e) => {
                         const file = e.target.files?.[0];
                         if(file) {
                           const reader = new FileReader();
                           reader.onloadend = () => setEditFormData({ ...editFormData, banner: reader.result as string });
                           reader.readAsDataURL(file);
                         }
                      }} className="mt-2 text-sm" />
                    </div>`;

adminContent = adminContent.replace(adminLogoUI, newAdminLogoUI);
fs.writeFileSync('src/views/AdminApp.tsx', adminContent);

console.log("Updated VendorApp and AdminApp for banners");
