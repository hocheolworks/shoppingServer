/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import OrderInfoEntity from 'src/order/entities/order.entity';
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'customer_info' })
class CustomerInfoEntity extends CoreEntity {
  @Column()
  customerEmail: string;

  @Column()
  customerName: string;

  @Column()
  customerPassword: string;

  @Column()
  customerPhoneNumber: string;

  @Column({ nullable: true })
  token: string;

  @Column({ default: 'USER' })
  userRole: string;

  @OneToMany(() => OrderInfoEntity, (order) => order.customer)
  orders: OrderInfoEntity[];
}

export default CustomerInfoEntity;
