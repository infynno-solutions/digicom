import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useDeleteProduct = (): any => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId?: string) => api.delete(`/product/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-products"] });
    },
  });
};
