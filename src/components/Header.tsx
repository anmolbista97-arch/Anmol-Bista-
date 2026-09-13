import React from 'react';
import { GraduationCapLogo } from './GraduationCapLogo';
import { FacultySelector } from './FacultySelector';
import { Faculty } from '../types';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  selectedFaculty: Faculty;
  onSelectFaculty: (faculty: Faculty) => void;
  onResetChat: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedFaculty,
  onSelectFaculty,
  onResetChat,
  hasMessages,
}) => {
  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-[#1A1A1A]/95 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 sm:px-6"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Glowing Logo + Non-glowing Crisp Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Glowing neon cyan lightning effect ONLY on the graduation cap logo */}
          <GraduationCapLogo size="md" />

          {/* Crisp, normal, non-glowing text title */}
          <div className="flex flex-col min-w-0">
            <h1
              id="app-title"
              className="text-sm sm:text-base font-bold text-neutral-100 tracking-tight whitespace-nowrap"
            >
              STUDYMATE AI{' '}
              <span className="text-xs sm:text-sm font-normal text-neutral-400">
                by Anmol Bista
              </span>
            </h1>
            <span className="text-[11px] text-neutral-500 font-medium hidden sm:inline">
              Academic Intelligence Engine
            </span>
          </div>
        </div>

        {/* Right: Compact Faculty Selector + New Chat Button */}
        <div className="flex items-center gap-2">
          <FacultySelector
            selectedFaculty={selectedFaculty}
            onSelectFaculty={onSelectFaculty}
          />

          {hasMessages && (
            <button
              id="reset-chat-button"
              type="button"
              onClick={onResetChat}
              title="Start New Chat"
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Clear chat and start over"
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
