import { SendEmailDto } from './dtos/send-email.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import emailConstants from './email.constants';

@Injectable()
export class EmailService {
  /**
   * 단일 대상에게 이메일 전송
   */
  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify().catch((e: Error) => {
      throw new BadRequestException(
        `${emailConstants.errorMessages.INVALID_FROM},${e}`,
      );
    });

    const { to, from, title } = sendEmailDto;
    const body = `<!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            .table {
                border-collapse: collapse;
                width: 600px;
                border-radius: 50px;
                border: 1px solid #dee2e6;
            }
        </style>
    </head>
    <body>
    <table align="center" class="table">
        <tr>
            <td style="background-color: #ffffff; padding: 40px 30px 40px 30px; text-align: center">
                <h3>안녕하세요, ${sendEmailDto.customerName}고객님</h3>
                <p>일조유통에 가입해 주셔서 진심으로 감사합니다.</p>
                <p>아래 링크를 클릭하시면 회원가입이 완료됩니다. </p>
                <a href="https://www.naver.com">회원 가입 완료</a>
            </td>
        </tr>
    </table>
    </body>
    </html>`;

    const params = { to, from, subject: title, html: body };

    transporter.sendMail(params).catch((e: Error) => {
      throw new BadRequestException(e);
    });
  }
}
