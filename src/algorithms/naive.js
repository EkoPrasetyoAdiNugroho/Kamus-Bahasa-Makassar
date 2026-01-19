/**
 * Naive String Matching Algorithm
 * Returns all occurrences of the pattern in the text.
 * 
 * @param {string} text - The text to search in.
 * @param {string} pattern - The pattern to search for.
 * @returns {object} - { matches: number[], comparisons: number }
 */
function naiveSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const matches = [];
    let comparisons = 0;

    if (m === 0) return { matches, comparisons };

    // Loop through all possible starting positions
    for (let i = 0; i <= n - m; i++) {
        let j = 0;

        // For current index i, check for pattern match
        while (j < m) {
            comparisons++; // Count comparison
            if (text[i + j] !== pattern[j]) {
                break;
            }
            j++;
        }

        if (j === m) {
            matches.push(i); // Pattern found at index i
        }
    }

    return { matches, comparisons };
}

module.exports = naiveSearch;
