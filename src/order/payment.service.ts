import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VirtualAccountWebhookBody } from 'src/common/types/types';
import { OrderService } from 'src/order/order.service';
import { Repository } from 'typeorm';
import { PaymentHistoryDto } from './dtos/payment-history.dto';
import PaymentHistoryEntity from './entities/payment-history.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentHistoryEntity)
    private readonly paymentHistoryRepository: Repository<PaymentHistoryEntity>, // private readonly orderService: OrderService,
  ) {}

  async insertPaymentHistory(paymentHistory: PaymentHistoryDto) {
    try {
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
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async receiveVirtualAccountWebhook(
    webhookBody: VirtualAccountWebhookBody,
  ): Promise<boolean> {
    try {
      await this.paymentHistoryRepository
        .createQueryBuilder()
        .update(PaymentHistoryEntity)
        .set({ approvedAt: webhookBody.createdAt, status: webhookBody.status })
        .where('orderId = :orderId', { orderId: webhookBody.orderId })
        .andWhere('secret = :secret', { secret: webhookBody.secret })
        .execute();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return true;
  }
}
