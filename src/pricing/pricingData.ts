import { Price } from "@/types/priceItem";

export const pricingData: Price[] = [
  {
    stripePriceId: "stripe_ID",
    unit_amount: 99 * 100,
    nickname: "Basic",
    description:
      "Perfect for individuals who want to take control of their personal finances with essential tracking features.",
    subtitle: "For individuals",
    includes: [
      "Connect up to 3 financial accounts",
      "Track expenses and income",
      "Basic budgeting tools",
      "30-day transaction history",
    ],
    icon: `/images/pricing/pricing-icon-01.svg`,
  },
  {
    stripePriceId: "stripe_ID",
    unit_amount: 199 * 100,
    nickname: "Pro",
    description:
      "Comprehensive financial tracking with advanced tools for budgeting, forecasting, and multi-account management.",
    subtitle: "For households",
    includes: [
      "Connect up to 15 financial accounts",
      "Advanced budget categories",
      "Savings goals and tracking",
      "1-year transaction history",
    ],
    icon: `/images/pricing/pricing-icon-02.svg`,
    icon2: `/images/pricing/pricing-icon-02-2.svg`,
    active: true,
  },
  {
    stripePriceId: "stripe_ID",
    unit_amount: 399 * 100,
    nickname: "Enterprise",
    description:
      "Complete financial management solution for businesses with team access, advanced reporting, and integration options.",
    subtitle: "For businesses",
    includes: [
      "Unlimited financial accounts",
      "Team access and permissions",
      "Custom financial reports",
      "API access and data export",
    ],
    icon: `/images/pricing/pricing-icon-03.svg`,
  },
];
