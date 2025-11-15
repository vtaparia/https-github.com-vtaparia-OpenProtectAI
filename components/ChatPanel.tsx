import React, { useState } from 'react';
import ResponseDisplay from './ResponseDisplay';
import PromptInput from './PromptInput';
import { ChatMessage } from '../types';
import { ChevronIcon } from './icons/ChevronIcon';

interface ChatPanelProps {
    chatHistory: ChatMessage[];
    isLoading: boolean;
    onSend: (prompt: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatHistory, isLoading, onSend }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={`shrink-0 bg-slate-800/50 backdrop-blur-lg border-t border-slate-700/50 transition-all duration-300 ease-in-out ${isExpanded ? 'h-1/2' : 'h-14'} flex flex-col`}>
             <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-1 bg-slate-700/50 hover:bg-slate-700 text-gray-400 flex items-center justify-center"
                title={isExpanded ? "Collapse Chat" : "Expand Chat"}
            >
                <span className="text-xs font-semibold">AI Architect Assistant</span>
                <div className={`${isExpanded ? '' : 'rotate-180'}`}>
                    <ChevronIcon isExpanded={!isExpanded} />
                </div>
            </button>
            <div className={`flex-1 flex flex-col overflow-hidden ${isExpanded ? 'visible' : 'hidden'}`}>
                <ResponseDisplay chatHistory={chatHistory} isLoading={isLoading} />
                <div className="p-4 border-t border-slate-700/50">
                    <PromptInput onSend={onSend} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;