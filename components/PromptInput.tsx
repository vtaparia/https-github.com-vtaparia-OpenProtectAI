// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React, { useState, KeyboardEvent } from 'react';

interface PromptInputProps {
  onSend: (prompt: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);


const PromptInput: React.FC<PromptInputProps> = ({ onSend, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSend(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the security architecture component you want to design..."
          className="w-full h-24 p-4 pr-12 text-gray-200 bg-slate-700/50 border border-slate-600/80 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-shadow"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 disabled:text-gray-600 enabled:hover:bg-cyan-500 enabled:hover:text-white transition-colors"
          aria-label="Send prompt"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PromptInput;