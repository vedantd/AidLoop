# AidLoop — Stellar Hackathon 2025 Submission

## 🎯 Project Summary (<150 chars)
**Yield-powered humanitarian funding protocol. Donors keep principal, only yield funds verified aid. Perpetual impact through DeFi yield.**

## 📋 Full Description

### The Problem We Solve
Traditional humanitarian aid systems are fragile and dependent on donor funding cycles. When global borrowing costs rise or donor budgets shrink, aid programs collapse, leaving vulnerable communities without support. Current systems lack transparency, have high overhead costs, and create dependency rather than sustainable impact.

### Our Solution: Antifragile Aid Economy
AidLoop creates a **yield-powered humanitarian funding protocol** that thrives in volatility. By leveraging DeFi yield from idle stablecoins, we build a self-sustaining system where:

- **Donors keep their principal** — USDC stays safe and withdrawable anytime
- **Only yield funds impact** — Generated interest automatically funds verified humanitarian services  
- **Impact is transparent** — Every service delivery mints an Impact Credit NFT on-chain
- **Funding is perpetual** — Yield persists or grows, ensuring continuity even during economic stress

### How Stellar Enables This
Stellar's unique architecture makes AidLoop possible:

- **Soroban Smart Contracts** — Complex yield management and impact validation logic
- **Stellar Asset Protocol** — Native USDC integration with seamless trustlines
- **Low Transaction Costs** — Enables micro-payments and frequent impact events
- **Fast Settlement** — Real-time impact tracking and immediate reimbursements
- **Transparent Ledger** — Public verification of all humanitarian transactions

## 🛠️ Technical Implementation

### Smart Contract Architecture (Rust/Soroban)

#### Core Contract Addresses (Stellar Testnet)
```
ImpactVault:        CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW
MerchantRegistry:   CA4ED4DJ4T7BCP26A2GOVY5Z2CANXRM23DVPT352LQYMAJCSGF757GZN  
DonorBadgeNFT:     CCAIBIEJTVBB7A75YTBVBIJ2CBX2ZETDWBSL57P4TYLY4VZVN5DKKGWL
```

**🔗 View on Stellar Explorer**: [stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet)

#### How Smart Contracts Work

**1. ImpactVault Contract** - Central yield management
```rust
// Core functions
pub fn deposit(env: Env, donor: Address, amount: i128) -> i128
pub fn deploy_to_defi(env: Env, protocol: String, amount: i128) -> bool
pub fn withdraw_yield(env: Env, amount: i128) -> i128
pub fn distribute_yield(env: Env, impact_contract: Address, amount: i128) -> bool
```
- Manages all donor USDC deposits
- Deploys funds to DeFi protocols (Blend, Aquarius) for yield generation
- Automatically withdraws and distributes yield to impact contracts
- Ensures donor principal remains safe and withdrawable

**2. MerchantRegistry Contract** - Service provider verification
```rust
// Core functions
pub fn register_merchant(env: Env, business_name: String, category: String, document_hash: String) -> bool
pub fn record_redemption(env: Env, merchant: Address, amount: i128) -> bool
pub fn is_verified(env: Env, merchant: Address) -> bool
```
- Verifies humanitarian service providers (hospitals, schools, relief orgs)
- Records service redemptions and tracks payments
- Only verified providers can receive reimbursements

**3. ImpactContract Contract** - Yield distribution and validation
```rust
// Core functions
pub fn receive_yield(env: Env, from: Address, amount: i128) -> bool
pub fn validate_proof(env: Env, proof_hash: String) -> bool
pub fn process_reimbursement(env: Env, merchant: Address, amount: i128) -> bool
```
- Receives yield from ImpactVault
- Validates service provider proofs
- Processes automatic reimbursements

**4. ImpactCreditNFT Contract** - Immutable impact proof
```rust
// Core functions
pub fn mint_impact_credit(env: Env, to: Address, service_type: String, impact_description: String, proof_hash: String) -> u32
pub fn get_impact_metadata(env: Env, token_id: u32) -> ImpactMetadata
```
- Mints NFTs as proof of humanitarian service delivery
- Contains immutable metadata about impact
- Enables transparent impact tracking

**5. DonorBadgeNFT Contract** - Donor gamification
```rust
// Core functions
pub fn mint_badge(env: Env, to: Address, badge_name: String, description: String, badge_type: String, rarity: String) -> u32
pub fn get_badges_by_owner(env: Env, owner: Address) -> Vec<u32>
```
- Rewards donors with achievement badges
- Gamifies humanitarian participation
- Encourages continued engagement

