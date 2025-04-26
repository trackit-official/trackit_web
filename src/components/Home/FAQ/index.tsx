"use client";
import { useState } from "react";
import FAQItemCard from "./FAQItemCard";
import faqData from "./faqData";

const FAQ = () => {
  const [activeFAQ, setActiveFAQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const handleSetActiveFAQ = (id: string) => {
    setActiveFAQ(id);
  };

  return (
    <section
      id="faq"
      className="pb-20 pt-16 lg:pb-25 xl:pb-30 relative overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-[10px] bg-primary/10 px-4.5 py-1.5 font-medium text-primary dark:bg-primary/20">
            Frequently Asked Questions
          </span>
          <h2 className="font-satoshi text-3xl font-bold text-black dark:text-white md:text-4xl lg:text-heading-3">
            Have Questions? We're Here to Help
          </h2>
          <p className="mt-4 font-satoshi text-base md:text-lg text-body-color dark:text-body-color-dark lg:w-4/5 xl:w-3/5 mx-auto leading-relaxed">
            Find answers to common questions about Trackiitt's features,
            security measures, and subscription plans to make the most of your
            financial tracking experience.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* FAQ Categories Sidebar */}
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-24 bg-white dark:bg-gray-dark rounded-xl shadow-solid-5 dark:shadow-solid-6 p-4 transition-all duration-300 hover:shadow-lg">
              <h3 className="font-satoshi text-lg font-bold mb-4 border-b border-stroke dark:border-stroke-dark pb-2 px-3">
                Categories
              </h3>
              <ul className="space-y-2">
                {faqData.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-satoshi text-base transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-primary text-white font-medium"
                          : "hover:bg-stroke/30 dark:hover:bg-stroke-dark/30"
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Questions and Answers */}
          <div className="col-span-12 md:col-span-8">
            <div className="space-y-4.5">
              {faqData
                .find((category) => category.id === activeCategory)
                ?.items.map((faq) => (
                  <FAQItemCard
                    key={faq.id}
                    id={faq.id}
                    title={faq.question}
                    text={faq.answer}
                    isActive={activeFAQ === faq.id}
                    setActive={handleSetActiveFAQ}
                    activeFAQ={activeFAQ}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-20 left-20 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl dark:bg-primary-700/10"></div>
      <div className="absolute top-20 right-20 w-60 h-60 bg-primary-300/10 rounded-full blur-3xl dark:bg-primary-700/10"></div>
    </section>
  );
};

export default FAQ;
