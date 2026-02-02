"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SportsSelector from "@/components/onboarding/SportsSelector";

export default function SportsPreferencesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (selectedSports.length === 0) {
      setError("Please select at least one sport to continue");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sports-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sports: selectedSports }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to save preferences");
      }

      // Redirect to dashboard after successful save
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 border-4 border-gameon-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gameon-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gameon-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-gameon-blue-500/30">
            <span className="text-3xl">🏆</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            What sports are you interested in?
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select your favorite sports to personalize your experience and connect with the right community
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          </div>
        )}

        {/* Sports Selector */}
        <div className="mb-12">
          <SportsSelector 
            onSelectionChange={setSelectedSports}
            initialSelection={selectedSports}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleContinue}
            disabled={isLoading || selectedSports.length === 0}
            className={`
              w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg
              transition-all duration-200 flex items-center justify-center gap-2
              ${
                selectedSports.length === 0
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gameon-blue-600 to-indigo-600 text-white shadow-lg shadow-gameon-blue-500/30 hover:shadow-xl hover:scale-105'
              }
            `}
          >
            {isLoading && (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? "Saving..." : "Continue"}
          </button>

          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Helper text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            You can always update your preferences later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
