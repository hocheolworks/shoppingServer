// import { SendEmailDto } from './dtos/send-email.dto';
// import { EmailService } from './email.service';
// import { Controller, HttpCode, Post, Body } from '@nestjs/common';

// @Controller('email')
// export class EmailController {
//   constructor(private readonly emailService: EmailService) {}

//   @Post()
//   @HttpCode(204)
//   async sendEmail(
//     @Body() sendEmailDto: SendEmailDto,
//     signupVerifyToken: string,
//   ) {
//     await this.emailService.verifyEmail(sendEmailDto, signupVerifyToken);
//   }
// }