#### Contract Interaction Flow
```
1. Donor deposits USDC → ImpactVault
2. ImpactVault deploys to DeFi → Yield generation  
3. Service provider delivers aid → MerchantRegistry verification
4. Proof submitted → ImpactContract validation
5. Reimbursement processed → ImpactCreditNFT minted
6. Donor receives badge → DonorBadgeNFT minted
```

### Key Stellar Features Utilized
1. **Soroban WASM Contracts** — Complex yield management and impact validation
2. **Stellar Asset Protocol** — USDC token integration with trustlines
3. **Horizon API** — Real-time balance monitoring and transaction history
4. **Soroban RPC** — Contract simulation and interaction
5. **Multi-signature Operations** — Secure yield distribution
6. **Event System** — Impact tracking and NFT minting

### Frontend Technology Stack
- **React.js + TypeScript** — Modern UI with type safety
- **Stellar SDK** — Blockchain integration and wallet connection
- **Freighter Wallet** — Seamless user experience
- **Tailwind CSS** — Responsive, accessible design
- **Vite** — Fast development and building

### DeFi Integration
- **Blend Protocol** — Primary yield generation through lending
- **Aquarius Protocol** — Additional yield farming opportunities  
- **USDC Token** — Stellar-based stablecoin for deposits
- **Yield Optimization** — Automated yield maximization strategies

## 🎯 Unique Stellar Advantages

### What Makes This Uniquely Possible on Stellar
1. **Low Transaction Costs** — Enables micro-payments for small humanitarian services
2. **Fast Settlement** — Real-time impact tracking and immediate reimbursements
3. **Native Asset Support** — Seamless USDC integration without complex bridging
4. **Soroban Smart Contracts** — Complex yield management impossible on simple blockchains
5. **Transparent Ledger** — Public verification of all humanitarian impact
6. **Global Accessibility** — Works anywhere with internet connection

### Technical Innovation
- **Yield-Powered Impact** — First protocol to use DeFi yield exclusively for humanitarian funding
- **Antifragile Design** — System that strengthens during economic stress
- **NFT Impact Proof** — Immutable, transparent impact documentation
- **Automated Reimbursement** — Smart contract-driven service provider payments
- **Real-Time Tracking** — Live impact metrics and donor engagement

## 📊 Live Deployment

### Core Smart Contracts
The essential contracts powering AidLoop's humanitarian funding solution:

- **ImpactVault**: [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW)
  - *Manages donor USDC deposits and yield generation*
- **MerchantRegistry**: [View on Explorer](https://stellar.expert/explorer/testnet/contract/CA4ED4DJ4T7BCP26A2GOVY5Z2CANXRM23DVPT352LQYMAJCSGF757GZN)
  - *Registers humanitarian service providers and records redemptions*
- **DonorBadgeNFT**: [View on Explorer](https://stellar.expert/explorer/testnet/contract/CCAIBIEJTVBB7A75YTBVBIJ2CBX2ZETDWBSL57P4TYLY4VZVN5DKKGWL)
  - *Mints achievement badges for donors*

## 🚀 Demo & Links

- **Live Demo**: [aidloop-demo.stellar.org](https://aidloop-demo.stellar.org)
- **Design System**: [Canva Design](https://www.canva.com/design/DAG25Z4jbbg/vp_IMiSj8FhP5rW2vY4yaw/edit)
- **Stellar Explorer**: [View Contracts](https://stellar.expert/explorer/testnet)
- **GitHub Repository**: [github.com/aidloop](https://github.com/aidloop)

## 🏆 Why This Deserves to Win

### Innovation
- **First yield-powered humanitarian protocol** — Transforms idle assets into perpetual impact
- **Antifragile aid economy** — System that strengthens during economic stress
- **Transparent impact tracking** — Every dollar traceable through blockchain

### Technical Excellence  
- **Complex Soroban integration** — Advanced smart contract architecture
- **Seamless user experience** — Intuitive donor and provider interfaces
- **Real-time impact metrics** — Live tracking of humanitarian outcomes

### Real-World Impact
- **Immediate deployment** — Ready for real humanitarian use cases
- **Scalable solution** — Works for individual donors to large organizations
- **Sustainable funding** — Perpetual impact through yield generation

---

**"Where your yield becomes someone's hope."**

*Built with ❤️ for Stellar Hackathon 2025*
