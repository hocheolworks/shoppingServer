/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import OrderItemInfoEntity from './orderItem.entity';

@Entity({ name: 'order_info' })
class OrderInfoEntity extends CoreEntity {
  @Column({ type: 'varchar', length: 16, comment: '주문자 성명' })
  orderCustomerName: string;

  @Column({ type: 'varchar', length: 128, comment: '이메일' })
  orderEmail: string;

  @Column({ type: 'varchar', length: 32, comment: '연락처' })
  orderPhoneNumber: string;

  @Column({ type: 'int', comment: '우편 번호' })
  orderPostIndex: number;

  @Column({ type: 'varchar', length: 256, comment: '배송 주소' })
  orderAddress: string;

  @Column({ type: 'varchar', length: 256, comment: '상세 주소' })
  orderAddressDetail: string;

  @Column({ type: 'int', comment: '주문 총 가격' })
  orderTotalPrice: number;

  @Column()
  customerId: number;

  @ManyToOne(() => CustomerInfoEntity, (customer) => customer.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  customer: CustomerInfoEntity;

  @OneToMany(() => OrderItemInfoEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemInfoEntity[];
}

export default OrderInfoEntity;
