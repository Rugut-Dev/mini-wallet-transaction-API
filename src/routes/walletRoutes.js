const express = require("express");
const WalletController = require("../controllers/WalletController");

const router = express.Router();
const walletController = new WalletController();

router.post("/wallets", walletController.createWallet);
router.post("/wallets/:walletId/deposit", walletController.deposit);
router.post("/wallets/transfer", walletController.transfer);

module.exports = router;
