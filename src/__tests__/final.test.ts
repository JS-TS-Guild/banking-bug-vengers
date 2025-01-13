import { BankAccountId, UserId } from "@/types/Common";
import { beforeEach, describe, expect, it } from "vitest";

import Bank from "@/models/bank";
import GlobalRegistry from "@/services/GlobalRegistry";
import User from "@/models/user";

interface TestFixtures {
  alice: User;
  aliceUserId: UserId;
  bob: User;
  bobUserId: UserId;
  bank: Bank;
  bankAllowsNegative: Bank;
  aliceAccountId: BankAccountId;
  aliceAccountAllowsNegativeId: BankAccountId;
  aliceOtherAccount1Id: BankAccountId;
  aliceOtherAccount2Id: BankAccountId;
  bobAccountId: BankAccountId;
  bobOtherAccountId: BankAccountId;
}

export class TestFactory {
  static createFixtures(): TestFixtures {
    GlobalRegistry.clear();

    const bank = Bank.create();
    const bankAllowsNegative = Bank.create({ isNegativeAllowed: true });

    const aliceAccount = bank.createAccount(1000);
    const aliceOtherAccount1 = bank.createAccount(250);
    const aliceOtherAccount2 = bank.createAccount(500);
    const aliceAccountAllowsNegative = bankAllowsNegative.createAccount(200);
    const bobAccount = bank.createAccount(500);
    const bobOtherAccount = bank.createAccount(100);

    const alice = User.create("Alice", [
      aliceAccount.getId(),
      aliceAccountAllowsNegative.getId(),
      aliceOtherAccount1.getId(),
      aliceOtherAccount2.getId(),
    ]); // Intentionally bank1, 2, 1, 1
    const bob = User.create("Bob", [bobAccount.getId()]);

    return {
      alice,
      aliceUserId: alice.getId(),
      bob,
      bobUserId: bob.getId(),
      bank,
      bankAllowsNegative,
      aliceAccountId: aliceAccount.getId(),
      aliceOtherAccount1Id: aliceOtherAccount1.getId(),
      aliceOtherAccount2Id: aliceOtherAccount2.getId(),
      aliceAccountAllowsNegativeId: aliceAccountAllowsNegative.getId(),
      bobAccountId: bobAccount.getId(),
      bobOtherAccountId: bobOtherAccount.getId(),
    };
  }

  static createBank(options?: { isNegativeAllowed?: boolean }): Bank {
    return Bank.create(options);
  }

  static createUser(name: string, accountIds: BankAccountId[]): User {
    return User.create(name, accountIds);
  }
}

describe("Final Tests", () => {
  let fixtures: TestFixtures;

  beforeEach(() => {
    fixtures = TestFactory.createFixtures();
  });

  it("should pass this case", () => {
    const {
      bank,
      aliceUserId,
      bobUserId,
      aliceAccountId,
      aliceOtherAccount1Id,
      aliceOtherAccount2Id,
      bobAccountId,
    } = fixtures;

    // Initial balances
    const aliceAccount = bank.getAccount(aliceAccountId);
    const aliceOtherAccount1 = bank.getAccount(aliceOtherAccount1Id);
    const aliceOtherAccount2 = bank.getAccount(aliceOtherAccount2Id);
    const bobAccount = bank.getAccount(bobAccountId);

    expect(aliceAccount.getBalance()).toBe(1000);
    expect(aliceOtherAccount1.getBalance()).toBe(250);
    expect(aliceOtherAccount2.getBalance()).toBe(500);
    expect(bobAccount.getBalance()).toBe(500);

    // Perform transfer
    bank.send(aliceUserId, bobUserId, 1600);

    // Check final balances
    expect(aliceAccount.getBalance()).toBe(0);
    expect(aliceOtherAccount1.getBalance()).toBe(0);
    expect(aliceOtherAccount2.getBalance()).toBe(150);
    expect(bobAccount.getBalance()).toBe(2100);
  });
});
