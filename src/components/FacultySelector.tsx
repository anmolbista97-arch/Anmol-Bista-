import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Atom, TrendingUp, Scale, BookOpen } from 'lucide-react';
import { Faculty } from '../types';
import { FACULTIES } from '../data/faculties';

interface FacultySelectorProps {
  selectedFaculty: Faculty;
  onSelectFaculty: (faculty: Faculty) => void;
}

export const FacultySelector: React.FC<FacultySelectorProps> = ({
  selectedFaculty,
  onSelectFaculty,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFacultyIcon = (faculty: Faculty, size = 15) => {
    switch (faculty) {
      case 'Science':
        return <Atom size={size} className="text-cyan-400" />;
      case 'Management':
        return <TrendingUp size={size} className="text-emerald-400" />;
      case 'Law':
        return <Scale size={size} className="text-amber-400" />;
      case 'Humanities':
        return <BookOpen size={size} className="text-purple-400" />;
    }
  };

  const currentFacultyData = FACULTIES.find((f) => f.id === selectedFaculty) || FACULTIES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="faculty-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-700/80 hover:border-neutral-600 hover:bg-neutral-800/80 text-xs sm:text-sm font-medium text-neutral-200 transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
      >
        <span className="flex items-center gap-1.5">
          {getFacultyIcon(selectedFaculty, 14)}
          <span className="font-semibold text-neutral-100">{currentFacultyData.name}</span>
        </span>
        <span className="text-[10px] text-neutral-400 hidden md:inline">Faculty</span>
        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id="faculty-dropdown-menu"
          role="listbox"
          aria-label="Select Faculty"
          className="absolute right-0 mt-1.5 w-56 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl z-50 overflow-hidden"
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-neutral-400 border-b border-neutral-800">
            Select Academic Faculty
          </div>
          {FACULTIES.map((faculty) => {
            const isSelected = faculty.id === selectedFaculty;
            return (
              <button
                key={faculty.id}
                id={`faculty-option-${faculty.id.toLowerCase()}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectFaculty(faculty.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                  isSelected
                    ? 'bg-neutral-800/90 text-white font-medium'
                    : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-neutral-800 border border-neutral-700/50">
                    {getFacultyIcon(faculty.id, 14)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{faculty.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate max-w-[130px]">
                      {faculty.id === 'Science' && 'Physics, Chem, Math, CS'}
                      {faculty.id === 'Management' && 'Accounts, Econ, Business'}
                      {faculty.id === 'Law' && 'Constitution, Codes, Rights'}
                      {faculty.id === 'Humanities' && 'Literature, History, Soc'}
                    </div>
                  </div>
                </div>
                {isSelected && <Check size={14} className="text-cyan-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
