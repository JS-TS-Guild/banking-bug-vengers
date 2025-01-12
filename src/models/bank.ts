import { BankAccountId, BankId, UserId } from '@/types/Common';

import BankAccount from './bank-account';
import GlobalRegistry from '@/services/GlobalRegistry';
import { v4 as uuidv4 } from 'uuid';

interface BankOptions {
  isNegativeAllowed?: boolean;
}

class Bank {
  private id: BankId;
  private accounts: Map<BankAccountId, BankAccount>;
  private isNegativeAllowed: boolean;

  private constructor(options: BankOptions = {}) {
    this.id = uuidv4();
    this.accounts = new Map();
    this.isNegativeAllowed = options.isNegativeAllowed || false;
  }

  static create(options: BankOptions = {}): Bank {
    return new Bank(options);
  }

  getId(): BankId {
    return this.id;
  }

  createAccount(initialBalance: number): BankAccount {
    const account = BankAccount.create(this.id, initialBalance);
    this.accounts.set(account.getId(), account);
    return account;
  }

  getAccount(accountId: BankAccountId): BankAccount {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  send(fromUserId: UserId, toUserId: UserId, amount: number, toBankId?: BankId): void {
    const fromUser = GlobalRegistry.getUser(fromUserId);
    const toUser = GlobalRegistry.getUser(toUserId);
    
    // Get sender's accounts in this bank
    const fromAccounts = fromUser.getAccountIds()
      .map(id => this.accounts.get(id))
      .filter(acc => acc && acc.getBankId() === this.id);

    // Find an account with sufficient funds
    const fromAccount = this.isNegativeAllowed ? 
      fromAccounts[0] : 
      fromAccounts.find(acc => acc!.getBalance() >= amount);

    if (!fromAccount) {
      throw new Error('Insufficient funds');
    }

    // Get recipient's account
    let toAccount: BankAccount;
    if (toBankId && toBankId !== this.id) {
      const toBank = GlobalRegistry.getBank(toBankId);
      toAccount = toBank.getAccount(toUser.getAccountIds()[0]);
    } else {
      toAccount = this.getAccount(toUser.getAccountIds()[0]);
    }

    // Perform transfer
    fromAccount.setBalance(fromAccount.getBalance() - amount);
    toAccount.setBalance(toAccount.getBalance() + amount);
  }
}

export default Bank;
