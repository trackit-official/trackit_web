import React from "react";
import featuresData from "./featuresData";
import FeatureItem from "./FeatureItem";
import SectionHeader from "@/components/Common/SectionHeader";
import Image from "next/image";
const Features = () => {
  return (
    <section
      id="features"
      className="relative z-1 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-1 py-17.5 dark:from-gray-900 dark:to-black dark:text-white lg:py-22.5 xl:py-27.5"
    >
      {/* <!-- section title --> */}
      <div className="relative">
        <div className="absolute -top-10 left-1/2 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl -translate-x-1/2 dark:bg-primary-900/10"></div>
        <SectionHeader
          title={
            <>
              Powerful{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Finance Features
              </span>
            </>
          }
          description="Everything you need to manage, track, and grow your money in one simple platform."
        />
      </div>

      <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
          {/* <!-- features item --> */}
          {featuresData?.map((item: FeatureItem, key: number) => (
            <div
              key={key}
              className={`animate-${key % 2 === 0 ? "slide-up" : "slide-up"}`}
              style={{ animationDelay: `${key * 0.1}s` }}
            >
              <FeatureItem data={item} />
            </div>
          ))}
        </div>

        {/* <!-- Features Bg Shapes --> */}
        <div className="hidden sm:block">
          <div className="absolute left-0 top-1/2 -z-1 -translate-y-1/2 opacity-60">
            <Image
              src="/images/features/features-shape-01.svg"
              alt="shape"
              width={600}
              height={600}
              className="animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <div className="absolute right-0 top-1/2 -z-1 -translate-y-1/2 opacity-60">
            <Image
              src="/images/features/features-shape-02.svg"
              alt="shape"
              width={800}
              height={800}
              className="animate-pulse-slow"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Add decorative circles */}
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl dark:bg-primary-700/10"></div>
          <div className="absolute top-20 right-20 w-60 h-60 bg-primary-300/10 rounded-full blur-3xl dark:bg-primary-700/10"></div>
        </div>
      </div>
    </section>
  );
};

export default Features;
