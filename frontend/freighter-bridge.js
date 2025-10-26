// Freighter Bridge - Alternative connection method for when window.freighterApi is not available
// This uses Chrome extension messaging to communicate with Freighter

const FreighterBridge = {
    FREIGHTER_ID: 'bcacfldlkkdogcmkkibnjlakofdplcbk',
    
    async isAvailable() {
        // Try direct API first
        if (typeof window.freighterApi !== 'undefined') {
            console.log('Freighter: Using direct API');
            return true;
        }
        
        // Try extension messaging
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            try {
                // Try to communicate with Freighter extension
                return new Promise((resolve) => {
                    chrome.runtime.sendMessage(
                        this.FREIGHTER_ID,
                        { type: 'FREIGHTER_API_REQUEST', method: 'isConnected' },
                        (response) => {
                            if (chrome.runtime.lastError) {
                                console.log('Freighter: Extension messaging failed:', chrome.runtime.lastError);
                                resolve(false);
                            } else {
                                console.log('Freighter: Extension messaging works!');
                                resolve(true);
                            }
                        }
                    );
                    // Timeout after 2 seconds
                    setTimeout(() => resolve(false), 2000);
                });
            } catch (error) {
                console.log('Freighter: Extension messaging error:', error);
                return false;
            }
        }
        
        return false;
    },
    
    async getPublicKey() {
        // Try direct API
        if (window.freighterApi && window.freighterApi.getPublicKey) {
            return await window.freighterApi.getPublicKey();
        }
        
        // Try extension messaging
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    this.FREIGHTER_ID,
                    { type: 'FREIGHTER_API_REQUEST', method: 'getPublicKey' },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error('Failed to communicate with Freighter extension'));
                        } else if (response && response.publicKey) {
                            resolve(response.publicKey);
                        } else {
                            reject(new Error('No public key returned from Freighter'));
                        }
                    }
                );
            });
        }
        
        throw new Error('Freighter not available');
    },
    
    async signTransaction(xdr, options) {
        // Try direct API
        if (window.freighterApi && window.freighterApi.signTransaction) {
            return await window.freighterApi.signTransaction(xdr, options);
        }
        
        // Try extension messaging
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    this.FREIGHTER_ID,
                    {
                        type: 'FREIGHTER_API_REQUEST',
                        method: 'signTransaction',
                        params: { xdr, ...options }
                    },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error('Failed to communicate with Freighter extension'));
                        } else if (response && response.signedTransaction) {
                            resolve(response.signedTransaction);
                        } else {
                            reject(new Error('No signed transaction returned from Freighter'));
                        }
                    }
                );
            });
        }
        
        throw new Error('Freighter not available');
    }
};

// Make it globally available
window.FreighterBridge = FreighterBridge;

console.log('Freighter Bridge loaded');


