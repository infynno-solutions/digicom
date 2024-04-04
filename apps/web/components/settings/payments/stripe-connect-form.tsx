"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuLoader } from "react-icons/lu";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  stripeConnectSchema,
  useStripeConnect,
} from "@/hooks/settings/use-stripe-connect";
import { useGetStripe } from "@/hooks/settings/uss-get-stripe";

const StripeConnectForm = () => {
  const { data, isLoading } = useGetStripe();
  const account = data?.data?.account;

  const form = useForm<z.infer<typeof stripeConnectSchema>>({
    resolver: zodResolver(stripeConnectSchema),
    defaultValues: {
      stripePublicKey: account?.stripePublicKey ?? "",
      stripeSecretKey: account?.stripeSecretKey ?? "",
    },
  });

  const { mutate, isPending } = useStripeConnect();
  const { toast } = useToast();

  const handleConnect = async (values: z.infer<typeof stripeConnectSchema>) =>
    mutate(values, {
      onSuccess: (res: any) => {
        toast({ title: res?.data?.message });
      },
      onError: (err: any) => {
        toast({
          title: err?.response?.data?.message || "Something went wrong!!",
          variant: "destructive",
        });
      },
    });

  useEffect(() => {
    if (account) {
      form.setValue("stripePublicKey", account?.stripePublicKey);
      form.setValue("stripeSecretKey", account?.stripeSecretKey);
    }
  }, [account, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Stripe</CardTitle>
        <CardDescription>Get paid out to your Stripe account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          All sales will incur a 10% fee. This feature is available in all
          countries where Stripe operates, except Brazil, India, Indonesia,
          Malaysia, Mexico, Philippines, and Thailand.
        </p>
        {isLoading ? (
          <LuLoader className="h-8 w-8 animate-spin" />
        ) : (
          <Form {...form}>
            <form
              className="mt-4 max-w-xl space-y-4"
              onSubmit={form.handleSubmit(handleConnect)}
            >
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stripe Public Key</FormLabel>
                    <FormControl>
                      <Input required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name="stripePublicKey"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stripe Secret Key</FormLabel>
                    <FormControl>
                      <Input required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name="stripeSecretKey"
              />
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <LuLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Connect</span>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectForm;
