// Load environment variables
require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 3000;

// Connect to PostgreSQL
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to database:', err);
    // Start server anyway with JSON fallback
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT} (JSON mode)`);
    });
});
