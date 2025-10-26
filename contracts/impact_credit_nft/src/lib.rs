#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

/// Impact Credit NFT Metadata
#[contracttype]
#[derive(Clone, Debug)]
pub struct ImpactCreditNFT {
    pub token_id: u32,
    pub redemption_id: u32, // Links to VoucherManager redemption
    pub beneficiary: Address,
    pub merchant: Address,
    pub program_id: u32,
    pub amount: i128,
    pub timestamp: u64,
    pub proof_hash: String,    // IPFS: proof documents
    pub metadata_uri: String,  // IPFS: NFT metadata JSON
    pub owner: Address,        // Current NFT owner
    pub for_sale: bool,
    pub price: i128,
}

/// ImpactCreditNFT: Proof-of-Impact NFTs for ESG investors
///
/// Each redemption mints an NFT that proves real aid was delivered
/// ESG investors can buy these NFTs, funding more programs
#[contract]
pub struct ImpactCreditNFTContract;

#[contractimpl]
impl ImpactCreditNFTContract {
    /// Initialize with admin and USDC token
    pub fn initialize(env: Env, admin: Address, usdc_token: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);
        env.storage()
            .instance()
            .set(&symbol_short!("usdc_tkn"), &usdc_token);
        env.storage().instance().set(&symbol_short!("nft_cnt"), &0u32);
    }

    /// Mint NFT for a redemption
    /// Called automatically when voucher is redeemed
    pub fn mint_impact_nft(
        env: Env,
        redemption_id: u32,
        beneficiary: Address,
        merchant: Address,
        program_id: u32,
        amount: i128,
        proof_hash: String,
    ) -> u32 {
        // Verify admin (VoucherManager calls this)
        let admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap();
        admin.require_auth();

        // Get next NFT ID
        let nft_count: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("nft_cnt"))
            .unwrap_or(0);
        let token_id = nft_count + 1;

        // Generate metadata URI (would be IPFS in production)
        let metadata_uri = String::from_str(&env, "ipfs://impact-credit/metadata");

        // Create NFT
        let nft = ImpactCreditNFT {
            token_id,
            redemption_id,
            beneficiary: beneficiary.clone(),
            merchant: merchant.clone(),
            program_id,
            amount,
            timestamp: env.ledger().timestamp(),
            proof_hash,
            metadata_uri,
            owner: admin.clone(), // Initially owned by system
            for_sale: true,
            price: amount, // Default price = aid amount
        };

        // Store NFT
        let nft_key = (symbol_short!("nft"), token_id);
        env.storage().instance().set(&nft_key, &nft);

        // Update counter
        env.storage()
            .instance()
            .set(&symbol_short!("nft_cnt"), &token_id);

        // Emit mint event
        env.events().publish(
            (symbol_short!("mint"), token_id, beneficiary, merchant),
            amount,
        );

        token_id
    }

    /// Get NFT details
    pub fn get_nft(env: Env, token_id: u32) -> Option<ImpactCreditNFT> {
        let nft_key = (symbol_short!("nft"), token_id);
        env.storage().instance().get(&nft_key)
    }

    /// Get NFT owner
    pub fn owner_of(env: Env, token_id: u32) -> Option<Address> {
        let nft_key = (symbol_short!("nft"), token_id);
        if let Some(nft) = env.storage().instance().get::<_, ImpactCreditNFT>(&nft_key) {
            Some(nft.owner)
        } else {
            None
        }
    }

    /// Transfer NFT
    pub fn transfer(env: Env, from: Address, to: Address, token_id: u32) {
        // Verify from authorization
        from.require_auth();

        // Get NFT
        let nft_key = (symbol_short!("nft"), token_id);
        let mut nft: ImpactCreditNFT = env
            .storage()
            .instance()
            .get(&nft_key)
            .expect("NFT not found");

        // Check ownership
        if nft.owner != from {
            panic!("Not the owner");
        }

        // Transfer
        nft.owner = to.clone();
        nft.for_sale = false; // Remove from sale
        env.storage().instance().set(&nft_key, &nft);

        // Emit transfer event
        env.events()
            .publish((symbol_short!("transfer"), token_id, from), to);
    }

    /// List NFT for sale
    pub fn list_for_sale(env: Env, owner: Address, token_id: u32, price: i128) {
        owner.require_auth();

        // Get NFT
        let nft_key = (symbol_short!("nft"), token_id);
        let mut nft: ImpactCreditNFT = env
            .storage()
            .instance()
            .get(&nft_key)
            .expect("NFT not found");

        // Check ownership
        if nft.owner != owner {
            panic!("Not the owner");
        }

        // List for sale
        nft.for_sale = true;
        nft.price = price;
        env.storage().instance().set(&nft_key, &nft);

        // Emit listing event
        env.events()
            .publish((symbol_short!("list"), token_id, owner), price);
    }

    /// Buy NFT
    /// ESG investor buys proof-of-impact
    /// Proceeds go back to funding new programs!
    pub fn buy_nft(env: Env, buyer: Address, token_id: u32) {
        buyer.require_auth();

        // Get NFT
        let nft_key = (symbol_short!("nft"), token_id);
        let mut nft: ImpactCreditNFT = env
            .storage()
            .instance()
            .get(&nft_key)
            .expect("NFT not found");

        // Check if for sale
        if !nft.for_sale {
            panic!("NFT not for sale");
        }

        let price = nft.price;
        let seller = nft.owner.clone();

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("usdc_tkn"))
            .unwrap();

        // Transfer USDC from buyer to seller
        let client = soroban_sdk::token::Client::new(&env, &usdc_token);
        client.transfer(&buyer, &seller, &price);

        // Transfer NFT ownership
        nft.owner = buyer.clone();
        nft.for_sale = false;
        env.storage().instance().set(&nft_key, &nft);

        // Emit sale event
        env.events()
            .publish((symbol_short!("sale"), token_id, seller, buyer), price);
    }

    /// Get total NFT count (total impact credits minted!)
    pub fn get_total_supply(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("nft_cnt"))
            .unwrap_or(0)
    }

    /// Get NFTs owned by address
    pub fn get_owned_nfts(env: Env, owner: Address) -> u32 {
        // In production, would maintain an index
        // For now, return 0
        0
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_nft_minting() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ImpactCreditNFTContract);
        let client = ImpactCreditNFTContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let usdc_token = Address::generate(&env);

        // Initialize
        client.initialize(&admin, &usdc_token);

        // Test basic structure
        assert_eq!(client.get_total_supply(), 0);
    }
}

