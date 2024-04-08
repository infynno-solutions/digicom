"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { LuLoader } from "react-icons/lu";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { checkoutSchema, useCheckout } from "@/hooks/product/use-checkout";

interface CheckoutFormProps {
  product: any;
  user?: Session["user"];
}

const CheckoutForm = ({ product, user }: CheckoutFormProps) => {
  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      productId: product.id,
      email: user?.email ?? "",
    },
  });

  const { toast } = useToast();
  const { mutate, isPending } = useCheckout();

  const handleCheckout = async (values: z.infer<typeof checkoutSchema>) =>
    mutate(values, {
      onSuccess: (res: any) => {
        if (res?.data?.url) {
          window.location.href = res?.data?.url;
        }
      },
      onError: (err: any) => {
        toast({
          title: err?.response?.data?.message || "Something went wrong!!",
          variant: "destructive",
        });
      },
    });

  return (
    <div className="p-4 md:w-1/3 md:p-6 lg:p-8">
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleCheckout)}
        >
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="email"
          />
          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? (
              <LuLoader className="h-5 w-5 animate-spin" />
            ) : (
              <span>Continue to Pay</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
