class DepositDTO {
  constructor(payload = {}) {
    this.walletId = this.validateWalletId(payload.walletId);
    this.amount = this.validateAmount(payload.amount);
  }

  validateWalletId(walletId) {
    const parsedWalletId = Number(walletId);

    if (!Number.isInteger(parsedWalletId) || parsedWalletId <= 0) {
      throw new Error("walletId must be a positive integer");
    }

    return parsedWalletId;
  }

  validateAmount(amount) {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    return parsedAmount;
  }
}

module.exports = DepositDTO;
