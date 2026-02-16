const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage
let todos = [
  { id: 1, title: 'Setup Jenkins Pipeline', completed: false },
  { id: 2, title: 'Configure ArgoCD', completed: false },
  { id: 3, title: 'Deploy to Kubernetes', completed: false }
];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ToDo API - DevOps Project',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API Info',
      'GET /health': 'Health Check',
      'GET /api/todos': 'Get all todos',
      'GET /api/todos/:id': 'Get todo by ID',
      'POST /api/todos': 'Create new todo',
      'PUT /api/todos/:id': 'Update todo',
      'DELETE /api/todos/:id': 'Delete todo'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all todos
app.get('/api/todos', (req, res) => {
  res.json({ success: true, data: todos });
});

// Get todo by ID
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  res.json({ success: true, data: todo });
});

// Create new todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    title,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json({ success: true, data: newTodo });
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  
  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  
  res.json({ success: true, data: todo });
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }
  
  todos.splice(index, 1);
  res.json({ success: true, message: 'Todo deleted successfully' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
});
