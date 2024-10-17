use anchor_lang::prelude::*;

declare_id!("27sEXEvZhXmZu9HDTuQDrQp8tGxaCbG9m5nrYBUw2bkc");

#[program]
pub mod solana_escrow {
    use super::*;

    // Initialize the escrow account with a certain amount
    pub fn initialize_escrow(ctx: Context<InitializeEscrow>, amount: u64) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;
        escrow_account.amount = amount;
        escrow_account.is_initialized = true;
        escrow_account.depositor = *ctx.accounts.depositor.key;
        Ok(())
    }

    // Deposit function to lock funds in escrow
    pub fn deposit(ctx: Context<Deposit>) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;
        let deposit_amount = escrow_account.amount;

        // Transfer funds from depositor to escrow
        **ctx.accounts.depositor.to_account_info().try_borrow_mut_lamports()? -= deposit_amount;
        **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? += deposit_amount;

        Ok(())
    }

    // Withdraw function to release funds when the conditions are met
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;
        let receiver = &mut ctx.accounts.receiver;

        // Ensure the escrow is initialized and the amount is available
        require!(escrow_account.is_initialized, CustomError::EscrowNotInitialized);
        require!(escrow_account.amount > 0, CustomError::InsufficientFunds);

        // Transfer the escrowed amount to the receiver
        let withdraw_amount = escrow_account.amount;
        **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= withdraw_amount;
        **ctx.accounts.receiver.to_account_info().try_borrow_mut_lamports()? += withdraw_amount;

        // Close the escrow by resetting the account
        escrow_account.is_initialized = false;
        escrow_account.amount = 0;

        Ok(())
    }
}

// Contexts for the escrow functions
#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(init, payer = depositor, space = 8 + 40)]
    pub escrow_account: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub depositor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub receiver: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Data stored in the escrow account
#[account]
pub struct EscrowAccount {
    pub amount: u64,
    pub is_initialized: bool,
    pub depositor: Pubkey,
}

// Custom errors
#[error_code]
pub enum CustomError {
    #[msg("Escrow has not been initialized.")]
    EscrowNotInitialized,
    #[msg("Insufficient funds in the escrow account.")]
    InsufficientFunds,
}
