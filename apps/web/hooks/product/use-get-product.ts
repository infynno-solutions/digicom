import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetProduct = (productId: string): any => {
  return useQuery<any>({
    queryKey: ["products", productId],
    queryFn: () => api.get(`/product/${productId}`),
  });
};
