import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name : 'customer_info'})
class CustomerInfoEntity extends CoreEntity{
  @PrimaryGeneratedColumn()
  customerId: string;

  @Column()
  password: string;

  @Column()
  birthday: string;

  @Column()
  balance: number;
}

export default CustomerInfoEntity