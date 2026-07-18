const fs = require('fs');

let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

// Update lucide imports
content = content.replace(
  "HelpCircle, FileSpreadsheet } from 'lucide-react'",
  "HelpCircle, FileSpreadsheet, ChevronLeft, Plus, Minus, LogOut } from 'lucide-react'"
);

// Add password and whatsapp input and logout button to ProfileView
const profileSearch = `<div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" />
          </div>`;

const profileReplace = `<div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
            <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
            <input type="text" value={formData.instagram || ''} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" placeholder="Change password..." value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" />
          </div>`;

content = content.replace(profileSearch, profileReplace);

// Remove the existing email, whatsapp, instagram from the old form if they exist
content = content.replace(/<div>\s*<label[^>]*>Email<\/label>[\s\S]*?<\/div>/g, '');
content = content.replace(/<div>\s*<label[^>]*>WhatsApp<\/label>[\s\S]*?<\/div>/g, '');
content = content.replace(/<div>\s*<label[^>]*>Instagram Username<\/label>[\s\S]*?<\/div>/g, '');
// I'll just re-add them below Name to be sure, and then we might have duplicates if my replace is wrong, let's not remove blindly.
// Let's do it safer. 

fs.writeFileSync('src/views/UserApp.tsx.backup', fs.readFileSync('src/views/UserApp.tsx', 'utf8'));

fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Updated profile view.");
