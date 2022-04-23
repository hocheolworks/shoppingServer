import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInfoEntity])
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
