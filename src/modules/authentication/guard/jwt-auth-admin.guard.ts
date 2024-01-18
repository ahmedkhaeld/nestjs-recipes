import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { TokenTypes } from '../constant/token-type.constant';

/**
 * A custom NestJS guard that extends the `AuthGuard` to provide additional
 * security checks for admin-level endpoints. It ensures that only authenticated
 * users with valid JWT tokens of the 'AdminUser' type are allowed to access
 * protected routes.
 */
@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
  ) {
    super();
  }

  /**
   * Overrides the `canActivate` method from the `AuthGuard` to implement
   * the following logic:
   *
   * 1. Checks if the endpoint is marked as public using the `IS_PUBLIC_KEY` decorator.
   *    If it is, allows access without further checks.
   * 2. Calls the parent `canActivate` method to perform the standard JWT authentication.
   * 3. Retrieves the authenticated user's token type from the request.
   * 4. Verifies if the token type is 'AdminUser'.
   * 5. Returns `true` only if both the parent `canActivate` and the token type check pass.
   *
   * @param context The execution context of the request.
   * @returns A promise that resolves to `true` if access is allowed, or `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this?.reflector?.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const parentCanActivate = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    let isApiAdminJwtToken = false;
    if (user.tokenType && user.tokenType === TokenTypes.AdminUser) {
      isApiAdminJwtToken = true;
    }

    return parentCanActivate && isApiAdminJwtToken;
  }
}
