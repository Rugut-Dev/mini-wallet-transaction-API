class Wallet {
  constructor(id, name, balance) {
    this.id = id;
    this.name = name;
    this.balance = Number(balance);
  }

  deposit(amount) {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new Error("Deposit amount must be a positive number");
    }

    this.balance += parsedAmount;
    return this.balance;
  }

  withdraw(amount) {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new Error("Withdrawal amount must be a positive number");
    }

    if (parsedAmount > this.balance) {
      throw new Error("Insufficient wallet balance");
    }

    this.balance -= parsedAmount;
    return this.balance;
  }
}

module.exports = Wallet;
