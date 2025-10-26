#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, String,
};

/// Mock USDC Token for Testing
/// This is a simple token contract that allows anyone to mint tokens for testing purposes
#[contract]
pub struct MockUSDC;

#[contracttype]
pub enum DataKey {
    Admin,
    Name,
    Symbol,
    Decimals,
}

#[contractimpl]
impl MockUSDC {
    /// Initialize the token
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String, decimals: u32) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
        env.storage().instance().set(&DataKey::Decimals, &decimals);
    }

    /// Mint tokens to any address (for testing only!)
    pub fn mint(env: Env, to: Address, amount: i128) {
        // In a real token, you'd check authorization here
        // For testing, anyone can mint

        // For now, just emit an event to simulate minting
        env.events().publish((symbol_short!("mint"), to), amount);
    }

    /// Get token name
    pub fn name(env: Env) -> String {
        env.storage().instance().get(&DataKey::Name).unwrap()
    }

    /// Get token symbol
    pub fn symbol(env: Env) -> String {
        env.storage().instance().get(&DataKey::Symbol).unwrap()
    }

    /// Get decimals
    pub fn decimals(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::Decimals).unwrap()
    }
}
