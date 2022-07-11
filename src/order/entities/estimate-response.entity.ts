/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'estimate_response' })
class EstimateResponseEntity extends CoreEntity {
  @Column({ type: 'int', comment: '[FK] 견적 요청 번호' })
  estimateSheetId: number;

  @Column({ type: 'int', comment: '상품 총 가격' })
  totalProductsPrice: number;

  @Column({ type: 'int', comment: '부가세' })
  tax: number;

  @Column({ type: 'int', comment: '인쇄비' })
  printFee: number;

  @Column({ type: 'int', comment: '배송비' })
  deliveryFee: number;

  @Column({ type: 'int', comment: '총 견적' })
  totalPrice: number;

  @Column({ type: 'varchar', length: 512, comment: '판매자의 말' })
  memo: string;
}

export default EstimateResponseEntity;
