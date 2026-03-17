class TransferDTO {
  constructor(payload = {}) {
    this.fromWalletId = this.validateWalletId(
      payload.fromWalletId,
      "fromWalletId"
    );
    this.toWalletId = this.validateWalletId(payload.toWalletId, "toWalletId");
    this.amount = this.validateAmount(payload.amount);

    if (this.fromWalletId === this.toWalletId) {
      throw new Error("Cannot transfer to the same wallet");
    }
  }

  validateWalletId(walletId, fieldName) {
    const parsedWalletId = Number(walletId);

    if (!Number.isInteger(parsedWalletId) || parsedWalletId <= 0) {
      throw new Error(`${fieldName} must be a positive integer`);
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

module.exports = TransferDTO;
