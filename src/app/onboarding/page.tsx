"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

const interestsList = [
  { id: "football", label: "Football", icon: "⚽" },
  { id: "cricket", label: "Cricket", icon: "🏏" },
  { id: "basketball", label: "Basketball", icon: "🏀" },
  { id: "tennis", label: "Tennis", icon: "🎾" },
  { id: "athletics", label: "Athletics", icon: "🏃" },
  { id: "gym", label: "Gym & Fitness", icon: "💪" },
  { id: "yoga", label: "Yoga", icon: "🧘" },
  { id: "esports", label: "Esports", icon: "🎮" },
  { id: "analytics", label: "Sports Analytics", icon: "📊" },
  { id: "coaching", label: "Coaching", icon: "📋" },
  { id: "scouting", label: "Scouting", icon: "🔍" },
  { id: "medicine", label: "Sports Medicine", icon: "⚕️" },
  { id: "refereeing", label: "Refereeing", icon: "🏁" },
  { id: "creation", label: "Content Creation", icon: "📹" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (!res.ok) throw new Error("Failed to update interests");

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent dark:to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-4">
            What are you interested in?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Select distinct sports and activities to customize your experience.
            We&apos;ll tailor your feed and recommendations based on your choices.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
          {interestsList.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <motion.button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 border ${
                  isSelected
                    ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700"
                }`}
              >
                <span className="text-4xl mb-3 filter drop-shadow-sm">
                  {interest.icon}
                </span>
                <span
                  className={`text-sm font-medium text-center ${
                    isSelected
                      ? "text-white"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {interest.label}
                </span>
                
                {isSelected && (
                  <div className="absolute top-3 right-3 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedInterests.length === 0 || isSubmitting}
            className={`
              px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg
              ${
                selectedInterests.length > 0
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 transform hover:-translate-y-1"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Saving...
              </span>
            ) : (
              "Continue to Dashboard"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
