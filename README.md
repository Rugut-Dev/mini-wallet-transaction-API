# Mini Wallet Transaction API

A simple backend service for managing wallet deposits and transfers

## Tech Stack

- Node.js
- Express
- SQLite

## Features

- Create wallets
- Deposit funds into a wallet
- Transfer funds between wallets
- Record every deposit and transfer as a transaction
- Validate common edge cases such as invalid IDs, negative amounts, insufficient balance, and same-wallet transfers

## Project Structure

```text
src/
  app.js
  config/
    db.js
  controllers/
    WalletController.js
  dtos/
    CreateWalletDTO.js
    DepositDTO.js
    TransferDTO.js
  models/
    Wallet.js
    Transaction.js
  repositories/
    WalletRepository.js
    TransactionRepository.js
  routes/
    walletRoutes.js
  services/
    WalletService.js
```

## Prerequisites

- Node.js 20+ recommended
- npm

## Setup Instructions

1. Clone the repository:

```bash
git clone <https://github.com/Rugut-Dev/mini-wallet-transaction-API >
cd mini-wallet-transaction-API
```

2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## How the App Runs

- The API starts on `http://localhost:3000`
- SQLite database file: `wallet.db`
- Tables are created automatically on startup

Base URL:

```text
http://localhost:3000/api
```

## API Endpoints

### 1. Create Wallet

Creates a new wallet with a starting balance of `0`.

**Request**

```http
POST /api/wallets
Content-Type: application/json
```

```json
{
  "name": "Alice"
}
```

**cURL**

```bash
curl -X POST http://localhost:3000/api/wallets \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
```

**Example Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice",
    "balance": 0
  }
}
```

### 2. Deposit to Wallet

Deposits a positive amount into the specified wallet and records the transaction.

**Request**

```http
POST /api/wallets/:walletId/deposit
Content-Type: application/json
```

```json
{
  "amount": 100
}
```

**cURL**

```bash
curl -X POST http://localhost:3000/api/wallets/1/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount":100}'
```

**Example Response**

```json
{
  "success": true,
  "data": {
    "wallet": {
      "id": 1,
      "name": "Alice",
      "balance": 100
    },
    "transaction": {
      "id": 1,
      "type": "deposit",
      "amount": 100,
      "fromWalletId": null,
      "toWalletId": 1,
      "createdAt": "2026-03-17T19:07:13.108Z"
    }
  }
}
```

### 3. Transfer Between Wallets

Transfers funds from one wallet to another inside a database transaction and records the transfer.

**Request**

```http
POST /api/wallets/transfer
Content-Type: application/json
```

```json
{
  "fromWalletId": 1,
  "toWalletId": 2,
  "amount": 40
}
```

**cURL**

```bash
curl -X POST http://localhost:3000/api/wallets/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromWalletId":1,"toWalletId":2,"amount":40}'
```

**Example Response**

```json
{
  "success": true,
  "data": {
    "fromWallet": {
      "id": 1,
      "name": "Alice",
      "balance": 60
    },
    "toWallet": {
      "id": 2,
      "name": "Bob",
      "balance": 40
    },
    "transaction": {
      "id": 2,
      "type": "transfer",
      "amount": 40,
      "fromWalletId": 1,
      "toWalletId": 2,
      "createdAt": "2026-03-17T19:07:13.117Z"
    }
  }
}
```

## Business Rules Implemented

- Sender must have sufficient balance before a transfer is completed
- Both wallets must exist before a transfer is processed
- Every deposit and transfer is recorded in the `transactions` table
- Invalid input is rejected:
  - missing or empty wallet name
  - invalid wallet IDs
  - zero or negative amounts
  - transfer to the same wallet

## Error Examples

### Deposit with Invalid Amount

```json
{
  "success": false,
  "error": "Amount must be greater than 0"
}
```

### Transfer to Same Wallet

```json
{
  "success": false,
  "error": "Cannot transfer to the same wallet"
}
```

### Transfer with Insufficient Balance

```json
{
  "success": false,
  "error": "Insufficient wallet balance"
}
```

## Available Scripts

```bash
npm start
```

Starts the server on port `3000`.

```bash
npm run dev
```

Starts the server with `nodemon`.

## Notes

- Database schema initialization runs automatically on app startup
- The API uses JSON request and response bodies
