import prismaDB from "@/lib/prismaDB";
import { NextResponse } from "next/server";

const ONE_RUPEE_IN_PAISE = 100;

interface PaymentResponse {
  userId: string;
  receipt_id: string;
  amount: number;
  currency: string;
  payment_id: string;
  order_id: string;
}

export async function POST(req: Request) {
  try {
    const { paymentData } = await req.json();
    console.log("Recived Data:", paymentData);

    if (!paymentData.userId) {
      return NextResponse.json(
        { error_message: "User Not Found" },
        { status: 400 }
      );
    }

    const paymentEntry = await prismaDB.paymentInformation.create({
      data: {
        userId: paymentData.userId,
        receipt_id: paymentData.receipt_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_id: paymentData.payment_id,
        order_id: paymentData.order_id,
      },
    });

    const additionalTokens = Math.floor(
      paymentData.amount / ONE_RUPEE_IN_PAISE
    );

    await prismaDB.user.update({
      where: { userId: paymentData.userId },
      data: {
        tokenLimit: {
          increment: additionalTokens,
        },
      },
    });

    return NextResponse.json(paymentEntry, { status: 200 });
  } catch (error) {
    console.error("Database Insertion or Update Error:", error);
    return NextResponse.json(
      {
        error_message:
          "Failed to save payment information or update token limit.",
      },
      { status: 500 }
    );
  }
}
