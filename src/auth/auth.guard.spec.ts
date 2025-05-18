import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let configService: DeepMocked<ConfigService>;
  let authGuard: AuthGuard;

  beforeEach(() => {
    configService = createMock<ConfigService>();
    configService.getOrThrow.mockReturnValue(`SECRET`);
    authGuard = new AuthGuard(configService);
    authGuard.onModuleInit();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it(`doit renvoyer vrai si la cle API est valide`, () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({ headers: { 'x-api-key': 'SECRET' } }),
      }),
    });
    const result = authGuard.canActivate(mockedExecutionContext);
    expect(result).toBe(true);
  });

  it(`doit renvoyer une erreur si la cle API n'est pas donnée`, () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({ headers: { 'x-api-key': '' } }),
      }),
    });
    const result = () => authGuard.canActivate(mockedExecutionContext);
    expect(result).toThrow(UnauthorizedException);
  });

  it(`doit renvoyer une erreur si la cle API n'est pas valide`, () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({ headers: { 'x-api-key': 'INVALID' } }),
      }),
    });
    const result = () => authGuard.canActivate(mockedExecutionContext);
    expect(result).toThrow(UnauthorizedException);
  });
});
