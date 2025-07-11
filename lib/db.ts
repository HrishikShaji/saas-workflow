import mysql from 'mysql2/promise';

const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

export default pool;
