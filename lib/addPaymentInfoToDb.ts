import prismadb from "@/lib/prismaDB";

interface PaymentResponse {
  order_id: string;
  amount: number;
  currency: string;
  payment_id: string;
  receipt_id: string;
  userId: string;
}

export const addPaymentInfoToDb = async (paymentResponse: PaymentResponse) => {
  if (!paymentResponse.userId) {
    return {
      error_message: "User Not Found",
    };
  }

  try {
    await prismadb.paymentInformation.create({
      data: {
        userId: paymentResponse.userId,
        receipt_id: paymentResponse.receipt_id,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        payment_id: paymentResponse.payment_id,
        order_id: paymentResponse.order_id,
      },
    });
  } catch (error) {
    console.error("Database Insertion Error:", error);
    return {
      error_message: "Failed to save payment information.",
    };
  }

  return {};
};
