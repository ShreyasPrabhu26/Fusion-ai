export const TOKEN_PER_CONVERSATION = 5;
export const TOKEN_PER_CODE = 5;
export const TOKEN_PER_IMAGE_GENERATION = 10;
export const TOKEN_PER_MUSIC_GENERATION = 10;
export const TOKEN_PER_VIDEO_GENERATION = 20;

interface Plan {
  title: string;
  price: number | string;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
}

export const PLANS: Plan[] = [
  {
    title: "Basic",
    price: 99,
    description:
      "Track your usage with 100 tokens per year. Essential features you need to get started.",
    features: [
      "5 tokens per conversation",
      "5 tokens per code generation",
      "10 tokens per image generation",
      "Access to basic analytics",
      "Email support",
      "Monthly usage reports",
      "Community forum access",
    ],
    actionLabel: "Get Started",
  },
  {
    title: "Pro",
    price: 199,
    description:
      "Track your usage with 200 tokens per year. Perfect for owners of small & medium businesses.",
    features: [
      "All Basic Features",
      "Advanced analytics tools",
      "Priority email support",
      "Weekly usage reports",
      "Access to exclusive webinars",
      "Community forum access",
      "Access to Advance Models",
    ],
    actionLabel: "Get Started",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    description:
      "Dedicated support and infrastructure to fit your needs. Contact us for a custom token plan.",
    features: [
      "All Pro Features",
      "Custom token allocation",
      "Dedicated account manager",
      "Enhanced security features",
      "Personalized onboarding",
      "24/7 premium support",
      "Customizable dashboard",
      "Access to beta features",
    ],
    actionLabel: "Contact Sales",
    exclusive: true,
  },
];
