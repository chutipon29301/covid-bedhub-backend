import { SetMetadata } from '@nestjs/common';

export const AllowAnyPermission = SetMetadata('allow-unauthenticated', true);
