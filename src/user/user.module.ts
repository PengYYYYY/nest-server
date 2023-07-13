import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from './role/role.module';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [RoleModule],
  exports: [UserService],
})
export class UserModule {}
