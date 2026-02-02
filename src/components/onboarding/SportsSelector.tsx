"use client";

import { useState } from 'react';
import { SPORTS_LIST, Sport } from '@/lib/sports-data';

interface SportsSelectorProps {
  onSelectionChange?: (selectedSports: string[]) => void;
  initialSelection?: string[];
}

export default function SportsSelector({ 
  onSelectionChange, 
  initialSelection = [] 
}: SportsSelectorProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>(initialSelection);

  const toggleSport = (sportId: string) => {
    const newSelection = selectedSports.includes(sportId)
      ? selectedSports.filter(id => id !== sportId)
      : [...selectedSports, sportId];
    
    setSelectedSports(newSelection);
    onSelectionChange?.(newSelection);
  };

  const isSelected = (sportId: string) => selectedSports.includes(sportId);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {SPORTS_LIST.map((sport) => (
          <SportCard
            key={sport.id}
            sport={sport}
            isSelected={isSelected(sport.id)}
            onToggle={() => toggleSport(sport.id)}
          />
        ))}
      </div>
      
      {selectedSports.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-gameon-blue-600 dark:text-gameon-blue-400">
              {selectedSports.length}
            </span>{' '}
            {selectedSports.length === 1 ? 'sport' : 'sports'} selected
          </p>
        </div>
      )}
    </div>
  );
}

interface SportCardProps {
  sport: Sport;
  isSelected: boolean;
  onToggle: () => void;
}

function SportCard({ sport, isSelected, onToggle }: SportCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative aspect-square rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-gameon-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-slate-900
        ${
          isSelected
            ? 'bg-gradient-to-br from-gameon-blue-500 to-indigo-600 shadow-lg shadow-gameon-blue-500/50 scale-95'
            : 'bg-white dark:bg-slate-800 hover:shadow-xl hover:scale-105 border-2 border-slate-200 dark:border-slate-700 hover:border-gameon-blue-400 dark:hover:border-gameon-blue-500'
        }
      `}
    >
      {/* Background gradient pattern */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 opacity-50" />
      )}
      
      {/* Icon and label */}
      <div className="relative h-full flex flex-col items-center justify-center p-3 md:p-4">
        <div className={`
          text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3
          transition-transform duration-300
          ${isSelected ? 'scale-110' : ''}
        `}>
          {sport.icon}
        </div>
        <div className={`
          text-xs md:text-sm font-semibold text-center leading-tight
          ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}
        `}>
          {sport.name}
        </div>
      </div>

      {/* Check mark overlay for selected state */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-4 h-4 text-gameon-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      )}

      {/* Shimmer effect on hover */}
      {!isSelected && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      )}
    </button>
  );
}
