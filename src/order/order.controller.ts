import OrderItemInfoEntity from 'src/order/entities/orderItem.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { InsertOrderInfoDto, SelectOrderInfoDto } from './dtos/order-info.dto';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { VirtualAccountWebhookBody } from 'src/common/types/types';
import * as path from 'path';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { TaxBillInfoDto } from './dtos/tax-bill-info.dto';
import { SelectEstimateItemsDto, SheetRequestDto } from './dtos/sheet-request.dto';
import { InputCartItemInfoDto } from 'src/customer/dtos/cartItem-info.dto';
import EstimateSheetEntity from './entities/estimate-sheet.entity';
import EstimateItemsEntity from './entities/estimate-items';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/all')
  async getOrderList() {
    return await this.orderService.getOrderList();
  }

  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: multerS3({
        s3: s3,
        bucket: 'iljo-product',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const extension = path.extname(file.originalname);
          cb(
            null,
            'design_' +
              file.originalname.replace(extension, '') +
              '_' +
              Date.now().toString() +
              extension,
          );
        },
      }),
    }),
  )
  @Post('/design')
  saveDesignFile(@UploadedFiles() files: Array<any>): Array<string> {
    if (files && files.length > 0) {
      return files.map((val) => val.location);
    } else {
      return [];
    }
  }

  @Get('/design/:oid')
  async getDesignFilepathsByOrderId(
    @Param('oid') oid: number,
  ): Promise<Array<string>> {
    return await this.orderService.getDesignFilepathsByOrderId(oid);
  }

  @Post('/payment')
  async paymentRequest(
    @Body()
    query: {
      paymentKey: string;
      orderId: string;
      amount: number;
      insertOrder: Partial<InsertOrderInfoDto>;
    },
  ): Promise<any> {
    return await this.orderService.paymentRequest(
      query.paymentKey,
      query.orderId,
      query.amount,
      query.insertOrder,
    );
  }

  @Get('item-list/:orderId')
  async getOrderItemInfo(
    @Param('orderId') orderId: number,
  ): Promise<OrderItemInfoEntity[]> {
    return await this.orderService.getOrderItemInfo(orderId);
  }

  @Post('/is-purchase')
  async checkPurchase(
    @Body('productId') productId: any,
    @Body('customerId') customerId: any,
  ): Promise<Boolean> {
    return this.orderService.checkCustomerOrderItem(productId, customerId);
  }

  @Get('/customer/:customerId')
  async getOrdersByCustomerId(
    @Param('customerId') customerId,
  ): Promise<SelectOrderInfoDto[]> {
    return await this.orderService.getOrdersByCustomerId(customerId);
  }

  @Get('/:orderId')
  async getOrderByOrderById(
    @Param('orderId') orderId,
  ): Promise<SelectOrderInfoDto> {
    return await this.orderService.getOrderByOrderId(orderId);
  }

  @Post('/payment/webhook/virtual-account')
  async webhookVirtualAccount(@Body() body: VirtualAccountWebhookBody) {
    await this.paymentService.receiveVirtualAccountWebhook(body);
    await this.orderService.updateOrderIsPaid(body.orderId, body.status);
  }

  @Post('/nonMember/orderList')
  async getNonMembersOrder(
    @Body('orderId') orderId,
    @Body('customerName') customerName,
    @Body('customerPhoneNumber') customerPhoneNumber,
  ): Promise<any> {
    console.log(orderId);
    return await this.orderService.searchNonMembersOrders(
      orderId,
      customerName,
      customerPhoneNumber,
    );
  }

  @Post('/taxBillInfo')
  async insertTaxBillInfo(@Body() taxBillInfoDto: Partial<TaxBillInfoDto>) {
    return await this.orderService.insertTaxBillInfo(taxBillInfoDto);
  }

  @Get('/:oid/taxBillInfo/')
  async selectTaxBillInfoByOrderId(@Param('oid') oid: number) {
    return await this.orderService.selectTaxBillInfoByOrderId(oid);
  }

  @Post('/sheetRequest')
  async insertSheetRequest(
    @Body()
    params: {
      sheetRequest: Partial<SheetRequestDto>;
      customerId: number;
      orderItems: Array<InputCartItemInfoDto>;
    },
  ) {
    return await this.orderService.insertEstimateSheetRequest(params);
  }

  @Get('/customer/estimate/:customerId')
  async getEstimatesByCustomerId(
    @Param('customerId') customerId,
  ): Promise<EstimateSheetEntity[]> {
    return await this.orderService.getEstimatesByCustomerId(customerId);
  }

  @Get('/estimate/:sid')
  async selectEstimateInfoBySheetId(
    @Param('sid') sid: number
  ): Promise<EstimateSheetEntity> {
    return await this.orderService.selectEstimateInfoBySheetId(sid);
  }

  @Get('/estimate/items/:sid')
  async selectEstimateItemsBySheetId(
    @Param('sid') sid: number
  ): Promise<Partial<SelectEstimateItemsDto>[]> {
    return await this.orderService.selectEstimateItemsBySheetId(sid);
  }

  @Get('/estimate/design/:sid')
  async getEstimateDesignFilepathsBySheetId(
    @Param('sid') sid: number,
  ): Promise<Array<string>> {
    return await this.orderService.getEstimateDesignFilepathsBySheetId(sid);
  }
}
