const { Pool } = require('pg');

let pool = null;

const getPool = () => {
    if (pool) {
        return pool;
    }

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
        console.warn('No PostgreSQL connection string found, using local JSON fallback');
        return null;
    }

    pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        max: 10, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client', err);
    });

    return pool;
};

const connectDB = async () => {
    try {
        const pool = getPool();

        if (!pool) {
            console.warn('PostgreSQL pool not initialized, falling back to local JSON');
            return null;
        }

        // Test connection
        const client = await pool.connect();
        console.log(`PostgreSQL Connected: ${client.connectionParameters.host}`);
        client.release();

        return pool;
    } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        console.warn('Falling back to local JSON data');
        return null;
    }
};

module.exports = { connectDB, getPool };
