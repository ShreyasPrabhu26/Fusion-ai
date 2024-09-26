import prismadb from "@/lib/prismaDB";
import { User } from "@prisma/client";

export async function createUser(
  userId: string,
  emailAddress: string
): Promise<User | null> {
  try {
    const newUser = await prismadb.user.create({
      data: {
        userId,
        emailAddress,
      },
    });

    console.log("User created:", newUser);
    return newUser;
  } catch (error: any) {
    console.error("Error creating user:", error.message || error);
    return null;
  }
}
