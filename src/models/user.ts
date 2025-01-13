import { BankAccountId, UserId } from "../types/Common";

import GlobalRegistry from "../services/GlobalRegistry";
import { v4 as uuidv4 } from "uuid";

export default class User {
  private id: UserId;
  private name: string;
  private accountIds: BankAccountId[];

  private constructor(id: UserId, name: string, accountIds: BankAccountId[]) {
    this.id = id;
    this.name = name;
    this.accountIds = accountIds;
  }

  static create(name: string, accountIds: BankAccountId[]): User {
    const user = new this(uuidv4(), name, accountIds);
    GlobalRegistry.registerUser(user);
    return user;
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getAccountIds(): BankAccountId[] {
    return this.accountIds;
  }
}
