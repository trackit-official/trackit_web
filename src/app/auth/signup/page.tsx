"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post("/api/auth/signup", form);
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg">
        <h1 className="text-3xl font-satoshi font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Trackiitt
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 font-satoshi">
          Create your free account and take control of your finances.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
            />
          </div>
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
            />
          </div>
          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-700 font-satoshi"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary-500 py-3 text-center text-white font-satoshi font-medium shadow-md hover:bg-primary-600 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
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
