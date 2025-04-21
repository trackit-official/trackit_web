import { FeatureWithImg } from "@/types/featureWithImg";

const featureItemData: FeatureWithImg[] = [
  {
    title: "Complete Financial Dashboard",
    description:
      "Gain total visibility into your financial health with our comprehensive dashboard that brings all your accounts together in one place.",
    checklist: [
      "Connect multiple bank accounts and financial platforms",
      "View all balances and transactions in one interface",
      "Automatic categorization of transactions",
      "Custom tags for personal organization",
    ],
    image: "/images/features/features-01.svg",
    id: 1,
  },
  {
    title: "Data-Driven Financial Insights",
    description:
      "Transform your financial data into actionable insights that help you make smarter money decisions and achieve your goals.",
    checklist: [
      "Interactive charts and spending breakdowns by category",
      "Transaction history in chronological order",
      "Powerful search across all transactions",
      "Downloadable statements and CSV exports",
    ],
    image: "/images/features/features-02.svg",
    id: 2,
  },
  {
    title: "Smart Money Management",
    description:
      "Take control of your spending with intelligent budgeting tools and personalized financial guidance.",
    checklist: [
      "Create monthly or category-based budgets",
      "Set savings or investment goals with visual milestones",
      "Receive alerts for overspending and unusual transactions",
      "Multi-currency support with real-time exchange rates",
    ],
    image: "/images/features/features-01.svg",
    id: 3,
  },
];

export default featureItemData;
