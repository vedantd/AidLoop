pub mod impact_credit_nft;
pub mod impact_vault;
pub mod merchant_registry;
pub mod program_manager;
pub mod voucher_manager;

#[cfg(test)]
mod test;

// Re-export the main contracts for easy access
pub use impact_credit_nft::ImpactCreditNFT;
pub use impact_vault::ImpactVault;
pub use merchant_registry::MerchantRegistry;
pub use program_manager::ProgramManager;
pub use voucher_manager::VoucherManager;
