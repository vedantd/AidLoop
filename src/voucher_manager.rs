use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, Vec, Map, String, BytesN};

const VOUCHER_BALANCES: Symbol = Symbol::short("VOUCHER_BAL");
const REDEMPTIONS: Symbol = Symbol::short("REDEMPTIONS");
const MERCHANT_REGISTRY: Symbol = Symbol::short("MERCHANT_REG");

#[derive(Clone)]
#[contracttype]
pub struct VoucherBalance {
    pub beneficiary: Address,
    pub category: String,
    pub amount: u128,
    pub program_id: u32,
}

#[derive(Clone)]
#[contracttype]
pub struct Redemption {
    pub id: u32,
    pub beneficiary: Address,
    pub merchant: Address,
    pub amount: u128,
    pub category: String,
    pub proof_hash: BytesN<32>,
    pub timestamp: u64,
    pub verified: bool,
}

#[contract]
pub struct VoucherManager;

#[contractimpl]
impl VoucherManager {
    /// Initialize voucher manager with merchant registry
    pub fn initialize(env: Env, merchant_registry: Address) {
        env.storage().instance().set(&MERCHANT_REGISTRY, &merchant_registry);
    }

    /// Allocate voucher credits to a beneficiary
    pub fn allocate_voucher(
        env: Env,
        beneficiary: Address,
        category: String,
        amount: u128,
        program_id: u32
    ) {
        // Create or update voucher balance
        let voucher_key = format!("voucher_{}_{}", beneficiary, category);
        let current_balance = env.storage().instance().get(&voucher_key).unwrap_or(0u128);
        env.storage().instance().set(&voucher_key, &(current_balance + amount));
        
        // Store voucher details
        let voucher = VoucherBalance {
            beneficiary: beneficiary.clone(),
            category: category.clone(),
            amount: current_balance + amount,
            program_id,
        };
        env.storage().instance().set(&format!("voucher_details_{}_{}", beneficiary, category), &voucher);
        
        env.events().publish(("voucher_allocated",), (beneficiary, category, amount, program_id));
    }

    /// Redeem voucher at a merchant
    pub fn redeem_voucher(
        env: Env,
        beneficiary: Address,
        merchant: Address,
        amount: u128,
        category: String,
        proof_hash: BytesN<32>
    ) -> u32 {
        beneficiary.require_auth();
        
        // Check beneficiary has sufficient voucher balance
        let voucher_key = format!("voucher_{}_{}", beneficiary, category);
        let current_balance = env.storage().instance().get(&voucher_key).unwrap_or(0u128);
        assert!(current_balance >= amount, "Insufficient voucher balance");
        
        // Verify merchant is registered and verified
        // This would call the merchant registry contract
        // For now, we'll assume merchant is verified
        
        // Create redemption record
        let redemption_count = env.storage().instance().get(&REDEMPTIONS).unwrap_or(0u32);
        let redemption_id = redemption_count + 1;
        
        let redemption = Redemption {
            id: redemption_id,
            beneficiary: beneficiary.clone(),
            merchant: merchant.clone(),
            amount,
            category: category.clone(),
            proof_hash,
            timestamp: env.ledger().timestamp(),
            verified: false, // Will be verified by proof engine
        };
        
        // Store redemption
        env.storage().instance().set(&REDEMPTIONS, &(redemption_count + 1));
        env.storage().instance().set(&format!("redemption_{}", redemption_id), &redemption);
        
        // Update voucher balance
        env.storage().instance().set(&voucher_key, &(current_balance - amount));
        
        // Emit redemption event
        env.events().publish(("voucher_redeemed",), (redemption_id, beneficiary, merchant, amount, category));
        
        redemption_id
    }

    /// Verify redemption with proof
    pub fn verify_redemption(env: Env, redemption_id: u32, verifier: Address) {
        verifier.require_auth();
        
        let mut redemption: Redemption = env.storage().instance().get(&format!("redemption_{}", redemption_id)).unwrap();
        redemption.verified = true;
        env.storage().instance().set(&format!("redemption_{}", redemption_id), &redemption);
        
        env.events().publish(("redemption_verified",), (redemption_id, verifier));
    }

    /// Get beneficiary voucher balance
    pub fn get_voucher_balance(env: Env, beneficiary: Address, category: String) -> u128 {
        let voucher_key = format!("voucher_{}_{}", beneficiary, category);
        env.storage().instance().get(&voucher_key).unwrap_or(0u128)
    }

    /// Get redemption details
    pub fn get_redemption(env: Env, redemption_id: u32) -> Redemption {
        env.storage().instance().get(&format!("redemption_{}", redemption_id)).unwrap()
    }

    /// Get all redemptions for a beneficiary
    pub fn get_beneficiary_redemptions(env: Env, beneficiary: Address) -> Vec<u32> {
        // This would require iterating through all redemptions
        // For simplicity, we'll return empty vec for now
        Vec::new(&env)
    }

    /// Get total redemptions count
    pub fn get_redemption_count(env: Env) -> u32 {
        env.storage().instance().get(&REDEMPTIONS).unwrap_or(0u32)
    }
}

