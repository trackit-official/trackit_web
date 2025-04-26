"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { signInSchema } from "@/validation/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    if (callbackError) toast.error(callbackError);
  }, [callbackError]);

  const onSubmit = async (data) => {
    const res = await signIn("credentials", { redirect: false, ...data });
    if (res?.error) {
      toast.error(res.error);
    } else {
      router.push("/");
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-satoshi font-bold text-gray-900 dark:text-white mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 font-satoshi">
          Sign in to continue to Trackiitt.
        </p>

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
