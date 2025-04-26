import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative z-1 mt-auto overflow-hidden bg-gray-900 py-17.5 lg:py-22.5 xl:py-27.5">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap gap-10 lg:justify-between xl:flex-nowrap xl:gap-20">
          <div className="w-full max-w-[275px]">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/images/logo/logo-light.svg"
                  alt="TracKit"
                  width={150}
                  height={40}
                  className="mb-3"
                />
              </div>
            </Link>
            <p className="mt-5 text-gray-5 leading-relaxed">
              Simplify your finances by connecting all your accounts in one
              place. Track spending, set budgets, and achieve your goals.
            </p>

            <ul className="mt-8 flex items-center gap-3">
              <li>
                <a
                  href="#"
                  aria-label="Twitter Social Link"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 duration-200 ease-out hover:bg-primary-600 hover:text-white"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.063 9L16.558 13.475L20.601 9H23.055L17.696 14.931L24 23H19.062L15.196 18.107L10.771 23H8.316L14.051 16.658L8 9H13.063ZM12.323 10.347H10.866L19.741 21.579H21.101L12.323 10.347Z" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  aria-label="Facebook Social Link"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 duration-200 ease-out hover:bg-primary-600 hover:text-white"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.9 2H3.1C2.5 2 2 2.5 2 3.1V20.9C2 21.5 2.5 22 3.1 22H12.7V14.2H10.1V11.2H12.7V9C12.7 6.5 14.2 5.2 16.5 5.2C17.6 5.2 18.5 5.3 18.8 5.3V8H17.1C15.7 8 15.4 8.7 15.4 9.6V11.1H18.7L18.3 14.1H15.4V22H20.9C21.5 22 22 21.5 22 20.9V3.1C22 2.5 21.5 2 20.9 2Z" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  aria-label="Instagram Social Link"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 duration-200 ease-out hover:bg-primary-600 hover:text-white"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.2C15.2 2.2 15.6 2.2 16.9 2.3C18.2 2.3 18.9 2.5 19.4 2.7C20 2.9 20.5 3.2 20.9 3.6C21.3 4.1 21.6 4.5 21.8 5.1C22 5.6 22.2 6.3 22.2 7.6C22.3 8.9 22.3 9.3 22.3 12.5C22.3 15.7 22.3 16.1 22.2 17.4C22.2 18.7 22 19.4 21.8 19.9C21.6 20.5 21.3 21 20.9 21.4C20.5 21.8 20 22.1 19.4 22.3C18.9 22.5 18.2 22.7 16.9 22.7C15.6 22.8 15.2 22.8 12 22.8C8.8 22.8 8.4 22.8 7.1 22.7C5.8 22.7 5.1 22.5 4.6 22.3C4 22.1 3.5 21.8 3.1 21.4C2.7 21 2.4 20.5 2.2 19.9C2 19.4 1.8 18.7 1.8 17.4C1.7 16.1 1.7 15.7 1.7 12.5C1.7 9.3 1.7 8.9 1.8 7.6C1.8 6.3 2 5.6 2.2 5.1C2.4 4.5 2.7 4 3.1 3.6C3.5 3.2 4 2.9 4.6 2.7C5.1 2.5 5.8 2.3 7.1 2.3C8.4 2.2 8.8 2.2 12 2.2ZM12 0C8.7 0 8.3 0 7 0.1C5.7 0.1 4.8 0.3 4 0.6C3.2 0.9 2.6 1.3 1.9 1.9C1.3 2.6 0.9 3.2 0.6 4C0.3 4.8 0.1 5.7 0.1 7C0 8.3 0 8.7 0 12C0 15.3 0 15.7 0.1 17C0.1 18.3 0.3 19.2 0.6 20C0.9 20.8 1.3 21.4 1.9 22.1C2.6 22.7 3.2 23.1 4 23.4C4.8 23.7 5.7 23.9 7 23.9C8.3 24 8.7 24 12 24C15.3 24 15.7 24 17 23.9C18.3 23.9 19.2 23.7 20 23.4C20.8 23.1 21.4 22.7 22.1 22.1C22.7 21.4 23.1 20.8 23.4 20C23.7 19.2 23.9 18.3 23.9 17C24 15.7 24 15.3 24 12C24 8.7 24 8.3 23.9 7C23.9 5.7 23.7 4.8 23.4 4C23.1 3.2 22.7 2.6 22.1 1.9C21.4 1.3 20.8 0.9 20 0.6C19.2 0.3 18.3 0.1 17 0.1C15.7 0 15.3 0 12 0Z" />
                    <path d="M12 5.9C8.7 5.9 6 8.6 6 11.9C6 15.2 8.7 17.9 12 17.9C15.3 17.9 18 15.2 18 11.9C18 8.6 15.3 5.9 12 5.9ZM12 15.7C9.9 15.7 8.2 14 8.2 11.9C8.2 9.8 9.9 8.1 12 8.1C14.1 8.1 15.8 9.8 15.8 11.9C15.8 14 14.1 15.7 12 15.7Z" />
                    <path d="M18.2 7C19 7 19.7 6.3 19.7 5.5C19.7 4.7 19 4 18.2 4C17.4 4 16.7 4.7 16.7 5.5C16.7 6.3 17.4 7 18.2 7Z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="flex w-full flex-col justify-between gap-10 sm:w-auto sm:flex-row xl:gap-20">
            <div className="w-full sm:w-auto">
              <h2 className="mb-5 font-satoshi text-lg font-bold -tracking-[0.2px] text-white">
                Product
              </h2>

              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Pricing & Plans
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-full sm:w-auto">
              <h2 className="mb-5 font-satoshi text-lg font-bold -tracking-[0.2px] text-white">
                Resources
              </h2>

              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Financial Tips
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Budget Templates
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-full sm:w-auto">
              <h2 className="mb-5 font-satoshi text-lg font-bold -tracking-[0.2px] text-white">
                Legal
              </h2>

              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Security Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-full sm:w-auto">
              <h2 className="mb-5 font-satoshi text-lg font-bold -tracking-[0.2px] text-white">
                Company
              </h2>

              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Press Kit
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-5 duration-200 ease-out hover:text-white"
                    href="#"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* <!-- footer menu end --> */}

        {/* <!-- Copyright & payment methods --> */}
        <div className="mt-15 flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-10">
          <p className="text-gray-5 mb-5 md:mb-0">
            © {new Date().getFullYear()} TracKit. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Image
              src="/images/footer/visa.svg"
              alt="Visa"
              width={40}
              height={25}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/images/footer/mastercard.svg"
              alt="Mastercard"
              width={40}
              height={25}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/images/footer/paypal.svg"
              alt="PayPal"
              width={40}
              height={25}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
            <div className="flex items-center bg-gray-800 rounded-md px-3 py-1.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5 text-primary-500"
              >
                <path
                  d="M7.99989 1.33334C5.41989 1.33334 3.33322 3.42001 3.33322 6.00001C3.33322 7.58668 4.12655 8.98668 5.33322 9.82668V14.6667L7.99989 13.3333L10.6666 14.6667V9.82668C11.8733 8.98668 12.6666 7.58668 12.6666 6.00001C12.6666 3.42001 10.5799 1.33334 7.99989 1.33334ZM9.99989 9.00001V12.3333L7.99989 11.3333L5.99989 12.3333V9.00001C5.37322 8.65334 4.85322 8.14001 4.50655 7.52001C4.15989 6.90001 3.99322 6.18668 3.99989 5.46668C4.01322 4.62001 4.29989 3.80668 4.81322 3.14668C5.32655 2.48668 6.03989 2.01334 6.85322 1.80668C7.66655 1.60001 8.51989 1.66668 9.29322 2.00001C10.0666 2.33334 10.7199 2.91334 11.1599 3.65334C11.5999 4.39334 11.7999 5.25334 11.7466 6.12001C11.6933 6.98668 11.3866 7.81334 10.8666 8.48668C10.3466 9.16001 9.64655 9.66001 8.84655 9.90668C9.23989 9.66001 9.63322 9.36668 9.99989 9.00001Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xs text-white">Secured & Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- bg shapes --> */}
      <div className="hidden sm:block">
        <div className="absolute bottom-0 left-0 -z-1 opacity-20">
          <Image
            src="/images/footer/footer-grid-01.svg"
            alt="grid"
            width={305}
            height={305}
          />
        </div>
        <div className="absolute right-0 top-0 -z-1 opacity-20">
          <Image
            src="/images/footer/footer-grid-02.svg"
            alt="grid"
            width={305}
            height={305}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
