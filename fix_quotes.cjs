const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');
code = code.replace("alert(\\\`Scanned! Earned 500 points for checking in.\\\`)", "alert('Scanned! Earned 500 points for checking in.')");
code = code.replace("alert(\\`Scanned! Earned 500 points for checking in.\\`)", "alert('Scanned! Earned 500 points for checking in.')");
fs.writeFileSync('src/views/UserApp.tsx', code);
