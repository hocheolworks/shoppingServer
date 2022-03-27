/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column } from 'typeorm';

@Entity()
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
  token: string;

  @Column({ default: 'USER' })
  userRole: string;
}

export default CustomerInfoEntity;
