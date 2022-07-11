import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { EstimateResponseDto } from './estimate-response.dto';

export class EstimateInfoDto {
  id: number;

  estimateName: string;

  estimateEmail: string;

  estimatePhoneNumber: string;

  estimateBusinessName: string;

  estimateBusinessType: string;

  estimateBusinessNumber: string;

  estimatePostIndex: string;

  estimateAddress: string;

  estimateAddressDetail: string;

  estimatePrintingDraft: string;

  estimateDesiredDate: string;

  estimateRequestMemo: string;

  customerId: number;

  requestStatus: string;

  response?: EstimateResponseDto;
}
