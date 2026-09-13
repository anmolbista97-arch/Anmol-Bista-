import React from 'react';
import { Faculty } from '../types';
import { FACULTIES } from '../data/faculties';
import { GraduationCapLogo } from './GraduationCapLogo';
import { Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';

interface EmptyStateProps {
  selectedFaculty: Faculty;
  onSelectPrompt: (promptText: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  selectedFaculty,
  onSelectPrompt,
}) => {
  const currentFaculty = FACULTIES.find((f) => f.id === selectedFaculty) || FACULTIES[0];

  return (
    <div
      id="empty-chat-state"
      className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-2xl mx-auto"
    >
      {/* Glowing Neon Cyan Lightning Effect ONLY on graduation cap logo icon */}
      <div className="mb-4">
        <GraduationCapLogo size="lg" />
      </div>

      {/* Crisp, normal, non-glowing text title */}
      <h2
        id="welcome-title"
        className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight mb-2"
      >
        STUDYMATE AI by Anmol Bista
      </h2>

      <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mb-6 leading-relaxed">
        High-performance academic intelligence for <span className="text-cyan-400 font-medium">{currentFaculty.name}</span>.
        Ask anything in <span className="text-neutral-200">English</span>,{' '}
        <span className="text-neutral-200">नेपाली (Devanagari)</span>, or{' '}
        <span className="text-neutral-200">Romanized Nepali</span>.
      </p>

      {/* Prompt Suggestions Grid */}
      <div className="w-full">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-3 px-1">
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-400" />
            Recommended {currentFaculty.name} Queries
          </span>
          <span className="text-[10px] text-neutral-500 lowercase">Click to ask directly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
          {currentFaculty.prompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`starter-prompt-${idx}`}
              type="button"
              onClick={() => onSelectPrompt(prompt.text)}
              className="group flex flex-col justify-between p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800/80 transition-all text-left shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">
                  {prompt.label}
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-neutral-500 group-hover:text-cyan-400 transition-colors flex-shrink-0"
                />
              </div>
              <p className="text-xs text-neutral-300 group-hover:text-neutral-100 font-normal line-clamp-2 leading-relaxed">
                "{prompt.text}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
