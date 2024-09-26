import prismadb from "@/lib/prismaDB";

interface PaymentResponse {
  order_id: string;
  amount: number;
  currency: string;
  payment_id: string;
  receipt_id: string;
  userId: string;
}

const ONE_RUPEE_IN_PAISE = 100;

export const addPaymentInfoAndUpdateToken = async (
  paymentResponse: PaymentResponse
) => {
  console.log("Received payment response:", paymentResponse);

  if (!paymentResponse.userId) {
    console.error("User ID is missing in the payment response.");
    return {
      error_message: "User Not Found",
    };
  }

  try {
    console.log(
      "Creating payment information for userId:",
      paymentResponse.userId
    );

    const paymentEntry = await prismadb.paymentInformation.create({
      data: {
        userId: paymentResponse.userId,
        receipt_id: paymentResponse.receipt_id,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        payment_id: paymentResponse.payment_id,
        order_id: paymentResponse.order_id,
      },
    });

    console.log("Payment entry created successfully:", paymentEntry);

    const user = await prismadb.user.findUnique({
      where: { userId: paymentResponse.userId },
    });

    if (!user) {
      console.error("User not found for userId:", paymentResponse.userId);
      return {
        error_message: "User not found.",
      };
    }

    console.log("User found:", user);

    const additionalTokens = Math.floor(
      paymentResponse.amount / ONE_RUPEE_IN_PAISE
    );   
    const updatedTokenLimit = user.tokenLimit + additionalTokens;

    console.log("Calculating updated token limit...");
    console.log("Current token limit:", user.tokenLimit);
    console.log("Additional tokens to add:", additionalTokens);
    console.log("New token limit will be:", updatedTokenLimit);

    const updatedUser = await prismadb.user.update({
      where: { userId: paymentResponse.userId },
      data: {
        tokenLimit: updatedTokenLimit,
      },
    });

    console.log("Token limit updated successfully:", updatedUser);

    return paymentEntry;
  } catch (error) {
    console.error("Database Insertion or Update Error:", error);
    return {
      error_message:
        "Failed to save payment information or update token limit.",
    };
  }
};
