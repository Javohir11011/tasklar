import { SetMetadata } from '@nestjs/common';
import { Role } from '../role/role';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
