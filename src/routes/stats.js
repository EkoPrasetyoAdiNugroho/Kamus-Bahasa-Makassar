const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Re-read dictionary to get count. 
// In a real app, successful DB connection would be shared.
// Here we just read the file again or we could export 'dictionary' from search.js if we refactor.
// For simplicity/safety, we'll just read the JSON length here.

const dataPath = path.join(__dirname, '../../data/dictionary.json');

router.get('/stats', (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const dictionary = JSON.parse(rawData);

        res.json({
            total_words: dictionary.length,
            algorithms_count: 2,
            status: "online"
        });
    } catch (err) {
        console.error("Error reading stats:", err);
        res.status(500).json({ error: "Failed to load stats" });
    }
});

module.exports = router;
