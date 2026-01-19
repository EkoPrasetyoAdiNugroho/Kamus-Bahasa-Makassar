const fs = require('fs');
const pdf = require('pdf-parse');
const pathStr = 'e:\\Latihan\\website\\Kamus Bhs daerah\\assets\\data_kamus.pdf';

const dataBuffer = fs.readFileSync(pathStr);

pdf(dataBuffer).then(function (data) {
    const text = data.text;
    console.log("Total Text Length:", text.length);

    // Check for Lontara chars (Buginese/Makassar range U+1A00 - U+1A1F)
    // Note: Some fonts might map them differently, but let's check standard first
    const lontaraRegex = /[\u1A00-\u1A1F]/g;
    const lontaraMatches = text.match(lontaraRegex);
    console.log("Lontara Characters Found:", lontaraMatches ? lontaraMatches.length : 0);

    const lines = text.split(/\r\n|\n|\r/);
    console.log("Total Lines:", lines.length);

    console.log("\n--- LINE SAMPLE (Searching for content) ---");
    // Print a chunk where content likely is
    const startLine = Math.min(100, lines.length - 200);
    for (let i = startLine; i < startLine + 100; i++) {
        if (lines[i] && lines[i].trim().length > 0) {
            console.log(`[${i}] ${lines[i].trim()}`);
        }
    }

    // Look for a specific pattern if possible
    console.log("\n--- SEARCHING FOR 'A' ENTRIES ---");
    const aEntries = lines.filter(l => l.startsWith('A') || l.startsWith('a')).slice(0, 10);
    aEntries.forEach(l => console.log(`Potential Entry: ${l}`));

}).catch(err => {
    console.error("Error:", err);
});
