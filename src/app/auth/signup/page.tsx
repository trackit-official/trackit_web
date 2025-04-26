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

type SignUpFormData = z.infer<typeof signUpSchema>;
type ErrorResponse = {
  error: string;
  message?: string;
  details?: string[];
  errorId?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    // Reset error states
    setFormError(null);
    setValidationErrors([]);

    try {
      // Create user account
      const response = await axios.post("/api/auth/signup", data);

      // If successful, sign the user in
      setIsSigningIn(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard");
    } catch (err) {
      setIsSigningIn(false);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const responseData = axiosError.response?.data;

        // Handle validation errors
        if (
          responseData?.errorId === "VALIDATION_ERROR" &&
          responseData?.details?.length > 0
        ) {
          setValidationErrors(responseData.details);
          setFormError("Please correct the errors below.");
          return;
        }

        // Handle specific error cases
        if (responseData?.message) {
          setFormError(responseData.message);
        } else if (responseData?.error) {
          setFormError(responseData.error);
        } else if (axiosError.response?.status === 409) {
          setFormError(
            "This email is already registered. Please use a different email or sign in."
          );
        } else {
          setFormError(
            `Failed to create account: ${axiosError.response?.statusText || "Unknown error"}`
          );
        }
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <h1 className="text-3xl font-satoshi font-bold text-gray-900 dark:text-white mb-2">
        Welcome to Trackiitt
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 font-satoshi">
        Create your free account and take control of your finances.
      </p>

      {/* Form-level error display */}
      {formError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {formError}
          </p>
          {validationErrors.length > 0 && (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {validationErrors.map((error, index) => (
                <li
                  key={index}
                  className="text-red-600 dark:text-red-400 text-xs"
                >
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            {...register("name")}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("password")}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="Hide password"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
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
                  aria-label="Show password"
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
            <div className="mt-1">
              <p className="text-xs text-red-600 font-medium">
                {errors.password.message}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must include at least 10 characters, uppercase,
                lowercase, number, and special character.
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSigningIn}
          className="w-full rounded-full bg-primary-500 py-3 text-center text-white font-satoshi font-medium shadow-md hover:bg-primary-600 transition disabled:opacity-50"
        >
          {isSubmitting
            ? "Creating account..."
            : isSigningIn
              ? "Signing in..."
              : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-primary-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
