# 🏛 TitleStone Dapp

A Decentralized Application powered by Ethereum, allowing users to register, search, transfer, and notarize land titles on-chain with a connected Web3 wallet.

## 🚀 Live Demo

https://title-stone-dapp.web.app/index.html

## 🎯 Features

- **Land Title Registration**

  - Users can connect their wallet and register a new land title (owner name, location, area) on-chain.

- **Lookup / Search**

  - Search by Title ID or by owner wallet address.

- **Transfer Ownership**

  - Transfer registered titles to new owners securely.

- **Digital Notary**

  - Upload notarized document URLs linked to a land ID.

- **Notarized Records**

  - View live notarized documents with verification and community voting.

- **Sell & Lease Modules**

  - List land titles for sale or lease, manage and track availability and pricing.

## 🧱 Architecture Overview

1. **Smart Contracts** (Solidity)

   - Manage land titles (`id`, `owner`, `ownerName`, `location`, `squareMeters`).
   - Ownership transfer events.
   - Notary logic for adding and validating document URLs.
   - Listing functionality for sale and lease with pricing and duration.

2. **Front-End**

   - Static HTML + Tailwind CSS + Ethers.js for mobile-responsive UI.
   - Pages:

     - _Dashboard_ – Overview stats and registered titles.
     - _Register, Search, Transfer, Notary, Notary‑Records, Sell, Lease_ interfaces.

   - Web3 wallet integration with account handling (connect/disconnect, network/account change listeners).

3. **Contract Module**

   - Shared `contract.js` exports ABI, deployed contract address, utility functions (`getAllLands()`, `getContract()`, etc.).

## 🛠 Local Installation

```bash
git clone https://github.com/ReinX24/hackthechain-2-rein-solis.git
cd title-stone-dapp
npm install
npx serve .
```

## 📦 Dependencies

- Ethereum: Ethers.js v6
- UI: Tailwind CSS, plain JavaScript
- Smart Contracts: Solidity

## 🔗 Network Configuration

Ensure your wallet (MetaMask) is connected to the Viction Testnet with these settings:

- Network Name: Viction Testnet
- RPC URL: https://89.rpc.thirdweb.com
- ChainID: 89
- Symbol: VIC
- Block Explorer URL: https://testnet.vicscan.xyz

### 🧠 Summary

TitleStone is a full-stack Web3 land registry platform with complete title lifecycle management—from registration and search to transfer, notarization, and marketplace listing. Let me know if you want to include wiring of specific pages, contract events, or link a deployed demo!
