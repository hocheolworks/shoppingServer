import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import AccountInfoEntity from './entities/account.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([AccountInfoEntity])],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
