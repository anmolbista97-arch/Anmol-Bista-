import React, { useState, useMemo } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, User, Bot, AlertTriangle, RotateCcw } from 'lucide-react';
import { ChatMessage } from '../types';
import { cleanMathAndLaTeX } from '../utils/mathCleaner';

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const cleanContent = useMemo(() => {
    return isUser ? message.content : cleanMathAndLaTeX(message.content);
  }, [message.content, isUser]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`py-4 px-3 sm:px-4 rounded-xl transition-colors ${
        isUser
          ? 'bg-neutral-900/60 border border-neutral-800/80 ml-auto max-w-[90%] sm:max-w-[80%]'
          : message.isError
          ? 'bg-red-950/20 border border-red-900/40 w-full'
          : 'bg-neutral-900/30 border border-neutral-800/40 w-full'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Role Icon */}
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
            isUser
              ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
              : message.isError
              ? 'bg-red-950/50 text-red-400 border border-red-800'
              : 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/60'
          }`}
        >
          {isUser ? (
            <User size={14} />
          ) : message.isError ? (
            <AlertTriangle size={14} />
          ) : (
            <Bot size={14} />
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-300">
                {isUser ? 'You' : 'StudyMate AI'}
              </span>
              {message.faculty && !isUser && !message.isError && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                  {message.faculty}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500">{message.timestamp}</span>
              {!message.isError && (
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy text"
                  aria-label="Copy message text"
                  className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>

          {/* Text Rendering */}
          {isUser ? (
            <div className="text-sm text-neutral-200 whitespace-pre-wrap break-words leading-relaxed font-normal">
              {message.content}
            </div>
          ) : message.isError ? (
            <div
              id={`error-banner-${message.id}`}
              className="w-full flex items-center justify-between gap-3 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 text-sm font-normal mt-1"
            >
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle size={15} className="text-red-400 shrink-0" />
                <span className="text-red-200 font-medium">Unable to load response.</span>
              </div>
              {onRetry && (
                <button
                  id={`retry-btn-${message.id}`}
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/60 hover:bg-red-800 text-red-100 hover:text-white rounded-lg text-xs font-semibold border border-red-700/60 transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw size={12} />
                  <span>Click to retry</span>
                </button>
              )}
            </div>
          ) : (
            <div className="academic-markdown text-sm text-neutral-200 leading-relaxed space-y-2 break-words font-normal">
              <Markdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  h1: ({ children }) => (
                    <h1 className="text-base font-bold text-neutral-100 mt-3 mb-1.5 border-b border-neutral-800 pb-1">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-sm font-bold text-neutral-100 mt-2.5 mb-1">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xs font-bold text-neutral-200 mt-2 mb-1">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-outside pl-4 mb-2 space-y-1 text-neutral-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside pl-4 mb-2 space-y-1 text-neutral-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-neutral-100">{children}</strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-neutral-700 pl-3 italic text-neutral-400 my-2">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-300 font-mono text-xs border border-neutral-700/60">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="relative my-2 rounded-lg bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs overflow-x-auto text-neutral-200">
                        <code>{children}</code>
                      </div>
                    );
                  },
                }}
              >
                {cleanContent}
              </Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
