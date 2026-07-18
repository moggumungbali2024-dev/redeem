const fs = require('fs');

let content = fs.readFileSync('src/api.ts', 'utf8');

// Inject login and register
const authCode = `
  login: async (whatsapp: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp, password })
    });
    return res.json();
  },
  register: async (whatsapp: string, password: string, name: string, email: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp, password, name, email })
    });
    return res.json();
  },
`;

content = content.replace('export const api = {', 'export const api = {\n' + authCode);

// Function to add userId to fetch body
const getUserIdStr = `const userId = localStorage.getItem('userId');\n    `;

// add userId to getUser
content = content.replace(
  "const res = await fetch('/api/user');", 
  "const userId = localStorage.getItem('userId') || 'u1';\n    const res = await fetch(`/api/user?userId=${userId}`);"
);

// add userId to claimDailyMission
content = content.replace(
  "const res = await fetch('/api/user/claim_daily', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' }\n    });",
  "const userId = localStorage.getItem('userId') || 'u1';\n    const res = await fetch('/api/user/claim_daily', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ userId })\n    });"
);

content = content.replace(
  "body: JSON.stringify(user),",
  "body: JSON.stringify({ ...user, userId: localStorage.getItem('userId') || 'u1' }),"
);

content = content.replace(
  "body: JSON.stringify({ targetUserId })",
  "body: JSON.stringify({ targetUserId, userId: localStorage.getItem('userId') || 'u1' })"
);

content = content.replace(
  "body: JSON.stringify({ requestId, status })",
  "body: JSON.stringify({ requestId, status, userId: localStorage.getItem('userId') || 'u1' })"
);

content = content.replace(
  "body: JSON.stringify({ couponId }),",
  "body: JSON.stringify({ couponId, userId: localStorage.getItem('userId') || 'u1' }),"
);

content = content.replace(
  "body: JSON.stringify({ couponId, cost }),",
  "body: JSON.stringify({ couponId, cost, userId: localStorage.getItem('userId') || 'u1' }),"
);

content = content.replace(
  "body: JSON.stringify({ partnerId })",
  "body: JSON.stringify({ partnerId, userId: localStorage.getItem('userId') || 'u1' })"
);

fs.writeFileSync('src/api.ts', content);
console.log("Refactoring api.ts complete.");
