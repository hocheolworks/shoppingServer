import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches } from "class-validator";

export class UpdateAccountInfoDto {
    @ApiProperty({
      description: '유저 고유 id',
      example: 1,
      required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    id: number;
    
    @ApiProperty({
      description: '유저의 이메일',
      example: 'hocheolworks@hyeongwookbabo.com',
      required: true,
    })
    @IsNotEmpty({ message: '이메일을 올바른 형식으로 입력해주세요' })
    @Length(10, 100, { message: '이메일을 올바른 형식으로 입력해주세요' })
    @IsEmail({ message: '이메일을 올바른 형식으로 입력해주세요' })
    customerEmail: string;

    @ApiProperty({
      description: '고객명',
      example: '호철웍',
      required: true,
    })
    @Length(2, 20)
    @IsNotEmpty({ message: '이름을 확인해주세요' })
    @Matches(/^[가-힣]+$/, { message: '이름을 올바르게 입력해주세요' })
    customerName: string;

    @ApiProperty({
      description: '고객 전화번호',
      example: '010-2041-7503',
      required: true,
    })
    @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
    @IsString({ message: '휴대폰 번호를 올바른 형식으로 입력해주세요.' })
    @Length(10, 30, { message: '휴대폰 번호를 올바른 형식으로 입력해주세요.' })
    customerPhoneNumber: string;

    @ApiProperty({
    description: '고객 우편번호',
    example: '12346',
    required: false,
    })
    @IsNotEmpty({ message: '우편번호를 입력해주세요.' })
    @IsString({ message: '우편번호를 올바른 형식으로 입력해주세요.' })
    customerPostIndex: string;


    @ApiProperty({
    description: '고객 주소',
    example: '서울 중구 필동',
    required: false,
    })
    @IsNotEmpty({ message: '주소를 입력해주세요.' })
    @IsString({ message: '주소를 올바른 형식으로 입력해주세요.' })
    customerAddress: string;

    @ApiProperty({
    description: '고객 상세 주소',
    example: '필동반점 덴뿌라',
    required: false,
    })
    @IsNotEmpty({ message: '상세주소를 입력해주세요.' })
    @IsString({ message: '상세주소를 올바른 형식으로 입력해주세요.' })
    customerAddressDetail: string;
}