const dictionary = require('../../data/dictionary.json');

exports.search = (req, res) => {
    const { q, algo } = req.query;

    if (!q) {
        return res.status(400).json({ success: false, message: "Query parameter 'q' is required." });
    }

    const { performance } = require('perf_hooks');
    const naiveSearch = require('../algorithms/naive');
    const kmpSearch = require('../algorithms/kmp');

    let searchFunction;
    if (algo === 'kmp') {
        searchFunction = kmpSearch;
    } else {
        searchFunction = naiveSearch; // Default
    }

    let totalComparisons = 0;
    const detailedResults = [];

    const startTime = performance.now();

    dictionary.forEach(entry => {
        // Search in both fields
        const resultIndonesia = searchFunction(entry.indonesia.toLowerCase(), q.toLowerCase());
        const resultDaerah = searchFunction(entry.daerah.toLowerCase(), q.toLowerCase());

        // Aggregate comparisons (metrics)
        totalComparisons += (resultIndonesia.comparisons + resultDaerah.comparisons);

        // Check if match found
        if (resultIndonesia.matches.length > 0 || resultDaerah.matches.length > 0) {
            detailedResults.push({
                entry: entry,
                matches: {
                    indonesia: resultIndonesia.matches,
                    daerah: resultDaerah.matches
                }
            });
        }
    });

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(4);

    res.json({
        success: true,
        metadata: {
            keyword: q,
            algorithm: algo === 'kmp' ? 'kmp' : 'naive',
            performance: {
                execution_time_ms: timeTaken,
                total_comparisons: totalComparisons
            }
        },
        results: detailedResults
    });
};

exports.getAllData = (req, res) => {
    res.json(dictionary);
};

exports.getStats = (req, res) => {
    res.json({
        total_words: dictionary.length
    });
};
