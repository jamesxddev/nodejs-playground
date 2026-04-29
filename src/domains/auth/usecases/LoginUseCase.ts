import { injectable } from 'tsyringe';
import { LoginDTO } from '../dtos/LoginDTO';
import { User } from '../entities/User';

@injectable()
export class LoginUseCase {
  async execute(input: LoginDTO): Promise<User> {
    // Stub implementation - returns a mock user
    // Database integration will be added later
    const now = new Date();
    const user = new User('1', input.email, '', 'First', undefined, 'Last', true, now, now);

    return user;
  }
}
