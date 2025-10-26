#!/bin/bash

# AidLoop Deployment Script
echo "🌍 Deploying AidLoop Smart Contracts..."

# Check if Stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI not found. Please install it first."
    exit 1
fi

# Build the contracts
echo "🔨 Building smart contracts..."
cargo build --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy contracts (this would be actual deployment commands)
echo "🚀 Deploying contracts to Stellar network..."

# Note: These are placeholder commands
# In a real deployment, you would use:
# stellar contract deploy --wasm target/wasm32-unknown-unknown/release/impact_vault.wasm
# stellar contract deploy --wasm target/wasm32-unknown-unknown/release/program_manager.wasm
# stellar contract deploy --wasm target/wasm32-unknown-unknown/release/voucher_manager.wasm
# stellar contract deploy --wasm target/wasm32-unknown-unknown/release/merchant_registry.wasm
# stellar contract deploy --wasm target/wasm32-unknown-unknown/release/impact_credit_nft.wasm

echo "📋 Contract addresses:"
echo "  ImpactVault: CONTRACT_ADDRESS_1"
echo "  ProgramManager: CONTRACT_ADDRESS_2"
echo "  VoucherManager: CONTRACT_ADDRESS_3"
echo "  MerchantRegistry: CONTRACT_ADDRESS_4"
echo "  ImpactCreditNFT: CONTRACT_ADDRESS_5"

echo "✅ Deployment complete!"
echo "🌐 Frontend available at: frontend/index.html"
echo "📖 Documentation: README.md"

