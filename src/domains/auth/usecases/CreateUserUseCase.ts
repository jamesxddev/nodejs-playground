import { injectable } from 'tsyringe';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { User } from '../entities/User';

@injectable()
export class CreateUserUseCase {
  async execute(input: CreateUserDTO): Promise<User> {
    // Stub implementation - creates a new user in memory
    // Database integration will be added later
    const user = User.create(input.email, input.password);

    return user;
  }
}
