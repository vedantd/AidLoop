// Real Donor Dashboard with Stellar Blockchain Integration

// Simple StellarClient for demo
class StellarClient {
    constructor(network = 'testnet') {
        this.network = network;
        this.server = 'https://horizon-testnet.stellar.org';
    }

    async createTestAccount() {
        // Simulate creating a test account
        const keypair = {
            publicKey: 'G' + Math.random().toString(36).substr(2, 55).toUpperCase(),
            secretKey: 'S' + Math.random().toString(36).substr(2, 55).toUpperCase(),
            keypair: {
                publicKey: function() { return this.publicKey; },
                secret: function() { return this.secretKey; }
            }
        };
        
        return {
            publicKey: keypair.publicKey,
            secretKey: keypair.secretKey,
            keypair: keypair
        };
    }

    async getAccountBalance(publicKey) {
        // Simulate account balance
        return [
            { asset: 'XLM', balance: (Math.random() * 1000 + 100).toFixed(2), assetType: 'native' },
            { asset: 'USDC', balance: (Math.random() * 500 + 50).toFixed(2), assetType: 'credit_alphanum4' }
        ];
    }

    async getTransactionHistory(publicKey, limit = 5) {
        // Simulate transaction history
        return [
            {
                id: 'txn_' + Math.random().toString(36).substr(2, 9),
                type: 'payment',
                amount: '100.00',
                created_at: new Date().toISOString(),
                hash: 'hash_' + Math.random().toString(36).substr(2, 9)
            }
        ];
    }
}

class DonorApp {
    constructor() {
        this.stellarClient = new StellarClient('testnet');
        this.walletConnected = false;
        this.userKeypair = null;
        this.userAddress = null;
        this.vaultAddress = null;
        this.usdcAsset = null;
        this.walletKit = null;
        this.init();
    }

    async init() {
        console.log('Initializing Donor App...');
        this.setupEventListeners();
        await this.loadDashboardData();
        this.initializeWalletKit();
        console.log('Donor App initialized');
    }

    async initializeWalletKit() {
        console.log('Initializing wallet connection...');
        // We'll use direct Freighter integration instead of wallet kit
        this.walletKit = null; // Not using wallet kit
        console.log('Using direct wallet integration');
    }

    setupEventListeners() {
        // Connect wallet button
        document.getElementById('connect-wallet-btn').addEventListener('click', () => {
            this.connectWallet();
        });

        // Deposit button
        document.getElementById('deposit-btn').addEventListener('click', () => {
            this.showDepositModal();
        });

        // View programs button
        document.getElementById('view-programs-btn').addEventListener('click', () => {
            this.showProgramsModal();
        });

        // Marketplace button
        document.getElementById('marketplace-btn').addEventListener('click', () => {
            this.showMarketplaceModal();
        });

        // Modal controls
        document.getElementById('close-deposit-modal').addEventListener('click', () => {
            this.hideDepositModal();
        });

        document.getElementById('close-programs').addEventListener('click', () => {
            this.hideProgramsModal();
        });

        document.getElementById('close-marketplace').addEventListener('click', () => {
            this.hideMarketplaceModal();
        });

        document.getElementById('confirm-deposit').addEventListener('click', () => {
            this.processDeposit();
        });

        document.getElementById('cancel-deposit').addEventListener('click', () => {
            this.hideDepositModal();
        });
    }

    async connectWallet() {
        try {
            console.log('Connecting to Stellar wallet...');
            
            // Use the enhanced Freighter detection
            const freighterApi = window.detectFreighter();
            
            if (freighterApi) {
                console.log('Freighter API found, connecting...');
                await this.connectFreighter(freighterApi);
            } else {
                console.log('Freighter not found, using demo mode');
                const useDemo = confirm('Freighter wallet not found. Would you like to use demo mode instead?');
                if (useDemo) {
                    await this.connectDemoWallet();
                }
            }

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            
            // Fallback to demo mode
            const useDemo = confirm(`Wallet connection failed: ${error.message}\n\nWould you like to use demo mode instead?`);
            if (useDemo) {
                await this.connectDemoWallet();
            }
        }
    }

