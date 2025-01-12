class User {
  private name: string;
  private accountIds: number[];

  private constructor(name: string, accountIds: number[]) {
    this.name = name;
    this.accountIds = accountIds;
  }

  static create(name: string, accountIds: number[]): User {
    return new User(name, accountIds);
  }
}

export default User;
