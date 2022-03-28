/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'product_info' })
class ProductInfoEntity extends CoreEntity {
  @Column({ type: 'varchar', length: '128', comment: '상품 명' })
  productName: string;

  @Column({ type: 'varchar', length: '512', comment: '상품 설명' })
  productDescription: string;

  @Column({ type: 'int', comment: '상품 가격' })
  productPrice: number; // 단위 : 원

  @Column({ type: 'int', comment: '최소 수량' })
  productMinimumEA: number;
}

export default ProductInfoEntity;
