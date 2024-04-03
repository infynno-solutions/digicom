import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { productSchema } from "./use-create-product";
import { api } from "@/lib/api";

export const useUpdateProduct = (productId?: string): any => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: z.infer<typeof productSchema>) =>
      api.patch(`/product/${productId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-products"] });
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });
};
