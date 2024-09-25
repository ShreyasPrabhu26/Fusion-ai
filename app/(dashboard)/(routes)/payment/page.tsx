"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PricingCard, PricingHeader } from "@/components/pricing-card";
import { PLANS } from "@/constants";

export default function PaymentPage() {
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
        <div className="py-8">
          <PricingHeader
            title="Pricing Plans"
            subtitle="Choose the plan that's right for you"
          />
          <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
            {PLANS.map((plan) => {
              return <PricingCard key={plan.title} {...plan} />;
            })}
          </section>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
