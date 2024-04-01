"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LuChevronLeft, LuLoader } from "react-icons/lu";
import { z } from "zod";
import { Button, buttonVariants } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import constants from "@/common/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  productSchema,
  useCreateProduct,
} from "@/hooks/product/use-create-product";
import { cn } from "@/lib/utils";

const ProductForm = () => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      currency: "USD",
      price: "",
      limitQuantity: false,
      quantity: "",
      hideQuantity: false,
      hideSales: false,
      onPurchaseRedirect: false,
      redirectLink: "",
      refundEnabled: false,
    },
  });

  const limitQuantity = form.watch("limitQuantity");
  const onPurchaseRedirect = form.watch("onPurchaseRedirect");

  const { mutate, isPending } = useCreateProduct();
  const { toast } = useToast();
  const router = useRouter();

  const handleCreate = async (values: z.infer<typeof productSchema>) =>
    mutate(values, {
      onSuccess: (res: any) => {
        toast({ title: res.data.message });
        router.push("/dashboard/products");
      },
      onError: (err: any) => {
        toast({ title: err?.response?.data?.message, variant: "destructive" });
      },
    });

  return (
    <Form {...form}>
      <form
        className="mx-auto grid w-full flex-1 auto-rows-max gap-4"
        onSubmit={form.handleSubmit(handleCreate)}
      >
        <div className="flex items-center gap-4">
          <Link
            className={cn(
              buttonVariants({ size: "icon", variant: "outline" }),
              "h-7 w-7",
            )}
            href="/dashboard/products"
          >
            <LuChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            New Product
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link
              className={cn(buttonVariants({ variant: "outline" }))}
              href="/dashboard/products"
            >
              Discard
            </Link>
            <Button disabled={isPending} size="sm" type="submit">
              {isPending ? (
                <LuLoader className="h-5 w-5 animate-spin" />
              ) : (
                <span>Save Product</span>
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  name="title"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  name="description"
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name="price"
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {constants.currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                    control={form.control}
                    name="currency"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 text-base">
                        Limit product sales
                      </FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name="limitQuantity"
                />
                {limitQuantity && (
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum number of purchases</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name="quantity"
                  />
                )}
                <FormField
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 text-base">
                        Hide stock
                      </FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name="hideQuantity"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 text-base">
                        Hide number of sales on your product page
                      </FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name="hideSales"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 text-base">
                        After payment redirection
                      </FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name="onPurchaseRedirect"
                />
                {onPurchaseRedirect && (
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Redirection link</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name="redirectLink"
                  />
                )}
                <FormField
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 text-base">
                        Enable refunds
                      </FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name="refundEnabled"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
