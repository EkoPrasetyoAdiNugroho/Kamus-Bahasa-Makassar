const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, '../assets/Data.xlsx');
const dictPath = path.join(__dirname, '../data/dictionary.json');

// Lontara Mapping (Base Consonants)
const lontaraMap = {
    'ka': '\u1A00', 'ga': '\u1A01', 'nga': '\u1A02', 'ngka': '\u1A03',
    'pa': '\u1A04', 'ba': '\u1A05', 'ma': '\u1A06', 'mpa': '\u1A07',
    'ta': '\u1A08', 'da': '\u1A09', 'na': '\u1A0A', 'nra': '\u1A0B',
    'ca': '\u1A0C', 'ja': '\u1A0D', 'nya': '\u1A0E', 'nca': '\u1A0F',
    'ya': '\u1A10', 'ra': '\u1A11', 'la': '\u1A12', 'wa': '\u1A13',
    'sa': '\u1A14', 'a': '\u1A15', 'ha': '\u1A16'
};

// Vowels
// i: dot above (u1A17)
// u: dot below (u1A18)
// e: (u1A19) - left
// o: (u1A1A) - right
// ae/e': (u1A1B) ? User chart has Ke, Ke', Ko. 
// "e" usually maps to \u1A19 (taling) which goes BEFORE the letter visually in some fonts but logical order is distinct.
// "o" usually maps to \u1A1A which goes AFTER.

