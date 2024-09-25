import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismaDB";
import { createUser } from "./createUser";

export const getApiLimitCount = async (): Promise<number> => {
  const { userId } = auth();

  if (!userId) return 0;

  const user = await prismadb.user.findFirst({
    where: {
      userId,
    },
  });

  if (!user) {
    const newUser = await createUser(userId);
    return newUser?.usedTokens ?? 0;
  }

  return user.usedTokens;
};

export const increaseApiLimit = async (token: number) => {
  const { userId } = auth();

  if (!userId) return;

  const user = await prismadb.user.findFirst({
    where: { userId },
  });
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) return false;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNT) {
    return true;
  } else {
    return false;
  }
};
