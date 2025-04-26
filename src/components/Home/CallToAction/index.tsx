import Image from "next/image";
import Link from "next/link";
const CallToAction = () => {
  return (
    <section className="relative z-1 overflow-hidden bg-gradient-to-r from-primary-500 to-primary-700 py-17.5 lg:py-22.5 xl:py-25">
      <div className="mx-auto w-full max-w-[585px] px-4 text-center sm:px-8 xl:px-0">
        <div className="animate-float">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
            Get Started Today
          </span>
          <h2 className="mb-5 font-satoshi text-3xl font-bold -tracking-[1.6px] text-white lg:text-heading-4 xl:text-heading-2">
            Take Control of Your Finances
          </h2>

          <p className="text-white/85 font-satoshi mb-8">
            Connect your accounts, set your goals, and start tracking your
            financial journey today. Join thousands of users who have
            transformed their financial lives with Trackiitt.
          </p>

          <Link
            href="#"
            className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 font-satoshi font-medium -tracking-[0.2px] text-primary-500 hover:bg-opacity-95 transition-all duration-300 hover:shadow-lg group"
          >
            <span>Start 14-Day Free Trial</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M12.172 7L6.808 1.636L8.222 0.222L16 8L8.222 15.778L6.808 14.364L12.172 9H0V7H12.172Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* <!-- bg shapes --> */}
      <div className="hidden sm:block">
        <div className="absolute bottom-0 left-0 -z-1 opacity-30">
          <Image
            src="/images/cta/cta-grid-01.svg"
            alt="grid"
            width={376}
            height={376}
            className="animate-pulse"
            style={{ animationDuration: "8s" }}
          />
        </div>
        <div className="absolute right-0 top-0 -z-1 opacity-30">
          <Image
            src="/images/cta/cta-grid-02.svg"
            alt="grid"
            width={376}
            height={376}
            className="animate-pulse"
            style={{ animationDuration: "10s" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 -z-1">
          <Image
            src="/images/cta/cta-shape-01.svg"
            alt="grid"
            width={1010}
            height={404}
            className="opacity-30"
          />
        </div>
        <div className="absolute bottom-0 right-0 -z-1">
          <Image
            src="/images/cta/cta-shape-02.svg"
            alt="grid"
            width={935}
            height={404}
            className="opacity-20"
          />
        </div>

        {/* Add decorative circles */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default CallToAction;
