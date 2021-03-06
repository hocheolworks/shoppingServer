/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import OrderInfoEntity from 'src/order/entities/order.entity';
import ReviewInfoEntity from 'src/product/entities/review.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import CartItemInfoEntity from './cartItem.entity';

@Entity({ name: 'customer_info' })
class CustomerInfoEntity extends CoreEntity {
  @Column()
  customerEmail: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerPassword: string;

  @Column({ nullable: true })
  customerPhoneNumber: string;

  @Column({ nullable: true })
  customerPostIndex: string;

  @Column({ nullable: true })
  customerAddress: string;

  @Column({ nullable: true })
  customerAddressDetail: string;

  @Column({ nullable: true })
  signupVerifyToken: string;

  @Column({ default: 'USER' })
  customerRole: string;

  @OneToMany(() => OrderInfoEntity, (order) => order.customer)
  orders: OrderInfoEntity[];

  @OneToMany(() => ReviewInfoEntity, (review) => review.customer)
  reviews: ReviewInfoEntity[];

  @OneToMany(() => CartItemInfoEntity, (cartItem) => cartItem.customer)
  cartItems: CartItemInfoEntity[];
}

export default CustomerInfoEntity;
