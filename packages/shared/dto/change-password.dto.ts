import { IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
