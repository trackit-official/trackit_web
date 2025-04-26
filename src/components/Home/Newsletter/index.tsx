import Graphics from "./Graphics";

export default function Newsletter() {
  return (
    <section className="relative z-10 overflow-hidden bg-gradient-to-r from-primary-50 to-indigo-50 py-17.5 dark:bg-gradient-to-r dark:from-gray-900 dark:to-primary-900/20 lg:py-[100px]">
      <div className="container mx-auto w-full max-w-[1170px] relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 right-10 w-32 h-32 bg-primary-300/20 rounded-full blur-3xl dark:bg-primary-700/20"></div>
        <div className="absolute -bottom-20 left-10 w-48 h-48 bg-indigo-300/20 rounded-full blur-3xl dark:bg-indigo-700/20"></div>

        <div className="mx-auto w-full max-w-[590px] relative">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4 dark:bg-primary-900/30 dark:text-primary-300">
              Newsletter
            </span>
            <h2 className="mb-5 font-satoshi text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-heading-2 relative inline-block">
              Stay Updated on Finance Tips
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary-500/30 rounded-full"></span>
            </h2>
            <p className="mb-10 font-satoshi text-lg text-body dark:text-gray-4">
              Subscribe to our newsletter for the latest financial tips,
              money-saving strategies, and exclusive Trackiitt feature updates
              to help you manage your money better.
            </p>
          </div>

          <form className="relative mx-auto flex w-full max-w-[490px] flex-wrap justify-end group">
            <input
              required
              type="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-full bg-white px-7.5 shadow-[0px_5px_15px_0px_rgba(7,10,46,0.08)] outline-none ring-offset-1 duration-300 focus:shadow-xl focus:ring-primary/20 dark:bg-white/5 dark:focus:ring-dark/20 lsm:h-16 lsm:pr-[150px] transition-all"
            />
            <button
              type="submit"
              className="right-2 mt-4 inline-flex h-12 min-w-[125px] items-center justify-center rounded-full bg-primary-500 px-7 font-satoshi text-base font-medium text-white transition-all duration-300 hover:bg-primary-700 hover:shadow-lg lsm:absolute lsm:top-1/2 lsm:mt-0 lsm:-translate-y-1/2 group-hover:shadow-primary-500/25"
            >
              <span className="mr-2">Subscribe</span>
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
            </button>
          </form>

          <div className="text-center font-satoshi mt-5 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Join over{" "}
              <span className="text-primary-700 dark:text-primary-400 font-medium">
                12,000+
              </span>{" "}
              subscribers worldwide
            </p>
          </div>
        </div>
      </div>

      <Graphics />
    </section>
  );
}
