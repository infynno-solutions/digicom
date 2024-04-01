import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { env } from "@/env.mjs";
import { api } from "@/lib/api";

export const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.string(),
  currency: z.string(),
  limitQuantity: z.boolean(),
  quantity: z.string().optional(),
  hideQuantity: z.boolean(),
  hideSales: z.boolean(),
  onPurchaseRedirect: z.boolean(),
  redirectLink: z.string().optional(),
  refundEnabled: z.boolean(),
});

export const useCreateProduct = (): any => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: z.infer<typeof productSchema>) =>
      api.post(`${env.NEXT_PUBLIC_API_URL}/product`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-products"] });
    },
  });
};
