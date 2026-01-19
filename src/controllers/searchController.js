const Dictionary = require('../models/Dictionary');
const localDictionary = require('../../data/dictionary.json');

// Helper to get dictionary data (MongoDB or JSON fallback)
async function getDictionaryData() {
    try {
        // Try MongoDB first
        const data = await Dictionary.find({}).lean();
        if (data && data.length > 0) {
            console.log(`Loaded ${data.length} words from MongoDB`);
            return data;
        }
    } catch (error) {
        console.log('MongoDB query failed, using local JSON');
    }

    // Fallback to local JSON
    console.log(`Loaded ${localDictionary.length} words from local JSON`);
    return localDictionary;
}

exports.search = async (req, res) => {
    const { q, algo, dir } = req.query;

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

    // Get dictionary from MongoDB or JSON
    const dictionary = await getDictionaryData();

    dictionary.forEach(entry => {
        let resultIndonesia = { matches: [], comparisons: 0 };
        let resultDaerah = { matches: [], comparisons: 0 };

        // Determine search direction
        // id_to_regional -> Search only in Indonesia
        // regional_to_id -> Search only in Daerah
        // empty/null -> Search both (Default)

        if (!dir || dir === 'id_to_regional') {
            resultIndonesia = searchFunction(entry.indonesia.toLowerCase(), q.toLowerCase());
        }

        if (!dir || dir === 'regional_to_id') {
            resultDaerah = searchFunction(entry.daerah.toLowerCase(), q.toLowerCase());
        }

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

exports.getAllData = async (req, res) => {
    const dictionary = await getDictionaryData();
    res.json(dictionary);
};

exports.getStats = async (req, res) => {
    const dictionary = await getDictionaryData();
    res.json({
        total_words: dictionary.length
    });
};
