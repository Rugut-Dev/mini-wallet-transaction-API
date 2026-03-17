const db = require("../config/db");
const Wallet = require("../models/Wallet");

class WalletRepository {
  constructor(database = db) {
    this.db = database;
  }

  run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function onRun(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          lastID: this.lastID,
          changes: this.changes,
        });
      });
    });
  }

  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (error, row) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(row);
      });
    });
  }

  async create(walletOrName, balance = 0) {
    const wallet =
      walletOrName instanceof Wallet
        ? walletOrName
        : new Wallet(
            null,
            typeof walletOrName === "object" ? walletOrName.name : walletOrName,
            typeof walletOrName === "object" ? walletOrName.balance ?? balance : balance
          );

    const result = await this.run(
      "INSERT INTO wallets (name, balance) VALUES (?, ?)",
      [wallet.name, wallet.balance]
    );

    return new Wallet(result.lastID, wallet.name, wallet.balance);
  }

  async findById(id) {
    const row = await this.get(
      "SELECT id, name, balance FROM wallets WHERE id = ?",
      [id]
    );

    if (!row) {
      return null;
    }

    return new Wallet(row.id, row.name, row.balance);
  }

  async updateBalance(id, balance) {
    const parsedBalance = Number(balance);

    await this.run("UPDATE wallets SET balance = ? WHERE id = ?", [
      parsedBalance,
      id,
    ]);

    return this.findById(id);
  }
}

module.exports = WalletRepository;
