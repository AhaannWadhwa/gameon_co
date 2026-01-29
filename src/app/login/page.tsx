"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Handle explicit credentials vs other errors
        if (result.error === "CredentialsSignin") {
            throw new Error("Invalid email or password");
        }
        throw new Error(result.error);
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex relative bg-gameon-blue-900 items-center justify-center p-12 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
         
         <div className="relative z-10 max-w-lg text-center text-white space-y-8">
             <h2 className="text-4xl font-bold tracking-tight">Welcome Back</h2>
             <p className="text-lg text-slate-200 leading-relaxed">
               "The connections I've made on The GameOn Co. have opened doors I didn't know existed. It's an essential tool for any serious athlete."
             </p>
             <div>
                <div className="font-bold text-lg">Marcus Trent</div>
                <div className="text-sky-300">Pro Basketball Player</div>
             </div>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Log in to your account
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Enter your credentials to access your dashboard
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
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-gameon-blue-600 hover:text-gameon-blue-500">
                    Forgot password?
                  </a>
                </div>
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base flex justify-center items-center gap-2"
            >
              {isLoading && (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-gameon-blue-600 hover:text-gameon-blue-500"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
