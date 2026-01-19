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

    const startTime = performance.now();

    const results = dictionary.filter(entry => {
        // Search in both indonesia and daerah fields
        const matchIndonesia = searchFunction(entry.indonesia.toLowerCase(), q.toLowerCase());
        const matchDaerah = searchFunction(entry.daerah.toLowerCase(), q.toLowerCase());
        return matchIndonesia || matchDaerah;
    });

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(4);

    // Create detailed results with match information
    const detailedResults = results.map(entry => {
        const matches = {
            indonesia: searchFunction(entry.indonesia.toLowerCase(), q.toLowerCase()) ? [0] : [],
            daerah: searchFunction(entry.daerah.toLowerCase(), q.toLowerCase()) ? [0] : []
        };
        return { entry, matches };
    });

    res.json({
        success: true,
        metadata: {
            keyword: q,
            algorithm: algo === 'kmp' ? 'kmp' : 'naive',
            performance: {
                execution_time_ms: timeTaken,
                total_comparisons: results.length
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
