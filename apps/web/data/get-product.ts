import axios from "axios";
import { env } from "@/env.mjs";

export const getProductData = async (productId: string) => {
  const res = await axios.get(
    `${env.NEXT_PUBLIC_API_URL}/product/${productId}`,
  );

  return res?.data?.product;
};
