#!/bin/bash

# AidLoop Contract Initialization Script
# This script initializes all deployed contracts with proper configuration

set -e

echo "🚀 Initializing AidLoop Contracts on Stellar Testnet"
echo "=================================================="

# Contract addresses
IMPACT_VAULT="CCCZ7BFJIM7O4XXZK22P6ZXGPM6NNWDZXR4U3YTE5WI6ITTA342HAICW"
PROGRAM_MANAGER="CDG2DJOKXE4MD7MCG5OAPBPLODROJ2AADW75EUSPMONCLPXVVYD5AVKN"
VOUCHER_MANAGER="CCTKNEL4UPLCTQSLIHE2Y3RIDFZKUTBONYFXSOOS2MSDU3YLRCCXSEIG"
MERCHANT_REGISTRY="CCG6HA73JOZIJB7W5WGMXORZN4SECNI2HB2DMM4KXUSSCGD6SSG657FY"
IMPACT_CREDIT_NFT="CA2PWCZSTCIZ75JRWXRIGU2LA7K25FZT2LMYRGJHXYTAJXK7PMURPUX2"

# Configuration
ADMIN="GAEFBBEVPIUUOTKWOL7B3L6X46F5HYFY5E2IUDV2EUA3LOO6C5AJVB35"
USDC_TOKEN="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
SOURCE_ACCOUNT="deployer"
NETWORK="testnet"

echo ""
echo "📝 Configuration:"
echo "  Admin: $ADMIN"
echo "  USDC Token: $USDC_TOKEN"
echo "  Network: $NETWORK"
echo ""

# Initialize Impact Vault
echo "1️⃣ Initializing ImpactVault..."
stellar contract invoke \
  --id $IMPACT_VAULT \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN \
  --usdc_token $USDC_TOKEN \
  2>&1 | tee -a initialization.log

if [ $? -eq 0 ]; then
    echo "✅ ImpactVault initialized successfully"
else
    echo "⚠️  ImpactVault initialization may have failed or already initialized"
fi
echo ""

# Initialize Program Manager
echo "2️⃣ Initializing ProgramManager..."
stellar contract invoke \
  --id $PROGRAM_MANAGER \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN \
  --vault $IMPACT_VAULT \
  2>&1 | tee -a initialization.log

if [ $? -eq 0 ]; then
    echo "✅ ProgramManager initialized successfully"
else
    echo "⚠️  ProgramManager initialization may have failed or already initialized"
fi
echo ""

# Initialize Voucher Manager
echo "3️⃣ Initializing VoucherManager..."
stellar contract invoke \
  --id $VOUCHER_MANAGER \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN \
  --program_manager $PROGRAM_MANAGER \
  2>&1 | tee -a initialization.log

if [ $? -eq 0 ]; then
    echo "✅ VoucherManager initialized successfully"
else
    echo "⚠️  VoucherManager initialization may have failed or already initialized"
fi
echo ""

# Initialize Merchant Registry
echo "4️⃣ Initializing MerchantRegistry..."
stellar contract invoke \
  --id $MERCHANT_REGISTRY \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN \
  2>&1 | tee -a initialization.log

if [ $? -eq 0 ]; then
    echo "✅ MerchantRegistry initialized successfully"
else
    echo "⚠️  MerchantRegistry initialization may have failed or already initialized"
fi
echo ""

# Initialize Impact Credit NFT
echo "5️⃣ Initializing ImpactCreditNFT..."
stellar contract invoke \
  --id $IMPACT_CREDIT_NFT \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN \
  2>&1 | tee -a initialization.log

if [ $? -eq 0 ]; then
    echo "✅ ImpactCreditNFT initialized successfully"
else
    echo "⚠️  ImpactCreditNFT initialization may have failed or already initialized"
fi
echo ""

echo "=================================================="
echo "🎉 Contract Initialization Complete!"
echo ""
echo "📋 Summary:"
echo "  ✅ All 5 contracts processed"
echo "  📄 Full log saved to: initialization.log"
echo ""
echo "🧪 Test the contracts:"
echo "  stellar contract invoke --id $IMPACT_VAULT --source $SOURCE_ACCOUNT --network $NETWORK -- get_admin"
echo ""
echo "🌐 View contracts on Stellar Expert:"
echo "  https://stellar.expert/explorer/testnet/contract/$IMPACT_VAULT"
echo ""


