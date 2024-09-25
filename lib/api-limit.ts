import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismaDB";
import { createUser } from "./createUser";

interface ApiLimitInfo {
  usedTokens?: number;
  tokenLimit?: number;
  message?: string;
}

export const getApiLimitInfo = async (): Promise<ApiLimitInfo> => {
  const { userId } = auth();

  if (!userId) {
    return {
      message: "User Not Found",
    };
  }

  let user = await prismadb.user.findFirst({
    where: {
      userId,
    },
  });

  if (!user) {
    user = await createUser(userId);
  }

  const userApiLimits = await prismadb.user.findUnique({
    where: { userId },
    select: {
      usedTokens: true,
      tokenLimit: true,
    },
  });

  if (!userApiLimits) {
    return {
      message: "Failed to fetch user API limits",
    };
  }

  return userApiLimits;
};

export const increaseApiLimit = async (increaseBy: number): Promise<void> => {
  const { userId } = auth();

  if (!userId) return;

  const updatedUser = await prismadb.user.update({
    where: { userId },
    data: {
      usedTokens: {
        increment: increaseBy,
      },
    },
  });

  console.log("API limit increased:", updatedUser);
};
