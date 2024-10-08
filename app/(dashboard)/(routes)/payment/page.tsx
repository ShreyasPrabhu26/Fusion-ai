"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PricingCard, PricingHeader } from "@/components/pricing-card";
import { PLANS } from "@/constants";
import axios from "axios";
import Script from "next/script";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentResponse {
  userId: string;
  payment_id: string;
  amount: number;
  currency: string;
  order_id: string;
  receipt_id: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { userId } = useAuth();

  if (!userId) {
    router.push("/sign-in");
    return null;
  }

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePlanSelect = async (plan: string) => {
    try {
      if (plan === "Enterprise") {
        window.open("https://cal.com/shreyasprabhu/30min", "_blank");
        return;
      }
      setIsProcessing(true);

      const responseFromRazorPay = await axios.post("/api/razorpay", {
        selectedPlan: plan,
      });

      const { order_id, amount, currency } = responseFromRazorPay.data;

      const options = {
        // key: process.env.RAZORPAY_PAY_KEY,
        currency: "INR",
        order_id,
        name: "Shreyas Technologies",
        description: "Welcome To Fusion Ai",
        handler: async function (response: any) {
          const paymentData = {
            order_id,
            userId,
            amount,
            currency,
            payment_id: response["razorpay_payment_id"],
            receipt_id: response["razorpay_order_id"],
          };

          const dbResponse: any = await axios.post(
            "/api/addPaymentInfoAndUpdateToken",
            {
              paymentData,
            }
          );

          if (dbResponse.error_message) {
            toast.error(
              "[INFRA] Database is not active. Please Contact Developer"
            );
          } else {
            toast.success("Congratulations! Payment Successful");
            router.refresh();
          }
        },
        prefill: {
          name: "Shreyas Technologies",
          // email: "test@email.com",
          // contact: "+910000000000",
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (window.Razorpay) {
        const razorPay = new window.Razorpay(options);
        razorPay.open();
      } else {
        console.error("Razorpay is not loaded yet");
        toast.error(
          "Payment gateway failed to load. Please try again or Contact Developer."
        );
      }
    } catch (error) {
      // console.log("Payment Failed", error);
      toast.error("Oops! Something went wrong!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <div className="py-8">
          <PricingHeader
            title="Pricing Plans"
            subtitle="Choose the plan that's right for you"
          />
          <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
            {PLANS.map((plan) => {
              return (
                <PricingCard
                  key={plan.title}
                  {...plan}
                  onClickHandler={() => handlePlanSelect(plan.title)}
                  isProcessing={isProcessing}
                />
              );
            })}
          </section>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
