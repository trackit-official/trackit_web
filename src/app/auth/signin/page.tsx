"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { signInSchema } from "@/validation/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";

type SignInFormData = z.infer<typeof signInSchema>;

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

// Error alert component following design guidelines
const ErrorAlert = ({ message, onDismiss }: ErrorAlertProps) => {
  return (
    <div className="relative mb-6 rounded-lg bg-red-50 p-4 shadow-sm border border-red-100 dark:bg-opacity-10 dark:bg-red-900 dark:border-red-800 backdrop-filter backdrop-blur-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-grow">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    // Handle error from URL parameters (e.g. OAuth errors)
    if (callbackError) {
      let message = callbackError;

      // Convert technical error messages to user-friendly ones
      if (callbackError === "OAuthAccountNotLinked") {
        message =
          "This email is already used with a different sign-in method. Please use your original sign-in method.";
      } else if (callbackError === "Callback") {
        message = "Authentication failed. Please try again.";
      } else if (callbackError.includes("Rate limit")) {
        message = "Too many sign-in attempts. Please try again later.";
      }

      setErrorMessage(message);
    }
  }, [callbackError]);

  const onSubmit = async (data: SignInFormData) => {
    setErrorMessage(null); // Clear any previous errors

    const res = await signIn("credentials", { redirect: false, ...data });
    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-satoshi font-bold text-gray-900 dark:text-white mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 font-satoshi">
          Sign in to continue to Trackiitt.
        </p>

        {errorMessage && (
          <ErrorAlert message={errorMessage} onDismiss={dismissError} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              {...register("email")}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
            />
            {errors.email && (
              <p className="mt-1 font-satoshi text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
            />
            {errors.password && (
              <p className="mt-1 text-xs font-satoshi text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-500 py-3 text-center text-white font-satoshi font-medium shadow-md hover:bg-primary-600 transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-px w-full bg-stroke dark:bg-stroke-dark"></span>
          <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
          <span className="h-px w-full bg-stroke dark:bg-stroke-dark"></span>
        </div>

        <button
          onClick={handleGoogle}
          className="mt-6 w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-satoshi"
        >
          <img src="/images/icon/google.svg" alt="Google" className="h-5 w-5" />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 font-satoshi">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-primary-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
