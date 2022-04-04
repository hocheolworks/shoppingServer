/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import ProductInfoEntity from './product.entity';

@Entity({ name: 'review_info' })
class ReviewInfoEntity extends CoreEntity {
  @ManyToOne(() => CustomerInfoEntity, (customer) => customer.reviews, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  customer: CustomerInfoEntity;

  @ManyToOne(() => ProductInfoEntity, (product) => product.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  product: ProductInfoEntity;

  @Column()
  ReviewMessage: string;

  @Column({ type: 'double' })
  ReviewRating: number;
}

export default ReviewInfoEntity;
