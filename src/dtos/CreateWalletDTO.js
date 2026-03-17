class CreateWalletDTO {
  constructor(payload = {}) {
    this.name = this.validateName(payload.name);
  }

  validateName(name) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Wallet name is required");
    }

    return name.trim();
  }
}

module.exports = CreateWalletDTO;
