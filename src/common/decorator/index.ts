import { SetMetadata } from '@nestjs/common';

export const SkipJwtAuth = () => SetMetadata('skipJwtAuth', true);
