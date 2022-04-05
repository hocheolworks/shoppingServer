/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import OrderInfoEntity from 'src/order/entities/order.entity';
import ReviewInfoEntity from 'src/product/entities/review.entity';
import { Entity, Column, OneToMany } from 'typeorm';

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
  signupVerifyToken: string;

  @Column({ default: 'USER' })
  userRole: string;

  @OneToMany(() => OrderInfoEntity, (order) => order.customer)
  orders: OrderInfoEntity[];

  @OneToMany(() => ReviewInfoEntity, (review) => review.customer)
  reviews: ReviewInfoEntity[];
}

export default CustomerInfoEntity;
