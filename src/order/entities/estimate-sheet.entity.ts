/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import OrderItemInfoEntity from './orderItem.entity';

@Entity({ name: 'estimate_info' })
class EstimateSheetEntity extends CoreEntity {
  @Column({ type: 'varchar', length: 16, comment: '대표자 이름' })
  estimateName: string;

  @Column({ type: 'varchar', length: 32, comment: '이메일' })
  estimateEmail: string;

  @Column({ type: 'varchar', length: 32, comment: '연락처' })
  estimatePhoneNumber: string;

  @Column({ type: 'varchar', length: 32, comment: '업체 상호', nullable: true })
  estimateBusinessName: string;

  @Column({
    type: 'varchar',
    length: 32,
    comment: '업태 및 종목',
    nullable: true,
  })
  estimateBusinessType: string;

  @Column({ type: 'varchar', length: 32, comment: '업체 상호', nullable: true })
  estimateBusinessNumber: string;

  @Column({ type: 'varchar', length: 16, comment: '우편 번호' })
  estimatePostIndex: string;

  @Column({ type: 'varchar', length: 256, comment: '배송 주소' })
  estimateAddress: string;

  @Column({ type: 'varchar', length: 256, comment: '배송 상세 주소' })
  estimateAddressDetail: string;

  @Column({ type: 'varchar', length: 32, comment: '납기 희망일' })
  estimateDesiredDate: string;

  @Column({ type: 'varchar', length: 256, comment: '요청사항', nullable: true })
  estimateRequestMemo: string;

  @Column({ type: 'int', comment: '[FK] 고객 ID' })
  customerId: number;

  @Column({
    type: 'varchar',
    length: 16,
    comment: '진행사항',
    default: '요청중',
  })
  requestStatus: string;
}

export default EstimateSheetEntity;
