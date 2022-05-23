import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PaymentHistoryEntity from './entities/history.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentHistoryEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}