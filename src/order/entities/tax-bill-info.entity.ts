/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';

import { Entity, Column } from 'typeorm';

@Entity({ name: 'tax_bill_info' })
class TaxBillInfoEntity extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 128,
    comment: 'order_info 테이블의 orderId 참조',
  })
  orderId: string;

  @Column({ type: 'varchar', length: 16, comment: '대표자 성명' })
  representativeName: string;

  @Column({ type: 'varchar', length: 16, comment: '사업자 등록 번호' })
  companyRegistrationNumber: string;

  @Column({ type: 'varchar', length: 256, comment: '사업장 소재지' })
  companyLocation: string;

  @Column({ type: 'varchar', length: 256, comment: '사업장 소재지 상세주소' })
  companyLocationDetail: string;

  @Column({ type: 'varchar', length: 32, comment: '업태' })
  businessCategory: string;

  @Column({ type: 'varchar', length: 32, comment: '종목' })
  businessType: string;

  @Column({ type: 'varchar', length: 32, comment: '이메일(선택사항)' })
  email: string;
}

export default TaxBillInfoEntity;
