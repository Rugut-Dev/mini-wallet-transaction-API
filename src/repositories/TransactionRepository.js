const db = require("../config/db");
const Transaction = require("../models/Transaction");

class TransactionRepository {
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

  async insert(transactionData) {
    const transaction =
      transactionData instanceof Transaction
        ? transactionData
        : new Transaction(
            transactionData.type,
            transactionData.amount,
            transactionData.fromWalletId ?? null,
            transactionData.toWalletId ?? null
          );

    if (transactionData.createdAt) {
      transaction.createdAt = transactionData.createdAt;
    }

    const result = await this.run(
      `
        INSERT INTO transactions (
          type,
          amount,
          from_wallet_id,
          to_wallet_id,
          created_at
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        transaction.type,
        transaction.amount,
        transaction.fromWalletId ?? null,
        transaction.toWalletId ?? null,
        transaction.createdAt,
      ]
    );

    transaction.id = result.lastID;
    return transaction;
  }
}

module.exports = TransactionRepository;
