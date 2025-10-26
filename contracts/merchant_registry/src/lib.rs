#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

/// Merchant verification status
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MerchantStatus {
    Pending,
    Verified,
    Suspended,
    Rejected,
}

/// Merchant profile
#[contracttype]
#[derive(Clone, Debug)]
pub struct Merchant {
    pub address: Address,
    pub name: String,
    pub category: String, // Humanitarian service category
    pub status: MerchantStatus,
    pub document_hash: String, // IPFS hash of verification docs
    pub total_redemptions: u32,
    pub total_volume: i128,
}

/// MerchantRegistry: Verifies and manages merchants
#[contract]
pub struct MerchantRegistry;

#[contractimpl]
impl MerchantRegistry {
    /// Initialize with admin
    pub fn initialize(env: Env, admin: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);
        env.storage()
            .instance()
            .set(&symbol_short!("merch_c"), &0u32);
    }

    /// Register a new merchant
    /// Merchant submits their info and verification documents
    pub fn register_merchant(
        env: Env,
        merchant: Address,
        name: String,
        category: String,      // Humanitarian service category
        document_hash: String, // IPFS: business license, tax ID, etc.
    ) {
        // Verify merchant authorization
        merchant.require_auth();

        // Check if merchant already registered
        let merchant_key = (symbol_short!("merchant"), merchant.clone());
        if env.storage().instance().has(&merchant_key) {
            panic!("Merchant already registered");
        }

        // Create merchant profile
        let merchant_profile = Merchant {
            address: merchant.clone(),
            name: name.clone(),
            category: category.clone(),
            status: MerchantStatus::Pending,
            document_hash,
            total_redemptions: 0,
            total_volume: 0,
        };

        // Store merchant
        env.storage()
            .instance()
            .set(&merchant_key, &merchant_profile);

        // Update counter
        let count: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("merch_c"))
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&symbol_short!("merch_c"), &(count + 1));

        // Emit registration event
        env.events()
            .publish((symbol_short!("register"), merchant), name);
    }

    /// Verify a merchant (admin only)
    /// After reviewing documents and doing KYC
    pub fn verify_merchant(env: Env, merchant: Address) {
        // Verify admin
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Get merchant
        let merchant_key = (symbol_short!("merchant"), merchant.clone());
        let mut merchant_profile: Merchant = env
            .storage()
            .instance()
            .get(&merchant_key)
            .expect("Merchant not found");

        // Update status
        merchant_profile.status = MerchantStatus::Verified;
        env.storage()
            .instance()
            .set(&merchant_key, &merchant_profile);

        // Emit verification event
        env.events()
            .publish((symbol_short!("verified"), merchant), ());
    }

    /// Suspend a merchant (admin only)
    pub fn suspend_merchant(env: Env, merchant: Address) {
        // Verify admin
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Get merchant
        let merchant_key = (symbol_short!("merchant"), merchant.clone());
        let mut merchant_profile: Merchant = env
            .storage()
            .instance()
            .get(&merchant_key)
            .expect("Merchant not found");

        // Update status
        merchant_profile.status = MerchantStatus::Suspended;
        env.storage()
            .instance()
            .set(&merchant_key, &merchant_profile);

        // Emit suspension event
        env.events()
            .publish((symbol_short!("suspend"), merchant), ());
    }

    /// Get merchant profile
    pub fn get_merchant(env: Env, merchant: Address) -> Option<Merchant> {
        let merchant_key = (symbol_short!("merchant"), merchant);
        env.storage().instance().get(&merchant_key)
    }

    /// Check if merchant is verified
    pub fn is_verified(env: Env, merchant: Address) -> bool {
        let merchant_key = (symbol_short!("merchant"), merchant);
        if let Some(merchant_profile) = env.storage().instance().get::<_, Merchant>(&merchant_key) {
            merchant_profile.status == MerchantStatus::Verified
        } else {
            false
        }
    }

    /// Update merchant stats after redemption
    /// Called by VoucherManager
    pub fn record_redemption(env: Env, merchant: Address, amount: i128) {
        // This would be called by VoucherManager contract
        let merchant_key = (symbol_short!("merchant"), merchant.clone());
        if let Some(mut merchant_profile) =
            env.storage().instance().get::<_, Merchant>(&merchant_key)
        {
            merchant_profile.total_redemptions += 1;
            merchant_profile.total_volume += amount;
            env.storage()
                .instance()
                .set(&merchant_key, &merchant_profile);
        }
    }

    /// Get total merchant count
    pub fn get_merchant_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("merch_c"))
            .unwrap_or(0)
    }

    /// Get merchants by category
    pub fn get_merchants_by_category(env: Env, category: String) -> Vec<Address> {
        // In production, would maintain a category index
        // For now, return empty vec
        Vec::new(&env)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_merchant_registration() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MerchantRegistry);
        let client = MerchantRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let merchant = Address::generate(&env);

        // Initialize
        client.initialize(&admin);

        // Test registration would require proper auth setup
        assert_eq!(client.get_merchant_count(), 0);
    }
}
