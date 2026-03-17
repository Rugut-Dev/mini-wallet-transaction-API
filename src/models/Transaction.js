class Transaction {
  constructor(type, amount, fromWalletId, toWalletId) {
    this.type = type;
    this.amount = Number(amount);
    this.fromWalletId = fromWalletId;
    this.toWalletId = toWalletId;
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Transaction;
