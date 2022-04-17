/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import ProductInfoEntity from '../../product/entities/product.entity';

@Entity({ name: 'cartItem_info' })
class CartItemInfoEntity extends CoreEntity {
  @ManyToOne(() => CustomerInfoEntity, (customer) => customer.cartItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  customer: CustomerInfoEntity;

  @ManyToOne(() => ProductInfoEntity, (product) => product.cartItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  product: ProductInfoEntity;

  @Column({ type: 'int' })
  productCount: number;
}

export default CartItemInfoEntity;
