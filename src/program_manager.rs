use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, Vec, Map, String, BytesN};

const PROGRAMS: Symbol = Symbol::short("PROGRAMS");
const ACTIVE_PROGRAMS: Symbol = Symbol::short("ACTIVE");
const IMPACT_VAULT: Symbol = Symbol::short("VAULT");

#[derive(Clone)]
#[contracttype]
pub struct Program {
    pub id: u32,
    pub category: String,
    pub total_funding: u128,
    pub remaining_funding: u128,
    pub verifier_set: Vec<Address>,
    pub is_active: bool,
    pub created_at: u64,
}

#[contract]
pub struct ProgramManager;

#[contractimpl]
impl ProgramManager {
    /// Initialize the program manager with impact vault address
    pub fn initialize(env: Env, impact_vault: Address) {
        env.storage().instance().set(&IMPACT_VAULT, &impact_vault);
    }

    /// Create a new aid program
    pub fn create_program(
        env: Env,
        creator: Address,
        category: String,
        total_funding: u128,
        verifier_set: Vec<Address>
    ) -> u32 {
        creator.require_auth();
        
        // Get next program ID
        let program_count = env.storage().instance().get(&PROGRAMS).unwrap_or(0u32);
        let program_id = program_count + 1;
        
        let program = Program {
            id: program_id,
            category: category.clone(),
            total_funding,
            remaining_funding: total_funding,
            verifier_set,
            is_active: true,
            created_at: env.ledger().timestamp(),
        };
        
        // Store program
        env.storage().instance().set(&PROGRAMS, &(program_count + 1));
        env.storage().instance().set(&format!("program_{}", program_id), &program);
        
        // Add to active programs
        let mut active_programs: Vec<u32> = env.storage().instance().get(&ACTIVE_PROGRAMS).unwrap_or(Vec::new(&env));
        active_programs.push_back(program_id);
        env.storage().instance().set(&ACTIVE_PROGRAMS, &active_programs);
        
        program_id
    }

    /// Allocate voucher credits to a beneficiary
    pub fn allocate_voucher(
        env: Env,
        program_id: u32,
        beneficiary: Address,
        amount: u128,
        category: String
    ) {
        // Verify program exists and is active
        let program: Program = env.storage().instance().get(&format!("program_{}", program_id)).unwrap();
        assert!(program.is_active, "Program is not active");
        assert!(program.remaining_funding >= amount, "Insufficient program funding");
        
        // Update program remaining funding
        let updated_program = Program {
            remaining_funding: program.remaining_funding - amount,
            ..program
        };
        env.storage().instance().set(&format!("program_{}", program_id), &updated_program);
        
        // Allocate voucher to beneficiary (this would interface with VoucherManager)
        // For now, we'll emit an event
        env.events().publish(("voucher_allocated",), (program_id, beneficiary, amount, category));
    }

    /// Get program details
    pub fn get_program(env: Env, program_id: u32) -> Program {
        env.storage().instance().get(&format!("program_{}", program_id)).unwrap()
    }

    /// Get all active programs
    pub fn get_active_programs(env: Env) -> Vec<u32> {
        env.storage().instance().get(&ACTIVE_PROGRAMS).unwrap_or(Vec::new(&env))
    }

    /// Deactivate a program
    pub fn deactivate_program(env: Env, program_id: u32) {
        let mut program: Program = env.storage().instance().get(&format!("program_{}", program_id)).unwrap();
        program.is_active = false;
        env.storage().instance().set(&format!("program_{}", program_id), &program);
        
        // Remove from active programs
        let mut active_programs: Vec<u32> = env.storage().instance().get(&ACTIVE_PROGRAMS).unwrap_or(Vec::new(&env));
        let mut new_active = Vec::new(&env);
        for id in active_programs.iter() {
            if *id != program_id {
                new_active.push_back(*id);
            }
        }
        env.storage().instance().set(&ACTIVE_PROGRAMS, &new_active);
    }

    /// Get total programs created
    pub fn get_program_count(env: Env) -> u32 {
        env.storage().instance().get(&PROGRAMS).unwrap_or(0u32)
    }
}

