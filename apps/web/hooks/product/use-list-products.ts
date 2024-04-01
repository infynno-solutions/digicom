import { useQuery } from "@tanstack/react-query";
import { env } from "@/env.mjs";
import { api } from "@/lib/api";

export const useListProducts = (): any => {
  return useQuery<any>({
    queryKey: ["list-products"],
    queryFn: () => api.get(`${env.NEXT_PUBLIC_API_URL}/product`),
  });
};
