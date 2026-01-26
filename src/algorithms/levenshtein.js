/**
 * Levenshtein Distance Algorithm
 * Calculates the minimum number of single-character edits (insertions, deletions, substitutions)
 * required to change one string into another.
 * 
 * Used for fuzzy search and finding similar words.
 */

/**
 * Calculate Levenshtein Distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance (lower = more similar)
 */
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    // Create a 2D array for dynamic programming
    const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    // Initialize base cases
    for (let i = 0; i <= len1; i++) {
        dp[i][0] = i; // Cost of deleting all characters from str1
    }
    for (let j = 0; j <= len2; j++) {
        dp[0][j] = j; // Cost of inserting all characters to str1
    }

    // Fill the DP table
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                // Characters match, no edit needed
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Take minimum of three operations: insert, delete, substitute
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,      // Deletion
                    dp[i][j - 1] + 1,      // Insertion
                    dp[i - 1][j - 1] + 1   // Substitution
                );
            }
        }
    }

    return dp[len1][len2];
}

/**
 * Calculate similarity percentage between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity percentage (0-100)
 */
function calculateSimilarity(str1, str2) {
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);

    if (maxLength === 0) return 100;

    const similarity = ((maxLength - distance) / maxLength) * 100;
    return Math.round(similarity * 100) / 100; // Round to 2 decimal places
}

/**
 * Find similar words from a word list based on Levenshtein Distance
 * @param {string} query - Search query
 * @param {Array} wordList - Array of word objects {word, ...}
 * @param {number} maxResults - Maximum number of results to return
 * @param {number} threshold - Minimum similarity percentage (0-100)
 * @returns {Array} - Array of similar words sorted by similarity
 */
function findSimilarWords(query, wordList, maxResults = 5, threshold = 40) {
    const queryLower = query.toLowerCase();

    // Calculate similarity for each word
    const similarities = wordList.map(item => {
        const word = item.toLowerCase();
        const similarity = calculateSimilarity(queryLower, word);
        const distance = levenshteinDistance(queryLower, word);

        return {
            word: item,
            similarity,
            distance
        };
    });

    // Filter by threshold and sort by similarity (descending) and distance (ascending)
    const filtered = similarities
        .filter(item => item.similarity >= threshold)
        .sort((a, b) => {
            // First sort by similarity (higher is better)
            if (b.similarity !== a.similarity) {
                return b.similarity - a.similarity;
            }
            // If similarity is equal, sort by distance (lower is better)
            return a.distance - b.distance;
        });

    // Return top N results
    return filtered.slice(0, maxResults);
}

module.exports = {
    levenshteinDistance,
    calculateSimilarity,
    findSimilarWords
};
