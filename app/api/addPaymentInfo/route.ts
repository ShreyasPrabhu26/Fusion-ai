import type { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismaDB";

interface PaymentResponse {
  userId: string;
  receipt_id: string;
  amount: number;
  currency: string;
  payment_id: string;
  order_id: string;
}

export async function POST(req: Request) {
  const paymentResponse: PaymentResponse = await req.json();

  if (!paymentResponse.userId) {
    return new Response(JSON.stringify({ error_message: "User Not Found" }), {
      status: 400,
    });
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Payment save error:", error);
    return new Response(
      JSON.stringify({ error_message: "Failed to save payment information." }),
      { status: 500 }
    );
  }
}
