/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import EstimateSheetEntity from './estimate-sheet.entity';
import OrderItemInfoEntity from './orderItem.entity';

@Entity({ name: 'estimate_order' })
class EstimateOrderEntity extends CoreEntity {

  @ManyToOne(() => EstimateSheetEntity, (sheet) => sheet.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  sheet: EstimateSheetEntity;

  @OneToMany(() => OrderItemInfoEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemInfoEntity[];
  
  @Column({ type: 'int', comment: '주문 총 가격', nullable: true })
  orderTotalPrice: number;

  @Column({ type: 'int', comment: '견적 후 가격', nullable: true })
  estimateTotalPrice: number;

  @Column({
    type: 'varchar',
    length: 32,
    comment: '주문 상태',
    default: '결제대기',
  })
  orderStatus: string;

  @Column({ type: 'boolean', comment: '결제 여부', default: false })
  orderIsPaid: boolean;

  @Column({ type: 'varchar', length: 128, comment: '토스 결제 주문 ID', nullable: true })
  orderId: string;

  @Column({ type: 'int', comment: '[FK] 회원 id', nullable: true })
  customerId: number;

  @Column({ type: 'boolean', comment: '세금계산서 여부', default: false })
  isTaxBill: boolean;
  
  @Column({
    type: 'int',
    comment: '견적요청 확인여부 0:견적 요청 1:진행중, 2:확인완료, 3:거절',
    default: 0
  })
  requestStatus: number;

}

export default EstimateOrderEntity;