function toLontara(text) {
    if (!text) return '';
    let t = text.toLowerCase();

    // Simple syllabic parser (Very Naive)
    // 1. Identify syllables. 
    // Heuristic: Consonant(s) + Vowel. 
    // Ignore final consonants like 'k', 'ng' (unless part of ngka), 'n', 'm' etc.

    // Clean text: remove apostrophes/glottals if they are just stops
    // But ' might be significant. Nia' -> ᨊᨗᨕ (Ni-A) or Ni-Ya?
    // Let's treat ' as ignored for mapping, implies stop.
    t = t.replace(/'/g, '');

    let result = '';
    let i = 0;

    while (i < t.length) {
        // Try to match longest consonant sound first
        // Candidates: ngka, mpa, nra, nca, nga, nya, ka, ga...

        // Find consonant part
        let cons = '';
        let step = 0;

        // Check 4 letter cons (ngka)
        if (t.substr(i, 4).match(/^(ngka|ncka)/)) { // ncka? nca is 3
            cons = t.substr(i, 4);
            // wait, ngka is 4.
        }

        // Check 3 letter cons (nga, mpa, nra, nca, nya)
        if (!cons) {
            let sub3 = t.substr(i, 3);
            if (['nga', 'mpa', 'nra', 'nca', 'nya', 'ngk'].includes(sub3)) {
                // Warning: ngk might be start of ngka, handled above?
                // if text is 'ngka', sub3 is 'ngk'. 'a' is vowel.
                // My map has 'ngka' as key including 'a'.
                // I need to separate C and V.
                // Map keys have 'a'.
            }
        }

        // REVISIT: My map has vowels included in keys.
        // I should map BASE characters (K, G, Ng...) and apply vowel rules.

        // Let's Refine Map to Bases
        // k: \u1A00, g: 01, ng: 02, ngk: 03, p: 04, b: 05, m: 06, mp: 07
        // t: 08, d: 09, n: 0A, nr: 0B, c: 0C, j: 0D, ny: 0E, nc: 0F
        // y: 10, r: 11, l: 12, w: 13, s: 14, a: 15, h: 16

        // Vowels: 
        // a: (default, no suffix) (u1A15 if standalone A)
        // i: + \u1A17
        // u: + \u1A18
        // e: + \u1A19 (before? in unicode it's character + vowel mark usually)
        // o: + \u1A1A

        // Parse: Find Consonant Cluster + Vowel
        // NGKA -> NGK + A

        // Let's identify the C cluster.
        let C = '';
        let V = 'a'; // default
        let consumed = 0;

        // Try 4 chars (ngka?) - wait, ngk is the C.
        if (['ngk'].includes(t.substr(i, 3))) { C = 'ngk'; consumed = 3; }
        else if (['mpa', 'nra', 'nca', 'nga', 'nya'].some(x => t.substr(i, 3).startsWith(x.substr(0, 2)) && false)) {
            // logic fail.
        }

        // Ordered lookup for Consonants
        const consList = ['ngk', 'mpa', 'nra', 'nca', 'nga', 'nya', 'ka', 'ga', 'pa', 'ba', 'ma', 'ta', 'da', 'na', 'ca', 'ja', 'ya', 'ra', 'la', 'wa', 'sa', 'ha'];
        // Note: 'a' is special (start with vowel).

        let foundC = false;

        // Special case: Starts with Vowel (Content is 'Ada') -> A-Da.
        // If current char is vowel, C is 'a' (u1A15).
        if (['a', 'i', 'u', 'e', 'o'].includes(t[i])) {
            C = 'null'; // use placeholder concept
            foundC = true;
            consumed = 0; // Don't consume yet, the vowel consumption happens next
        } else {
            // Try to match multi-char consonants
            // sorted by length desc
            const bases = [
                { k: 'ngk', v: '\u1A03' }, { k: 'mpa', v: '\u1A07' }, { k: 'nra', v: '\u1A0B' }, { k: 'nca', v: '\u1A0F' },
                { k: 'nga', v: '\u1A02' }, { k: 'nya', v: '\u1A0E' },
                { k: 'ka', v: '\u1A00' }, { k: 'ga', v: '\u1A01' }, { k: 'pa', v: '\u1A04' }, { k: 'ba', v: '\u1A05' }, { k: 'ma', v: '\u1A06' },
                { k: 'ta', v: '\u1A08' }, { k: 'da', v: '\u1A09' }, { k: 'na', v: '\u1A0A' }, { k: 'ca', v: '\u1A0C' }, { k: 'ja', v: '\u1A0D' },
                { k: 'ya', v: '\u1A10' }, { k: 'ra', v: '\u1A11' }, { k: 'la', v: '\u1A12' }, { k: 'wa', v: '\u1A13' }, { k: 'sa', v: '\u1A14' },
                { k: 'ha', v: '\u1A16' }
            ];

            // bases keys usually end in 'a' in the map, so strip 'a'
            for (let b of bases) {
                let baseStr = b.k.slice(0, -1); // ngk, mp...
                // Special check: ensure we don't match 'n' of 'nga' if it's just 'na'
                if (t.substr(i).startsWith(baseStr)) {
                    // Check next char is vowel? 
                    // e.g. 'ngk' matched. 'i' follows? 
                    // what if 'ngka'? 'a' follows.

                    // We found a match.
                    C = b.v;
                    consumed = baseStr.length;
                    foundC = true;
                    break;
                }
            }

            if (!foundC) {
                // Single consonants not covered above? 
                // k, g, p, b, m, t, d, n, c, j, y, r, l, w, s, h
                // My list covered them (ka, ga..).
                // What if words end in consonant? 'mangan'. 'n' at end.
                // It won't match 'na' (n+vowel).
                // If no match and not vowel, it's a dead consonant. Skip/Ignore.
                i++;
                continue;
            }
        }

        // Consume Vowel
        let nextChar = t[i + consumed];
        let vowelMark = '';
        let vowelConsumed = 0;

        if (nextChar === 'a') { vowelMark = ''; vowelConsumed = 1; }
        else if (nextChar === 'i') { vowelMark = '\u1A17'; vowelConsumed = 1; }
        else if (nextChar === 'u') { vowelMark = '\u1A18'; vowelConsumed = 1; }
        else if (nextChar === 'e') { vowelMark = '\u1A19'; vowelConsumed = 1; } // é?
        else if (nextChar === 'o') { vowelMark = '\u1A1A'; vowelConsumed = 1; }
        else {
            // No standard vowel follows?
            // Maybe it's 'e' pepet = 'a'? 
            // Or maybe it's the A base implicit?
            // If C was null (vowel start) and no vowel char, this is error.
            if (C === 'null') {
                i++; continue;
            }
            // If C found but no vowel, default 'a' (implicit)?
            // But if text is 'n' (dead), we shouldn't have matched 'na'.
            // Actually, my regex matched 'n' from 'na' base. 
            // If the text is 'makan', k matches 'ka', a matches 'a'. 'n' at end.
            // 'n' matches 'na' base 'n'? 
            // My loop matches, checks vowel.
            // If 'n' is followed by EOF, it's dead.
            // So if !vowel, treat as dead?
            vowelMark = ''; // implicit a? 
            // No, strictly, if I see 'n' at end, it's dead.
            // 'na' base implies 'n' + 'a'.
            // So I should only match 'n' if it is followed by vowel?

            // This logic is getting complex.
            // Fallback: If no vowel character found to consume, assume dead consonant (skip) UNLESS it is implicit 'a'?
            // Latin-to-Lontara without distinct 'a' marker is tricky.
            // Assuming the input is Latinized Makassar which usually writes vowels explicitly.
            // 'Mangkasara' -> Ma-ngka-sa-ra.
            // 'Mangan' -> Ma-nga-n.
            // If I matched 'n' (from na), and next is not vowel, I should probably discard 'n'.

            vowelConsumed = 0; // Didn't eat a vowel.
            // But did we create a syllable?
            // If I matched 'm' (ma), and next is 'p' (part of mpa?), wait.
            // If I matched 'm' but it was actually 'mpa', precedence matters.

            // Let's assume my bases array is sorted by length handles precedence.
            // Issue: 'n' at end. Matches 'na' base (n). 
            // Next char is undefined.
            // Check: is next char a vowel?
            const isVowel = (c) => ['a', 'i', 'u', 'e', 'o'].includes(c);
            if (!isVowel(nextChar)) {
                // Dead consonant. Skip.
                i += consumed;
                continue;
            }
        }

        // Emit
        let baseChar = C;
        if (C === 'null') baseChar = '\u1A15'; // A base

        result += baseChar + vowelMark;
        i += consumed + vowelConsumed;
    }
    return result;
}

try {
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Skip header (Row 0)
    const newDict = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 2) continue;

        const indonesia = row[0];
        const daerah = row[1];

        if (!indonesia || !daerah) continue;

        // Generate Lontara
        // Generate from 'daerah' field
        const lontara = toLontara(daerah.toString());

        newDict.push({
            indonesia: indonesia.toString().trim(),
            daerah: daerah.toString().trim(),
            lontara: lontara,
            kelas: "Umum", // Default
            description: `Terjemahan: ${indonesia}`
        });
    }

    console.log(`Processed ${newDict.length} entries.`);

    // Write
    fs.writeFileSync(dictPath, JSON.stringify(newDict, null, 4));
    console.log("Dictionary updated successfully!");

} catch (e) {
    console.error("Import failed:", e);
}
