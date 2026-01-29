"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine((email) => email.endsWith("@gmail.com"), {
    message: "Only @gmail.com addresses are allowed",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ATHLETE", "COACH", "ACADEMY"]),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Registration failed");
      }

      router.push("/onboarding");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Join thousands of sports professionals today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  I am a...
                </label>
                <select
                  {...register("role")}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                >
                  <option value="">Select Role</option>
                  <option value="ATHLETE">Athlete</option>
                  <option value="COACH">Coach / Scout</option>
                  <option value="ACADEMY">Academy / Organization</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base flex justify-center items-center gap-2"
            >
              {isLoading && (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
            
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-gameon-blue-600 hover:text-gameon-blue-500"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gameon-blue-500/20 rounded-full blur-3xl pointer-events-none" />
         
         <div className="relative z-10 max-w-lg text-center text-white space-y-8">
             <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center border border-white/20">
                <span className="text-4xl">🏆</span>
             </div>
             <blockquote className="text-2xl font-medium leading-relaxed">
               "The GameOn Co. has completely transformed how we scout talent. The verified stats and video integration make it effortless."
             </blockquote>
             <div>
                <div className="font-bold text-lg">Sarah Johnson</div>
                <div className="text-slate-400">Director of Scouting, Elite FC</div>
             </div>
         </div>
      </div>
    </div>
  );
}
