import { BankAccountId, BankId, UserId } from "../types/Common";

import BankAccount from "./bank-account";
import GlobalRegistry from "../services/GlobalRegistry";
import TransactionService from "@/services/TransactionService";
import { v4 as uuidv4 } from "uuid";

export default class Bank {
  private id: BankId;
  private accounts: Map<BankAccountId, BankAccount>;
  private isNegativeAllowed: boolean;

  private constructor(id: BankId, isNegativeAllowed: boolean = false) {
    this.id = id;
    this.accounts = new Map();
    this.isNegativeAllowed = isNegativeAllowed;
  }

  static create(options?: { isNegativeAllowed?: boolean }): Bank {
    const bank = new this(uuidv4(), options?.isNegativeAllowed || false);
    GlobalRegistry.registerBank(bank);
    return bank;
  }

  getId(): BankId {
    return this.id;
  }

  getAccount(accountId: BankAccountId): BankAccount {
    const account =
      this.accounts.get(accountId) || GlobalRegistry.getAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }

  createAccount(initialBalance: number): BankAccount {
    const account = BankAccount.create(initialBalance, this.id);
    this.accounts.set(account.getId(), account);
    return account;
  }

  getIsNegativeAllowed(): boolean {
    return this.isNegativeAllowed;
  }

  hasAccount(accountId: string): boolean {
    return this.accounts.has(accountId);
  }

  send(
    fromUserId: UserId,
    toUserId: UserId,
    amount: number,
    toBankId?: BankId,
  ): void {
    const fromUser = GlobalRegistry.getUser(fromUserId);
    const toUser = GlobalRegistry.getUser(toUserId);

    const fromAccounts = fromUser
      .getAccountIds()
      .map((id) => this.accounts.get(id))
      .filter((account) => account !== undefined);

    const totalAvailableBalance = fromAccounts.reduce(
      (sum, acc) => sum + acc.getBalance(),
      0,
    );

    if (!this.isNegativeAllowed && totalAvailableBalance < amount) {
      throw new Error("Insufficient funds");
    }

    let toAccount: BankAccount;
    if (toBankId && toBankId !== this.id) {
      const toBank = GlobalRegistry.getBank(toBankId);
      const toAccountId = toUser
        .getAccountIds()
        .find((id) => toBank.accounts.has(id));
      if (!toAccountId) {
        throw new Error("Recipient account not found in target bank");
      }
      toAccount = toBank.getAccount(toAccountId);
    } else {
      const toAccountId = toUser
        .getAccountIds()
        .find((id) => this.accounts.has(id));
      if (!toAccountId) {
        throw new Error("Recipient account not found");
      }
      toAccount = this.getAccount(toAccountId);
    }

    TransactionService.executeTransfer(
      fromAccounts,
      toAccount,
      amount,
      this.isNegativeAllowed,
    );
  }
}
