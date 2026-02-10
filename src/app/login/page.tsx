"use client";

import { useState, useMemo, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema, signupSchema, checkPasswordStrength, type LoginInput, type SignupInput } from "@/lib/validation/auth";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Initialize mode based on query param, default to login
  const [mode, setMode] = useState<"login" | "signup">(() => {
    return searchParams.get("mode") === "signup" ? "signup" : "login";
  });
  const [password, setPassword] = useState("");

  const passwordStrength = useMemo(() => {
    if (!password || mode === "login") return null;
    return checkPasswordStrength(password);
  }, [password, mode]);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const errors = mode === "login" ? loginErrors : signupErrors;

  const onLoginSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          throw new Error("Invalid email or password");
        }
        throw new Error(result.error);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error("Unable to connect to server. Please try again.");
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || "Registration failed");
      }

      // Success - redirect to sports preferences
      router.push("/sports-preferences");
      router.refresh();
    } catch (err: any) {
      console.error("Signup error:", err);
      
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Unable to connect to server. Please check your internet connection.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError(null);
    setPassword("");
    setShowPassword(false);
    resetLogin();
    resetSignup();
    
    // Optional: update URL parameters relative to the current path
    // This is a bit tricky with Next.js router, sticking to state is safer for now
    // unless we really need the URL to reflect the state change for bookmarking.
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex relative bg-gameon-blue-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-lg text-center text-white space-y-8">
          <h2 className="text-4xl font-bold tracking-tight">
            {mode === "login" ? "Welcome Back" : "Join The GameOn Co."}
          </h2>
          <p className="text-lg text-slate-200 leading-relaxed">
            {mode === "login" 
              ? "\"The connections I've made on The GameOn Co. have opened doors I didn't know existed. It's an essential tool for any serious athlete.\""
              : "\"The GameOn Co. has completely transformed how we scout talent. The verified stats and video integration make it effortless.\""
            }
          </p>
          <div>
            <div className="font-bold text-lg">
              {mode === "login" ? "Marcus Trent" : "Sarah Johnson"}
            </div>
            <div className="text-sky-300">
              {mode === "login" ? "Pro Basketball Player" : "Director of Scouting, Elite FC"}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
           {/* Top Mode Toggle REMOVED */}

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === "login" ? "Log in to your account" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {mode === "login" 
                ? "Enter your credentials to access your dashboard"
                : "Join thousands of sports professionals today"
              }
            </p>
          </div>

          <form 
            onSubmit={mode === "login" ? handleSubmitLogin(onLoginSubmit) : handleSubmitSignup(onSignupSubmit)} 
            className="mt-8 space-y-6"
          >
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Name field - only for signup */}
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    {...registerSignup("name")}
                    type="text"
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                  {signupErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{signupErrors.name.message}</p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  {...(mode === "login" ? registerLogin("email") : registerSignup("email"))}
                  type="email"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone field - only for signup */}
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Phone Number (Optional)
                  </label>
                  <input
                    {...registerSignup("phone")}
                    type="tel"
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                    placeholder="+1 234 567 8900"
                  />
                  {signupErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{signupErrors.phone.message}</p>
                  )}
                </div>
              )}

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === "login" && (
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-gameon-blue-600 hover:text-gameon-blue-500"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    {...(mode === "login" ? registerLogin("password") : registerSignup("password"))}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      if (mode === "signup") {
                        registerSignup("password").onChange(e);
                        setPassword(e.target.value);
                      } else {
                        registerLogin("password").onChange(e);
                      }
                    }}
                    className="block w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Password Strength Meter - only for signup */}
                {mode === "signup" && password && passwordStrength && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passwordStrength.score >= level
                              ? passwordStrength.strength === "weak"
                                ? "bg-red-500"
                                : passwordStrength.strength === "medium"
                                ? "bg-yellow-500"
                                : passwordStrength.strength === "strong"
                                ? "bg-blue-500"
                                : "bg-green-500"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.strength === "weak"
                        ? "text-red-600"
                        : passwordStrength.strength === "medium"
                        ? "text-yellow-600"
                        : passwordStrength.strength === "strong"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}>
                      Password strength: {passwordStrength.strength.replace("-", " ")}
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Date of Birth - only for signup */}
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Date of Birth
                  </label>
                  <input
                    {...registerSignup("dateOfBirth")}
                    type="date"
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  />
                  {signupErrors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">
                      {signupErrors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              )}

              {/* Role - only for signup */}
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    I am a...
                  </label>
                  <select
                    {...registerSignup("role")}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Role</option>
                    <option value="ATHLETE">Athlete</option>
                    <option value="COACH">Coach / Scout</option>
                    <option value="ACADEMY">Academy / Organization</option>
                  </select>
                  {signupErrors.role && (
                    <p className="mt-1 text-sm text-red-600">{signupErrors.role.message}</p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base flex justify-center items-center gap-2"
            >
              {isLoading && (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading 
                ? (mode === "login" ? "Logging in..." : "Creating Account...") 
                : (mode === "login" ? "Log In" : "Sign Up")
              }
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Sign in with Google
              </span>
            </button>
          </form>

            <div className="mt-6 text-center text-sm">
              {mode === "login" ? (
                <p className="text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className="font-medium text-gameon-blue-600 hover:text-gameon-blue-500 dark:text-gameon-blue-400"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="font-medium text-gameon-blue-600 hover:text-gameon-blue-500 dark:text-gameon-blue-400"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
