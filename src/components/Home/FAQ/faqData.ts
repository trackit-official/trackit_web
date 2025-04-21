import { Faq } from "@/types/faq";

const faqData: Faq[] = [
  {
    id: 1,
    question: "How secure is Trackiitt with my financial data?",
    answer:
      "Trackiitt uses bank-level 256-bit encryption to protect your data. We implement read-only access to your financial accounts, which means we can never make changes or move money. Your sensitive information is never stored on our servers, and we employ comprehensive security measures that comply with international financial data protection standards.",
  },
  {
    id: 2,
    question:
      "Which banks and financial platforms can I connect with Trackiitt?",
    answer:
      "Trackiitt integrates with over 10,000 financial institutions worldwide, including major banks, credit card providers, investment platforms, and cryptocurrency wallets. Our platform continually adds new integrations to ensure you can connect virtually any financial account you own.",
  },
  {
    id: 3,
    question: "Is there a free trial available?",
    answer:
      "Yes, Trackiitt offers a 14-day free trial with full access to all premium features. You can connect up to 5 financial accounts, create budgets, and explore spending insights without entering payment details. After the trial period, you can choose between our Basic, Premium, or Business subscription plans.",
  },
  {
    id: 4,
    question: "How does the budgeting feature work?",
    answer:
      "Trackiitt's budgeting tool allows you to set monthly spending limits for different categories like groceries, entertainment, and transportation. Once set up, our system automatically categorizes your transactions and shows you visual progress bars indicating how close you are to reaching your limits. You'll receive notifications when approaching or exceeding your budget to help you stay on track.",
  },
  {
    id: 5,
    question: "Can I track shared expenses or family accounts?",
    answer:
      "Absolutely! Trackiitt offers family sharing options on our Premium and Business plans. You can create a household account where family members can link their individual accounts while maintaining privacy for specific transactions. This gives you a complete picture of family finances and helps with shared budgeting and expense tracking.",
  },
  {
    id: 6,
    question: "What kind of reports and insights does Trackiitt provide?",
    answer:
      "Trackiitt generates detailed financial reports including monthly spending summaries, category breakdowns, merchant analysis, and year-over-year comparisons. Our advanced analytics show spending patterns, identify areas where you might be overspending, and provide personalized recommendations for improving your financial health based on your specific habits and goals.",
  },
];

export default faqData;
