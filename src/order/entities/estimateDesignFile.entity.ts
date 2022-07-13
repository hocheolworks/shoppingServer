/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';

import { Entity, Column } from 'typeorm';

@Entity({ name: 'estimate_design_file_info' })
class EstimateDesignFileInfoEntity extends CoreEntity {
  @Column({
    type: 'int',
    comment: 'estimate_info 테이블의 id 참조 (논리적 FK)',
  })
  sId: number;

  @Column({ type: 'varchar', length: 256, comment: '디자인 파일 경로(s3)' })
  designFilePath: string;
}

export default EstimateDesignFileInfoEntity;
