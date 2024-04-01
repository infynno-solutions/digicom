import { User as NextAuthUser } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    token: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: NextAuthUser & {
      id: UserId;
      token: string;
    };
  }
}
