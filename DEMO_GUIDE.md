# 🎬 AidLoop Demo Guide

Complete walkthrough for demoing AidLoop at the Stellar Community Hackathon 2025.

---

## 🚀 Pre-Demo Setup (5 minutes)

### 1. Start the Frontend
```bash
cd /Users/vedantdalvi/AidLoop
npm run dev
```
✅ Open browser to: **http://localhost:5173**

### 2. Prepare Freighter Wallet
- Install Freighter extension
- Switch to **TESTNET**
- Import account with: `SD6V3FF6OEC5V53O5AAHLIA2JQMLPW5DWWXX4C5IIASUYL6XLNIR3GAZ`
- Your address: `GAEFBBEVPIUUOTKWOL7B3L6X46F5HYFY5E2IUDV2EUA3LOO6C5AJVB35`

### 3. Verify Account Has Funds
- XLM: ~10,000 (for transaction fees)
- USDC: Get from Stellar Laboratory if needed

---

## 🎯 Demo Script (10 minutes)

### Act 1: The Problem (1 min)
**"Traditional aid distribution is broken..."**

- 💸 Billions in aid, but where does it go?
- 🕳️ Opaque pipelines
- 🔄 No sustainability - donations dry up
- ❌ No proof of impact

**"AidLoop fixes this with blockchain."**

---

### Act 2: The Solution (2 min)
**Show Home Page**

Navigate to **/** (home page)

**Key Points:**
- 💰 Donors deposit USDC, keep principal
- 📈 Only **yield** funds aid programs
- 🎟️ Beneficiaries get digital vouchers
- 🏪 Merchants redeem for instant payment
- 🎨 Each redemption → Impact NFT
- ♻️ NFT sales → More programs (circular!)

**Show the visual flow diagram on the home page**

---

### Act 3: Live Demo - Donor Flow (3 min)

#### Step 1: Connect Wallet
1. Click **"Connect Freighter"** in navbar
2. Approve in Freighter popup
3. ✅ See your address appear in navbar

#### Step 2: View Dashboard
Navigate to **/donor**

**Show:**
- XLM balance: ~10,000
- USDC balance: Check current balance
- Vault statistics

#### Step 3: Deposit USDC
1. Enter amount: **100 USDC**
2. Click **"Deposit to Vault"**
3. **Sign transaction in Freighter**
4. ✅ Wait for confirmation
5. Show updated balance

**Key Points:**
- "Your 100 USDC stays in the vault"
- "The yield it generates funds aid programs"
- "You can withdraw anytime"
- "100% transparent - all on-chain"

---

### Act 4: Live Demo - Beneficiary Flow (2 min)

Navigate to **/beneficiary**

**Show:**
- Active vouchers (Healthcare: $50, Food: $30)
- Available programs
- How to apply for programs
- Redemption process

**Key Points:**
- "Vouchers are category-specific"
- "Can only be used at verified merchants"
- "Every redemption creates proof on-chain"

---

### Act 5: Live Demo - Merchant Flow (2 min)

Navigate to **/merchant**

**Show:**
- Merchant verification status (✓ Verified)
- POS interface for redemptions
- How to scan/enter beneficiary ID
- Instant settlement

**Key Points:**
- "Merchants get verified through KYC"
- "Accept vouchers like credit cards"
- "Get paid instantly in USDC"
- "Each redemption mints an Impact NFT"

---

### Act 6: The Tech (1 min)

**Show the code/contracts:**

```bash
# Quick view of contract addresses
cat deployed_contracts.json
```

**Key Points:**
- 5 Soroban smart contracts (Rust → WebAssembly)
- All deployed to Stellar testnet
- Verified on Stellar Expert
- Open source

**Smart Contracts:**
- `ImpactVault` - Manages deposits & yield
- `ProgramManager` - Creates aid programs  
- `VoucherManager` - Tracks vouchers & redemptions
- `MerchantRegistry` - KYC verification
- `ImpactCreditNFT` - Proof-of-impact tokens

---

### Act 7: The Impact (1 min)

**Back to Home Page - Show stats**

**Vision:**
- 🌍 Global reach - anyone can donate
- 💎 Sustainable - yield funding never stops
- 📊 Transparent - all transactions public
- 🎨 Investable - ESG investors buy impact NFTs
- ♻️ Circular - creates self-funding ecosystem

**"This is the future of humanitarian aid."**

---

## 🎤 Key Talking Points

### Technical Excellence
- ✅ Full-stack dApp (Rust smart contracts + React frontend)
- ✅ Real Stellar/Soroban integration
- ✅ Freighter wallet support
- ✅ Production-ready architecture
- ✅ Following scaffold-stellar best practices

