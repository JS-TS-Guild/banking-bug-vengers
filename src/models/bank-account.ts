import { BankAccountId, BankId } from '@/types/Common';

import { v4 as uuidv4 } from 'uuid';

class BankAccount {
  private id: BankAccountId;
  private bankId: BankId;
  private balance: number;

  private constructor(bankId: BankId, balance: number) {
    this.id = uuidv4();
    this.bankId = bankId;
    this.balance = balance;
  }

  static create(bankId: BankId, balance: number): BankAccount {
    const account = new BankAccount(bankId, balance);
    return account;
  }

  getId(): BankAccountId {
    return this.id;
  }

  getBankId(): BankId {
    return this.bankId;
  }

  getBalance(): number {
    return this.balance;
  }

  setBalance(amount: number): void {
    this.balance = amount;
  }
}

export default BankAccount;
