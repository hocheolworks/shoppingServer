/* eslint-disable prettier/prettier */
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CoreEntity {
  @ApiProperty({
    description: 'id(pk)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '생성일시',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: '삭제일시',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
