const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store
let items = [
    { id: 1, name: 'Sample Item', description: 'This is a sample item.' }
];
let nextId = 2;

// CREATE: Add a new item
app.post('/api/items', (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    const newItem = { id: nextId++, name, description };
    items.push(newItem);
    res.status(201).json(newItem);
});

// READ: Get all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// UPDATE: Update an existing item by ID
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const index = items.findIndex(item => item.id === id);

    if (index !== -1) {
        items[index] = { ...items[index], name, description };
        res.json(items[index]);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

// DELETE: Remove an item by ID
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);

    if (items.length < initialLength) {
        res.status(204).send(); // 204 No Content
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
