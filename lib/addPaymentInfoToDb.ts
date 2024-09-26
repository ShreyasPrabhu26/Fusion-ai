import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismaDB";

export const addPaymentInfoToDb = async (paymentResponse: object) => {
  const { userId } = auth();
  if (!userId) {
    return {
      error_message: "User Not Found",
    };
  }

  prismadb.paymentInformation.create({
    where: {
      userId,
    },
  });
};
