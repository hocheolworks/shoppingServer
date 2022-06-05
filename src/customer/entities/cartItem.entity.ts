/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import ProductInfoEntity from '../../product/entities/product.entity';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'cartItem_info' })
class CartItemInfoEntity {
  @Column({ type: 'int', nullable: false })
  @PrimaryColumn()
  customerId: number;

  @ManyToOne(() => CustomerInfoEntity, (customer) => customer.cartItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  customer: CustomerInfoEntity;

  @Column({ type: 'int', nullable: false })
  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => ProductInfoEntity, (product) => product.cartItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  product: ProductInfoEntity;

  @Column({ type: 'int' })
  productCount: number;

  @ApiProperty({
    description: '생성일시',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: '삭제일시',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}

export default CartItemInfoEntity;
