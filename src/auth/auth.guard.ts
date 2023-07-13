import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skipJwtAuth =
      this.reflector.get<boolean>('skipJwtAuth', context.getClass()) ||
      this.reflector.get<boolean>('skipJwtAuth', context.getHandler());
    if (skipJwtAuth) {
      return true;
    }
    return super.canActivate(context);
  }
}
