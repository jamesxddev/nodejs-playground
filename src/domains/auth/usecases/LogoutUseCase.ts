import { injectable } from 'tsyringe';

@injectable()
export class LogoutUseCase {
  async execute(_userId: string): Promise<void> {
    // Stateless JWT logout — token invalidation is handled client-side.
    // The client must discard the token after calling this endpoint.
  }
}
