type FAQ = {
  id: string;
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  name: string;
  items: FAQ[];
};

const faqData: FAQCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    items: [
      {
        id: "connect-accounts",
        question: "How do I connect my bank accounts to Trackiitt?",
        answer:
          "Trackiitt uses secure bank-level encryption to connect with over 10,000 financial institutions. Simply navigate to the 'Accounts' section, click 'Add New Account', and follow the guided process to securely connect your accounts through our trusted partners.",
      },
      {
        id: "data-security",
        question: "Is my financial data secure with Trackiitt?",
        answer:
          "Absolutely. We use industry-leading 256-bit encryption to protect your data, never store your bank credentials, and implement two-factor authentication. Our platform is SOC 2 Type II certified, regularly audited, and we never sell your personal information.",
      },
      {
        id: "supported-institutions",
        question: "Which financial institutions are supported?",
        answer:
          "Trackiitt supports over 10,000 financial institutions across North America, Europe, and Asia-Pacific regions. This includes major banks, credit unions, investment platforms, cryptocurrency exchanges, and retirement account providers.",
      },
    ],
  },
  {
    id: "features",
    name: "Features & Tools",
    items: [
      {
        id: "budget-setup",
        question: "How do I set up my first budget?",
        answer:
          "Creating your first budget is simple: Navigate to the 'Budgets' tab, select 'Create New Budget', choose which accounts to include, set your income, and allocate spending across categories. Our smart assistant can suggest budgets based on your historical spending patterns.",
      },
      {
        id: "expense-tracking",
        question: "Can Trackiitt automatically categorize my expenses?",
        answer:
          "Yes! Trackiitt's AI-powered system automatically categorizes your transactions with over 95% accuracy. You can review and adjust any miscategorized transactions, and our system learns from your corrections to improve future categorization.",
      },
      {
        id: "financial-goals",
        question: "How do I track progress toward my financial goals?",
        answer:
          "Use our Goals feature to set specific financial targets like saving for a home, paying off debt, or building an emergency fund. Link relevant accounts, set target dates and amounts, and Trackiitt will visualize your progress and provide actionable insights to help you stay on track.",
      },
    ],
  },
  {
    id: "plans-billing",
    name: "Plans & Billing",
    items: [
      {
        id: "free-vs-premium",
        question: "What's the difference between free and premium plans?",
        answer:
          "The free plan includes basic expense tracking, account connections, and simple budgeting tools. Premium plans add advanced features like investment portfolio tracking, custom reports, financial forecasting, bill reminders, multi-device sync, priority support, and no advertising.",
      },
      {
        id: "subscription-billing",
        question: "How does subscription billing work?",
        answer:
          "Premium subscriptions are billed monthly or annually (with a 20% discount for annual billing). You can upgrade, downgrade, or cancel at any time. If you cancel, you'll continue to have premium access until the end of your current billing period.",
      },
      {
        id: "refund-policy",
        question: "What is your refund policy?",
        answer:
          "We offer a 30-day money-back guarantee for annual subscriptions. If you're not completely satisfied, contact our support team within 30 days of your purchase for a full refund. Monthly subscriptions can be canceled anytime but are not eligible for partial refunds.",
      },
    ],
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    items: [
      {
        id: "sync-issues",
        question: "My accounts aren't syncing correctly. What should I do?",
        answer:
          "First, ensure your banking credentials haven't changed. Try refreshing the connection in the Accounts section. If problems persist, check our System Status page to see if there are known issues with your institution. You can also try disconnecting and reconnecting the account, or contact our support team for assistance.",
      },
      {
        id: "missing-transactions",
        question: "Why are some of my transactions missing?",
        answer:
          "Transactions typically appear within 24-48 hours of posting to your account. If you're missing older transactions, verify your date filters aren't limiting the view. For credit cards or loans, ensure the account is properly connected. If issues persist, our support team can investigate further.",
      },
      {
        id: "data-export",
        question: "How can I export my financial data?",
        answer:
          "You can export your financial data in CSV, Excel, or PDF formats from the Reports section. Choose the date range, accounts, and categories you want to include, then select your preferred export format. Your data will be generated and available for download immediately.",
      },
    ],
  },
];

export default faqData;
