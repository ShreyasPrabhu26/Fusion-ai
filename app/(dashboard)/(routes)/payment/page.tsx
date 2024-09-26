"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PricingCard, PricingHeader } from "@/components/pricing-card";
import { PLANS } from "@/constants";
import axios from "axios";
import Script from "next/script";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePlanSelect = async (plan: string) => {
    try {
      setIsProcessing(true);
      setSelectedPlan(plan);

      const responseFromRazorPay = await axios.post("/api/razorpay", {
        selectedPlan,
      });

      const options = {
        key: process.env.RAZORPAY_PAY_KEY,
        currency: "INR",
        order_id: responseFromRazorPay.data.orderId,
        name: "Shreyas Technologies",
        description: "Testing Razorpay",
        handler: function (response: any) {
          const { reciept_id, amount, currency } = responseFromRazorPay.data;
          console.log("Payment Successfull", {
            reciept_id,
            amount,
            currency,
            payment_id: response["razorpay_payment_id"],
            order_id: response["razorpay_order_id"],
          });
          router.push("/dashboard");
        },
        prefill: {
          name: "Shreyas Technologies",
          email: "test@email.com",
          conatact: "+910000000000",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorPay = new window.Razorpay(options);
      razorPay.open();
    } catch (error) {
      console.log("Payment Failed", error);
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
        <Script src="http://checkout.razorpay.com/v1/checkout.js" />
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
                />
              );
            })}
          </section>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
