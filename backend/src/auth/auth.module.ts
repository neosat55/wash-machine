import { Module } from '@nestjs/common';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';
import { UsersModule } from '../users';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { HasherBcrypt } from '../infrastructure/hasher/hasher';
import { AuthGuard } from '../infrastructure/auth/auth.guard';
import { jwtConstants } from '../infrastructure/auth/constants';
import { RolesGuard } from '../infrastructure/auth/roles.guard';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
    HasherBcrypt,
  ],
  exports: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    })
  ]
})
export class AuthModule {}