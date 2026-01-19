/**
 * Database Schema for PostgreSQL
 * Run this to create the dictionary table
 */

const SQL_CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS dictionary (
    id SERIAL PRIMARY KEY,
    indonesia VARCHAR(255) NOT NULL,
    daerah VARCHAR(255) NOT NULL,
    lontara VARCHAR(255) DEFAULT '',
    kelas VARCHAR(100) DEFAULT 'Umum',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_indonesia ON dictionary(indonesia);
CREATE INDEX IF NOT EXISTS idx_daerah ON dictionary(daerah);
CREATE INDEX IF NOT EXISTS idx_kelas ON dictionary(kelas);
`;

const SQL_INSERT_WORD = `
INSERT INTO dictionary (indonesia, daerah, lontara, kelas)
VALUES ($1, $2, $3, $4)
RETURNING *;
`;

const SQL_GET_ALL = `
SELECT id, indonesia, daerah, lontara, kelas FROM dictionary ORDER BY indonesia;
`;

const SQL_SEARCH_INDONESIA = `
SELECT id, indonesia, daerah, lontara, kelas 
FROM dictionary 
WHERE LOWER(indonesia) LIKE LOWER($1);
`;

const SQL_SEARCH_DAERAH = `
SELECT id, indonesia, daerah, lontara, kelas 
FROM dictionary 
WHERE LOWER(daerah) LIKE LOWER($1);
`;

const SQL_SEARCH_BOTH = `
SELECT id, indonesia, daerah, lontara, kelas 
FROM dictionary 
WHERE LOWER(indonesia) LIKE LOWER($1) OR LOWER(daerah) LIKE LOWER($1);
`;

const SQL_COUNT = `
SELECT COUNT(*) as total FROM dictionary;
`;

const SQL_CLEAR_ALL = `
DELETE FROM dictionary;
`;

module.exports = {
    SQL_CREATE_TABLE,
    SQL_INSERT_WORD,
    SQL_GET_ALL,
    SQL_SEARCH_INDONESIA,
    SQL_SEARCH_DAERAH,
    SQL_SEARCH_BOTH,
    SQL_COUNT,
    SQL_CLEAR_ALL
};
