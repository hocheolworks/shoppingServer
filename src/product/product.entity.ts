/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column } from 'typeorm';

@Entity()
class ProductInfoEntity extends CoreEntity {
  @Column()
  productName: string;

  @Column()
  productDescription: string;

  @Column()
  productPrice: number; // 단위 : 원
}

export default ProductInfoEntity;
