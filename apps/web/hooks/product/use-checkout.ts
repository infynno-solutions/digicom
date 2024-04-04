import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { env } from "@/env.mjs";

export const checkoutSchema = z.object({
  email: z.string().email(),
  productId: z.string(),
});

export const useCheckout = (): any => {
  return useMutation({
    mutationFn: (data: z.infer<typeof checkoutSchema>) =>
      axios.post(`${env.NEXT_PUBLIC_API_URL}/checkout`, data),
  });
};
