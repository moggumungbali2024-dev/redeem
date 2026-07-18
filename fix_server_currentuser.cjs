const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The problematic lines:
// let currentUser = users.find(u => u.id === (req.query.userId || req.body.userId)) || currentUser;
// const userIndex = users.findIndex(u => u.id === currentUser.id);

content = content.replace(/let currentUser = users\.find\(u => u\.id === \(req\.query\.userId \|\| req\.body\.userId\)\) \|\| currentUser;/g,
  `let currentUser = users.find(u => u.id === (req.query.userId || req.body.userId));
    if (!currentUser) return res.status(404).json({ error: "User not found" });`);

fs.writeFileSync('server.ts', content);
console.log("Fixed currentUser bug!");
