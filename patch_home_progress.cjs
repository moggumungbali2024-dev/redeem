const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

// First, inject ScanQR import and view
code = code.replace(
  "import { cn } from '../lib/utils';",
  "import { cn } from '../lib/utils';\nimport { Scanner } from '@yudiel/react-qr-scanner';"
);

// We need to add QrCode icon
code = code.replace(
  "Settings, LogOut",
  "Settings, LogOut, QrCode"
);
// wait, we don't know the exact lucide-react imports. Let's just grab the whole import line.
