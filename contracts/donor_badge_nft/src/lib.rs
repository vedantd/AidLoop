#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

/// Badge metadata
#[contracttype]
#[derive(Clone, Debug)]
pub struct BadgeMetadata {
    pub name: String,
    pub description: String,
    pub image_url: String,
    pub badge_type: String,
    pub rarity: String,
}

/// Donor Badge NFT Contract
#[contract]
pub struct DonorBadgeNFT;

#[contractimpl]
impl DonorBadgeNFT {
    /// Initialize the NFT contract
    pub fn initialize(env: Env, admin: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);
        env.storage()
            .instance()
            .set(&symbol_short!("next_id"), &1u32);
    }

    /// Mint a new donor badge NFT
    pub fn mint_badge(
        env: Env,
        to: Address,
        badge_name: String,
        badge_description: String,
        badge_type: String,
        rarity: String,
    ) -> u32 {
        // Get next token ID
        let next_id: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("next_id"))
            .unwrap_or(1);

        // Create badge metadata
        let metadata = BadgeMetadata {
            name: badge_name.clone(),
            description: badge_description,
            image_url: String::from_str(&env, "https://ipfs.io/ipfs/badge-image-hash"),
            badge_type,
            rarity,
        };

        // Store the badge
        let badge_key = (symbol_short!("badge"), next_id);
        env.storage().instance().set(&badge_key, &metadata);

        // Store owner
        let owner_key = (symbol_short!("owner"), next_id);
        env.storage().instance().set(&owner_key, &to);

        // Update next ID
        env.storage()
            .instance()
            .set(&symbol_short!("next_id"), &(next_id + 1));

        // Emit mint event
        env.events().publish((symbol_short!("mint"), to), next_id);

        next_id
    }

    /// Get badge metadata
    pub fn get_badge(env: Env, token_id: u32) -> Option<BadgeMetadata> {
        let badge_key = (symbol_short!("badge"), token_id);
        env.storage().instance().get(&badge_key)
    }

    /// Get badge owner
    pub fn get_owner(env: Env, token_id: u32) -> Option<Address> {
        let owner_key = (symbol_short!("owner"), token_id);
        env.storage().instance().get(&owner_key)
    }

    /// Get total supply
    pub fn total_supply(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("next_id"))
            .unwrap_or(1)
            - 1
    }

    /// Get badges by owner
    pub fn get_badges_by_owner(env: Env, owner: Address) -> Vec<u32> {
        let total = Self::total_supply(env.clone());
        let mut badges = Vec::new(&env);

        for i in 1..=total {
            if let Some(badge_owner) = Self::get_owner(env.clone(), i) {
                if badge_owner == owner {
                    badges.push_back(i);
                }
            }
        }

        badges
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mint_badge() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DonorBadgeNFT);
        let client = DonorBadgeNFTClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        // Initialize
        client.initialize(&admin);

        // Mint badge
        let token_id = client.mint_badge(
            &user,
            &String::from_str(&env, "Rising Star"),
            &String::from_str(&env, "A badge for new donors making their first impact"),
            &String::from_str(&env, "achievement"),
            &String::from_str(&env, "common"),
        );

        assert_eq!(token_id, 1);
        assert_eq!(client.total_supply(), 1);
    }
}
