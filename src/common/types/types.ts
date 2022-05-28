export type TossPaymentResponse = {
  status: number;
  data: Object;
};

export type VirtualAccountWebhookBody = {
  createdAt: string;
  secret: string;
  orderId: string;
  status: string;
};
