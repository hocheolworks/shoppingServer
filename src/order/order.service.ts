import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductInfoEntity from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { InsertOrderInfoDto, SelectOrderInfoDto } from './dtos/order-info.dto';
import OrderInfoEntity from './entities/order.entity';
import OrderItemInfoEntity from './entities/orderItem.entity';
import * as http from 'https';
import { CustomerService } from 'src/customer/customer.service';
import { TossPaymentResponse } from 'src/common/types/types';
import { PaymentService } from 'src/order/payment.service';
import { PaymentHistoryDto } from 'src/order/dtos/payment-history.dto';
import * as AWS from 'aws-sdk';
import { getLocation } from 'src/common/functions/functions';
import { TaxBillInfoDto } from './dtos/tax-bill-info.dto';
import TaxBillInfoEntity from './entities/tax-bill-info.entity';
import OrderDesignFileInfoEntity from './entities/orderDesignFile.entity';
import { SheetRequestDto } from './dtos/sheet-request.dto';
import EstimateSheetEntity from './entities/estimate-sheet.entity';
import EstimateOrderEntity from './entities/estimate-order.entity';
import { InputCartItemInfoDto } from 'src/customer/dtos/cartItem-info.dto';
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function TossPaymentRequest(options, data) {
  return new Promise<TossPaymentResponse>((resolve, reject) => {
    const req = http.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const data = JSON.parse(Buffer.concat(chunks).toString());

        resolve({
          status: res.statusCode,
          data: data,
        });
        // 내가 필요한 부분
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.write(JSON.stringify(data));
    req.end();
  });
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderInfoEntity)
    private readonly orderInfoRepository: Repository<OrderInfoEntity>,

    @InjectRepository(OrderItemInfoEntity)
    private readonly orderItemInfoRepository: Repository<OrderItemInfoEntity>,

    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepository: Repository<ProductInfoEntity>,

    @InjectRepository(TaxBillInfoEntity)
    private readonly taxBillInfoInfoRepository: Repository<TaxBillInfoEntity>,

    @InjectRepository(OrderDesignFileInfoEntity)
    private readonly orderDesignFileInfoInfoRepository: Repository<OrderDesignFileInfoEntity>,

    @InjectRepository(EstimateSheetEntity)
    private readonly estimateSheetEntityRepository: Repository<EstimateSheetEntity>,
    
    @InjectRepository(EstimateOrderEntity)
    private readonly estimateOrderEntityRepository: Repository<EstimateOrderEntity>,    

    private readonly customerService: CustomerService,
    private readonly paymentService: PaymentService,
  ) {}

  async getOrdersByCustomerId(
    customerId: number,
  ): Promise<SelectOrderInfoDto[]> {
    return this.orderInfoRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem_info')
      .leftJoinAndSelect('orderItem_info.product', 'product_info')
      .where('order.customer.id = :id', { id: customerId })
      .getMany();
  }

  async getOrderByOrderId(orderId: number): Promise<SelectOrderInfoDto> {
    return this.orderInfoRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem_info')
      .leftJoinAndSelect('orderItem_info.product', 'product_info')
      .where('order.id = :id', { id: orderId })
      .getOne();
  }

  async paymentRequest(
    paymentKey: string,
    tossOrderId: string,
    amount: number,
    insertOrder: Partial<InsertOrderInfoDto>,
  ): Promise<any> {
    const orderIdSplit: string[] = tossOrderId.split('-');
    const customerId: number = parseInt(orderIdSplit[1]);

    const options = {
      method: 'POST',
      hostname: 'api.tosspayments.com',
      port: null,
      path: `/v1/payments/${paymentKey}`,
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.TOSS_SECRET_KEY + ':',
          'utf8',
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    };

    const data = {
      amount: amount,
      orderId: tossOrderId,
    };
    try {
      const response = await TossPaymentRequest(options, data);

      if (response.status === 200) {
        // 결제 성공
        insertOrder.orderId = tossOrderId;
        await this.insertOrder(
          insertOrder,
          (response.data as PaymentHistoryDto).method !== '가상계좌',
        );

        if (!tossOrderId.includes('NM')) {
          await this.customerService.clearCart(customerId);
        }

        await this.paymentService.insertPaymentHistory(
          response.data as PaymentHistoryDto,
        );
      } else {
        // 결제 실패
        // 디자인 파일 삭제
        if (insertOrder.orderDesignFile) {
          const params: AWS.S3.DeleteObjectsRequest = {
            Bucket: 'iljo-product',
            Delete: { Objects: [] },
          };

          insertOrder.orderDesignFile.forEach((val) =>
            params.Delete.Objects.push({ Key: decodeURI(getLocation(val)) }),
          );

          s3.deleteObjects(params, (err, data) => {
            if (err) {
              switch (err.code) {
                case 'ENOENT':
                  console.log('파일이 존재하지 않습니다.');
                  break;
                default:
                  console.log(err);
                  break;
              }
              return;
            } else {
              console.log(data);
            }
            console.log(
              `Successfully remove ${insertOrder.orderDesignFile.length} files`,
            );
          });
        }

        console.log(response.data);
        throw new HttpException(response.data, response.status);
      }

      return response.data;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async insertOrder(
    insertOrderInfoDto: Partial<InsertOrderInfoDto>,
    isPaid: boolean,
  ): Promise<SelectOrderInfoDto> {
    try {
      const newOrderInfo = this.orderInfoRepository.create({
        customerId:
          insertOrderInfoDto.customerId === -1
            ? null
            : insertOrderInfoDto.customerId,
        orderCustomerName: insertOrderInfoDto.orderCustomerName,
        orderPostIndex: insertOrderInfoDto.orderPostIndex,
        orderAddress: insertOrderInfoDto.orderAddress,
        orderAddressDetail: insertOrderInfoDto.orderAddressDetail,
        orderPhoneNumber: insertOrderInfoDto.orderPhoneNumber,
        orderMemo: insertOrderInfoDto.orderMemo,
        orderTotalPrice: insertOrderInfoDto.orderTotalPrice,
        orderTotalProductsPrice: insertOrderInfoDto.orderTotalProductsPrice,
        orderTax: insertOrderInfoDto.orderTax,
        orderPrintFee: insertOrderInfoDto.orderPrintFee,
        orderDeliveryFee: insertOrderInfoDto.orderDeliveryFee,
        orderStatus: isPaid ? '결제완료' : '결제대기',
        orderIsPaid: isPaid,
        orderId: insertOrderInfoDto.orderId,
        isTaxBill: insertOrderInfoDto.isTaxBill,
      });
      const result = await this.orderInfoRepository.save(newOrderInfo);
      const cart = insertOrderInfoDto.cart;

      for (let i = 0; i < insertOrderInfoDto.orderDesignFile.length; i++) {
        const filePath = insertOrderInfoDto.orderDesignFile[i];
        await this.orderDesignFileInfoInfoRepository.save({
          oId: result.id,
          designFilePath: decodeURI(filePath),
        });
      }

      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const product = await this.productInfoRepository.findOne({
          id: cartItem.productId,
        });

        this.orderItemInfoRepository.save({
          orderItemEA: cartItem.productCount,
          orderItemTotalPrice: product.productPrice * cartItem.productCount,
          order: newOrderInfo,
          product: product,
          isPrint: cartItem.isPrint,
        });
      }

      return result;
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async updateOrderIsPaid(orderId: string, status: string): Promise<boolean> {
    try {
      let orderStatus = '결제대기';
      switch (status) {
        case 'DONE':
          orderStatus = '결제완료';
          break;
        case 'CANCELED':
          orderStatus = '주문취소';
          break;
        case 'PARTIAL_CANCELED':
          orderStatus = '입금부분취소';
          break;
      }
      await this.orderInfoRepository
        .createQueryBuilder()
        .update(OrderInfoEntity)
        .set({
          orderIsPaid: status === 'DONE',
          orderStatus: orderStatus,
        })
        .where('orderId = :orderId', { orderId: orderId })
        .execute();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return true;
  }

  async getOrderItemInfo(orderId: number) {
    return this.orderItemInfoRepository.find({ orderId: orderId });
  }

  async getOrderList() {
    return await this.orderInfoRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem_info')
      .leftJoinAndSelect('orderItem_info.product', 'product_info')
      .getMany();
  }

  async checkCustomerOrderItem(
    productId: number,
    customerId: number,
  ): Promise<Boolean> {
    const orderList = await this.orderInfoRepository.find({
      customerId: customerId,
    });
    const product = await this.productInfoRepository.findOne({ id: productId });

    let is_purchased = false;
    for (let i = 0; i < orderList.length; i++) {
      const orderItemCount = await this.orderItemInfoRepository.count({
        product: product,
        orderId: orderList[i].id,
      });
      if (orderItemCount != 0) {
        is_purchased = true;
        break;
      }
    }

    return is_purchased;
  }

  async searchNonMembersOrders(
    orderId: string,
    customerName: string,
    customerPhoneNumber: string,
  ): Promise<any> {
    try {
      const order = await this.orderInfoRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems', 'orderItem_info')
        .leftJoinAndSelect('orderItem_info.product', 'product_info')
        .where('order.orderId = :id', { id: 'order-' + orderId })
        .andWhere('order.orderCustomerName = :customerName', {
          customerName: customerName,
        })
        .andWhere('order.orderPhoneNumber = :customerPhoneNumber', {
          customerPhoneNumber: customerPhoneNumber,
        })
        .getOne();
      return order;
    } catch {
      return -1;
    }
  }

  async insertTaxBillInfo(taxBillInfoDto: Partial<TaxBillInfoDto>) {
    try {
      await this.taxBillInfoInfoRepository.save(taxBillInfoDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async selectTaxBillInfoByOrderId(oid: number) {
    const order = await this.orderInfoRepository.findOne({ id: oid });
    return await this.taxBillInfoInfoRepository.findOne({
      where: {
        orderId: order.orderId,
      },
    });
  }

  async getDesignFilepathsByOrderId(oid: number): Promise<string[]> {
    const designFiles = await this.orderDesignFileInfoInfoRepository.find({
      oId: oid,
    });
    return designFiles.map((val) => val.designFilePath);
  }

  async insertEstimateSheetRequest(
    params: { 
      sheetRequest : Partial<SheetRequestDto>,
      customerId : number,      
      orderItems : Array<InputCartItemInfoDto>,
    }
  ) : Promise<any> {

    let price = 0;

    // TODO : 카트에 담겨있는 물건들 + 개수 어떻게 연결시킬건지 생각
    let item = undefined;
    params.orderItems.map((val) => {
      price += val.productCount * val.productPrice;
    })

    const sheetRequestDto = params.sheetRequest;
    const estimateSheet = await this.estimateSheetEntityRepository.save({
      estimateName : sheetRequestDto.newCustomerName,
      estimateEmail : sheetRequestDto.newCustomerEmail,
      estimatePhoneNumber : sheetRequestDto.newCustomerPhoneNumber,
      estimateBusinessName : sheetRequestDto.businessName,
      estimateBusinessType : sheetRequestDto.businessType,
      estimateBusinessNumber : sheetRequestDto.businessNumber,
      estimatePostIndex : sheetRequestDto.newCustomerPostIndex,
      estimateAddress : sheetRequestDto.newCustomerAddress,
      estimateAddressDetail : sheetRequestDto.newCustomerAddressDetail,
      estimatePrintingDraft : sheetRequestDto.printingDraft,
      estimateDesiredDate : sheetRequestDto.desiredDate,
      estimateRequestMemo : sheetRequestDto.requestMemo,
      
    })

    const estimateOrder = await this.estimateOrderEntityRepository.save({
      sheet:estimateSheet,
      orderTotalPrice : price,
      customerId : params.customerId,
    })

    return 1
  }
}
