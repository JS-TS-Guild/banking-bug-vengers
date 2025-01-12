import { BankId, UserId } from '@/types/Common';

import Bank from '@/models/bank';
import User from '@/models/user';

class GlobalRegistry {
  private static users: Map<UserId, User> = new Map();
  private static banks: Map<BankId, Bank> = new Map();

  static registerUser(user: User): void {
    this.users.set(user.getId(), user);
  }

  static registerBank(bank: Bank): void {
    this.banks.set(bank.getId(), bank);
  }

  static getUser(userId: UserId): User {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static getBank(bankId: BankId): Bank {
    const bank = this.banks.get(bankId);
    if (!bank) {
      throw new Error('Bank not found');
    }
    return bank;
  }

  static clear(): void {
    this.users.clear();
    this.banks.clear();
  }
}

export default GlobalRegistry;