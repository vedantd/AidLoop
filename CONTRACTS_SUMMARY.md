# 🌍 AidLoop Smart Contracts - Built Successfully!

## ✅ All 5 Contracts Compiled

### 1. **ImpactVault** 💰
**Purpose:** Manages donor USDC deposits and yield generation

**Key Features:**
- Accept USDC deposits from donors
- Track individual and total balances
- Allow principal withdrawal (not yield)
- Distribute yield to active programs
- Full event logging for transparency

**Functions:**
- `initialize()` - Set up vault with USDC token
- `deposit()` - Donor deposits USDC
- `withdraw()` - Donor withdraws principal
- `get_balance()` - Check donor balance
- `distribute_yield()` - Admin distributes yield to programs

---

### 2. **ProgramManager** 📋
**Purpose:** Creates and manages aid programs

**Key Features:**
- Create aid programs (Healthcare, Food, Education, Housing, Emergency)
- Manage program budgets and allocations
- Issue vouchers to beneficiaries
- NGO authorization system
- Program activation/deactivation

**Functions:**
- `initialize()` - Set up program manager
- `create_program()` - NGO creates a new aid program
- `allocate_to_program()` - Admin allocates funds to program
- `issue_voucher()` - NGO issues voucher to beneficiary
- `get_program()` - Get program details

---

### 3. **VoucherManager** 🎟️
**Purpose:** Tracks beneficiary vouchers and merchant redemptions

**Key Features:**
- Issue vouchers to beneficiaries
- Track voucher balances per program
- Handle merchant redemptions
- Store redemption proof (IPFS hashes)
- Trigger NFT minting on redemption

**Functions:**
- `initialize()` - Set up voucher manager
- `issue_voucher()` - Issue voucher to beneficiary
- `get_voucher_balance()` - Check beneficiary balance
- `redeem_voucher()` - Beneficiary redeems at merchant (THE MAGIC!)
- `get_redemption()` - Get redemption details

---

### 4. **MerchantRegistry** 🏪
**Purpose:** Verifies and manages merchants

**Key Features:**
- Merchant registration with KYC
- Status tracking (Pending, Verified, Suspended, Rejected)
- Service categories (Healthcare, Pharmacy, Food, etc.)
- Document verification (IPFS)
- Track merchant transaction stats

**Functions:**
- `initialize()` - Set up registry
- `register_merchant()` - Merchant registers with documents
- `verify_merchant()` - Admin verifies merchant after KYC
- `suspend_merchant()` - Admin suspends merchant
- `is_verified()` - Check if merchant is verified
- `record_redemption()` - Update merchant stats

---

### 5. **ImpactCreditNFT** 🎨
**Purpose:** Proof-of-Impact NFTs for ESG investors

**Key Features:**
- Mint NFT for each redemption (proof of real aid!)
- Link to redemption proof (IPFS)
- NFT marketplace (list, buy, transfer)
- Proceeds fund more programs (circular economy!)
- ESG investor participation

**Functions:**
- `initialize()` - Set up NFT contract
- `mint_impact_nft()` - Mint NFT after voucher redemption
- `get_nft()` - Get NFT details
- `transfer()` - Transfer NFT ownership
- `list_for_sale()` - List NFT for sale
- `buy_nft()` - ESG investor buys proof-of-impact

---

## 📦 Build Output

```bash
Finished `release` profile [optimized] target(s) in 4.44s
```

**Location:** `target/wasm32-unknown-unknown/release/*.wasm`

---

## 🚀 Next Steps

### To Deploy to Stellar Testnet:

1. **Install Stellar CLI:**
```bash
cargo install --locked stellar-cli
```

2. **Configure Network:**
```bash
stellar network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

3. **Create Deployer Identity:**
```bash
stellar keys generate --global deployer --network testnet
stellar keys fund deployer --network testnet
```

4. **Deploy Contracts:**
```bash
# Deploy ImpactVault
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/impact_vault.wasm \
  --source deployer \
  --network testnet

# Deploy ProgramManager
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/program_manager.wasm \
  --source deployer \
  --network testnet

# ... repeat for other contracts
```

---

## 🎯 The AidLoop Flow

1. **Donor** deposits USDC → `ImpactVault`
2. **Yield** generated → distributed to `ProgramManager`
3. **NGO** creates program → `ProgramManager`
4. **NGO** issues voucher → `VoucherManager`
5. **Beneficiary** receives goods from verified merchant
6. **Merchant** redeems voucher → `VoucherManager` 
7. **NFT** auto-minted → `ImpactCreditNFT` (PROOF!)
8. **ESG Investor** buys NFT → proceeds fund more programs! ♻️

---

## 📊 Contract Sizes

```
impact_vault.wasm         : ~XXX KB
program_manager.wasm      : ~XXX KB
voucher_manager.wasm      : ~XXX KB
merchant_registry.wasm    : ~XXX KB
impact_credit_nft.wasm    : ~XXX KB
```

---

## 🔧 Development

**Build:**
```bash
cargo build --release
```

**Test:**
```bash
cargo test
```

**Format:**
```bash
cargo fmt
```

**Lint:**
```bash
cargo clippy
```

---

## 📝 Notes

- All contracts use `soroban-sdk = "23.0.2"`
- Optimized for size with `opt-level = "z"`
- Event logging for transparency
- IPFS integration for proof storage
- Ready for testnet deployment!

---

**Built with ❤️ for the Stellar Community Hackathon 2025**


