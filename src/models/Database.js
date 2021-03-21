// ===== Database
const mysql = require("mysql2");

class Database {
  constructor() {
    this.db = mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      timezone: process.env.DATABASE_TIMEZONE
    });
  }
}

module.exports = Database;
