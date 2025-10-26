#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String};

/// ImpactContract: Simplified version for deployment
///
/// Core Features:
/// - Receives yield from ImpactVault
/// - Basic proof submission and verification
#[contract]
pub struct ImpactContract;

#[contractimpl]
impl ImpactContract {
    /// Initialize with admin address
    pub fn initialize(env: Env, admin: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);

        // Initialize counters
        env.storage()
            .instance()
            .set(&symbol_short!("proof_cnt"), &0u32);
        env.storage()
            .instance()
            .set(&symbol_short!("yield_bal"), &0i128);
    }

    /// Receive yield from ImpactVault
    pub fn receive_yield(env: Env, from: Address, amount: i128) {
        from.require_auth();

        let current_yield: i128 = env
            .storage()
            .instance()
            .get(&symbol_short!("yield_bal"))
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&symbol_short!("yield_bal"), &(current_yield + amount));

        env.events()
            .publish((symbol_short!("yield_rcv"), from), amount);
    }

    /// Merchant submits proof of service delivery
    pub fn submit_proof(
        env: Env,
        merchant: Address,
        service_type: String,
        amount: i128,
        proof_hash: String,
    ) -> u32 {
        merchant.require_auth();

        let proof_count: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("proof_cnt"))
            .unwrap_or(0);
        let proof_id = proof_count + 1;

        // Store proof data
        env.storage()
            .instance()
            .set(&(symbol_short!("proof"), proof_id), &merchant);
        env.storage()
            .instance()
            .set(&(symbol_short!("amount"), proof_id), &amount);
        env.storage()
            .instance()
            .set(&(symbol_short!("hash"), proof_id), &proof_hash);
        env.storage()
            .instance()
            .set(&(symbol_short!("status"), proof_id), &0u32); // 0 = Pending

        env.storage()
            .instance()
            .set(&symbol_short!("proof_cnt"), &proof_id);

        env.events()
            .publish((symbol_short!("proof_sub"), proof_id, merchant), amount);

        proof_id
    }

    /// Admin verifies a proof
    pub fn verify_proof(env: Env, proof_id: u32) -> u32 {
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Update status to verified
        env.storage()
            .instance()
            .set(&(symbol_short!("status"), proof_id), &1u32); // 1 = Verified

        // Return mock NFT ID
        let nft_id = proof_id;

        env.events()
            .publish((symbol_short!("proof_ver"), proof_id), nft_id);

        nft_id
    }

    /// Get total proofs submitted
    pub fn get_total_proofs(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("proof_cnt"))
            .unwrap_or(0)
    }

    /// Get current yield balance
    pub fn get_yield_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&symbol_short!("yield_bal"))
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ImpactContract);
        let client = ImpactContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        assert_eq!(client.get_total_proofs(), 0);
        assert_eq!(client.get_yield_balance(), 0);
    }
}
