"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuLoader } from "react-icons/lu";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    await signIn("credentials", { ...values, redirect: false }).then((res) => {
      setIsLoading(false);
      if (!res) {
        toast({ title: "Something went wrong!!", variant: "destructive" });
        return;
      }
      if (res.error) {
        toast({ title: res.error, variant: "destructive" });
        return;
      }
      router.push("/dashboard");
    });
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleLogin)}>
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
          control={form.control}
          name="email"
        />
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          control={form.control}
          name="password"
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <LuLoader className="h-5 w-5 animate-spin" />
          ) : (
            <span>Login</span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
