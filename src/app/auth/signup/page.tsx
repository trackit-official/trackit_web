"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

type SignUpFormData = z.infer<typeof signUpSchema>;

interface ErrorResponse {
  error: string;
  message?: string;
  details?: string[];
  errorId?: string;
}

// ErrorAlert component (can be moved to a shared components folder)
interface ErrorAlertProps {
  title: string;
  message: string;
  details?: string[];
  errorId?: string;
  onDismiss: () => void;
}

const ErrorAlert = ({
  title,
  message,
  details,
  errorId,
  onDismiss,
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
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.293-5.293a1 1 0 001.414 0L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l.293.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 000 1.414l1.293 1.293a1 1 0 001.414 0L10 11.414l.293.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 000 1.414l.001.001.292.292a1 1 0 001.414 0l1.293-1.293.001-.001.292-.292a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 000 1.414l.001.001.292.292a1 1 0 001.414 0l1.293-1.293.001-.001.292-.292a1 1 0 00-1.414 0l-1.293-1.293a1 1 0 00-1.414 0l-.293.293-.001.001-.292.292a1 1 0 00-1.414 0l-1.293 1.293a1 1 0 000 1.414l1.293 1.293a1 1 0 001.414 0l.293-.293.001-.001.292-.292a1 1 0 001.414 0l1.293-1.293.001-.001.292-.292a1 1 0 001.414 0l1.293 1.293a1 1 0 001.414 0l.293-.293.001-.001.292-.292a1 1 0 001.414 0l1.293-1.293a1 1 0 000-1.414z"
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
          {details && details.length > 0 && (
            <ul className="list-disc list-inside mt-2 space-y-0.5">
              {details.map((detail, index) => (
                <li
                  key={index}
                  className="text-xs text-red-500 dark:text-red-400"
                >
                  {detail}
                </li>
              ))}
            </ul>
          )}
          {errorId && (
            <p className="text-xs text-red-500 dark:text-red-500 mt-2 font-mono">
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

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<Omit<
    ErrorAlertProps,
    "onDismiss"
  > | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setApiError(null);

    try {
      const response = await axios.post<{
        message: string;
        userId: string;
      }>("/api/auth/signup", data);

      toast.success(
        response.data.message || "Account created! Signing you in..."
      );
      setIsSigningIn(true);

      const signInResponse = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResponse?.error) {
        setIsSigningIn(false);
        setApiError({
          title: "Sign-In After Signup Failed",
          message:
            "Your account was created, but we couldn't sign you in automatically. Please try signing in manually.",
        });
        toast.error("Automatic sign-in failed. Please sign in.");
        // Optionally, redirect to sign-in page after a delay or offer a button
        setTimeout(() => router.push("/auth/signin"), 3000);
      } else if (signInResponse?.ok) {
        router.push("/dashboard");
      } else {
        setIsSigningIn(false);
        setApiError({
          title: "Sign-In After Signup Unclear",
          message:
            "Account created, but sign-in status is unclear. Please try signing in.",
        });
        toast.warn("Sign-in status unclear. Please try signing in manually.");
      }
    } catch (err) {
      setIsSigningIn(false);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const responseData = axiosError.response?.data;

        const errorTitle = responseData?.error
          ? responseData.error
              .replace(/_/g, " ")
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")
          : "Signup Failed";

        setApiError({
          title: errorTitle,
          message:
            responseData?.message ||
            "An unexpected error occurred during signup.",
          details: responseData?.details,
          errorId: responseData?.errorId,
        });

        if (responseData?.details && responseData.details.length > 0) {
          responseData.details.forEach((detail) => {
            // Attempt to map specific Zod error messages to fields
            if (detail.toLowerCase().includes("name"))
              setError("name", { type: "server", message: detail });
            else if (detail.toLowerCase().includes("email"))
              setError("email", { type: "server", message: detail });
            else if (detail.toLowerCase().includes("password"))
              setError("password", { type: "server", message: detail });
          });
        }
        toast.error(
          responseData?.message || "Signup failed. Please check errors."
        );
      } else {
        setApiError({
          title: "Unexpected Error",
          message: "An unknown error occurred. Please try again.",
        });
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dismissError = () => {
    setApiError(null);
  };

  return (
    <>
      <Toaster
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
      />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl backdrop-filter backdrop-blur-lg bg-opacity-80 dark:bg-opacity-70 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/images/logo/trackiitt-logo.svg"
              alt="Trackiitt Logo"
              className="h-10"
            />
          </Link>
          <h1 className="text-3xl font-satoshi font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-satoshi">
            Join Trackiitt and take control of your finances.
          </p>
        </div>

        {apiError && (
          <ErrorAlert
            title={apiError.title}
            message={apiError.message}
            details={apiError.details}
            errorId={apiError.errorId}
            onDismiss={dismissError}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-satoshi">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              {...register("name")}
              className={`mt-1 block w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-primary-600 dark:focus:border-primary-500 font-satoshi placeholder-gray-400 dark:placeholder-gray-500 ${errors.name ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-500" : "border-gray-300"}`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1.5 font-satoshi text-xs text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("password")}
                className={`mt-1 block w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-primary-600 dark:focus:border-primary-500 font-satoshi placeholder-gray-400 dark:placeholder-gray-500 ${errors.password ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-500" : "border-gray-300"}`}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none p-1 rounded-md"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <div className="mt-1.5">
                <p className="font-satoshi text-xs text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-satoshi">
              Password must be at least 10 characters and include uppercase,
              lowercase, number, and a special character.
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSigningIn}
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
                Creating Account...
              </div>
            ) : isSigningIn ? (
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
              "Create Free Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-satoshi">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
