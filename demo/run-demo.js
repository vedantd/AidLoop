#!/usr/bin/env node

// AidLoop Complete Demo Runner
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AidLoopDemo {
    constructor() {
        this.demoSteps = [
            'setup',
            'donor-deposit',
            'beneficiary-voucher',
            'merchant-redemption',
            'blockchain-verification',
            'impact-nft-minting',
            'marketplace-trading'
        ];
        this.currentStep = 0;
    }

    async run() {
        console.log('🌍 AidLoop Complete Demo Starting...\n');
        
        try {
            await this.setupDemo();
            await this.runDemoSteps();
            await this.showResults();
        } catch (error) {
            console.error('❌ Demo failed:', error.message);
            process.exit(1);
        }
    }

    async setupDemo() {
        console.log('📋 Setting up demo environment...');
        
        // Check if frontend files exist
        const frontendFiles = [
            'frontend/donor-dashboard.html',
            'frontend/beneficiary-app.html',
            'frontend/merchant-pos.html'
        ];

        for (const file of frontendFiles) {
            if (!fs.existsSync(file)) {
                throw new Error(`Frontend file not found: ${file}`);
            }
        }

        console.log('✅ Demo environment ready\n');
    }

    async runDemoSteps() {
        for (let i = 0; i < this.demoSteps.length; i++) {
            this.currentStep = i;
            await this.runStep(this.demoSteps[i]);
            await this.wait(2000); // Wait between steps
        }
    }

    async runStep(stepName) {
        console.log(`🔄 Running step: ${stepName}`);
        
        switch (stepName) {
            case 'setup':
                await this.stepSetup();
                break;
            case 'donor-deposit':
                await this.stepDonorDeposit();
                break;
            case 'beneficiary-voucher':
                await this.stepBeneficiaryVoucher();
                break;
            case 'merchant-redemption':
                await this.stepMerchantRedemption();
                break;
            case 'blockchain-verification':
                await this.stepBlockchainVerification();
                break;
            case 'impact-nft-minting':
                await this.stepImpactNFTMinting();
                break;
            case 'marketplace-trading':
                await this.stepMarketplaceTrading();
                break;
        }
    }

    async stepSetup() {
        console.log('   📱 Opening donor dashboard...');
        console.log('   📱 Opening beneficiary app...');
        console.log('   📱 Opening merchant POS...');
        console.log('   ✅ All interfaces ready');
    }

    async stepDonorDeposit() {
        console.log('   💰 Donor deposits $1000 USDC into ImpactVault');
        console.log('   🔗 Blockchain transaction: TXN_001');
        console.log('   📊 Vault balance updated: $1000.00');
        console.log('   ✅ Deposit successful');
    }

    async stepBeneficiaryVoucher() {
        console.log('   🎫 Beneficiary receives healthcare voucher');
        console.log('   📱 QR code generated for redemption');
        console.log('   💊 Voucher amount: $150.00');
        console.log('   ✅ Voucher allocated');
    }

    async stepMerchantRedemption() {
        console.log('   🏪 Merchant scans beneficiary QR code');
        console.log('   💳 Transaction amount: $25.00');
        console.log('   🔗 Blockchain verification in progress...');
        console.log('   ✅ Redemption successful');
    }

    async stepBlockchainVerification() {
        console.log('   ⛓️  On-chain verification completed');
        console.log('   📋 Proof stored on IPFS');
        console.log('   🔐 Cryptographic signature verified');
        console.log('   ✅ Verification successful');
    }

    async stepImpactNFTMinting() {
        console.log('   🎨 Impact Credit NFT minted');
        console.log('   🆔 NFT ID: ICNFT_001');
        console.log('   📊 Impact score: 85/100');
        console.log('   ✅ NFT created');
    }

    async stepMarketplaceTrading() {
        console.log('   🛒 NFT listed on marketplace');
        console.log('   💰 Price: $95.00');
        console.log('   👥 ESG investor purchases NFT');
        console.log('   🔄 Proceeds reinvested into new programs');
        console.log('   ✅ Trading cycle complete');
    }

    async showResults() {
        console.log('\n🎉 AidLoop Demo Complete!');
        console.log('\n📊 Demo Results:');
        console.log('   💰 Total deposits: $1000.00');
        console.log('   🎫 Vouchers issued: 3');
        console.log('   🏪 Redemptions: 1');
        console.log('   🎨 NFTs minted: 1');
        console.log('   💱 Marketplace trades: 1');
        console.log('   🔄 Aid loop: Complete');
        
        console.log('\n🌐 Access the interfaces:');
        console.log('   👨‍💼 Donor Dashboard: http://localhost:8000/donor-dashboard.html');
        console.log('   👤 Beneficiary App: http://localhost:8000/beneficiary-app.html');
        console.log('   🏪 Merchant POS: http://localhost:8000/merchant-pos.html');
        
        console.log('\n🚀 Next Steps:');
        console.log('   1. Deploy contracts to Stellar testnet');
        console.log('   2. Integrate with real USDC');
        console.log('   3. Add IPFS storage');
        console.log('   4. Implement verifier DAO');
        console.log('   5. Launch on mainnet');
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Run the demo
if (require.main === module) {
    const demo = new AidLoopDemo();
    demo.run().catch(console.error);
}

module.exports = AidLoopDemo;

