import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class ConnectStripeDto {
  @IsNotEmpty()
  stripePublicKey: string;

  @IsNotEmpty()
  stripeSecretKey: string;

  @IsOptional()
  @IsBoolean()
  useStripeCheckout: boolean;
}
