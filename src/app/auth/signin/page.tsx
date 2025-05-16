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
// import logoImage from "../../../../public/images/logo/Vector.svg";
import logoImage from "@/../public/images/logo/Vector2.svg";

type SignInFormData = z.infer<typeof signInSchema>;

// Updated ErrorAlert component to match UI guidelines
interface ErrorAlertProps {
  title: string;
  message: string;
  onDismiss: () => void;
  errorId?: string;
}

const ErrorAlert = ({
  title,
  message,
  onDismiss,
  errorId,
}: ErrorAlertProps) => {
  return (
    <div className="relative mb-6 rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg dark:border-red-700 dark:bg-red-900/30 backdrop-filter backdrop-blur-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-500 dark:text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.293-5.293a1 1 0 001.414 0L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l.293.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 000 1.414l1.293 1.293a1 1 0 001.414 0L10 11.414l.293.293a1 1 0 001.414 0l.001-.001.292-.292a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 000 1.414l.001.001.292.292a1 1 0 001.414 0l1.293-1.293.001-.001.292-.292a1 1 0 001.414 0l1.293 1.293.001-.001.292-.292a1 1 0 001.414 0l.293.293.001.001.292.292a1 1 0 001.414 0l1.293-1.293.001-.001.292-.292a1 1 0 001.414 0l.293.293.001.001.292.292a1 1 0 001.414 0l1.293-1.293a1 1 0 000-1.414l-1.293-1.293a1 1 0 00-1.414 0l-.293.293-.001.001-.292.292a1 1 0 00-1.414 0l-1.293 1.293-.001.001-.292.292a1 1 0 00-1.414 0l-1.293-1.293a1 1 0 00-1.414 0l-.293.293-.001.001-.292.292a1 1 0 00-1.414 0l-1.293 1.293a1 1 0 000 1.414l1.293 1.293a1 1 0 001.414 0l.293-.293.001-.001.292-.292a1 1 0 001.414 0l1.293-1.293.001-.001.292-.292a1 1 0 001.414 0l1.293 1.293a1 1 0 001.414 0l.293-.293.001-.001.292-.292a1 1 0 001.414 0l1.293-1.293a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-grow">
          <h3 className="text-md font-semibold text-red-700 dark:text-red-300">
            {title}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {message}
          </p>
          {errorId && (
            <p className="text-xs text-red-500 dark:text-red-500 mt-1">
              Error ID: {errorId}
            </p>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-offset-red-900"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-5 w-5"
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
  const [apiError, setApiError] = useState<{
    title: string;
    message: string;
    errorId?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    if (callbackError) {
      let title = "Authentication Error";
      let message =
        "An unexpected error occurred during sign-in. Please try again.";
      // No errorId from NextAuth callback errors directly

      if (callbackError === "OAuthAccountNotLinked") {
        title = "Account Linking Issue";
        message =
          "This email is already associated with another sign-in method. Please use the original method or link your accounts in settings.";
      } else if (
        callbackError === "Callback" ||
        callbackError === "CredentialsSignin"
      ) {
        // CredentialsSignin is a common one for bad email/password
        title = "Sign-In Failed";
        message =
          "Invalid email or password. Please check your credentials and try again.";
      } else if (callbackError.toLowerCase().includes("rate limit")) {
        title = "Too Many Attempts";
        message =
          "You've made too many sign-in attempts. Please wait a moment and try again.";
      } else if (callbackError === "AccessDenied") {
        title = "Access Denied";
        message =
          "You do not have permission to access this resource. Please contact support if you believe this is an error.";
      }
      setApiError({ title, message });
      // Clear the error from URL to prevent it from showing again on refresh
      router.replace("/auth/signin", undefined);
    }
  }, [callbackError, router]);

  const onSubmit = async (data: SignInFormData) => {
    setApiError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        // Use a more generic message for credential errors as NextAuth already provides one
        // Specific messages are handled by the useEffect hook for URL errors
        setApiError({
          title: "Sign-In Failed",
          message:
            res.error === "CredentialsSignin"
              ? "Invalid email or password. Please check your credentials and try again."
              : "An error occurred during sign-in. Please try again.",
        });
        toast.error(
          res.error === "CredentialsSignin"
            ? "Invalid email or password."
            : "Sign-in error."
        );
      } else if (res?.ok) {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      } else {
        setApiError({
          title: "Sign-In Error",
          message: "An unexpected issue occurred. Please try again.",
        });
        toast.error("An unexpected sign-in error occurred.");
      }
    } catch (e) {
      setApiError({
        title: "Network Error",
        message:
          "Could not connect to the server. Please check your internet connection and try again.",
      });
      toast.error("Network error. Please try again.");
    }
  };

  const handleGoogle = async () => {
    setApiError(null);
    try {
      const res = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (res?.error) {
        setApiError({
          title: "Google Sign-In Failed",
          message:
            "Could not sign in with Google. Please try again or use another method.",
        });
        toast.error("Google sign-in failed.");
      } else if (res?.ok) {
        toast.success("Signed in with Google successfully!");
        router.push("/dashboard");
      }
    } catch (e) {
      setApiError({
        title: "Network Error",
        message:
          "Could not connect to Google. Please check your internet connection.",
      });
      toast.error("Google sign-in network error.");
    }
  };

  const dismissError = () => {
    setApiError(null);
  };

  return (
    <>
      {/* <Toaster
        position="top-right"
        toastOptions={{
          className: "font-satoshi",
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#43AA8B", // Green for success
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF5A5F", // Red for error
              secondary: "#fff",
            },
          },
        }}
      /> */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl backdrop-filter backdrop-blur-lg bg-opacity-80 dark:bg-opacity-70 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img src={logoImage} alt="TrackIt Logo" className="h-10" />
          </Link>
          <h1 className="text-3xl font-satoshi font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-satoshi">
            Securely sign in to your Trackiitt account.
          </p>
        </div>

        {apiError && (
          <ErrorAlert
            title={apiError.title}
            message={apiError.message}
            errorId={apiError.errorId}
            onDismiss={dismissError}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-satoshi">
              Email address
            </label>
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              className={`mt-1 block w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-primary-600 dark:focus:border-primary-500 font-satoshi placeholder-gray-400 dark:placeholder-gray-500 ${errors.email ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-500" : "border-gray-300"}`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1.5 font-satoshi text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-satoshi">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className={`mt-1 block w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-primary-600 dark:focus:border-primary-500 font-satoshi placeholder-gray-400 dark:placeholder-gray-500 ${errors.password ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-500" : "border-gray-300"}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1.5 font-satoshi text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-500 py-3.5 text-center text-base text-white font-satoshi font-semibold shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <span className="h-px flex-grow bg-gray-300 dark:bg-gray-600"></span>
          <span className="mx-4 text-sm text-gray-500 dark:text-gray-400 font-satoshi">
            OR
          </span>
          <span className="h-px flex-grow bg-gray-300 dark:bg-gray-600"></span>
        </div>

        <button
          onClick={handleGoogle}
          disabled={isSubmitting} // Disable while main form is submitting
          className="mt-6 w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 font-satoshi font-medium transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <img src="/images/icon/google.svg" alt="Google" className="h-5 w-5" />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 font-satoshi">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
          >
            Create one now
          </Link>
        </p>
      </div>
    </>
  );
}
