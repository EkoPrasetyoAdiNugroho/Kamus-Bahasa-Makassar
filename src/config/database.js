const { neon } = require('@neondatabase/serverless');

let sql = null;

// Initialize Neon SQL client (serverless-optimized)
const getClient = () => {
    if (sql) {
        return sql;
    }

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
        console.warn('No PostgreSQL connection string found');
        return null;
    }

    // Neon serverless driver uses HTTP/WebSocket, perfect for serverless
    sql = neon(connectionString);
    return sql;
};

const connectDB = async () => {
    try {
        const sql = getClient();

        if (!sql) {
            console.warn('PostgreSQL client not initialized, falling back to local JSON');
            return null;
        }

        // Test connection with simple query
        await sql`SELECT 1`;
        console.log(`Neon PostgreSQL Connected (Serverless)`);

        return true;
    } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        console.warn('Falling back to local JSON data');
        return null;
    }
};

// Execute query using Neon's tagged template
const executeQuery = async (query, params = []) => {
    const sql = getClient();

    if (!sql) {
        throw new Error('No database client available');
    }

    try {
        // Neon uses tagged templates, but we need to convert our parameterized queries
        // For now, return raw query execution
        const result = await sql(query, params);
        return { rows: result };
    } catch (error) {
        console.error('Query execution error:', error);
        throw error;
    }
};

module.exports = { connectDB, executeQuery, getClient };
