"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
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

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  price: z.string(),
  currency: z.string(),
  limitQuantity: z.boolean(),
  quantity: z.string(),
  hideQuantity: z.boolean(),
  hideSales: z.boolean(),
  onPurchaseRedirect: z.boolean(),
  redirectLink: z.string().optional(),
  refundEnabled: z.boolean(),
});

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

  const handleCreate = async (values: z.infer<typeof productSchema>) => {
    console.log("🚀 ~ ProductForm ~ values:", values);
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
        onSubmit={form.handleSubmit(handleCreate)}
      >
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
      </form>
    </Form>
  );
};

export default ProductForm;
