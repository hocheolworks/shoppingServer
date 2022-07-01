/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';

import { Entity, Column } from 'typeorm';

@Entity({ name: 'order_design_file_info' })
class OrderDesignFileInfoEntity extends CoreEntity {
  @Column({
    type: 'int',
    comment: 'order_info 테이블의 id 참조 (논리적 FK)',
  })
  oId: number;

  @Column({ type: 'varchar', length: 256, comment: '디자인 파일 경로(s3)' })
  designFilePath: string;
}

export default OrderDesignFileInfoEntity;
