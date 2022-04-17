import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class OrderItemsDto {

    @ApiProperty({
        description: 'order_info 테이블에 해당하는 id', // TODO : 사용할지 말지 정해야함, 사용안하면 삭제할것
        example: 1,
        required: true,
    })
    orderId: number;

    @ApiProperty({
        description: '주문 상품 아이디',
        example: 1,
        required: true,
    })
    productId: number;

    
    @ApiProperty({
        description: '주문 상품의 수량',
        example: 2,
        required: true,
    })
    orderItemEA: number;
    
    @ApiProperty({
        description: '총 주문 금액',
        example: 155000,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    orderItemTotalPrice: number;
}