    async connectFreighter(freighterApi = null) {
        try {
            console.log('Connecting to Freighter...');
            
            // Use provided API or fallback to window
            const api = freighterApi || window.freighterApi || window.freighter;
            
            if (!api) {
                throw new Error('Freighter API not available');
            }
            
            console.log('Using Freighter API:', api);
            
            // Check if already connected
            const isConnected = await api.isConnected();
            console.log('Freighter connected:', isConnected);
            
            if (!isConnected) {
                console.log('Requesting Freighter connection...');
                await api.connect();
            }

            // Get public key
            const publicKey = await api.getPublicKey();
            this.userAddress = publicKey;
            this.walletConnected = true;
            this.freighterApi = api; // Store for later use

            console.log('Freighter connected successfully:', this.userAddress);

            // Update UI
            this.updateWalletStatus();
            await this.loadDashboardData();

            // Show success message
            alert(`Freighter connected successfully!\nAddress: ${this.userAddress}`);

        } catch (error) {
            console.error('Failed to connect Freighter:', error);
            throw error;
        }
    }

    async connectDemoWallet() {
        try {
            console.log('Connecting to demo wallet...');
            
            // Create a demo account
            const account = await this.stellarClient.createTestAccount();
            this.userKeypair = account.keypair;
            this.userAddress = account.publicKey;
            this.walletConnected = true;

            console.log('Demo wallet connected:', this.userAddress);

            // Update UI
            this.updateWalletStatus();
            await this.loadDashboardData();

            // Show demo message
            alert(`Demo wallet connected!\nAddress: ${this.userAddress}\n\nNote: This is a demo mode for testing purposes.`);

        } catch (error) {
            console.error('Failed to connect demo wallet:', error);
            alert('Failed to connect demo wallet. Please try again.');
        }
    }

    updateWalletStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const walletAddress = document.getElementById('wallet-address');
        const connectBtn = document.getElementById('connect-wallet-btn');

