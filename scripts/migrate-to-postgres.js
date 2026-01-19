/**
 * Migration Script: Import dictionary.json data into PostgreSQL (Neon)
 * Run this once to populate your database
 * 
 * Usage: node scripts/migrate-to-postgres.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const localData = require('../data/dictionary.json');
const queries = require('../src/models/queries');

async function migrate() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
        console.error('Error: DATABASE_URL or POSTGRES_URL not found in environment variables');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to PostgreSQL...');
        const client = await pool.connect();
        console.log('Connected successfully!');

        // Create table if not exists
        console.log('Creating table schema...');
        await client.query(queries.SQL_CREATE_TABLE);
        console.log('Table schema ready!');

        // Clear existing data (optional - comment this out if you want to keep existing data)
        console.log('Clearing existing data...');
        await client.query(queries.SQL_CLEAR_ALL);
        console.log('Cleared!');

        // Insert all dictionary entries
        console.log(`Inserting ${localData.length} words...`);
        let inserted = 0;

        for (const entry of localData) {
            await client.query(queries.SQL_INSERT_WORD, [
                entry.indonesia,
                entry.daerah,
                entry.lontara || '',
                entry.kelas || 'Umum'
            ]);
            inserted++;

            // Progress indicator
            if (inserted % 50 === 0) {
                console.log(`  Progress: ${inserted}/${localData.length}...`);
            }
        }

        console.log(`Successfully inserted ${inserted} words!`);

        // Verify
        const countResult = await client.query(queries.SQL_COUNT);
        const total = countResult.rows[0].total;
        console.log(`Total words in database: ${total}`);

        client.release();
        await pool.end();
        console.log('\nMigration completed successfully! ✅');
    } catch (error) {
        console.error('Migration failed:', error);
        await pool.end();
        process.exit(1);
    }
}

migrate();
