import BankAccount from "@/models/bank-account";

export class TransactionService {
  static executeTransfer(
    fromAccounts: BankAccount[],
    toAccount: BankAccount,
    amount: number,
    isNegativeAllowed: boolean,
  ): void {
    let remainingAmount = amount;
    for (const fromAccount of fromAccounts) {
      const availableBalance = fromAccount.getBalance();
      if (availableBalance > 0) {
        const transferAmount = Math.min(availableBalance, remainingAmount);
        fromAccount.withdraw(transferAmount);
        remainingAmount -= transferAmount;

        if (remainingAmount <= 0) {
          break;
        }
      }
    }

    if (remainingAmount > 0) {
      if (isNegativeAllowed) {
        fromAccounts[0].withdraw(remainingAmount);
      } else {
        throw new Error("Insufficient funds");
      }
    }

    toAccount.deposit(amount);
  }
}

export default TransactionService;
