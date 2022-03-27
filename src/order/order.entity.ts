/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column } from 'typeorm';

@Entity()
class OrderInfoEntity extends CoreEntity {}

export default OrderInfoEntity;
