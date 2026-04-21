export interface IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class User implements IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;

  constructor(id: string, email: string, password: string, createdAt: Date = new Date()) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  static create(email: string, password: string): User {
    return new User(crypto.randomUUID(), email, password);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}
