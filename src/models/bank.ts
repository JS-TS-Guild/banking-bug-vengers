import BankAccount from "./bank-account";

class Bank {
  private static idCounter = 1;
  private id: number;
  private accounts: BankAccount[];

  private constructor() {
    this.id = Bank.idCounter++;
    this.accounts = [];
  }

  static create(): Bank {
    return new Bank();
  }

  getId(): number {
    return this.id;
  }

  createAccount(initialBalance: number): BankAccount {
    const account = BankAccount.create(this.id, initialBalance);
    this.accounts.push(account);
    return account;
  }
}

export default Bank;
