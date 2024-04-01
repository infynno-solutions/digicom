import { Transform } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUrl,
  MinLength,
  ValidateIf,
} from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsIn([
    "AFN",
    "ALL",
    "DZD",
    "AOA",
    "ARS",
    "AMD",
    "AWG",
    "AUD",
    "AZN",
    "BSD",
    "BDT",
    "BBD",
    "BZD",
    "BMD",
    "BOB",
    "BAM",
    "BWP",
    "BRL",
    "GBP",
    "BND",
    "BGN",
    "BIF",
    "KHR",
    "CAD",
    "CVE",
    "KYD",
    "XAF",
    "XPF",
    "CLP",
    "CNY",
    "COP",
    "KMF",
    "CDF",
    "CRC",
    "HRK",
    "CZK",
    "DKK",
    "DJF",
    "DOP",
    "XCD",
    "EGP",
    "ETB",
    "EUR",
    "FKP",
    "FJD",
    "GMD",
    "GEL",
    "GIP",
    "GTQ",
    "GNF",
    "GYD",
    "HTG",
    "HNL",
    "HKD",
    "HUF",
    "ISK",
    "INR",
    "IDR",
    "ILS",
    "JMD",
    "JPY",
    "KZT",
    "KES",
    "KGS",
    "LAK",
    "LBP",
    "LSL",
    "LRD",
    "MOP",
    "MKD",
    "MGA",
    "MWK",
    "MYR",
    "MVR",
    "MRO",
    "MUR",
    "MXN",
    "MDL",
    "MNT",
    "MAD",
    "MZN",
    "MMK",
    "NAD",
    "NPR",
    "ANG",
    "TWD",
    "NZD",
    "NIO",
    "NGN",
    "NOK",
    "PKR",
    "PAB",
    "PGK",
    "PYG",
    "PEN",
    "PHP",
    "PLN",
    "QAR",
    "RON",
    "RUB",
    "RWF",
    "STD",
    "SHP",
    "SVC",
    "WST",
    "SAR",
    "RSD",
    "SCR",
    "SLL",
    "SGD",
    "SBD",
    "SOS",
    "ZAR",
    "KRW",
    "LKR",
    "SRD",
    "SZL",
    "SEK",
    "CHF",
    "TJS",
    "TZS",
    "THB",
    "TOP",
    "TTD",
    "TRY",
    "UGX",
    "UAH",
    "AED",
    "USD",
    "UYU",
    "UZS",
    "VUV",
    "VND",
    "XOF",
    "YER",
    "ZMW",
  ])
  currency: string;

  @IsNotEmpty()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  @IsPositive()
  price: number;

  descripton: string;

  limitQuantity: boolean;

  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsPositive()
  @ValidateIf((obj) => obj.limitQuantity === true)
  quantity: number;

  refundEnabled: boolean;

  hideQuantity: boolean;

  hideSales: boolean;

  refundPolicy: string;

  onPurchaseRedirect: boolean;

  @ValidateIf((obj) => obj.onPurchaseRedirect === true)
  @IsNotEmpty()
  @IsUrl()
  redirectLink: string;
}
