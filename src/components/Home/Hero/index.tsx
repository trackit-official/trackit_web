import Image from "next/image";
import React from "react";
import brandData from "./brandData";
import Link from "next/link";
import Phones from "../../../../public/images/hero/Group 1.png";

const Hero = () => {
  return (
    <section className="relative z-1 overflow-hidden pb-17.5 pt-30 lg:pb-20 lg:pt-30 xl:pb-25 xl:pt-[170px] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/10">
      {/* Glass effect card for main content */}
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Text Content */}
          <div className="w-full lg:w-1/2 text-left animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full mb-5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2"></span>
              <span className="text-sm   font-satoshi font-medium">
                Financial Freedom Simplified
              </span>
            </div>

            <h1 className="mb-5 font-satoshi text-heading-4 font-bold -tracking-[1.6px] text-black dark:text-white lg:text-heading-2 xl:text-[58px] xl:leading-[1.12]">
              Track{" "}
              <span className="relative inline-block text-primary-900 dark:text-primary-500">
                Every{" "}
                <span className="absolute bottom-0.5 left-0 h-2 w-full pl-1 pr-2">
                  <svg
                    className="fill-current"
                    width="106%"
                    height="100%"
                    viewBox="0 0 100 7"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M100 2.49998C100 1.50001 100 2.5 100 1.50001C64.2857 -0.240394 17.4603 3.99028 0 6.05927L0 2.05807C17.4603 0.641568 64.2857 0 100 2.49998Z"
                    />
                  </svg>
                </span>
              </span>{" "}
              <span className="text-primary-900 dark:text-primary-500">
                Naira
              </span>{" "}
              <br className="hidden lg:block" />
              <span className="text-gray-700 dark:text-gray-200">
                With Confidence
              </span>
            </h1>

            <p className="mb-7.5 w-full font-plusJakartaSans max-w-[580px] text-lg -tracking-[0.2px] text-gray-600 dark:text-gray-300 leading-relaxed">
              Simplify your finances by connecting all your accounts in one
              place. Track spending patterns, set intelligent budgets, and
              achieve your financial goals with real-time insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-500 py-4 px-7 font-satoshi font-medium text-white hover:bg-primary-600 hover:shadow-lg transition-all duration-300"
              >
                <span>Start Free Trial</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5 5.625C7.15482 5.625 6.875 5.34518 6.875 5C6.875 4.65482 7.15482 4.375 7.5 4.375H15C15.3452 4.375 15.625 4.65482 15.625 5V12.5C15.625 12.8452 15.3452 13.125 15 13.125C14.6548 13.125 14.375 12.8452 14.375 12.5V6.50888L5.44194 15.4419C5.19786 15.686 4.80214 15.686 4.55806 15.4419C4.31398 15.1979 4.31398 14.8021 4.55806 14.5581L13.4911 5.625H7.5Z"
                    fill="white"
                  />
                </svg>
              </Link>

              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-gray-300 py-4 px-7 font-satoshi font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <span>See How It Works</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3.125C6.20215 3.125 3.125 6.20215 3.125 10C3.125 13.7979 6.20215 16.875 10 16.875C13.7979 16.875 16.875 13.7979 16.875 10C16.875 6.20215 13.7979 3.125 10 3.125ZM10 15.625C6.89307 15.625 4.375 13.1069 4.375 10C4.375 6.89307 6.89307 4.375 10 4.375C13.1069 4.375 15.625 6.89307 15.625 10C15.625 13.1069 13.1069 15.625 10 15.625Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8.75 7.34375C8.75 7.53784 8.82754 7.72357 8.96549 7.86151C9.10343 7.99946 9.28916 8.077 9.483 8.077H9.58319L9.58325 12.6562C9.58325 12.8503 9.66079 13.0361 9.79873 13.174C9.93668 13.3119 10.1224 13.3895 10.3163 13.3895C10.5102 13.3895 10.6959 13.3119 10.8339 13.174C10.9718 13.0361 11.0494 12.8503 11.0494 12.6562V8.077H11.15C11.3441 8.077 11.5298 7.99946 11.6678 7.86151C11.8057 7.72357 11.8833 7.53784 11.8833 7.34375C11.8833 7.14966 11.8057 6.96393 11.6678 6.82599C11.5298 6.68804 11.3441 6.6105 11.15 6.6105H9.483C9.28916 6.6105 9.10343 6.68804 8.96549 6.82599C8.82754 6.96393 8.75 7.14966 8.75 7.34375Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-11 w-11 rounded-full border-2 border-white overflow-hidden"
                  >
                    <Image
                      src={`/images/testimonial/author-0${item}.png`}
                      alt="User"
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="text-yellow-500 mb-2"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M7.53834 1.10997C7.70914 0.699319 8.29086 0.699318 8.46166 1.10997L10.0629 4.83299C10.1992 5.15786 10.5037 5.3725 10.8477 5.40454L14.8299 5.81587C15.2745 5.85818 15.4533 6.40895 15.126 6.7064L12.1491 9.44354C11.8874 9.68323 11.7729 10.0358 11.8477 10.3737L12.6401 14.3043C12.7258 14.7432 12.2621 15.0855 11.8693 14.8515L8.32656 12.8603C8.12441 12.7442 7.87559 12.7442 7.67344 12.8603L4.13067 14.8515C3.73786 15.0855 3.27422 14.7432 3.35991 14.3043L4.15235 10.3737C4.22711 10.0358 4.11263 9.68323 3.85089 9.44354L0.874011 6.7064C0.546688 6.40895 0.725463 5.85818 1.17013 5.81587L5.15232 5.40454C5.4963 5.3725 5.80078 5.15786 5.93706 4.83299L7.53834 1.10997Z"
                        fill="currentColor"
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400  font-satoshi">
                  <span className="font-semibold text-black dark:text-white">
                    4.9/5
                  </span>{" "}
                  from 2,500+ reviews
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-primary-300/40 to-blue-400/40 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-primary-400/40 to-green-400/40 rounded-full blur-3xl"></div>

              {/* Glass effect card */}
              <div className="relative bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl border border-white/20 dark:border-gray-800/30 p-4 shadow-xl transform hover:scale-[1.01] transition-all duration-300">
                <Image
                  src={Phones}
                  alt="Financial tracking app screenshots"
                  className="w-full object-contain rounded-2xl"
                />

                {/* Floating metrics cards */}
                <div className="absolute -left-10 bottom-1/4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-float">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18 7L9.429 17L6 13"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Budget on track
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Saved ₦25,000 this month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-10 top-1/3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-float-delayed">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M16 6L12.5 2.5M12.5 2.5L9 6M12.5 2.5V15M22 13.5C22 17.6421 17.9706 21 13 21C8.02944 21 4 17.6421 4 13.5C4 9.35786 8.02944 6 13 6"
                          stroke="#3A86FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Instant transfers
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Quick & secure payments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by Brands Section */}

      {/* Hero Bg Shapes - more subtle than before */}
      <div className="hidden sm:block">
        <div className="absolute left-0 top-20 -z-10 opacity-30">
          <Image
            src="/images/hero/hero-shape-01.svg"
            alt="shape"
            width={340}
            height={480}
          />
        </div>
        <div className="absolute right-0 top-0 -z-10 opacity-30">
          <Image
            src="/images/hero/hero-shape-02.svg"
            alt="shape"
            width={425}
            height={682}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