### Innovation
- 💡 **Yield-based funding** (principal preserved)
- 💡 **Category-specific vouchers** (no misuse)
- 💡 **Proof-of-impact NFTs** (tradable verification)
- 💡 **Circular economy** (self-sustaining)
- 💡 **Zero middlemen** (smart contracts automate everything)

### Social Impact
- 🌍 Solves real humanitarian aid problems
- 💝 Donors keep their money while helping
- 🎯 Beneficiaries get targeted aid
- 🏪 Merchants earn while serving community
- 📈 Creates new market (impact investing)

---

## 🐛 Troubleshooting During Demo

### Wallet Won't Connect
```
1. Check Freighter is on TESTNET
2. Refresh page
3. Unlock wallet
```

### Transaction Fails
```
1. Check XLM balance > 1 XLM (for fees)
2. Check USDC trustline exists
3. Try smaller amount
```

### USDC Balance Zero
```
1. Click "Add USDC Trustline"
2. Get testnet USDC from Stellar Lab
3. Wait for confirmation
```

---

## 📸 Demo Screenshots to Capture

1. **Home Page** - Hero + flow diagram
2. **Connected Wallet** - Navbar showing address
3. **Donor Dashboard** - Balances displayed
4. **Deposit Transaction** - Freighter popup
5. **Transaction Success** - Confirmation message
6. **Beneficiary Vouchers** - Active vouchers shown
7. **Merchant POS** - Redemption interface
8. **Contract Addresses** - Terminal showing deployed contracts

---

## 🎯 Audience-Specific Pitches

### To Developers:
- "Built with Soroban SDK, fully open source"
- "5 smart contracts, 1,200 lines of Rust"
- "React + TypeScript frontend, Vite for builds"
- "Following scaffold-stellar patterns"

### To Donors/NGOs:
- "Your money stays safe, only yield funds programs"
- "100% transparent - see every transaction"
- "Track impact in real-time"
- "Withdraw anytime"

### To Investors:
- "Creates new market: tradable impact verification"
- "ESG investors can buy proof-of-impact NFTs"
- "Self-sustaining circular economy"
- "Solves $400B humanitarian aid market"

### To Judges:
- **Technical:** Full-stack, production-ready, follows best practices
- **Innovation:** Yield-based funding + NFT proofs = unique
- **Impact:** Solves real problem, scalable globally
- **Completeness:** Working end-to-end demo with real on-chain txs

---

## ⏱️ Time-Based Demo Options

### 2-Minute Pitch
1. Problem (30s)
2. Solution overview (30s)
3. Live deposit demo (60s)

### 5-Minute Demo
1. Problem + Solution (90s)
2. Donor flow demo (120s)
3. Show other dashboards (90s)

### 10-Minute Full Demo
Use the full script above!

---

## 🏆 Closing Statement

**"AidLoop transforms humanitarian aid with blockchain."**

- ✅ Donors keep their money
- ✅ Yield funds programs forever
- ✅ Vouchers prevent misuse
- ✅ Merchants get instant payment
- ✅ NFTs prove impact
- ✅ Self-sustaining circular economy

**"Built on Stellar. Live on testnet. Ready to change the world."**

**"Thank you! Questions?"**

---

## 📋 Demo Checklist

Before starting:
- [ ] Frontend running on localhost:5173
- [ ] Freighter installed and on testnet
- [ ] Account funded with XLM and USDC
- [ ] Browser DevTools closed (looks cleaner)
- [ ] Full screen mode enabled
- [ ] Zoom level at 100%
- [ ] Internet connection stable

During demo:
- [ ] Speak clearly and at moderate pace
- [ ] Show, don't just tell
- [ ] Wait for transactions to confirm
- [ ] Point out key features
- [ ] Mention Stellar/Soroban frequently
- [ ] Smile and be enthusiastic!

After demo:
- [ ] Share GitHub repo link
- [ ] Show documentation
- [ ] Provide contract addresses
- [ ] Answer questions
- [ ] Thank the audience

---

## 🔗 Resources to Share

**Project Links:**
- GitHub: [Your Repo URL]
- Live Demo: http://localhost:5173 (or deployed URL)
- Contracts: See `deployed_contracts.json`

**Documentation:**
- `PROJECT_STATUS.md` - Complete overview
- `FRONTEND_README.md` - Frontend guide
- `DEPLOYMENT_SUCCESS.md` - Contract deployment
- `CONTRACTS_SUMMARY.md` - Technical details

**Stellar Explorer:**
- All contracts viewable on https://stellar.expert/explorer/testnet

---

# 🌟 You Got This!

Remember: This is a **working, functional dApp** with **real on-chain transactions**. 

You're not showing mockups - you're showing the **future of humanitarian aid**.

**Go make an impact! 🌍💜**
