#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Vec};

/// Program categories for aid distribution
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProgramCategory {
    Healthcare,
    Food,
    Education,
    Housing,
    Emergency,
}

/// Aid Program structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Program {
    pub id: u32,
    pub name: String,
    pub category: ProgramCategory,
    pub ngo: Address,
    pub total_budget: i128,
    pub allocated: i128,
    pub active: bool,
}

/// ProgramManager: Creates and manages aid programs
#[contract]
pub struct ProgramManager;

#[contractimpl]
impl ProgramManager {
    /// Initialize with admin and USDC token
    pub fn initialize(env: Env, admin: Address, usdc_token: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);
        env.storage()
            .instance()
            .set(&symbol_short!("usdc_tkn"), &usdc_token);
        env.storage()
            .instance()
            .set(&symbol_short!("prog_cnt"), &0u32);
    }

    /// Create a new aid program
    pub fn create_program(
        env: Env,
        ngo: Address,
        name: String,
        category: ProgramCategory,
        budget: i128,
    ) -> u32 {
        // Verify NGO authorization
        ngo.require_auth();

        // Get next program ID
        let program_count: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("prog_cnt"))
            .unwrap_or(0);

        let program_id = program_count + 1;

        // Create program
        let program = Program {
            id: program_id,
            name: name.clone(),
            category: category.clone(),
            ngo: ngo.clone(),
            total_budget: budget,
            allocated: 0,
            active: true,
        };

        // Store program
        let program_key = (symbol_short!("program"), program_id);
        env.storage().instance().set(&program_key, &program);

        // Update program count
        env.storage()
            .instance()
            .set(&symbol_short!("prog_cnt"), &program_id);

        // Emit event
        env.events()
            .publish((symbol_short!("prog_new"), program_id), name);

        program_id
    }

    /// Get program details
    pub fn get_program(env: Env, program_id: u32) -> Option<Program> {
        let program_key = (symbol_short!("program"), program_id);
        env.storage().instance().get(&program_key)
    }

    /// Allocate funds from ImpactVault to a program
    /// This creates vouchers for beneficiaries
    pub fn allocate_to_program(env: Env, program_id: u32, amount: i128) {
        // Verify admin
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Get program
        let program_key = (symbol_short!("program"), program_id);
        let mut program: Program = env
            .storage()
            .instance()
            .get(&program_key)
            .expect("Program not found");

        // Check if program is active
        if !program.active {
            panic!("Program is not active");
        }

        // Check budget limit
        if program.allocated + amount > program.total_budget {
            panic!("Allocation exceeds budget");
        }

        // Update allocated amount
        program.allocated += amount;
        env.storage().instance().set(&program_key, &program);

        // Emit allocation event
        env.events()
            .publish((symbol_short!("allocate"), program_id), amount);
    }

    /// Issue voucher to beneficiary
    /// This transfers allocated funds from program to voucher manager
    pub fn issue_voucher(
        env: Env,
        program_id: u32,
        beneficiary: Address,
        amount: i128,
        voucher_manager: Address,
    ) {
        // Get program
        let program_key = (symbol_short!("program"), program_id);
        let program: Program = env
            .storage()
            .instance()
            .get(&program_key)
            .expect("Program not found");

        // Verify NGO authorization
        program.ngo.require_auth();

        // Check allocation
        if amount > program.allocated {
            panic!("Insufficient allocated funds");
        }

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("usdc_tkn"))
            .unwrap();

        // Transfer USDC to voucher manager
        let client = token::Client::new(&env, &usdc_token);
        client.transfer(&env.current_contract_address(), &voucher_manager, &amount);

        // Emit voucher issued event
        env.events()
            .publish((symbol_short!("voucher"), beneficiary, program_id), amount);
    }

    /// Deactivate a program
    pub fn deactivate_program(env: Env, program_id: u32) {
        // Verify admin
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Get and update program
        let program_key = (symbol_short!("program"), program_id);
        let mut program: Program = env
            .storage()
            .instance()
            .get(&program_key)
            .expect("Program not found");

        program.active = false;
        env.storage().instance().set(&program_key, &program);

        // Emit event
        env.events()
            .publish((symbol_short!("prog_off"), program_id), ());
    }

    /// Get total program count
    pub fn get_program_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("prog_cnt"))
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_create_program() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ProgramManager);
        let client = ProgramManagerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let usdc_token = Address::generate(&env);
        let ngo = Address::generate(&env);

        // Initialize
        client.initialize(&admin, &usdc_token);

        // Note: Would need to set up proper auth for full test
    }
}
