const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  '<Route path="/map" element={<MapView partners={partners} user={user} />} />',
  '<Route path="/map" element={<MapView partners={partners} user={user} categories={categories} />} />'
);

const oldMapViewDecl = 'function MapView({ partners, user }: { partners: Partner[], user: User }) {';
const newMapViewDecl = 'function MapView({ partners, user, categories }: { partners: Partner[], user: User, categories: Category[] }) {';
code = code.replace(oldMapViewDecl, newMapViewDecl);

fs.writeFileSync('src/views/UserApp.tsx', code);
