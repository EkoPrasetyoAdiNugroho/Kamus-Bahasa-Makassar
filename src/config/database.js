const { Client } = require('pg');

// Create a new client for each query (serverless-friendly)
const createClient = () => {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
        console.warn('No PostgreSQL connection string found');
        return null;
    }

    return new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });
};

const connectDB = async () => {
    try {
        const client = createClient();

        if (!client) {
            console.warn('PostgreSQL client not initialized, falling back to local JSON');
            return null;
        }

        await client.connect();
        console.log(`PostgreSQL Connected: ${client.host}`);
        await client.end();

        return true;
    } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        console.warn('Falling back to local JSON data');
        return null;
    }
};

// Execute query with automatic client management
const executeQuery = async (queryText, params = []) => {
    const client = createClient();

    if (!client) {
        throw new Error('No database client available');
    }

    try {
        await client.connect();
        const result = await client.query(queryText, params);
        return result;
    } finally {
        await client.end();
    }
};

module.exports = { connectDB, executeQuery };
