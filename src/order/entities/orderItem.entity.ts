/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import ProductInfoEntity from 'src/product/entities/product.entity';
import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import OrderInfoEntity from './order.entity';

@Entity({ name: 'orderItem_info' })
class OrderItemInfoEntity extends CoreEntity {
  @ManyToOne(() => OrderInfoEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  order: OrderInfoEntity;

  @ManyToOne(() => ProductInfoEntity, (product) => product.orderItems, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true,
  })
  product: ProductInfoEntity;

  @Column({ type: 'int', comment: '상품 주문 개수' })
  orderItemEA: number;

  @Column({ type: 'int', comment: '상품 합계 금액' })
  orderItemTotalPrice: number;
}

export default OrderItemInfoEntity;
