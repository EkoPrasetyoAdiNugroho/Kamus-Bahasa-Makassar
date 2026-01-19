const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const naiveSearch = require('../algorithms/naive');
const kmpSearch = require('../algorithms/kmp');

// Load dictionary data synchronously on startup (simple for this scale)
const dataPath = path.join(__dirname, '../data/dictionary.json');
let dictionary = [];

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    dictionary = JSON.parse(rawData);
    console.log(`Dictionary loaded with ${dictionary.length} words.`);
} catch (err) {
    console.error("Error loading dictionary:", err);
}

// Search Endpoint
router.get('/search', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const algo = req.query.algo ? req.query.algo.toLowerCase() : 'kmp'; // Default to KMP

    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required." });
    }

    const results = [];
    let totalComparisons = 0;

    // Performance Timing
    const start = process.hrtime();

    dictionary.forEach(entry => {
        const textIndo = entry.indonesia.toLowerCase();
        const textDaerah = entry.daerah.toLowerCase();

        // Search in Indonesian word
        let resultIndo;
        if (algo === 'naive') {
            resultIndo = naiveSearch(textIndo, query);
        } else {
            resultIndo = kmpSearch(textIndo, query);
        }

        // Search in Regional word
        let resultDaerah;
        if (algo === 'naive') {
            resultDaerah = naiveSearch(textDaerah, query);
        } else {
            resultDaerah = kmpSearch(textDaerah, query);
        }

        // Aggregate comparisons
        if (!resultIndo || !resultDaerah) {
            console.error("Algorithm returned undefined for:", { textIndo, textDaerah, algo });
            return;
        }

        // Note: For a real rigorous academic comparison, we might sum these up differently,
        // but here we sum total operations performed for this single query across the dataset.
        totalComparisons += ((resultIndo.comparisons || 0) + (resultDaerah.comparisons || 0));

        if (resultIndo.matches.length > 0 || resultDaerah.matches.length > 0) {
            results.push({
                entry: entry,
                matches: {
                    indonesia: resultIndo.matches, // Indices where match occurred
                    daerah: resultDaerah.matches
                }
            });
        }
    });

    const end = process.hrtime(start);
    const executionTimeMs = (end[0] * 1000 + end[1] / 1e6).toFixed(4); // Convert to ms

    res.json({
        metadata: {
            query: query,
            algorithm: algo,
            total_entries_scanned: dictionary.length,
            total_matches_found: results.length,
            performance: {
                execution_time_ms: executionTimeMs,
                total_comparisons: totalComparisons
            }
        },
        results: results
    });
});

// GET all dictionary data
router.get('/data', (req, res) => {
    res.json(dictionary);
});

// GET stats
router.get('/stats', (req, res) => {
    res.json({
        total_words: dictionary.length
    });
});

module.exports = router;
