"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignIn = pathname.includes("/signin");

  // Choose different images based on the current path
  const imageSrc = isSignIn
    ? "/images/signin/auth-signin.jpg"
    : "/images/signin/auth-signup.jpg";

  const imageAlt = isSignIn
    ? "Sign in to Trackiitt"
    : "Create a Trackiitt account";

  const headingText = isSignIn
    ? "Welcome back to your financial journey"
    : "Start your financial journey today";

  const subText = isSignIn
    ? "Track, manage, and optimize your finances with ease"
    : "Join thousands of users managing their finances with Trackiitt";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Image Section - Hidden on mobile, 50% width on desktop */}
      <div className="hidden md:flex md:w-1/2 relative bg-primary-100 dark:bg-primary-900">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-bold mb-2 font-satoshi">
              {headingText}
            </h2>
            <p className="text-white/80 max-w-md font-satoshi">{subText}</p>
          </div>
        </div>
      </div>

      {/* Form Section - Full width on mobile, 50% width on desktop */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="w-full max-w-md px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
