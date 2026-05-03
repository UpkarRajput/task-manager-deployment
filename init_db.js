const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function createTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306 
        });

        console.log("Connected to Railway MySQL!");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password_hash VARCHAR(255)
            );
        `);
        console.log("✅ Users table ready.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Projects table ready.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS ProjectMembers (
                project_id INT,
                user_id INT,
                role ENUM('Admin', 'Member') DEFAULT 'Member',
                PRIMARY KEY (project_id, user_id),
                FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            );
        `);
        console.log("✅ ProjectMembers table ready.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                assigned_to INT NULL,
                title VARCHAR(200),
                status ENUM('To Do', 'In Progress', 'Done') DEFAULT 'To Do',
                due_date DATE,
                FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_to) REFERENCES Users(id) ON DELETE SET NULL
            );
        `);
        console.log("✅ Tasks table ready.");

        console.log("🎉 All database tables created successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
        process.exit(1);
    }
}

createTables();