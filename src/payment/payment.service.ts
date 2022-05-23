import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentHistoryDto } from './dto/history.dto';
import PaymentHistoryEntity from './entities/history.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentHistoryEntity)
    private readonly paymentHistoryRepository: Repository<PaymentHistoryEntity>,
  ) {}

  async insertPaymentHistory(paymentHistory: PaymentHistoryDto) {
    await this.paymentHistoryRepository.save({
      ...paymentHistory,
      cancels: JSON.stringify(paymentHistory.cancels),
      card: JSON.stringify(paymentHistory.card),
      virtualAccount: JSON.stringify(paymentHistory.virtualAccount),
      mobilePhone: JSON.stringify(paymentHistory.mobilePhone),
      giftCertificate: JSON.stringify(paymentHistory.giftCertificate),
      transfer: JSON.stringify(paymentHistory.transfer),
      failure: JSON.stringify(paymentHistory.failure),
      cashReceipt: JSON.stringify(paymentHistory.cashReceipt),
      discount: JSON.stringify(paymentHistory.discount),
    });
  }
}
