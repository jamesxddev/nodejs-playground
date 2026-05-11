import 'reflect-metadata';
import { LogoutUseCase } from '../LogoutUseCase';

describe('LogoutUseCase', () => {
  describe('execute', () => {
    it('should resolve without error for a valid user id', async () => {
      const useCase = new LogoutUseCase();
      await expect(useCase.execute('user-1')).resolves.toBeUndefined();
    });

    it('should resolve without error for any user id', async () => {
      const useCase = new LogoutUseCase();
      await expect(useCase.execute('any-user-id')).resolves.toBeUndefined();
    });
  });
});
