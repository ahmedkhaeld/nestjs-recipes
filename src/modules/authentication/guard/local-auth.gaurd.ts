import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A custom NestJS guard that extends the `AuthGuard` to provide authentication
 * using the local strategy for username and password-based login. It ensures that
 * only authenticated users are allowed to access protected routes.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
