const express = require("express");
const db = require("./config/db");
const WalletController = require("./controllers/WalletController");
const TransactionRepository = require("./repositories/TransactionRepository");
const WalletRepository = require("./repositories/WalletRepository");
const createWalletRouter = require("./routes/walletRoutes");
const WalletService = require("./services/WalletService");

const app = express();
const PORT = 3000;

const walletRepository = new WalletRepository(db);
const transactionRepository = new TransactionRepository(db);
const walletService = new WalletService(
  db,
  walletRepository,
  transactionRepository
);
const walletController = new WalletController(walletService, walletRepository);

app.use(express.json());
app.use("/api", createWalletRouter(walletController));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
