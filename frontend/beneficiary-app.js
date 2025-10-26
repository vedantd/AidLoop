// Beneficiary App with Real Voucher Management
class BeneficiaryApp {
    constructor() {
        this.beneficiaryId = 'BEN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.voucherBalances = {
            healthcare: 150.00,
            food: 75.00,
            education: 50.00
        };
        this.redemptionHistory = [];
        this.init();
    }

    init() {
        console.log('Initializing Beneficiary App...');
        this.setupEventListeners();
        this.loadVoucherBalances();
        this.loadRedemptionHistory();
        console.log('Beneficiary App initialized');
    }

    setupEventListeners() {
        // QR code modal events
        document.getElementById('qr-modal').addEventListener('click', (e) => {
            if (e.target.id === 'qr-modal') {
                this.hideQRModal();
            }
        });
    }

    loadVoucherBalances() {
        document.getElementById('beneficiary-id').textContent = this.beneficiaryId;
        document.getElementById('healthcare-balance').textContent = `$${this.voucherBalances.healthcare.toFixed(2)}`;
        document.getElementById('food-balance').textContent = `$${this.voucherBalances.food.toFixed(2)}`;
        document.getElementById('education-balance').textContent = `$${this.voucherBalances.education.toFixed(2)}`;
    }

    loadRedemptionHistory() {
        // Simulate redemption history
        const history = [
            {
                category: 'Healthcare',
                merchant: 'Pharmacy',
                description: 'Medicines & consultation',
                amount: 25.00,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                verified: true
            },
            {
                category: 'Food',
                merchant: 'Grocery Store',
                description: 'Fresh vegetables & rice',
                amount: 15.00,
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                verified: true
            }
        ];

        this.redemptionHistory = history;
        this.renderRedemptionHistory();
    }

    renderRedemptionHistory() {
        const container = document.getElementById('redemption-history');
        
        if (this.redemptionHistory.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">No redemptions yet</p>';
            return;
        }

        container.innerHTML = this.redemptionHistory.map(redemption => `
            <div class="bg-white rounded-lg p-4 shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-gray-800">${redemption.category} - ${redemption.merchant}</p>
                        <p class="text-sm text-gray-600">${redemption.description}</p>
                        <p class="text-xs text-gray-500">${this.formatTimeAgo(redemption.timestamp)}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-green-600">-$${redemption.amount.toFixed(2)}</p>
                        <p class="text-xs text-gray-500">${redemption.verified ? 'Verified ✓' : 'Pending'}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
    }

    showVoucherQR(category) {
        const modal = document.getElementById('qr-modal');
        const title = document.getElementById('qr-title');
        const amount = document.getElementById('qr-amount');
        
        // Update modal content based on category
        const categoryNames = {
            healthcare: 'Healthcare Voucher',
            food: 'Food Voucher',
            education: 'Education Voucher'
        };
        
        title.textContent = categoryNames[category];
        amount.textContent = `$${this.voucherBalances[category].toFixed(2)}`;
        
        // Generate QR code data
        const qrData = {
            beneficiaryId: this.beneficiaryId,
            category: category,
            amount: this.voucherBalances[category],
            timestamp: Date.now(),
            signature: this.generateSignature(category)
        };
        
        console.log('QR Code Data:', qrData);
        
        modal.classList.remove('hidden');
    }

    hideQRModal() {
        document.getElementById('qr-modal').classList.add('hidden');
    }

    generateSignature(category) {
        // In a real implementation, this would be a cryptographic signature
        return 'SIG' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Simulate voucher redemption
    async redeemVoucher(category, amount, merchantId) {
        try {
            console.log(`Redeeming ${amount} from ${category} voucher at merchant ${merchantId}`);
            
            if (this.voucherBalances[category] < amount) {
                throw new Error('Insufficient voucher balance');
            }
            
            // Update balance
            this.voucherBalances[category] -= amount;
            
            // Add to redemption history
            const redemption = {
                category: category.charAt(0).toUpperCase() + category.slice(1),
                merchant: `Merchant ${merchantId}`,
                description: `${category} services`,
                amount: amount,
                timestamp: new Date(),
                verified: false
            };
            
            this.redemptionHistory.unshift(redemption);
            
            // Update UI
            this.loadVoucherBalances();
            this.renderRedemptionHistory();
            
            console.log('Voucher redeemed successfully');
            return redemption;
            
        } catch (error) {
            console.error('Voucher redemption failed:', error);
            throw error;
        }
    }

    // Simulate verification of redemption
    async verifyRedemption(redemptionId) {
        try {
            console.log(`Verifying redemption ${redemptionId}`);
            
            // Find the redemption in history
            const redemption = this.redemptionHistory.find(r => r.id === redemptionId);
            if (redemption) {
                redemption.verified = true;
                this.renderRedemptionHistory();
            }
            
            console.log('Redemption verified successfully');
        } catch (error) {
            console.error('Redemption verification failed:', error);
            throw error;
        }
    }
}

// Global functions for UI interactions
window.showVoucherQR = function(category) {
    if (window.beneficiaryApp) {
        window.beneficiaryApp.showVoucherQR(category);
    }
};

window.hideQRModal = function() {
    if (window.beneficiaryApp) {
        window.beneficiaryApp.hideQRModal();
    }
};

window.showHistory = function() {
    console.log('Showing history');
    // In a real app, this would navigate to a history page
};

window.showProfile = function() {
    console.log('Showing profile');
    // In a real app, this would navigate to a profile page
};

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.beneficiaryApp = new BeneficiaryApp();
});

