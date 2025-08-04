const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`);
  console.log(`Access via: http://54.198.228.118:${PORT}`);
}); 