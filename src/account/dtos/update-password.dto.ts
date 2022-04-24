import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({
      description: '유저의 이메일',
      example: 'hocheolworks@hyeongwookbabo.com',
      required: true,
    })
    @IsNotEmpty({ message: '이메일을 올바른 형식으로 입력해주세요' })
    @Length(10, 100, { message: '이메일을 올바른 형식으로 입력해주세요' })
    @IsEmail({ message: '이메일을 올바른 형식으로 입력해주세요' })
    email: string;

    @ApiProperty({
      description: '비밀번호',
      example: 'abcd1234',
      required: true,
    })
    @IsNotEmpty({ message: '비밀번호를 확인해주세요' })
    @IsString({ message: '비밀번호를 확인해주세요' })
    @Length(5, 30, { message: '비밀번호를 5자 이상, 30자 미만으로 입력해주세요' })
    password: string;

    @ApiProperty({
      description: '비밀번호2',
      example: 'abcd1234',
      required: true,
    })
    @IsNotEmpty({ message: '비밀번호를 확인해주세요' })
    @IsString({ message: '비밀번호를 확인해주세요' })
    @Length(5, 30, { message: '비밀번호를 5자 이상, 30자 미만으로 입력해주세요' })
    password2: string;
}