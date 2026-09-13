import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput, ChatInputHandle } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { Faculty, ChatMessage } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>('Science');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('studymate_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load session history', e);
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatusText, setLoadingStatusText] = useState('Generating answer...');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputHandle>(null);

  // Save conversation to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('studymate_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save session history', e);
    }
  }, [messages]);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string, retryFromHistory?: ChatMessage[]) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      faculty: selectedFaculty,
    };

    const baseHistory = retryFromHistory !== undefined ? retryFromHistory : messages;
    const newHistory = [...baseHistory, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setLoadingStatusText('Generating answer...');

    // Auto-focus input after sending
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 50);

    const executeFetch = async (attempt: number): Promise<any> => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: textToSend,
            history: newHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            faculty: selectedFaculty,
          }),
        });

        if (!response.ok) {
          if (response.status === 503 && attempt < 2) {
            setLoadingStatusText('Retrying...');
            await new Promise((res) => setTimeout(res, 1000));
            return executeFetch(attempt + 1);
          }
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Unable to load response. Click to retry.');
        }

        return await response.json();
      } catch (err: any) {
        if (attempt < 2 && (err?.message?.includes('503') || err?.message?.includes('Failed to fetch'))) {
          setLoadingStatusText('Retrying...');
          await new Promise((res) => setTimeout(res, 1000));
          return executeFetch(attempt + 1);
        }
        throw err;
      }
    };

    try {
      const data = await executeFetch(1);

      const aiMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Unable to load response. Click to retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        faculty: selectedFaculty,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: 'Unable to load response. Click to retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        faculty: selectedFaculty,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStatusText('Generating answer...');
      // Ensure auto-focus after response completes
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  };

  const handleRetry = (errorMsgId: string) => {
    if (isLoading) return;

    // Locate the error message and the preceding user message
    const errIndex = messages.findIndex((m) => m.id === errorMsgId);
    if (errIndex === -1) return;

    let userMsgText = '';
    let priorHistory: ChatMessage[] = [];

    for (let i = errIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMsgText = messages[i].content;
        priorHistory = messages.slice(0, i);
        break;
      }
    }

    if (userMsgText) {
      handleSend(userMsgText, priorHistory);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  const handleResetChat = () => {
    setMessages([]);
    try {
      sessionStorage.removeItem('studymate_chat_history');
    } catch (e) {
      console.warn(e);
    }
    chatInputRef.current?.focus();
  };

  return (
    <div
      id="studymate-app-root"
      className="min-h-screen bg-[#1A1A1A] text-neutral-100 flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-300"
    >
      {/* Header with Glowing Logo, Non-glowing Title & Compact Faculty Dropdown */}
      <Header
        selectedFaculty={selectedFaculty}
        onSelectFaculty={setSelectedFaculty}
        onResetChat={handleResetChat}
        hasMessages={messages.length > 0}
      />

      {/* Main Continuous Chat Container */}
      <main
        id="chat-main-area"
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4 pb-36 flex flex-col justify-start"
      >
        {messages.length === 0 ? (
          <EmptyState
            selectedFaculty={selectedFaculty}
            onSelectPrompt={handleSelectPrompt}
          />
        ) : (
          <div className="space-y-4 w-full">
            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                onRetry={message.isError ? () => handleRetry(message.id) : undefined}
              />
            ))}

            {/* Thinking / Streaming Indicator */}
            {isLoading && (
              <div
                id="ai-loading-indicator"
                className="py-2.5 px-4 rounded-xl bg-neutral-900/60 border border-neutral-800/60 w-fit flex items-center gap-3 text-xs text-neutral-300 animate-pulse"
              >
                <div className="w-5 h-5 rounded-md bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                  <Loader2 size={12} className="animate-spin text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 font-normal">
                  <span className="text-neutral-200 font-medium">{loadingStatusText}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* Fixed Bottom Question Input with Auto-Focus */}
      <ChatInput
        ref={chatInputRef}
        input={input}
        setInput={setInput}
        onSend={() => handleSend()}
        isLoading={isLoading}
        selectedFaculty={selectedFaculty}
      />
    </div>
  );
}
