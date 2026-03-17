const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(__dirname, "../../", process.env.DB_PATH || "wallet.db");
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Failed to connect to SQLite database:", error.message);
  }
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      from_wallet_id INTEGER,
      to_wallet_id INTEGER,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_wallet_id) REFERENCES wallets (id),
      FOREIGN KEY (to_wallet_id) REFERENCES wallets (id)
    )
  `);
});

module.exports = db;
