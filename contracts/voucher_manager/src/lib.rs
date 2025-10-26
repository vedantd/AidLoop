#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, String};

/// Voucher status tracking
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VoucherStatus {
    Active,
    Redeemed,
    Expired,
}

/// Redemption record for proof-of-impact
#[contracttype]
#[derive(Clone, Debug)]
pub struct Redemption {
    pub beneficiary: Address,
    pub merchant: Address,
    pub program_id: u32,
    pub amount: i128,
    pub timestamp: u64,
    pub proof_hash: String, // IPFS hash of proof documents
}

/// VoucherManager: Tracks beneficiary vouchers and merchant redemptions
#[contract]
pub struct VoucherManager;

#[contractimpl]
impl VoucherManager {
    /// Initialize with USDC token and admin
    pub fn initialize(env: Env, usdc_token: Address, admin: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("usdc_tkn"), &usdc_token);
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);
        env.storage()
            .instance()
            .set(&symbol_short!("redeem_ct"), &0u32);
    }

    /// Issue voucher to beneficiary
    /// Called by ProgramManager after receiving funds
    pub fn issue_voucher(env: Env, beneficiary: Address, program_id: u32, amount: i128) {
        // Verify admin (ProgramManager calls this)
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Update beneficiary balance for this program
        let voucher_key = (symbol_short!("voucher"), beneficiary.clone(), program_id);
        let current: i128 = env.storage().instance().get(&voucher_key).unwrap_or(0);

        env.storage()
            .instance()
            .set(&voucher_key, &(current + amount));

        // Emit voucher issued event
        env.events().publish(
            (symbol_short!("issue"), beneficiary, program_id),
            amount,
        );
    }

    /// Get beneficiary voucher balance for a program
    pub fn get_voucher_balance(env: Env, beneficiary: Address, program_id: u32) -> i128 {
        let voucher_key = (symbol_short!("voucher"), beneficiary, program_id);
        env.storage().instance().get(&voucher_key).unwrap_or(0)
    }

    /// Redeem voucher at merchant
    /// This is where the magic happens - real aid delivery!
    pub fn redeem_voucher(
        env: Env,
        beneficiary: Address,
        merchant: Address,
        program_id: u32,
        amount: i128,
        proof_hash: String, // IPFS hash: receipt + GPS + timestamp
    ) -> u32 {
        // Verify beneficiary authorization
        beneficiary.require_auth();

        // Check voucher balance
        let voucher_key = (symbol_short!("voucher"), beneficiary.clone(), program_id);
        let current_balance: i128 = env
            .storage()
            .instance()
            .get(&voucher_key)
            .unwrap_or(0);

        if amount > current_balance {
            panic!("Insufficient voucher balance");
        }

        // Verify merchant is registered and verified
        // In production, would call MerchantRegistry contract
        // For now, we'll trust the merchant parameter

        // Update voucher balance
        env.storage()
            .instance()
            .set(&voucher_key, &(current_balance - amount));

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("usdc_tkn"))
            .unwrap();

        // Transfer USDC to merchant
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(&env.current_contract_address(), &merchant, &amount);

        // Create redemption record
        let redemption_count: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("redeem_ct"))
            .unwrap_or(0);
        let redemption_id = redemption_count + 1;

        let redemption = Redemption {
            beneficiary: beneficiary.clone(),
            merchant: merchant.clone(),
            program_id,
            amount,
            timestamp: env.ledger().timestamp(),
            proof_hash: proof_hash.clone(),
        };

        // Store redemption
        let redemption_key = (symbol_short!("redeem"), redemption_id);
        env.storage().instance().set(&redemption_key, &redemption);

        // Update counter
        env.storage()
            .instance()
            .set(&symbol_short!("redeem_ct"), &redemption_id);

        // Emit redemption event - this triggers NFT minting!
        env.events().publish(
            (
                symbol_short!("redeemed"),
                beneficiary,
                merchant,
                program_id,
            ),
            redemption_id,
        );

        redemption_id
    }

    /// Get redemption details
    pub fn get_redemption(env: Env, redemption_id: u32) -> Option<Redemption> {
        let redemption_key = (symbol_short!("redeem"), redemption_id);
        env.storage().instance().get(&redemption_key)
    }

    /// Get total redemption count
    pub fn get_redemption_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("redeem_ct"))
            .unwrap_or(0)
    }

    /// Get beneficiary's total redemptions
    pub fn get_beneficiary_redemptions(env: Env, beneficiary: Address) -> u32 {
        let count_key = (symbol_short!("ben_count"), beneficiary);
        env.storage().instance().get(&count_key).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_voucher_flow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, VoucherManager);
        let client = VoucherManagerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let usdc_token = Address::generate(&env);

        // Initialize
        client.initialize(&usdc_token, &admin);

        // Test basic structure
        assert_eq!(client.get_redemption_count(), 0);
    }
}

