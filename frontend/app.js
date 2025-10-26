// AidLoop - Clean Freighter Integration
// Built from scratch with proper Freighter API usage

// Global state
let state = {
    connected: false,
    publicKey: null,
    freighterApi: null,
    balances: {
        xlm: 0,
        usdc: 0
    },
    stats: {
        deposited: 0,
        yield: 0,
        peopleHelped: 0
    }
};

// Console logging
function log(message, type = 'info') {
    const consoleDiv = document.getElementById('console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    // Also log to browser console
    window.console[type === 'error' ? 'error' : 'log'](message);
}

// Wait for Freighter to be available
async function waitForFreighter(maxAttempts = 20, interval = 500) {
    log('Waiting for Freighter to load...');
    
    for (let i = 0; i < maxAttempts; i++) {
        // Check if Freighter is available (it injects as window.freighterApi)
        if (typeof window.freighterApi !== 'undefined' && window.freighterApi) {
            log('Freighter API found!', 'success');
            return window.freighterApi;
        }
        
        // Also check for older versions
        if (typeof window.freighter !== 'undefined' && window.freighter) {
            log('Freighter API found (legacy)!', 'success');
            return window.freighter;
        }
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, interval));
        
        if (i % 3 === 0) {
            log(`Still waiting... attempt ${i + 1}/${maxAttempts}`);
        }
    }
    
    log('Freighter not found after ' + maxAttempts + ' attempts', 'error');
    log('Please make sure Freighter extension is installed and enabled', 'error');
    return null;
}

// Connect to Freighter wallet
async function connectWallet() {
    try {
        log('Starting wallet connection...');
        
        // Wait for Freighter API
        const api = await waitForFreighter();
        
        if (!api) {
            throw new Error('Freighter wallet not found. Please install Freighter extension.');
        }
        
        state.freighterApi = api;
        log('Freighter API loaded successfully', 'success');
        
        // Check if already connected
        const isConnected = await api.isConnected();
        log(`Freighter connection status: ${isConnected}`);
        
        // Request connection if not connected
        if (!isConnected) {
            log('Requesting Freighter permission...');
            await api.connect();
        }
        
        // Get public key
        const publicKey = await api.getPublicKey();
        state.publicKey = publicKey;
        state.connected = true;
        
        log(`Wallet connected successfully!`, 'success');
        log(`Public Key: ${publicKey}`, 'success');
        
        // Update UI
        updateUI();
        
        // Load balance
        await loadBalance();
        
    } catch (error) {
        log(`Connection failed: ${error.message}`, 'error');
        alert(`Failed to connect wallet: ${error.message}\n\nPlease make sure:\n1. Freighter extension is installed\n2. You have approved the connection\n3. You are on the correct network`);
    }
}

// Load account balance
async function loadBalance() {
    try {
        if (!state.publicKey) {
            throw new Error('No wallet connected');
        }
        
        log('Loading account balance...');
        
        // Create server connection
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        
        // Load account
        const account = await server.loadAccount(state.publicKey);
        
        log('Account loaded successfully', 'success');
        
        // Parse balances
        account.balances.forEach(balance => {
            if (balance.asset_type === 'native') {
                state.balances.xlm = parseFloat(balance.balance).toFixed(2);
                log(`XLM Balance: ${state.balances.xlm}`, 'success');
            } else if (balance.asset_code === 'USDC') {
                state.balances.usdc = parseFloat(balance.balance).toFixed(2);
                log(`USDC Balance: ${state.balances.usdc}`, 'success');
            }
        });
        
        // Update UI
        updateUI();
        
    } catch (error) {
        log(`Failed to load balance: ${error.message}`, 'error');
        
        // If account doesn't exist, suggest funding it
        if (error.message.includes('Account not found')) {
            log('Account not funded yet. You need to fund your testnet account.', 'error');
            alert('Your account needs to be funded on testnet.\n\nVisit: https://laboratory.stellar.org/#account-creator?network=test\n\nPaste your public key and click "Get test network lumens"');
        }
    }
}

// Refresh balance
async function refreshBalance() {
    await loadBalance();
}

