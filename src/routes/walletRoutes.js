const express = require("express");

function createWalletRouter(walletController) {
  const router = express.Router();

  router.post("/wallets", walletController.createWallet);
  router.post("/wallets/:walletId/deposit", walletController.deposit);
  router.post("/wallets/transfer", walletController.transfer);

  return router;
}

module.exports = createWalletRouter;
