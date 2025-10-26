# AidLoop — Yield-Powered Humanitarian Funding

**Transform idle stablecoin yield into verified social impact. Stake once, fund impact forever.**

[![Built for Stellar Hackathon 2025](https://img.shields.io/badge/Built%20for-Stellar%20Hackathon%202025-blue)](https://stellar.org)
[![Stellar Network](https://img.shields.io/badge/Network-Stellar%20Testnet-orange)](https://testnet.stellar.org)
[![Soroban Smart Contracts](https://img.shields.io/badge/Platform-Soroban%20WASM-green)](https://soroban.stellar.org)

## 🎨 Design System
**[View Design System on Canva](https://www.canva.com/design/DAG25Z4jbbg/vp_IMiSj8FhP5rW2vY4yaw/edit)** — Complete UI/UX design system with components, colors, and layouts

## 📋 Deployed Smart Contracts (Stellar Testnet)

| Contract | Address | Explorer Link | Purpose |
|----------|---------|---------------|---------|
| **ImpactVault** | `CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW` | [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW) | Manages donor USDC deposits and yield distribution |
| **ProgramManager** | `CDG2DJOKXE4MD7MCG5OAPBPLODROJ2AADW75EUSPMONCLPXVVYD5AVKN` | [View on Explorer](https://stellar.expert/explorer/testnet/contract/CDG2DJOKXE4MD7MCG5OAPBPLODROJ2AADW75EUSPMONCLPXVVYD5AVKN) | Creates and manages aid programs |
| **VoucherManager** | `CCTKNEL4UPLCTQSLIHE2Y3RIDFZKUTBONYFXSOOS2MSDU3YLRCCXSEIG` | [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCTKNEL4UPLCTQSLIHE2Y3RIDFZKUTBONYFXSOOS2MSDU3YLRCCXSEIG) | Tracks vouchers and merchant redemptions |
| **MerchantRegistry** | `CCG6HA73JOZIJB7W5WGMXORZN4SECNI2HB2DMM4KXUSSCGD6SSG657FY` | [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCG6HA73JOZIJB7W5WGMXORZN4SECNI2HB2DMM4KXUSSCGD6SSG657FY) | Verifies and manages merchants |
| **ImpactCreditNFT** | `CA2PWCZSTCIZ75JRWXRIGU2LA7K25FZT2LMYRGJHXYTAJXK7PMURPUX2` | [View on Explorer](https://stellar.expert/explorer/testnet/contract/CA2PWCZSTCIZ75JRWXRIGU2LA7K25FZT2LMYRGJHXYTAJXK7PMURPUX2) | Proof-of-impact NFTs for ESG investors |

## 🎯 Problem & Solution

### The Problem
Traditional humanitarian aid systems are fragile and dependent on donor funding cycles. When global borrowing costs rise or donor budgets shrink, aid programs collapse, leaving vulnerable communities without support. Current systems lack transparency, have high overhead costs, and create dependency rather than sustainable impact.

### The Solution
AidLoop creates an **antifragile aid economy** that thrives in volatility. By leveraging DeFi yield from idle stablecoins, we build a self-sustaining humanitarian funding protocol where:

- **Donors keep their principal** — USDC stays safe and withdrawable anytime
- **Only yield funds impact** — Generated interest automatically funds verified humanitarian services  
- **Impact is transparent** — Every service delivery mints an Impact Credit NFT on-chain
- **Funding is perpetual** — Yield persists or grows, ensuring continuity even during economic stress

## 🎬 Demo Video

https://github.com/vedantd/AidLoop/blob/main/public/demo.mp4

*Watch AidLoop in action: See how donors deposit USDC, yield generates automatically, and humanitarian services get funded transparently.*

## 📸 Screenshots

Drive: `https://drive.google.com/drive/folders/15kya7f4fZ-L7ptPAd1jFlsLibYWjz-ti?usp=sharing`

## 🏗️ How It Works

### For Donors
1. **Deposit USDC** into on-chain vaults (principal remains safe)
2. **Yield generates automatically** through DeFi protocols (Blend, Aquarius)
3. **Impact happens transparently** — yield funds verified humanitarian services
4. **Track your impact** — see real-time proof of lives changed

### For Service Providers
1. **Register as verified provider** — hospitals, schools, relief organizations
2. **Deliver humanitarian services** — medical care, education, emergency relief
3. **Submit proof of service** — documentation and impact evidence
4. **Receive reimbursement** — automatic payment from yield pool

### The Yield-Powered Cycle
```
Donor Deposits USDC → DeFi Yield Generation → Service Provider Verification → 
Impact Credit NFT Minting → Automatic Reimbursement → Transparent Impact Tracking
```

## 🛠️ Technical Implementation

### Stellar & Soroban Integration
AidLoop leverages Stellar's unique capabilities to create a transparent, efficient humanitarian funding protocol:

- **Soroban Smart Contracts** — Rust-based WASM contracts for complex logic
- **Stellar Asset Protocol** — Native USDC integration with trustlines
- **Horizon API** — Real-time balance and transaction monitoring
- **Soroban RPC** — Contract interaction and simulation
- **Stellar SDK** — JavaScript integration for frontend

### Smart Contract Architecture

#### Core Contracts
- **`ImpactVault`** — `CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW`
  - Manages donor USDC deposits and yield generation
- **`MerchantRegistry`** — `CA4ED4DJ4T7BCP26A2GOVY5Z2CANXRM23DVPT352LQYMAJCSGF757GZN`
  - Verifies and manages humanitarian service providers
- **`ImpactContract`** — `CCG6HA73JOZIJB7W5WGMXORZN4SECNI2HB2DMM4KXUSSCGD6SSG657FY`
  - Handles yield distribution and proof validation
- **`ImpactCreditNFT`** — `CA2PWCZSTCIZ75JRWXRIGU2LA7K25FZT2LMYRGJHXYTAJXK7PMURPUX2`
  - Mints NFTs as proof of impact delivery
- **`DonorBadgeNFT`** — `CCAIBIEJTVBB7A75YTBVBIJ2CBX2ZETDWBSL57P4TYLY4VZVN5DKKGWL`
  - Rewards donors with achievement badges

#### How Smart Contracts Work

##### 1. ImpactVault Contract
**Purpose**: Central vault managing all donor deposits and yield generation

**Key Functions**:
```rust
// Deposit USDC from donors
pub fn deposit(env: Env, donor: Address, amount: i128) -> i128

// Deploy funds to DeFi protocols for yield generation
pub fn deploy_to_defi(env: Env, protocol: String, amount: i128) -> bool

// Withdraw yield from DeFi protocols
pub fn withdraw_yield(env: Env, amount: i128) -> i128

// Distribute yield to impact contracts
pub fn distribute_yield(env: Env, impact_contract: Address, amount: i128) -> bool
```

**Workflow**:
1. Donors deposit USDC → Vault stores principal safely
2. Vault deploys funds to DeFi protocols (Blend, Aquarius)
3. Yield accumulates automatically through lending/borrowing
4. Yield is withdrawn and distributed to impact contracts
5. Donors can withdraw principal anytime

##### 2. MerchantRegistry Contract
**Purpose**: Verifies and manages humanitarian service providers

**Key Functions**:
```rust
// Register new service provider
pub fn register_merchant(
    env: Env, 
    business_name: String, 
    category: String, 
    document_hash: String
) -> bool

// Record service redemption/payment
pub fn record_redemption(env: Env, merchant: Address, amount: i128) -> bool

// Get merchant verification status
pub fn is_verified(env: Env, merchant: Address) -> bool
```

**Workflow**:
1. Service providers register with business details
2. Documents are verified off-chain (IPFS integration)
3. Verified providers can submit proof of service
4. Contract records redemptions and tracks payments
5. Only verified providers can receive reimbursements

##### 3. ImpactContract Contract
**Purpose**: Handles yield distribution and proof validation

**Key Functions**:
```rust
// Receive yield from vault
pub fn receive_yield(env: Env, from: Address, amount: i128) -> bool

// Validate service proof
pub fn validate_proof(env: Env, proof_hash: String) -> bool

// Process reimbursement
pub fn process_reimbursement(env: Env, merchant: Address, amount: i128) -> bool
```

**Workflow**:
1. Receives yield from ImpactVault
2. Validates service provider proofs
3. Processes automatic reimbursements
4. Tracks total impact generated

##### 4. ImpactCreditNFT Contract
**Purpose**: Mints NFTs as immutable proof of impact delivery

**Key Functions**:
```rust
// Mint impact credit NFT
pub fn mint_impact_credit(
    env: Env,
    to: Address,
    service_type: String,
    impact_description: String,
    proof_hash: String
) -> u32

// Get NFT metadata
pub fn get_impact_metadata(env: Env, token_id: u32) -> ImpactMetadata
```

**Workflow**:
1. Service provider submits proof of humanitarian service
2. Proof is validated by ImpactContract
3. ImpactCreditNFT is automatically minted
4. NFT contains immutable proof of impact
5. Donors can view their impact through NFTs

##### 5. DonorBadgeNFT Contract
**Purpose**: Rewards donors with achievement badges

**Key Functions**:
```rust
// Mint donor badge
pub fn mint_badge(
    env: Env,
    to: Address,
    badge_name: String,
    description: String,
    badge_type: String,
    rarity: String
) -> u32

// Get donor's badges
pub fn get_badges_by_owner(env: Env, owner: Address) -> Vec<u32>
```

**Workflow**:
1. Donors achieve milestones (first donation, $1000 impact, etc.)
2. Badges are automatically minted based on impact
3. Donors can display badges on leaderboard
4. Gamification encourages continued participation

#### Contract Interaction Flow
```
1. Donor deposits USDC → ImpactVault
2. ImpactVault deploys to DeFi → Yield generation
3. Service provider delivers aid → MerchantRegistry verification
4. Proof submitted → ImpactContract validation
5. Reimbursement processed → ImpactCreditNFT minted
6. Donor receives badge → DonorBadgeNFT minted
```

#### Key Features
- **Multi-signature yield management** — Secure yield distribution
- **On-chain proof validation** — Immutable service verification
- **NFT-based impact tracking** — Transparent impact documentation
- **Automated reimbursement** — Smart contract-driven payments

### Frontend Technology Stack
- **React.js** — Modern UI framework with hooks
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Vite** — Fast build tooling
- **Stellar SDK** — Blockchain integration
- **Freighter Wallet** — User wallet connection

### DeFi Integration
- **Blend Protocol** — Lending and borrowing for yield generation
- **Aquarius Protocol** — Additional yield farming opportunities
- **USDC Token** — Stellar-based stablecoin for deposits
- **Yield Optimization** — Automated yield maximization strategies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+ and Cargo
- Stellar CLI tools
- Freighter wallet extension

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/aidloop.git
cd aidloop

# Install dependencies
npm install

# Build smart contracts
cargo build --target wasm32-unknown-unknown --release

# Deploy contracts to Stellar Testnet
./deploy_contracts.sh

# Start development server
npm run dev
```

### Contract Deployment
```bash
# Deploy all contracts
./deploy_contracts.sh

# Initialize contracts
./initialize_contracts.sh
```

### Core Contract Addresses (Stellar Testnet)
```
ImpactVault:        CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW
MerchantRegistry:   CA4ED4DJ4T7BCP26A2GOVY5Z2CANXRM23DVPT352LQYMAJCSGF757GZN
DonorBadgeNFT:     CCAIBIEJTVBB7A75YTBVBIJ2CBX2ZETDWBSL57P4TYLY4VZVN5DKKGWL
```

**View on Stellar Explorer**: [stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet)

## 📊 Live Deployment

### Core Smart Contracts
The essential contracts powering AidLoop's humanitarian funding solution:

- **ImpactVault**: [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW)
  - *Manages donor USDC deposits and yield generation*
- **MerchantRegistry**: [View on Explorer](https://stellar.expert/explorer/testnet/contract/CA4ED4DJ4T7BCP26A2GOVY5Z2CANXRM23DVPT352LQYMAJCSGF757GZN)
  - *Registers humanitarian service providers and records redemptions*
- **DonorBadgeNFT**: [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCAIBIEJTVBB7A75YTBVBIJ2CBX2ZETDWBSL57P4TYLY4VZVN5DKKGWL)
  - *Mints achievement badges for donors*

## 🔗 Links & Resources

- **Live Demo**: [aidloop-demo.stellar.org](https://aidloop-demo.stellar.org)
- **Stellar Explorer**: [View Contracts](https://stellar.expert/explorer/testnet)
- **Documentation**: [docs.aidloop.org](https://docs.aidloop.org)

## 🤝 Contributing

We welcome contributions to AidLoop! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Areas
- **Smart Contract Optimization** — Gas efficiency and security
- **Frontend UX/UI** — User experience improvements
- **DeFi Integration** — Additional yield protocols
- **Impact Measurement** — Enhanced tracking and analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** — For the incredible blockchain platform
- **Soroban Team** — For the powerful smart contract capabilities
- **Freighter Wallet** — For seamless user experience
- **Humanitarian Community** — For inspiring real-world impact

---

**Built with ❤️ for Stellar Hackathon 2025**

*"Where your yield becomes someone's hope."*
