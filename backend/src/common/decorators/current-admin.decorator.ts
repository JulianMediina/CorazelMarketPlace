import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedAdmin } from '../../auth/strategies/jwt.strategy';

interface RequestWithAdmin extends Request {
  user: AuthenticatedAdmin;
}

/** Extrae el admin autenticado adjuntado por JwtStrategy (request.user). */
export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin => {
    const request = ctx.switchToHttp().getRequest<RequestWithAdmin>();
    return request.user;
  },
);
