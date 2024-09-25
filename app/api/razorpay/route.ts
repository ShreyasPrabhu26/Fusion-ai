import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_PAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const order = await razorpay.orders.create({
      amount: 100 * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(
      {
        orderId: order.id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Something Went Wrong!", error);
    return NextResponse.json(
      {
        error: "Error Creating Order",
      },
      { status: 500 }
    );
  }
}
