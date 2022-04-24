import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './../customer/customer.module';
import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategey';
import { JwtModule } from '@nestjs/jwt';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInfoEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1y' },
    }),
    HttpModule,
    forwardRef(() => CustomerModule),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
