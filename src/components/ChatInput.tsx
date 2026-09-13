import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Faculty } from '../types';

export interface ChatInputHandle {
  focus: () => void;
  setValue: (val: string) => void;
}

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  selectedFaculty: Faculty;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  ({ input, setInput, onSend, isLoading, selectedFaculty }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      setValue: (val: string) => {
        setInput(val);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      },
    }));

    useEffect(() => {
      // Auto-focus on initial mount
      textareaRef.current?.focus();
    }, []);

    // Auto-resize textarea height based on content up to 140px
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = 'auto';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 140);
      textarea.style.height = `${newHeight}px`;
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() && !isLoading) {
          onSend();
        }
      }
    };

    return (
      <div
        id="chat-input-container"
        className="fixed bottom-0 left-0 right-0 z-30 bg-[#1A1A1A]/95 backdrop-blur-md border-t border-neutral-800/90 py-3 px-4 sm:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                onSend();
              }
            }}
            className="relative flex items-end gap-2 bg-neutral-900 border border-neutral-700/80 rounded-2xl p-1.5 sm:p-2 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/40 transition-all shadow-lg"
          >
            {/* Input textarea */}
            <textarea
              ref={textareaRef}
              id="academic-question-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${selectedFaculty} question in English, Nepali (नेपाली), or Romanized Nepali...`}
              disabled={isLoading}
              rows={1}
              className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none px-2.5 py-2 min-h-[44px] leading-relaxed disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              id="send-question-button"
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send question"
              className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                input.trim() && !isLoading
                  ? 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400 font-semibold shadow-md active:scale-95'
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-cyan-400" />
              ) : (
                <Send size={18} className="translate-x-0.5" />
              )}
            </button>
          </form>

          {/* Crisp, normal, non-glowing footer tag */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-500 px-1">
            <span id="footer-tag" className="font-normal">
              STUDYMATE AI by Anmol Bista • Dynamic Gemini API
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Sparkles size={11} className="text-neutral-500" />
              <span>Shift + Enter for new line</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';
