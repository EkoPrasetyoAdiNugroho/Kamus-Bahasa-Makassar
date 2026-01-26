const { getClient } = require('../config/database');
const localDictionary = require('../../data/dictionary.json');

// Helper to get dictionary data (PostgreSQL or JSON fallback)
async function getDictionaryData() {
    const sql = getClient();

    if (!sql) {
        console.log(`Loaded ${localDictionary.length} words from local JSON`);
        return localDictionary;
    }

    try {
        // Use Neon's tagged template syntax
        const result = await sql`SELECT id, indonesia, daerah, lontara, kelas FROM dictionary ORDER BY indonesia`;

        if (result && result.length > 0) {
            console.log(`Loaded ${result.length} words from PostgreSQL`);
            return result;
        }
    } catch (error) {
        console.log('PostgreSQL query failed, using local JSON:', error.message);
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
    const { findSimilarWords } = require('../algorithms/levenshtein');

    let searchFunction;
    if (algo === 'kmp') {
        searchFunction = kmpSearch;
    } else {
        searchFunction = naiveSearch; // Default
    }

    const startTime = performance.now();

    // Get dictionary from PostgreSQL or JSON
    const dictionary = await getDictionaryData();

    const queryLower = q.toLowerCase().trim();



    // === STEP 1: Check for EXACT word match ===
    // An exact match means the query matches the entire word (indonesia or daerah)
    const exactMatches = [];
    let totalComparisons = 0;

    dictionary.forEach(entry => {
        const indonesiaLower = entry.indonesia.toLowerCase().trim();
        const daerahLower = entry.daerah.toLowerCase().trim();

        // Check if query exactly matches indonesia or daerah word
        const isExactIndonesia = indonesiaLower === queryLower;
        const isExactDaerah = daerahLower === queryLower;



        // Also run string matching algorithm for metrics
        let resultIndonesia = { matches: [], comparisons: 0 };
        let resultDaerah = { matches: [], comparisons: 0 };

        if (!dir || dir === 'id_to_regional') {
            resultIndonesia = searchFunction(indonesiaLower, queryLower);
        }

        if (!dir || dir === 'regional_to_id') {
            resultDaerah = searchFunction(daerahLower, queryLower);
        }

        totalComparisons += (resultIndonesia.comparisons + resultDaerah.comparisons);

        if (isExactIndonesia || isExactDaerah) {

            exactMatches.push({
                entry: entry,
                matches: {
                    indonesia: isExactIndonesia ? [0] : [],
                    daerah: isExactDaerah ? [0] : []
                },
                matchType: 'exact'
            });
        }
    });



    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(4);

    // === STEP 2: Find words with MATCHING PREFIX (3+ characters from index 0) ===


    const uniqueSuggestions = [];
    const seenEntries = new Set();

    // Only do prefix matching if query is at least 3 characters
    if (queryLower.length >= 3) {
        const queryPrefix3 = queryLower.substring(0, 3); // First 3 chars

        dictionary.forEach(entry => {
            const indonesiaLower = entry.indonesia.toLowerCase().trim();
            const daerahLower = entry.daerah.toLowerCase().trim();

            // Check if already in exact matches
            const alreadyInExact = exactMatches.some(
                result => result.entry.indonesia.toLowerCase() === indonesiaLower &&
                    result.entry.daerah.toLowerCase() === daerahLower
            );

            if (alreadyInExact) return; // Skip if already exact match

            // Check prefix match (first 3 chars) in both fields
            const indonesiaPrefix = indonesiaLower.substring(0, 3);
            const daerahPrefix = daerahLower.substring(0, 3);

            const matchesIndonesia = indonesiaPrefix === queryPrefix3;
            const matchesDaerah = daerahPrefix === queryPrefix3;

            // If either field matches prefix
            if (matchesIndonesia || matchesDaerah) {
                const entryKey = `${indonesiaLower}-${daerahLower}`;

                if (!seenEntries.has(entryKey)) {
                    seenEntries.add(entryKey);

                    // Calculate how many characters match consecutively from index 0
                    let matchingChars = 0;
                    const wordToCheck = matchesIndonesia ? indonesiaLower : daerahLower;

                    for (let i = 0; i < Math.min(queryLower.length, wordToCheck.length); i++) {
                        if (queryLower[i] === wordToCheck[i]) {
                            matchingChars++;
                        } else {
                            break; // Stop at first non-match
                        }
                    }

                    // Calculate similarity: use LONGER word as denominator
                    // Example: "balla" (5) vs "ballang" (7) -> 5 matches / 7 total = 71%
                    const maxLength = Math.max(queryLower.length, wordToCheck.length);
                    const similarity = (matchingChars / maxLength) * 100;

                    uniqueSuggestions.push({
                        entry: entry,
                        similarity: Math.round(similarity),
                        matchedField: matchesIndonesia ? 'indonesia' : 'daerah',
                        matchedWord: matchesIndonesia ? entry.indonesia : entry.daerah,
                        matchingChars: matchingChars
                    });
                }
            }
        });

        // Sort by number of matching characters (descending)
        uniqueSuggestions.sort((a, b) => b.matchingChars - a.matchingChars);
    }



    // === STEP 3: Determine response ===
    const hasExactMatch = exactMatches.length > 0;

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
        results: exactMatches,
        suggestions: uniqueSuggestions.slice(0, 5), // Limit to top 5 unique suggestions
        hasExactMatch: hasExactMatch,
        message: hasExactMatch
            ? `Ditemukan ${exactMatches.length} hasil untuk "${q}"`
            : `Kata "${q}" tidak ditemukan dalam kamus`
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
