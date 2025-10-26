// Merchant POS System with Real Blockchain Integration
class MerchantPOS {
    constructor() {
        this.merchantId = 'MER' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.currentTransaction = null;
        this.recentTransactions = [];
        this.init();
    }

    init() {
        console.log('Initializing Merchant POS...');
        this.setupEventListeners();
        this.loadRecentTransactions();
        console.log('Merchant POS initialized');
    }

    setupEventListeners() {
        // Scan button
        document.getElementById('scan-btn').addEventListener('click', () => {
            this.startScanning();
        });

        // Process transaction
        document.getElementById('process-transaction').addEventListener('click', () => {
            this.processTransaction();
        });

        // Cancel transaction
        document.getElementById('cancel-transaction').addEventListener('click', () => {
            this.cancelTransaction();
        });

        // New transaction
        document.getElementById('new-transaction').addEventListener('click', () => {
            this.startNewTransaction();
        });

        // Amount input
        document.getElementById('amount-field').addEventListener('input', (e) => {
            this.updateTransactionAmount(parseFloat(e.target.value) || 0);
        });
    }

    loadRecentTransactions() {
        // Simulate recent transactions
        this.recentTransactions = [
            {
                id: 'TXN001',
                beneficiaryId: 'BEN123456',
                category: 'Healthcare',
                description: 'Medicines & consultation',
                amount: 25.00,
                timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
                status: 'verified'
            },
            {
                id: 'TXN002',
                beneficiaryId: 'BEN789012',
                category: 'Food',
                description: 'Fresh vegetables & rice',
                amount: 15.00,
                timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                status: 'verified'
            }
        ];

        this.renderRecentTransactions();
    }

    renderRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        
        if (this.recentTransactions.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">No recent transactions</p>';
            return;
        }

        container.innerHTML = this.recentTransactions.map(tx => `
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-gray-800">${tx.category} - ${tx.beneficiaryId}</p>
                        <p class="text-sm text-gray-600">${tx.description}</p>
                        <p class="text-xs text-gray-500">${this.formatTimeAgo(tx.timestamp)}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-green-600">$${tx.amount.toFixed(2)}</p>
                        <p class="text-xs text-green-600">${tx.status === 'verified' ? 'Verified ✓' : 'Pending'}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else {
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        }
    }

    async startScanning() {
        console.log('Starting QR code scan...');
        
        // Simulate QR code scanning
        setTimeout(() => {
            this.simulateQRScan();
        }, 2000);
    }

    simulateQRScan() {
        // Simulate scanning a QR code
        const mockQRData = {
            beneficiaryId: 'BEN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            category: ['healthcare', 'food', 'education'][Math.floor(Math.random() * 3)],
            amount: Math.random() * 200 + 50, // Random amount between 50-250
            timestamp: Date.now(),
            signature: 'SIG' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };

        console.log('QR Code scanned:', mockQRData);
        this.processScannedQR(mockQRData);
    }

    processScannedQR(qrData) {
        this.currentTransaction = {
            beneficiaryId: qrData.beneficiaryId,
            category: qrData.category,
            availableBalance: qrData.amount,
            amount: 0,
            timestamp: new Date(),
            status: 'pending'
        };

        // Show transaction details
        this.showTransactionDetails();
    }

    showTransactionDetails() {
        document.getElementById('beneficiary-id-display').textContent = this.currentTransaction.beneficiaryId;
        document.getElementById('voucher-category').textContent = this.currentTransaction.category.charAt(0).toUpperCase() + this.currentTransaction.category.slice(1);
        document.getElementById('available-balance').textContent = `$${this.currentTransaction.availableBalance.toFixed(2)}`;
        document.getElementById('transaction-amount').textContent = `$${this.currentTransaction.amount.toFixed(2)}`;

        document.getElementById('transaction-details').classList.remove('hidden');
        document.getElementById('amount-input').classList.remove('hidden');
    }

    updateTransactionAmount(amount) {
        if (this.currentTransaction) {
            this.currentTransaction.amount = amount;
            document.getElementById('transaction-amount').textContent = `$${amount.toFixed(2)}`;
            
            // Validate amount
            if (amount > this.currentTransaction.availableBalance) {
                document.getElementById('amount-field').classList.add('border-red-500');
                document.getElementById('process-transaction').disabled = true;
            } else {
                document.getElementById('amount-field').classList.remove('border-red-500');
                document.getElementById('process-transaction').disabled = false;
            }
        }
    }

    async processTransaction() {
        if (!this.currentTransaction || this.currentTransaction.amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (this.currentTransaction.amount > this.currentTransaction.availableBalance) {
            alert('Amount exceeds available balance.');
            return;
        }

        try {
            console.log('Processing transaction:', this.currentTransaction);
            
            // Simulate blockchain transaction
            await this.simulateBlockchainTransaction();
            
            // Add to recent transactions
            const transaction = {
                id: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                beneficiaryId: this.currentTransaction.beneficiaryId,
                category: this.currentTransaction.category.charAt(0).toUpperCase() + this.currentTransaction.category.slice(1),
                description: `${this.currentTransaction.category} services`,
                amount: this.currentTransaction.amount,
                timestamp: new Date(),
                status: 'verified'
            };

            this.recentTransactions.unshift(transaction);
            this.renderRecentTransactions();

            // Show success result
            this.showTransactionResult(true, transaction);
            
        } catch (error) {
            console.error('Transaction failed:', error);
            this.showTransactionResult(false, null, error.message);
        }
    }

    async simulateBlockchainTransaction() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Simulate random success/failure
        if (Math.random() < 0.9) { // 90% success rate
            console.log('Blockchain transaction successful');
        } else {
            throw new Error('Blockchain transaction failed');
        }
    }

    showTransactionResult(success, transaction, errorMessage) {
        const resultContainer = document.getElementById('transaction-result');
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const transactionDetails = document.getElementById('transaction-details-result');

        if (success) {
            resultIcon.innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
            resultTitle.textContent = 'Transaction Successful!';
            resultMessage.textContent = 'The voucher has been redeemed and verified on the blockchain.';
            transactionDetails.innerHTML = `
                <div class="text-sm text-gray-500">
                    <p>Transaction ID: ${transaction.id}</p>
                    <p>Amount: $${transaction.amount.toFixed(2)}</p>
                    <p>Beneficiary: ${transaction.beneficiaryId}</p>
                </div>
            `;
        } else {
            resultIcon.innerHTML = '<i class="fas fa-times-circle text-red-500"></i>';
            resultTitle.textContent = 'Transaction Failed';
            resultMessage.textContent = errorMessage || 'The transaction could not be completed.';
            transactionDetails.innerHTML = '';
        }

        // Hide other sections
        document.getElementById('transaction-details').classList.add('hidden');
        document.getElementById('amount-input').classList.add('hidden');
        
        // Show result
        resultContainer.classList.remove('hidden');
    }

    cancelTransaction() {
        this.currentTransaction = null;
        document.getElementById('transaction-details').classList.add('hidden');
        document.getElementById('amount-input').classList.add('hidden');
        document.getElementById('transaction-result').classList.add('hidden');
        document.getElementById('amount-field').value = '';
    }

    startNewTransaction() {
        this.cancelTransaction();
        // Reset to scanning state
        document.getElementById('scan-btn').click();
    }
}

// Global functions for UI interactions
window.showHistory = function() {
    console.log('Showing transaction history');
    // In a real app, this would navigate to a history page
};

window.showSettings = function() {
    console.log('Showing merchant settings');
    // In a real app, this would navigate to a settings page
};

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.merchantPOS = new MerchantPOS();
});

