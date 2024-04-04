import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetStripe = (): any => {
  return useQuery<any>({
    queryKey: ["stripe"],
    queryFn: () => api.get(`/settings/payments/stripe`),
  });
};
