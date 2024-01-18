import { SetMetadata } from '@nestjs/common';
import { UserScopes } from '../constant/user-scope.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserScopes[]) => SetMetadata(ROLES_KEY, roles);
