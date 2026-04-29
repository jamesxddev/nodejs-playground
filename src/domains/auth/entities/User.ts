export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    firstName: string,
    middleName: string | undefined,
    lastName: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
