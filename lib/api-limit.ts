import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismaDB";
import { createUser } from "./createUser";
import { clerkClient } from "@clerk/nextjs/server";

interface ApiLimitInfo {
  usedTokens?: number;
  tokenLimit?: number;
  error_message?: string;
}

export const getApiLimitInfo = async (): Promise<ApiLimitInfo> => {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error_message: "User Not Found",
      };
    }

    // Find the user in Prisma DB
    let user = await prismadb.user.findFirst({
      where: {
        userId,
      },
    });

    // If user doesn't exist in Prisma, create a new user using Clerk's email
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      if (!clerkUser?.primaryEmailAddress?.emailAddress) {
        return {
          error_message: "User email not found in Clerk",
        };
      }

      const userEmail = clerkUser.primaryEmailAddress.emailAddress;

      user = await createUser(userId, userEmail);
    }

    // Fetch the API usage limits for the user from Prisma
    const userApiLimits = await prismadb.user.findUnique({
      where: { userId },
      select: {
        usedTokens: true,
        tokenLimit: true,
      },
    });

    if (!userApiLimits) {
      return {
        error_message: "Failed to fetch user API limits",
      };
    }

    return {
      usedTokens: userApiLimits.usedTokens,
      tokenLimit: userApiLimits.tokenLimit,
    };
  } catch (error) {
    console.error("Error fetching API limit info:", error);
    return {
      error_message: "An unexpected error occurred while fetching API limits",
    };
  }
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
