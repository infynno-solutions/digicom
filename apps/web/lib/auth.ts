import axios from "axios";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/env.mjs";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email", name: "email" },
        password: { type: "password", name: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided.");
        }

        const { email, password } = credentials;

        try {
          const res = await axios.post(
            `${env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email,
              password,
            },
          );

          const user = res.data.user;
          const token = res.data.token;

          return {
            ...user,
            token,
          };
        } catch (e: any) {
          throw new Error(
            e?.response?.data?.message || "Something went wrong!!",
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};
