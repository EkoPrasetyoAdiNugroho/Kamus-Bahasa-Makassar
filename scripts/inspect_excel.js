const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../assets/Data.xlsx');
console.log("Reading file from:", filePath);

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON to see headers
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Header: 1 gives array of arrays

    console.log("Sheet Name:", sheetName);
    console.log("Total Rows:", data.length);

    if (data.length > 0) {
        console.log("Headers (Row 1):", data[0]);
    }

    if (data.length > 1) {
        console.log("Sample Data (Row 2):", data[1]);
        console.log("Sample Data (Row 3):", data[2]);
    }

} catch (e) {
    console.error("Error reading Excel:", e);
}
