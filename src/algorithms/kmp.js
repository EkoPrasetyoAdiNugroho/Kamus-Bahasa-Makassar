/**
 * Knuth-Morris-Pratt (KMP) String Matching Algorithm
 * Returns all occurrences of the pattern in the text.
 * 
 * @param {string} text - The text to search in.
 * @param {string} pattern - The pattern to search for.
 * @returns {object} - { matches: number[], comparisons: number }
 */
function kmpSearch(text, pattern) {
    const n = text ? text.length : 0;
    const m = pattern ? pattern.length : 0;
    const matches = [];
    let comparisons = 0;

    if (m === 0 || n === 0) return { matches, comparisons };

    // Preprocess the pattern (calculate LPS array)
    const lps = computeLPSArray(pattern);

    let i = 0; // index for text[]
    let j = 0; // index for pattern[]

    while (i < n) {
        comparisons++; // Count comparison logic

        if (pattern[j] === text[i]) {
            j++;
            i++;
        }

        if (j === m) {
            matches.push(i - j);
            j = lps[j - 1]; // Reset j to continue searching
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
                // Do not increment i here
            } else {
                i++;
            }
        }
    }

    return { matches, comparisons };
}

/**
 * Computes the Longest Prefix Suffix (LPS) array.
 * 
 * @param {string} pattern 
 * @returns {number[]}
 */
function computeLPSArray(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let len = 0; // length of the previous longest prefix suffix
    let i = 1;

    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

module.exports = kmpSearch;
