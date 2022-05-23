import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PaymentHistoryEntity from './entities/history.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentHistoryEntity)
    private readonly productInfoRepository: Repository<PaymentHistoryEntity>,
  ) {}

  async insertPaymentHistory() {}
}
