const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// Replace `users[0]` with `currentUser` in all endpoints.
// But first, we need to inject `const currentUser = users.find(u => u.id === (req.query.userId || req.body.userId)) || users[0];` at the start of each user endpoint.

const endpointsToUpdate = [
  'app.get("/api/user"',
  'app.put("/api/user"',
  'app.post("/api/user/save_coupon"',
  'app.post("/api/user/redeem_coupon"',
  'app.post("/api/user/daily_claim"',
  'app.post("/api/user/vip_checkin"',
  'app.post("/api/user/contact_requests"',
  'app.put("/api/user/contact_requests/:requestId"'
];

for (const ep of endpointsToUpdate) {
  const regex = new RegExp(`(${ep.replace(/[.*+?^$\{\}()|\[\]\\]/g, '\\$&')},.*?\\(req, res\\) => \\{)`, 'g');
  content = content.replace(regex, `$1\n    let currentUser = users.find(u => u.id === (req.query.userId || req.body.userId)) || users[0];\n    const userIndex = users.findIndex(u => u.id === currentUser.id);`);
}

// Special case for PUT /api/user where we do users[0] = ...
content = content.replace(/users\[0\] = \{ \.\.\.users\[0\], \.\.\.req\.body \};/g, 'users[userIndex] = { ...currentUser, ...req.body };\n    currentUser = users[userIndex];');

// Replace all other users[0] with currentUser
content = content.replace(/users\[0\]/g, 'currentUser');

// Inject Auth endpoints before app.get("/api/user")
const authEndpoints = `
  app.post("/api/auth/register", async (req, res) => {
    const { whatsapp, password, name, email } = req.body;
    const existing = users.find(u => u.whatsapp === whatsapp);
    if (existing) {
      return res.status(400).json({ error: "WhatsApp already registered" });
    }
    const newUser = {
      id: "u" + Date.now(),
      name: name || "New User",
      avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
      points: 0,
      profileCompleted: false,
      savedCoupons: [],
      email: email || "",
      whatsapp,
      password,
      instagram: "",
      dob: "",
      contactRequests: [],
      pointLogs: []
    };
    users.push(newUser);
    await dbUpsert('rnf_users', newUser);
    res.json({ success: true, user: newUser });
  });

  app.post("/api/auth/login", (req, res) => {
    const { whatsapp, password } = req.body;
    const user = users.find(u => u.whatsapp === whatsapp && u.password === password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
`;

content = content.replace('  // User Profile', '  // Auth\n' + authEndpoints + '\n  // User Profile');

fs.writeFileSync('server.ts', content);
console.log("Refactoring complete.");
