"use client";
import { useState } from "react";

const FAQItemCard = ({
  title = "How to use Trackiitt?",
  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at posuere nisl. Integer tincidunt dictum tellus at dapibus.",
  number,
  id,
  isActive,
  setActive,
  activeFAQ,
  ...props
}: {
  title?: string;
  text?: string;
  number?: string;
  id: string;
  isActive?: boolean;
  setActive?: (id: string) => void;
  activeFAQ?: string;
}) => {
  const handleToggle = (id: string) => {
    if (setActive) {
      setActive(id === activeFAQ ? "" : id);
    }
  };

  return (
    <div
      data-faqid={id}
      className={`flex flex-col rounded-[20px] transition-all duration-300 ${
        isActive
          ? "bg-primary px-[35px] py-7 text-white shadow-lg"
          : "bg-white px-[35px] py-7 shadow-solid-6 dark:bg-gray-dark hover:shadow-lg"
      }`}
    >
      <button
        onClick={() => handleToggle(id)}
        className="flex w-full items-center justify-between"
      >
        <span className="font-satoshi text-xl font-semibold text-left pr-4">
          {title}
        </span>
        <span className="flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
          >
            <path
              d="M9 4V14"
              stroke={isActive ? "white" : "#101010"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={` ${
                isActive ? "stroke-white" : "stroke-black dark:stroke-white"
              }`}
            />
            <path
              d={isActive ? "" : "M4 9H14"}
              stroke={isActive ? "white" : "#101010"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={` ${
                isActive
                  ? "!stroke-transparent"
                  : "stroke-black dark:stroke-white"
              }`}
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isActive ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="font-satoshi text-base leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default FAQItemCard;
