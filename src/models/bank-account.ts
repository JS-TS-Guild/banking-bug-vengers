import { BankAccountId, BankId } from "@/types/Common";

import GlobalRegistry from "@/services/GlobalRegistry";
import { v4 as uuidv4 } from "uuid";

export default class BankAccount {
  private id: BankAccountId;
  private balance: number;
  private bankId: BankId;

  private constructor(id: BankAccountId, initialBalance: number, bankId: BankId) {
    this.id = id;
    this.balance = initialBalance;
    this.bankId = bankId;
  }

  static create(initialBalance: number, bankId: BankId): BankAccount {
    const account = new this(uuidv4(), initialBalance, bankId);
    GlobalRegistry.registerAccount(account);
    return account;
  }
  getId(): BankAccountId {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getBankId(): BankId {
    return this.bankId;
  }

  setBalance(amount: number): void {
    this.balance = amount;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): void {
    this.balance -= amount;
  }
}
