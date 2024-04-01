import axios from "axios";
import { getSession } from "next-auth/react";
import { env } from "@/env.mjs";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config: any) => {
  const session = await getSession();
  config.headers.Authorization = `Bearer ${session?.user.token}`;
  return config;
});
