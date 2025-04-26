"use client";
import React from "react";
import SectionHeader from "@/components/Common/SectionHeader";
import { pricingData } from "@/pricing/pricingData";
import PriceItem from "./PriceItem";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="overflow-hidden bg-gradient-to-b from-white to-gray-50 py-17.5 dark:from-gray-900 dark:to-black lg:py-22.5 xl:py-27.5"
    >
      {/* <!-- section title --> */}
      <SectionHeader
        title={
          <>
            Choose the plan that{" "}
            <span className="text-primary">fits your needs</span>
          </>
        }
        description="Track your finances with transparent and flexible pricing options. No hidden fees, cancel anytime, and upgrade as your financial goals grow."
      />

      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
          {pricingData &&
            pricingData.map((price, key) => (
              <PriceItem plan={price} key={key} />
            ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-plusJakartaSans text-lg text-gray-600 dark:text-gray-400">
            All plans include:{" "}
            <span className="font-medium">Core tracking features</span>,{" "}
            <span className="font-medium">Bank synchronization</span>,{" "}
            <span className="font-medium">Mobile app access</span>, and{" "}
            <span className="font-medium">Basic reports</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
