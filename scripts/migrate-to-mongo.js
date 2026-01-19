/**
 * Migration Script: Import dictionary.json data into MongoDB
 * Run this once to populate your MongoDB Atlas database
 * 
 * Usage: node scripts/migrate-to-mongo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Dictionary = require('../src/models/Dictionary');
const localData = require('../data/dictionary.json');

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI_APP, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected successfully!');

        // Clear existing data (optional - comment this out if you want to keep existing data)
        console.log('Clearing existing data...');
        await Dictionary.deleteMany({});
        console.log('Cleared!');

        // Insert all dictionary entries
        console.log(`Inserting ${localData.length} words...`);
        const result = await Dictionary.insertMany(localData);
        console.log(`Successfully inserted ${result.length} words!`);

        // Verify
        const count = await Dictionary.countDocuments();
        console.log(`Total words in database: ${count}`);

        mongoose.connection.close();
        console.log('\nMigration completed successfully! ✅');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
