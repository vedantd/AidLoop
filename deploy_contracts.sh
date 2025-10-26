#!/bin/bash

# AidLoop Contract Deployment Script
# Deploys all 5 contracts to Stellar Testnet

set -e

echo "🌍 AidLoop Contract Deployment"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'

NC='\033[0m' # No Color

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI not found!"
    echo "Install it with: cargo install --locked stellar-cli"
    exit 1
fi

echo "✅ Stellar CLI found"
echo ""

# Network configuration
NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org:443"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Build contracts
echo "${BLUE}📦 Building contracts...${NC}"
cargo build --target wasm32-unknown-unknown --release
echo "${GREEN}✅ Contracts built${NC}"
echo ""

# Optimize contracts
echo "${BLUE}🔧 Optimizing contracts...${NC}"
for contract in impact_vault impact_contract program_manager voucher_manager merchant_registry impact_credit_nft; do
    stellar contract optimize \
        --wasm target/wasm32-unknown-unknown/release/${contract}.wasm \
        --wasm-out target/wasm32-unknown-unknown/release/${contract}_optimized.wasm
    echo "  ✓ ${contract} optimized"
done
echo "${GREEN}✅ All contracts optimized${NC}"
echo ""

# Deploy contracts
echo "${BLUE}🚀 Deploying contracts to testnet...${NC}"
echo ""

# 1. ImpactVault
echo "1️⃣  Deploying ImpactVault..."
IMPACT_VAULT=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/impact_vault_optimized.wasm \
    --source deployer \
    --network $NETWORK 2>&1 | tail -1)
echo "${GREEN}   ✅ ImpactVault: $IMPACT_VAULT${NC}"
echo ""

# 2. ImpactContract
echo "2️⃣  Deploying ImpactContract..."
IMPACT_CONTRACT=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/impact_contract_optimized.wasm \
    --source deployer \
    --network $NETWORK 2>&1 | tail -1)
echo "${GREEN}   ✅ ImpactContract: $IMPACT_CONTRACT${NC}"
echo ""

# 3. ProgramManager
echo "3️⃣  Deploying ProgramManager..."
PROGRAM_MANAGER=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/program_manager_optimized.wasm \
    --source deployer \
    --network $NETWORK 2>&1 | tail -1)
echo "${GREEN}   ✅ ProgramManager: $PROGRAM_MANAGER${NC}"
echo ""

# 4. VoucherManager
echo "4️⃣  Deploying VoucherManager..."
VOUCHER_MANAGER=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/voucher_manager_optimized.wasm \
    --source deployer \
    --network $NETWORK 2>&1 | tail -1)
echo "${GREEN}   ✅ VoucherManager: $VOUCHER_MANAGER${NC}"
echo ""

# 5. MerchantRegistry
echo "5️⃣  Deploying MerchantRegistry..."
MERCHANT_REGISTRY=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/merchant_registry_optimized.wasm \
    --source deployer \
    --network $NETWORK 2>&1 | tail -1)
echo "${GREEN}   ✅ MerchantRegistry: $MERCHANT_REGISTRY${NC}"
echo ""

# 6. ImpactCreditNFT
echo "6️⃣  Deploying ImpactCreditNFT..."
IMPACT_CREDIT_NFT=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/impact_credit_nft_optimized.wasm \
    --source deployer \
    --network $NETWORK 2>&1 | tail -1)
echo "${GREEN}   ✅ ImpactCreditNFT: $IMPACT_CREDIT_NFT${NC}"
echo ""

# Save contract addresses
echo "${BLUE}💾 Saving contract addresses...${NC}"
cat > deployed_contracts.json <<EOF
{
  "network": "$NETWORK",
  "deployed_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "contracts": {
    "ImpactVault": "$IMPACT_VAULT",
    "ImpactContract": "$IMPACT_CONTRACT",
    "ProgramManager": "$PROGRAM_MANAGER",
    "VoucherManager": "$VOUCHER_MANAGER",
    "MerchantRegistry": "$MERCHANT_REGISTRY",
    "ImpactCreditNFT": "$IMPACT_CREDIT_NFT"
  }
}
EOF
echo "${GREEN}✅ Contract addresses saved to deployed_contracts.json${NC}"
echo ""

# Summary
echo "================================"
echo "🎉 ${GREEN}Deployment Complete!${NC}"
echo "================================"
echo ""
echo "Contract Addresses:"
echo "-------------------"
echo "ImpactVault:      $IMPACT_VAULT"
echo "ImpactContract:  $IMPACT_CONTRACT"
echo "ProgramManager:   $PROGRAM_MANAGER"
echo "VoucherManager:   $VOUCHER_MANAGER"
echo "MerchantRegistry: $MERCHANT_REGISTRY"
echo "ImpactCreditNFT:  $IMPACT_CREDIT_NFT"
echo ""
echo "Next Steps:"
echo "1. Initialize contracts with proper admin addresses"
echo "2. Set up USDC token addresses"
echo "3. Connect frontend to these contract addresses"
echo ""
echo "🚀 AidLoop is ready to change the world!"

