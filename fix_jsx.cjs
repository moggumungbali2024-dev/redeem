const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

code = code.replace(
  'className="p-5 flex flex-col gap-6"\n    >\n      <AnimatePresence>{showLevelUp && <LevelUpModal onClose={() => setShowLevelUp(false)} />}</AnimatePresence>\n    >',
  'className="p-5 flex flex-col gap-6"\n    >\n      <AnimatePresence>{showLevelUp && <LevelUpModal onClose={() => setShowLevelUp(false)} />}</AnimatePresence>'
);

fs.writeFileSync('src/views/UserApp.tsx', code);
