use soroban_sdk::{contract, contractimpl, token, Address, Env, Map, Symbol, Vec, U256};

const VAULT_BALANCE: Symbol = Symbol::short("VAULT_BAL");
const YIELD_ACCUMULATED: Symbol = Symbol::short("YIELD_ACC");
const PROGRAM_MANAGER: Symbol = Symbol::short("PROG_MGR");

#[contract]
pub struct ImpactVault;

#[contractimpl]
impl ImpactVault {
    /// Initialize the vault with the program manager address
    pub fn initialize(env: Env, program_manager: Address) {
        env.storage()
            .instance()
            .set(&PROGRAM_MANAGER, &program_manager);
        env.storage().instance().set(&VAULT_BALANCE, &0u128);
        env.storage().instance().set(&YIELD_ACCUMULATED, &0u128);
    }

    /// Deposit USDC into the vault
    pub fn deposit(env: Env, from: Address, amount: u128) {
        from.require_auth();

        // Transfer USDC from donor to vault
        let client = token::Client::new(&env, &env.current_contract_address());
        client.transfer(&from, &env.current_contract_address(), &amount);

        // Update vault balance
        let current_balance = env
            .storage()
            .instance()
            .get(&VAULT_BALANCE)
            .unwrap_or(0u128);
        env.storage()
            .instance()
            .set(&VAULT_BALANCE, &(current_balance + amount));
    }

    /// Withdraw USDC from the vault (only for program manager)
    pub fn withdraw(env: Env, to: Address, amount: u128) {
        let program_manager: Address = env.storage().instance().get(&PROGRAM_MANAGER).unwrap();
        program_manager.require_auth();

        let current_balance = env
            .storage()
            .instance()
            .get(&VAULT_BALANCE)
            .unwrap_or(0u128);
        assert!(current_balance >= amount, "Insufficient vault balance");

        // Transfer USDC to program manager
        let client = token::Client::new(&env, &env.current_contract_address());
        client.transfer(&env.current_contract_address(), &to, &amount);

        // Update vault balance
        env.storage()
            .instance()
            .set(&VAULT_BALANCE, &(current_balance - amount));
    }

    /// Distribute yield to program manager (only yield, not principal)
    pub fn distribute_yield(env: Env, yield_amount: u128) {
        let program_manager: Address = env.storage().instance().get(&PROGRAM_MANAGER).unwrap();

        // Transfer yield to program manager
        let client = token::Client::new(&env, &env.current_contract_address());
        client.transfer(
            &env.current_contract_address(),
            &program_manager,
            &yield_amount,
        );

        // Update yield tracking
        let current_yield = env
            .storage()
            .instance()
            .get(&YIELD_ACCUMULATED)
            .unwrap_or(0u128);
        env.storage()
            .instance()
            .set(&YIELD_ACCUMULATED, &(current_yield + yield_amount));
    }

    /// Get current vault balance
    pub fn get_vault_balance(env: Env) -> u128 {
        env.storage()
            .instance()
            .get(&VAULT_BALANCE)
            .unwrap_or(0u128)
    }

    /// Get total yield distributed
    pub fn get_yield_distributed(env: Env) -> u128 {
        env.storage()
            .instance()
            .get(&YIELD_ACCUMULATED)
            .unwrap_or(0u128)
    }

    /// Get program manager address
    pub fn get_program_manager(env: Env) -> Address {
        env.storage().instance().get(&PROGRAM_MANAGER).unwrap()
    }
}

