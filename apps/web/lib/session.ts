import { getServerSession } from "next-auth";

export const getCurrentUser = async () => {
  const session = await getServerSession();
  return session?.user;
};
