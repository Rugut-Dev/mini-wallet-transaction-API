const db = require("../config/db");
const TransactionRepository = require("../repositories/TransactionRepository");
const WalletRepository = require("../repositories/WalletRepository");

class WalletService {
  constructor(
    database = db,
    walletRepository = new WalletRepository(database),
    transactionRepository = new TransactionRepository(database)
  ) {
    this.db = database;
    this.walletRepository = walletRepository;
    this.transactionRepository = transactionRepository;
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

  async deposit(walletId, amount) {
    await this.run("BEGIN TRANSACTION");

    try {
      const wallet = await this.walletRepository.findById(walletId);

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      wallet.deposit(amount);

      const updatedWallet = await this.walletRepository.updateBalance(
        wallet.id,
        wallet.balance
      );

      const transaction = await this.transactionRepository.insert({
        type: "deposit",
        amount,
        fromWalletId: null,
        toWalletId: wallet.id,
      });

      await this.run("COMMIT");

      return {
        wallet: updatedWallet,
        transaction,
      };
    } catch (error) {
      try {
        await this.run("ROLLBACK");
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }

      throw error;
    }
  }

  async transfer(fromId, toId, amount) {
    if (Number(fromId) === Number(toId)) {
      throw new Error("Transfer requires two different wallets");
    }

    await this.run("BEGIN TRANSACTION");

    try {
      const fromWallet = await this.walletRepository.findById(fromId);
      const toWallet = await this.walletRepository.findById(toId);

      if (!fromWallet || !toWallet) {
        throw new Error("Both wallets must exist");
      }

      fromWallet.withdraw(amount);
      toWallet.deposit(amount);

      const updatedFromWallet = await this.walletRepository.updateBalance(
        fromWallet.id,
        fromWallet.balance
      );
      const updatedToWallet = await this.walletRepository.updateBalance(
        toWallet.id,
        toWallet.balance
      );

      const transaction = await this.transactionRepository.insert({
        type: "transfer",
        amount,
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
      });

      await this.run("COMMIT");

      return {
        fromWallet: updatedFromWallet,
        toWallet: updatedToWallet,
        transaction,
      };
    } catch (error) {
      try {
        await this.run("ROLLBACK");
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }

      throw error;
    }
  }
}

module.exports = WalletService;