        if (this.walletConnected) {
            statusIndicator.classList.remove('status-disconnected');
            statusIndicator.classList.add('status-connected');
            walletAddress.textContent = `${this.userAddress.substring(0, 8)}...${this.userAddress.substring(-8)}`;
            connectBtn.textContent = 'Connected';
            connectBtn.classList.add('bg-green-600');
            connectBtn.classList.remove('bg-indigo-600');
        } else {
            statusIndicator.classList.remove('status-connected');
            statusIndicator.classList.add('status-disconnected');
            walletAddress.textContent = 'Not Connected';
            connectBtn.textContent = 'Connect Wallet';
            connectBtn.classList.remove('bg-green-600');
            connectBtn.classList.add('bg-indigo-600');
        }
    }

    async loadDashboardData() {
        if (!this.walletConnected) {
            console.log('Wallet not connected, skipping dashboard data load');
            return;
        }

        try {
            console.log('Loading dashboard data...');
            
            // Get account balance
            const balances = await this.stellarClient.getAccountBalance(this.userAddress);
            console.log('Account balances:', balances);

            // Update vault balance (simulated)
            const xlmBalance = balances.find(b => b.asset === 'XLM')?.balance || '0';
            document.getElementById('vault-balance').textContent = `$${parseFloat(xlmBalance).toFixed(2)}`;

            // Update yield generated (simulated)
            const yieldGenerated = Math.random() * 100;
            document.getElementById('yield-generated').textContent = `$${yieldGenerated.toFixed(2)}`;

            // Update impact credits (simulated)
            const impactCredits = Math.floor(Math.random() * 20);
            document.getElementById('impact-credits').textContent = impactCredits.toString();

            // Update active programs (simulated)
            const activePrograms = Math.floor(Math.random() * 5) + 1;
            document.getElementById('active-programs').textContent = activePrograms.toString();

            // Load transaction history
            await this.loadTransactionHistory();

            console.log('Dashboard data loaded successfully');
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async loadTransactionHistory() {
        try {
            const transactions = await this.stellarClient.getTransactionHistory(this.userAddress, 5);
            const historyContainer = document.getElementById('transaction-history');
            
            if (transactions.length === 0) {
                historyContainer.innerHTML = '<p class="text-gray-500 text-center">No transactions yet</p>';
                return;
            }

            historyContainer.innerHTML = transactions.map(tx => `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-medium">${tx.type === 'payment' ? 'Payment' : 'Transaction'}</p>
                        <p class="text-sm text-gray-600">${new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-medium text-green-600">+${tx.amount || '0'} XLM</p>
                        <p class="text-sm text-gray-600">${tx.hash.substring(0, 8)}...</p>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load transaction history:', error);
        }
    }

    showDepositModal() {
        if (!this.walletConnected) {
            alert('Please connect your wallet first.');
            return;
        }
        document.getElementById('deposit-modal').classList.remove('hidden');
    }

    hideDepositModal() {
        document.getElementById('deposit-modal').classList.add('hidden');
        document.getElementById('deposit-amount').value = '';
    }

    async processDeposit() {
        const amount = document.getElementById('deposit-amount').value;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        try {
            console.log(`Processing deposit of ${amount} USDC...`);
            
            // Show processing message
            const confirmBtn = document.getElementById('confirm-deposit');
            confirmBtn.textContent = 'Processing...';
            confirmBtn.disabled = true;
            
            if (this.walletConnected && window.freighterApi) {
                // Real wallet transaction
                await this.processRealDeposit(amount);
            } else {
                // Demo transaction
                await this.processDemoDeposit(amount);
            }
            
        } catch (error) {
            console.error('Deposit failed:', error);
            alert('Deposit failed. Please try again.');
        } finally {
            // Reset button
            const confirmBtn = document.getElementById('confirm-deposit');
            confirmBtn.textContent = 'Deposit';
            confirmBtn.disabled = false;
        }
    }

    async processRealDeposit(amount) {
        try {
            if (!window.freighterApi) {
                throw new Error('Freighter not available');
            }

            // Check if user has USDC
            const balances = await this.stellarClient.getAccountBalance(this.userAddress);
            const usdcBalance = balances.find(b => b.asset === 'USDC')?.balance || 0;
            
            if (parseFloat(usdcBalance) < parseFloat(amount)) {
                throw new Error(`Insufficient USDC balance. You have ${usdcBalance} USDC, but trying to deposit ${amount} USDC.`);
            }

            // Create USDC asset (for demo purposes)
            const usdcAsset = new window.StellarSdk.Asset('USDC', 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5OLWK');
            
            // Create payment operation
            const paymentOp = window.StellarSdk.Operation.payment({
                destination: this.vaultAddress || 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5OLWK', // ImpactVault address
                asset: usdcAsset,
                amount: amount
            });

            // Build transaction
            const server = new window.StellarSdk.Server('https://horizon-testnet.stellar.org');
            const account = await server.loadAccount(this.userAddress);
            
            const transaction = new window.StellarSdk.TransactionBuilder(account, {
                fee: window.StellarSdk.BASE_FEE,
                networkPassphrase: window.StellarSdk.Networks.TESTNET
            })
            .addOperation(paymentOp)
            .setTimeout(30)
            .build();

            // Sign transaction using Freighter
            const signedTransaction = await window.freighterApi.signTransaction(transaction.toXDR());
            const result = await server.submitTransaction(signedTransaction);
            
            console.log('Real deposit successful:', result);
            alert(`Successfully deposited ${amount} USDC!\n\nTransaction Hash: ${result.hash}`);
            
            this.hideDepositModal();
            await this.loadDashboardData();
            
        } catch (error) {
            console.error('Real deposit failed:', error);
            throw error;
        }
    }

    async processDemoDeposit(amount) {
        try {
            // Simulate deposit transaction
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
            
            console.log(`Demo deposit successful: ${amount} USDC`);
            alert(`Demo: Successfully deposited ${amount} USDC!\n\nTransaction ID: TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}\n\nNote: This is a demo transaction.`);
            
            this.hideDepositModal();
            await this.loadDashboardData();
            
        } catch (error) {
            console.error('Demo deposit failed:', error);
            throw error;
        }
    }

    showProgramsModal() {
        document.getElementById('programs-modal').classList.remove('hidden');
        this.loadPrograms();
    }

    hideProgramsModal() {
        document.getElementById('programs-modal').classList.add('hidden');
    }

    async loadPrograms() {
        const programsContainer = document.getElementById('programs-list');
        
        // Simulate loading programs
        const programs = [
            {
                id: 1,
                name: 'Healthcare Program',
                category: 'Healthcare',
                funding: 10000,
                remaining: 7500,
                beneficiaries: 150,
                status: 'Active'
            },
            {
                id: 2,
                name: 'Education Program',
                category: 'Education',
                funding: 5000,
                remaining: 2500,
                beneficiaries: 75,
                status: 'Active'
            },
            {
                id: 3,
                name: 'Food Security Program',
                category: 'Food',
                funding: 3000,
                remaining: 1200,
                beneficiaries: 200,
                status: 'Active'
            }
        ];

        programsContainer.innerHTML = programs.map(program => `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-lg">${program.name}</h4>
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">${program.status}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">Category: ${program.category}</p>
                <div class="mb-2">
                    <div class="flex justify-between text-sm mb-1">
                        <span>Funding Progress</span>
                        <span>${((program.funding - program.remaining) / program.funding * 100).toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${(program.funding - program.remaining) / program.funding * 100}%"></div>
                    </div>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Beneficiaries: ${program.beneficiaries}</span>
                    <span>Remaining: $${program.remaining.toLocaleString()}</span>
                </div>
            </div>
        `).join('');
    }

    showMarketplaceModal() {
        document.getElementById('marketplace-modal').classList.remove('hidden');
        this.loadMarketplace();
    }

    hideMarketplaceModal() {
        document.getElementById('marketplace-modal').classList.add('hidden');
    }

    async loadMarketplace() {
        const marketplaceContainer = document.getElementById('marketplace-list');
        
        // Simulate loading marketplace items
        const items = [
            {
                id: 1,
                title: 'Healthcare Impact Credit #001',
                amount: 100,
                impactScore: 85,
                price: 95,
                category: 'Healthcare',
                seller: 'GABC123...XYZ789'
            },
            {
                id: 2,
                title: 'Education Impact Credit #002',
                amount: 50,
                impactScore: 92,
                price: 48,
                category: 'Education',
                seller: 'GDEF456...UVW012'
            },
            {
                id: 3,
                title: 'Food Security Impact Credit #003',
                amount: 75,
                impactScore: 78,
                price: 70,
                category: 'Food',
                seller: 'GHIJ789...RST345'
            }
        ];

        marketplaceContainer.innerHTML = items.map(item => `
            <div class="border rounded-lg p-4">
                <h4 class="font-semibold mb-2">${item.title}</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Amount:</span>
                        <span class="font-medium">$${item.amount}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Impact Score:</span>
                        <span class="font-medium text-green-600">${item.impactScore}/100</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Price:</span>
                        <span class="font-medium text-indigo-600">$${item.price}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Category:</span>
                        <span class="font-medium">${item.category}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Seller:</span>
                        <span class="font-mono text-xs">${item.seller}</span>
                    </div>
                </div>
                <button class="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" onclick="buyImpactCredit(${item.id})">
                    Buy NFT
                </button>
            </div>
        `).join('');
    }
}

// Global function for buying impact credits
window.buyImpactCredit = function(itemId) {
    console.log(`Buying impact credit ${itemId}`);
    alert(`Buying Impact Credit #${itemId}... This would trigger a real blockchain transaction!`);
};

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.donorApp = new DonorApp();
    console.log('DonorApp initialized and available globally');
});
