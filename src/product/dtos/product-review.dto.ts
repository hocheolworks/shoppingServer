export class ProductReviewDto {
    id:number | undefined;
    customerId: number | undefined;
    productId: number;
    author: string;
    message: string;
    rating: number;
}
  