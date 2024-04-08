import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