// Update UI
function updateUI() {
    // Update status badge
    const statusBadge = document.getElementById('status-badge');
    if (state.connected) {
        statusBadge.className = 'status-badge connected';
        statusBadge.textContent = 'Connected';
    } else {
        statusBadge.className = 'status-badge disconnected';
        statusBadge.textContent = 'Disconnected';
    }
    
    // Update wallet info
    const walletInfo = document.getElementById('wallet-info');
    if (state.connected) {
        walletInfo.classList.add('active');
        document.getElementById('wallet-address').textContent = 
            state.publicKey.substring(0, 8) + '...' + state.publicKey.substring(state.publicKey.length - 8);
        document.getElementById('xlm-balance').textContent = state.balances.xlm;
        document.getElementById('usdc-balance').textContent = state.balances.usdc;
    } else {
        walletInfo.classList.remove('active');
    }
    
    // Update buttons
    document.getElementById('connect-btn').disabled = state.connected;
    document.getElementById('deposit-btn').disabled = !state.connected;
    document.getElementById('refresh-btn').disabled = !state.connected;
    
    if (state.connected) {
        document.getElementById('connect-btn').textContent = 'Wallet Connected ✓';
    }
    
    // Update stats
    document.getElementById('total-deposited').textContent = '$' + state.stats.deposited.toFixed(2);
    document.getElementById('yield-generated').textContent = '$' + state.stats.yield.toFixed(2);
    document.getElementById('people-helped').textContent = state.stats.peopleHelped;
}

// Show deposit modal
function showDepositModal() {
    document.getElementById('deposit-modal').classList.add('active');
}

// Hide deposit modal
function hideDepositModal() {
    document.getElementById('deposit-modal').classList.remove('active');
    document.getElementById('deposit-amount').value = '';
}

// Process deposit
async function processDeposit() {
    try {
        const amount = document.getElementById('deposit-amount').value;
        
        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        log(`Processing deposit of ${amount} USDC...`);
        
        // Check if user has enough USDC
        if (parseFloat(amount) > parseFloat(state.balances.usdc)) {
            throw new Error(`Insufficient USDC balance. You have ${state.balances.usdc} USDC`);
        }
        
        // USDC asset on testnet (you'll need to use the correct issuer)
        // For demo purposes, using a test USDC issuer
        const usdcAsset = new StellarSdk.Asset(
            'USDC',
            'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5' // Test USDC issuer
        );
        
        // Vault address (replace with your actual vault address)
        const vaultAddress = 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5OLWK';
        
        log('Building transaction...');
        
        // Create server connection
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        
        // Load account
        const account = await server.loadAccount(state.publicKey);
        
        // Build transaction
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET
        })
        .addOperation(StellarSdk.Operation.payment({
            destination: vaultAddress,
            asset: usdcAsset,
            amount: amount
        }))
        .setTimeout(30)
        .build();
        
        log('Transaction built, requesting signature...');
        
        // Sign with Freighter
        const signedXdr = await state.freighterApi.signTransaction(transaction.toXDR(), {
            network: 'TESTNET',
            networkPassphrase: StellarSdk.Networks.TESTNET
        });
        
        log('Transaction signed, submitting...');
        
        // Submit transaction
        const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
            signedXdr,
            StellarSdk.Networks.TESTNET
        );
        
        const result = await server.submitTransaction(transactionToSubmit);
        
        log(`Deposit successful! Hash: ${result.hash}`, 'success');
        alert(`Deposit successful!\n\nTransaction Hash: ${result.hash}\n\nView on StellarExpert: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
        
        // Update stats
        state.stats.deposited += parseFloat(amount);
        state.stats.yield += parseFloat(amount) * 0.05; // Simulated 5% yield
        state.stats.peopleHelped += Math.floor(parseFloat(amount) / 10); // Simulated impact
        
        // Refresh balance
        await loadBalance();
        
        // Hide modal
        hideDepositModal();
        
    } catch (error) {
        log(`Deposit failed: ${error.message}`, 'error');
        alert(`Deposit failed: ${error.message}`);
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    log('AidLoop initialized', 'success');
    log('Checking for Freighter wallet...');
    
    // Check if Freighter is available multiple times
    let checkCount = 0;
    const checkInterval = setInterval(() => {
        checkCount++;
        
        if (window.freighterApi || window.freighter) {
            log('✓ Freighter wallet detected!', 'success');
            log('Click "Connect Freighter Wallet" to connect', 'info');
            clearInterval(checkInterval);
        } else if (checkCount >= 10) {
            log('✗ Freighter wallet not detected', 'error');
            log('Please install Freighter: https://www.freighter.app/', 'error');
            log('After installing, refresh this page', 'info');
            clearInterval(checkInterval);
        }
    }, 500);
});

// Close modal on outside click
document.getElementById('deposit-modal').addEventListener('click', (e) => {
    if (e.target.id === 'deposit-modal') {
        hideDepositModal();
    }
});
