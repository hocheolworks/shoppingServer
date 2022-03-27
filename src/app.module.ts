import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import CustomerInfoEntity from './customer/customer.entity';

/**
 * ENV 설정
 */
 let envFilePath = 'envs/.env.dev';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [CustomerInfoEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CustomerModule
  ],
})
export class AppModule {}