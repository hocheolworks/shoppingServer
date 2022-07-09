/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'estimate_items' })
class EstimateItemsEntity extends CoreEntity {

  @Column({ type: 'int', comment: '[FK] 견적 번호' })
  estimateSheetId: number;

  @Column({ type: 'int', comment: '[FK] 고객 고유번호' })
  customerId: number;

  @Column({ type: 'int', comment: '[FK] 상품 번호'})
  productId: number

  @Column({ type: 'int', comment: '견적요청 상품 주문 개수' })
  estimateItemEA: number;

  @Column({ type: 'int', comment: '상품 합계 금액' })
  orderItemTotalPrice: number;

  // TODO 사용안하면 삭제
  @Column({ type: 'boolean', comment: '인쇄 여부', default: false })
  isPrint: boolean;
  
}

export default EstimateItemsEntity;
