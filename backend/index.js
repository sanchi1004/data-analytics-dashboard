const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow CORS so frontend can call backend

// Dummy analytics data - replace with real database later
const analyticsData = {
  sales: [
    { date: '2025-01-01', value: 100 },
    { date: '2025-01-02', value: 300 },
    { date: '2025-01-03', value: 250 },
    { date: '2025-01-04', value: 400 },
  ],
  revenue: 10500,
  users: 2300,
};

app.get('/', (req, res) => res.send('Backend works!'));

// Simple API endpoint to get dummy data
app.get('/api/analytics', (req, res) => {
  res.json(analyticsData);
});

app.listen(3001, () => console.log('Server running on port 3001'));
