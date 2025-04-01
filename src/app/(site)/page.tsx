import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Trackitt - Financial Tracker Application`,
  description: `A Financial Tracker Application that helps you manage your finances, track expenses, and achieve your financial goals.`,
  openGraph: {
    type: "website",
    title: `Trackitt - Financial Tracker Application`,
    description: `A Financial Tracker Application that helps you manage your finances, track expenses, and achieve your financial goals.`,
    images:
      "https://ucarecdn.com/4b0ffd0e-90b0-4a59-b63c-f5ecee0ae575/saasbold.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: `Trackitt - Financial Tracker Application`,
    description: `A Financial Tracker Application that helps you manage your finances, track expenses, and achieve your financial goals.`,
    images:
      "https://ucarecdn.com/4b0ffd0e-90b0-4a59-b63c-f5ecee0ae575/saasbold.jpg",
  },
};

export default function HomePage() {
  return (
    <main>
      <Home />
    </main>
  );
}
