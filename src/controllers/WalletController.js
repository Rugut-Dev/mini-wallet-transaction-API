const CreateWalletDTO = require("../dtos/CreateWalletDTO");
const DepositDTO = require("../dtos/DepositDTO");
const TransferDTO = require("../dtos/TransferDTO");
const WalletRepository = require("../repositories/WalletRepository");
const WalletService = require("../services/WalletService");

class WalletController {
  constructor(
    walletService = new WalletService(),
    walletRepository = new WalletRepository()
  ) {
    this.walletService = walletService;
    this.walletRepository = walletRepository;

    this.createWallet = this.createWallet.bind(this);
    this.deposit = this.deposit.bind(this);
    this.transfer = this.transfer.bind(this);
  }

  getRequestValue(req, key) {
    if (req.body && req.body[key] !== undefined) {
      return req.body[key];
    }

    if (req.params && req.params[key] !== undefined) {
      return req.params[key];
    }

    return undefined;
  }

  getErrorStatus(error) {
    const notFoundErrors = new Set(["Wallet not found", "Both wallets must exist"]);

    if (notFoundErrors.has(error.message)) {
      return 404;
    }

    return 400;
  }

  async createWallet(req, res) {
    try {
      const dto = new CreateWalletDTO(req.body);
      const wallet = await this.walletRepository.create(dto.name, 0);

      return res.status(201).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      return res.status(this.getErrorStatus(error)).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deposit(req, res) {
    try {
      const dto = new DepositDTO({
        walletId: this.getRequestValue(req, "walletId"),
        amount: this.getRequestValue(req, "amount"),
      });

      const result = await this.walletService.deposit(dto.walletId, dto.amount);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(this.getErrorStatus(error)).json({
        success: false,
        error: error.message,
      });
    }
  }

  async transfer(req, res) {
    try {
      const dto = new TransferDTO({
        fromWalletId: this.getRequestValue(req, "fromWalletId"),
        toWalletId: this.getRequestValue(req, "toWalletId"),
        amount: this.getRequestValue(req, "amount"),
      });

      const result = await this.walletService.transfer(
        dto.fromWalletId,
        dto.toWalletId,
        dto.amount
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(this.getErrorStatus(error)).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = WalletController;
