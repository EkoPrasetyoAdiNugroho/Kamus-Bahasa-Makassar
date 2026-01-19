const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const searchRoutes = require('./routes/search');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', searchRoutes);
app.use('/api', require('./routes/stats'));

// Root endpoint for health check
// Root endpoint for health check moved to avoid conflict with frontend
app.get('/api/status', (req, res) => {
    res.send({ status: "Dictionary Backend is running", endpoints: ["/api/search"] });
});

module.exports = app;
