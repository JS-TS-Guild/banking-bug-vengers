class BankAccount {
  private static idCounter = 1;
  private id: number;
  private bankId: number;
  private balance: number;

  private constructor(bankId: number, balance: number) {
    this.id = BankAccount.idCounter++;
    this.bankId = bankId;
    this.balance = balance;
  }

  static create(bankId: number, balance: number): BankAccount {
    return new BankAccount(bankId, balance);
  }

  getId(): number {
    return this.id;
  }
}

export default BankAccount;
