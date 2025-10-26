// Stellar Blockchain Integration for AidLoop
import { Server, Networks, Keypair, TransactionBuilder, Operation, Asset } from '@stellar/stellar-sdk';

export class StellarClient {
    constructor(network = 'testnet') {
        this.network = network;
        this.server = new Server('https://horizon-testnet.stellar.org');
        this.networkPassphrase = Networks.TESTNET;
    }

    // Create a new account for testing
    async createTestAccount() {
        try {
            const keypair = Keypair.random();
            const response = await fetch('https://friendbot.stellar.org', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addr: keypair.publicKey() })
            });
            
            if (response.ok) {
                return {
                    publicKey: keypair.publicKey(),
                    secretKey: keypair.secret(),
                    keypair: keypair
                };
            }
            throw new Error('Failed to create test account');
        } catch (error) {
            console.error('Error creating test account:', error);
            throw error;
        }
    }

    // Get account balance
    async getAccountBalance(publicKey) {
        try {
            const account = await this.server.loadAccount(publicKey);
            const balances = account.balances.map(balance => ({
                asset: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
                balance: balance.balance,
                assetType: balance.asset_type
            }));
            return balances;
        } catch (error) {
            console.error('Error getting account balance:', error);
            return [];
        }
    }

    // Send XLM transaction
    async sendXLM(fromKeypair, toPublicKey, amount) {
        try {
            const account = await this.server.loadAccount(fromKeypair.publicKey());
            
            const transaction = new TransactionBuilder(account, {
                fee: '100',
                networkPassphrase: this.networkPassphrase
            })
            .addOperation(Operation.payment({
                destination: toPublicKey,
                asset: Asset.native(),
                amount: amount.toString()
            }))
            .setTimeout(30)
            .build();

            transaction.sign(fromKeypair);
            const result = await this.server.submitTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Error sending XLM:', error);
            throw error;
        }
    }

    // Create asset (for USDC simulation)
    async createAsset(issuerKeypair, assetCode, amount) {
        try {
            const account = await this.server.loadAccount(issuerKeypair.publicKey());
            
            const transaction = new TransactionBuilder(account, {
                fee: '100',
                networkPassphrase: this.networkPassphrase
            })
            .addOperation(Operation.payment({
                destination: issuerKeypair.publicKey(),
                asset: new Asset(assetCode, issuerKeypair.publicKey()),
                amount: amount.toString()
            }))
            .setTimeout(30)
            .build();

            transaction.sign(issuerKeypair);
            const result = await this.server.submitTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Error creating asset:', error);
            throw error;
        }
    }

    // Send asset transaction
    async sendAsset(fromKeypair, toPublicKey, asset, amount) {
        try {
            const account = await this.server.loadAccount(fromKeypair.publicKey());
            
            const transaction = new TransactionBuilder(account, {
                fee: '100',
                networkPassphrase: this.networkPassphrase
            })
            .addOperation(Operation.payment({
                destination: toPublicKey,
                asset: asset,
                amount: amount.toString()
            }))
            .setTimeout(30)
            .build();

            transaction.sign(fromKeypair);
            const result = await this.server.submitTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Error sending asset:', error);
            throw error;
        }
    }

    // Get transaction history
    async getTransactionHistory(publicKey, limit = 10) {
        try {
            const transactions = await this.server.transactions()
                .forAccount(publicKey)
                .order('desc')
                .limit(limit)
                .call();
            
            return transactions.records;
        } catch (error) {
            console.error('Error getting transaction history:', error);
            return [];
        }
    }
}

