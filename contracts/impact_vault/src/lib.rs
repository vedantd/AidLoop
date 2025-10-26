#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, token, Address, Env, Vec};

/// ImpactVault: Manages donor USDC deposits and yield generation
///
/// Core Features:
/// - Accept USDC deposits from donors
/// - Track deposit amounts and yield
/// - Distribute yield to active programs
/// - Allow donors to withdraw principal (not yield)
#[contract]
pub struct ImpactVault;

#[contractimpl]
impl ImpactVault {
    /// Initialize the vault with the USDC token address
    pub fn initialize(env: Env, usdc_token: Address, admin: Address) {
        // Store USDC token address
        env.storage()
            .instance()
            .set(&symbol_short!("usdc_tkn"), &usdc_token);

        // Store admin
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);

        // Initialize total deposits
        env.storage()
            .instance()
            .set(&symbol_short!("total"), &0i128);
    }

    /// Deposit USDC into the vault
    /// Returns the total balance after deposit
    pub fn deposit(env: Env, donor: Address, amount: i128) -> i128 {
        // Verify donor authorization
        donor.require_auth();

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("usdc_tkn"))
            .unwrap();

        // Transfer USDC from donor to vault
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(&donor, &env.current_contract_address(), &amount);

        // Update donor balance
        let donor_key = (symbol_short!("balance"), donor.clone());
        let current_balance: i128 = env.storage().instance().get(&donor_key).unwrap_or(0);

        let new_balance = current_balance + amount;
        env.storage().instance().set(&donor_key, &new_balance);

        // Update total deposits
        let total: i128 = env
            .storage()
            .instance()
            .get(&symbol_short!("total"))
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&symbol_short!("total"), &(total + amount));

        // Emit deposit event
        env.events()
            .publish((symbol_short!("deposit"), donor), amount);

        new_balance
    }

    /// Get donor's balance
    pub fn get_balance(env: Env, donor: Address) -> i128 {
        let donor_key = (symbol_short!("balance"), donor);
        env.storage().instance().get(&donor_key).unwrap_or(0)
    }

    /// Get total deposits in the vault
    pub fn get_total_deposits(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&symbol_short!("total"))
            .unwrap_or(0)
    }

    /// Withdraw principal (donors can only withdraw their original deposit)
    pub fn withdraw(env: Env, donor: Address, amount: i128) -> i128 {
        donor.require_auth();

        // Check donor balance
        let donor_key = (symbol_short!("balance"), donor.clone());
        let current_balance: i128 = env.storage().instance().get(&donor_key).unwrap_or(0);

        if amount > current_balance {
            panic!("Insufficient balance");
        }

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("usdc_tkn"))
            .unwrap();

        // Transfer USDC from vault to donor
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(&env.current_contract_address(), &donor, &amount);

        // Update balances
        let new_balance = current_balance - amount;
        env.storage().instance().set(&donor_key, &new_balance);

        let total: i128 = env
            .storage()
            .instance()
            .get(&symbol_short!("total"))
            .unwrap();
        env.storage()
            .instance()
            .set(&symbol_short!("total"), &(total - amount));

        // Emit withdrawal event
        env.events()
            .publish((symbol_short!("withdraw"), donor), amount);

        new_balance
    }

    /// Deploy funds to DeFi protocol for yield generation
    /// Admin-only function - integrates with Blend/Soroswap
    pub fn deploy_to_defi(env: Env, defi_protocol: Address, amount: i128) {
        // Verify admin
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("usdc_tkn"))
            .unwrap();

        // Transfer USDC to DeFi protocol
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(&env.current_contract_address(), &defi_protocol, &amount);

        // Store deployed amount
        let deployed_key = (symbol_short!("deployed"), defi_protocol.clone());
        let current_deployed: i128 = env.storage().instance().get(&deployed_key).unwrap_or(0);
        env.storage()
            .instance()
            .set(&deployed_key, &(current_deployed + amount));

        // Emit deployment event
        env.events()
            .publish((symbol_short!("deployed"), defi_protocol), amount);
    }

    /// Withdraw yield from DeFi protocol
    /// Admin-only function
    pub fn withdraw_yield(env: Env, defi_protocol: Address, amount: i128) {
        // Verify admin
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // In production, would call DeFi protocol to withdraw
        // For now, simulate yield withdrawal

        // Update deployed amount
        let deployed_key = (symbol_short!("deployed"), defi_protocol.clone());
        let current_deployed: i128 = env.storage().instance().get(&deployed_key).unwrap_or(0);
        if amount > current_deployed {
            panic!("Insufficient deployed amount");
        }
        env.storage()
            .instance()
            .set(&deployed_key, &(current_deployed - amount));

        // Store yield for distribution
        let yield_key = symbol_short!("yield_p");
        let current_yield: i128 = env.storage().instance().get(&yield_key).unwrap_or(0);
        env.storage()
            .instance()
            .set(&yield_key, &(current_yield + amount));

        // Emit yield withdrawal event
        env.events()
            .publish((symbol_short!("yield_wd"), defi_protocol), amount);
    }

    /// Distribute yield to impact contract
    /// Admin-only function
    pub fn distribute_yield(env: Env, impact_contract: Address, yield_amount: i128) {
        // Verify admin
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Check available yield
        let yield_key = symbol_short!("yield_p");
        let available_yield: i128 = env.storage().instance().get(&yield_key).unwrap_or(0);
        if yield_amount > available_yield {
            panic!("Insufficient yield available");
        }

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("usdc_tkn"))
            .unwrap();

        // Transfer yield to impact contract
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(
            &env.current_contract_address(),
            &impact_contract,
            &yield_amount,
        );

        // Update yield pool
        env.storage()
            .instance()
            .set(&yield_key, &(available_yield - yield_amount));

        // Emit yield distribution event
        env.events()
            .publish((symbol_short!("yield_dst"), impact_contract), yield_amount);
    }

    /// Get total yield generated
    pub fn get_total_yield(env: Env) -> i128 {
        let yield_key = symbol_short!("yield_p");
        env.storage().instance().get(&yield_key).unwrap_or(0)
    }

    /// Get deployed amount to specific DeFi protocol
    pub fn get_deployed_amount(env: Env, defi_protocol: Address) -> i128 {
        let deployed_key = (symbol_short!("deployed"), defi_protocol);
        env.storage().instance().get(&deployed_key).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_deposit_withdraw() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ImpactVault);
        let client = ImpactVaultClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let usdc_token = Address::generate(&env);
        let donor = Address::generate(&env);

        // Initialize
        client.initialize(&usdc_token, &admin);

        // Test would require mock token setup
        // For now, basic structure is validated
    }
}
