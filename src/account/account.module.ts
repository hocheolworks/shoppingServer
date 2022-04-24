import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategey';
import { CustomerModule } from 'src/customer/customer.module';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInfoEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1y' },
    }),

    forwardRef(() => CustomerModule),
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy]
})
export class AccountModule {}
