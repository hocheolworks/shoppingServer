/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import CartItemInfoEntity from 'src/customer/entities/cartItem.entity';
import OrderItemInfoEntity from 'src/order/entities/orderItem.entity';
import { Entity, Column, OneToMany, getRepository, AfterLoad } from 'typeorm';
import ReviewInfoEntity from './review.entity';

@Entity({ name: 'product_info' })
class ProductInfoEntity extends CoreEntity {
  @Column({ type: 'varchar', length: '128', comment: '상품 명' })
  productName: string;

  @Column({ type: 'text', comment: '상품 설명' })
  productDescription: string;

  @Column({ type: 'int', comment: '상품 가격' })
  productPrice: number; // 단위 : 원

  @Column({ type: 'int', comment: '최소 수량' })
  productMinimumEA: number;

  @Column({ type: 'varchar', length: '512', comment: '상품 이미지 파일경로' })
  productImageFilepath: string;

  @OneToMany(() => ReviewInfoEntity, (review) => review.product)
  reviews: ReviewInfoEntity[];

  @OneToMany(() => OrderItemInfoEntity, (orderItem) => orderItem.product)
  orderItems: OrderItemInfoEntity[];

  @OneToMany(() => CartItemInfoEntity, (cartItem) => cartItem.product)
  cartItems: CartItemInfoEntity[];

  productRating: number;
  productRatingCount: number;

  @AfterLoad()
  calculatedRating = async () => {
    const result = await getRepository(ReviewInfoEntity)
      .createQueryBuilder('review')
      .where('review.productId = :id', { id: this.id })
      .getRawAndEntities();

    const ratingsAboveZero = result?.entities?.filter(
      (x) => x.reviewRating > 0,
    );
    const count = ratingsAboveZero.length;

    if (count > 0) {
      this.productRating =
        ratingsAboveZero.reduce((acc, curr) => {
          return acc + curr.reviewRating;
        }, 0) / count;

      this.productRatingCount = count;
    } else {
      this.productRating = 0;
      this.productRatingCount = 0;
    }
  };
}

export default ProductInfoEntity;
