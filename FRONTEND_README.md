# AidLoop Frontend

Modern React + TypeScript frontend for the AidLoop DeFi for Social Impact platform.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 🏗️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Stellar SDK** - Blockchain interactions
- **Freighter API** - Wallet integration

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── contracts/        # Contract configs and addresses
├── hooks/            # Custom React hooks (wallet, contracts)
├── pages/            # Route pages
│   ├── Home.tsx
│   ├── DonorDashboard.tsx
│   ├── BeneficiaryApp.tsx
│   └── MerchantPOS.tsx
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## 🔗 Contract Addresses (Testnet)

All contracts are deployed on Stellar testnet:

- **ImpactVault**: `CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW`
- **ProgramManager**: `CDG2DJOKXE4MD7MCG5OAPBPLODROJ2AADW75EUSPMONCLPXVVYD5AVKN`
- **VoucherManager**: `CCTKNEL4UPLCTQSLIHE2Y3RIDFZKUTBONYFXSOOS2MSDU3YLRCCXSEIG`
- **MerchantRegistry**: `CCG6HA73JOZIJB7W5WGMXORZN4SECNI2HB2DMM4KXUSSCGD6SSG657FY`
- **ImpactCreditNFT**: `CA2PWCZSTCIZ75JRWXRIGU2LA7K25FZT2LMYRGJHXYTAJXK7PMURPUX2`

## 🎯 Features

### Donor Dashboard
- Connect Freighter wallet
- View XLM and USDC balances
- Deposit USDC to Impact Vault
- Track yield generation
- Monitor impact metrics

### Beneficiary App
- View available vouchers
- Browse aid programs
- Redeem vouchers at merchants
- Track redemption history

### Merchant POS
- Process voucher redemptions
- View merchant verification status
- Track earnings
- View redemption history

## 🔐 Wallet Integration

This app uses **Freighter** wallet for Stellar interactions:

1. Install [Freighter browser extension](https://freighter.app/)
2. Create or import a Stellar account
3. Switch to **Testnet** in Freighter settings
4. Click "Connect Freighter" in the app

## 🧪 Testing

### Get Testnet Tokens

1. **XLM (Lumens)**:
   - Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
   - Create/fund your testnet account

2. **USDC**:
   - Add USDC trustline in the Donor Dashboard
   - Get testnet USDC from Stellar Laboratory

## 📝 Smart Contract Interactions

### Deposit to Vault

```typescript
import * as StellarSdk from '@stellar/stellar-sdk';
import { CONTRACTS, NETWORK } from './contracts/config';

const transaction = new StellarSdk.TransactionBuilder(account, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: NETWORK.networkPassphrase,
})
  .addOperation(
    StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACTS.IMPACT_VAULT,
      function: 'deposit',
      args: [
        StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(amount, { type: 'i128' }),
      ],
    })
  )
  .build();
```

## 🎨 Design System

Colors:
- **Primary**: Purple (#6366f1) - Donors
- **Secondary**: Blue (#3b82f6) - Beneficiaries
- **Tertiary**: Indigo (#4f46e5) - Merchants
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Freighter wallet extension

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
VITE_NETWORK=testnet
VITE_RPC_URL=https://soroban-testnet.stellar.org
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Code Quality
```bash
npm run lint
```

## 🚢 Deployment

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
The `dist/` folder contains the production build ready for deployment.

## 📚 Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Freighter Wallet](https://freighter.app/)
- [Stellar SDK](https://github.com/stellar/js-stellar-sdk)

## 🐛 Troubleshooting

### Freighter Not Connecting
- Ensure Freighter is installed and unlocked
- Check you're on testnet (not mainnet)
- Refresh the page

### Transaction Failures
- Check account has enough XLM for fees
- Verify contract addresses are correct
- Check transaction status on Stellar Expert

### USDC Balance Shows Zero
- Add USDC trustline first
- Get testnet USDC from Stellar Laboratory
- Wait for transaction confirmation

## 📄 License

Apache 2.0 - See LICENSE file for details


