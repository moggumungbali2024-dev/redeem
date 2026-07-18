const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf-8');

server = server.replace(
  '  app.delete("/api/categories/:id", (req, res) => {',
  `  app.put("/api/categories/:id", (req, res) => {
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx >= 0) {
      categories[idx] = { ...categories[idx], ...req.body };
      res.json(categories[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/categories/:id", (req, res) => {`
);

server = server.replace(
  '  app.delete("/api/events/:id", (req, res) => {',
  `  app.put("/api/events/:id", (req, res) => {
    const idx = events.findIndex(e => e.id === req.params.id);
    if (idx >= 0) {
      events[idx] = { ...events[idx], ...req.body };
      res.json(events[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/events/:id", (req, res) => {`
);

fs.writeFileSync('server.ts', server);

let api = fs.readFileSync('src/api.ts', 'utf-8');
api = api.replace(
  '  deleteCategory: async (id: string): Promise<void> => {',
  `  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await fetch(\`/api/categories/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteCategory: async (id: string): Promise<void> => {`
);

api = api.replace(
  '  deleteEvent: async (id: string): Promise<void> => {',
  `  updateEvent: async (id: string, data: Partial<AppEvent>): Promise<AppEvent> => {
    const res = await fetch(\`/api/events/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteEvent: async (id: string): Promise<void> => {`
);
fs.writeFileSync('src/api.ts', api);

let admin = fs.readFileSync('src/views/AdminApp.tsx', 'utf-8');
admin = admin.replace(
  `                 {modalType === 'category' && <CategoryForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) await api.createCategory(data); // Assuming create handles update in our mock or we can add update logic
                   else await api.createCategory(data);
                   fetchData();
                   setModalOpen(false);
                 }} />}`,
  `                 {modalType === 'category' && <CategoryForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) await api.updateCategory(editingItem.id, data);
                   else await api.createCategory(data);
                   fetchData();
                   setModalOpen(false);
                 }} />}`
);

admin = admin.replace(
  `                 {modalType === 'event' && <EventForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) {
                     // We don't have updateEvent endpoint, let's delete and create or you can add one to API.
                     // For now, we will create a new one and delete old one if editing.
                     await api.deleteEvent(editingItem.id);
                     await api.createEvent(data);
                   } else {
                     await api.createEvent(data);
                   }
                   fetchData();
                   setModalOpen(false);
                 }} />}`,
  `                 {modalType === 'event' && <EventForm initialData={editingItem} onSave={async (data) => {
                   if (editingItem) await api.updateEvent(editingItem.id, data);
                   else await api.createEvent(data);
                   fetchData();
                   setModalOpen(false);
                 }} />}`
);

fs.writeFileSync('src/views/AdminApp.tsx', admin);

