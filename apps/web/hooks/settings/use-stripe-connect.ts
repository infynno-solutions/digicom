import { QueryClient, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/api";

export const stripeConnectSchema = z.object({
  stripePublicKey: z.string(),
  stripeSecretKey: z.string(),
});

export const useStripeConnect = (): any => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: z.infer<typeof stripeConnectSchema>) =>
      api.post(`/settings/payments/stripe`, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["stripe"] });
    },
  });
};
