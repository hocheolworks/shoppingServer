import { PickType } from '@nestjs/swagger';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';

export class LoginRequestDto extends PickType(CustomerInfoEntity, [
  'customerEmail',
  'customerPassword',
]) {}
