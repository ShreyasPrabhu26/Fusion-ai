import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PLANS } from "@/constants";

const ONE_RUPEE_IN_PAISE = 100;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_PAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { selectedPlan } = await req.json();

    if (!selectedPlan) {
      return NextResponse.json(
        { error: "PLAN IS NOT SELECTED!!!" },
        { status: 400 }
      );
    }

    const selectedPlanDetails = PLANS.find(
      (plan) => plan.title === selectedPlan
    );

    if (!selectedPlanDetails || typeof selectedPlanDetails.price !== "number") {
      return NextResponse.json(
        {
          error:
            "Error Creating Order: Plan details are missing or price is invalid",
        },
        { status: 500 }
      );
    }

    const amount = selectedPlanDetails.price * ONE_RUPEE_IN_PAISE;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        PLAN_NAME: selectedPlanDetails.title,
      },
    });

    return NextResponse.json(
      {
        order_id: order.id,
        receipt_id: order.receipt,
        amount,
        currency: "INR",
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
