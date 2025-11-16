// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage, MessageRole } from '../types';
import MermaidDiagram from './MermaidDiagram';
import { UserIcon } from './icons/UserIcon';
import { RobotIcon } from './icons/RobotIcon';

interface ResponseDisplayProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

const CodeBlock: React.FC<{ node: any, inline?: boolean, className?: string, children: React.ReactNode & React.ReactNode[] }> = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  if (language === 'mermaid') {
    return <MermaidDiagram chart={String(children)} />;
  }

  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ chatHistory, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);
  
  const markdownComponents = {
    code: CodeBlock,
    h1: (props: any) => <h1 className="text-2xl font-bold mt-5 mb-3 border-b border-slate-600 pb-2" {...props} />,
    h2: (props: any) => <h2 className="text-xl font-semibold mt-4 mb-2 border-b border-slate-700 pb-1" {...props} />,
    h3: (props: any) => <h3 className="text-lg font-semibold mt-3 mb-1" {...props} />,
    p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside mb-4 ml-4 space-y-1" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside mb-4 ml-4 space-y-1" {...props} />,
    li: (props: any) => <li className="mb-1" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-400 my-4" {...props} />,
    table: (props: any) => <table className="table-auto w-full my-4 border-collapse border border-slate-600" {...props} />,
    thead: (props: any) => <thead className="bg-slate-800" {...props} />,
    th: (props: any) => <th className="border border-slate-600 px-4 py-2 text-left" {...props} />,
    td: (props: any) => <td className="border border-slate-600 px-4 py-2" {...props} />,
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 p-4 my-2 rounded-lg ${msg.role === MessageRole.USER ? 'bg-slate-700/50' : 'bg-transparent'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === MessageRole.USER ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                  {msg.role === MessageRole.USER ? <UserIcon /> : <RobotIcon />}
              </div>
              <div className="flex-1 pt-1 min-w-0">
                  <strong className="text-sm font-semibold text-gray-400">{msg.role === MessageRole.USER ? 'You' : 'Cyber Architect AI'}</strong>
                  {msg.role === MessageRole.ERROR ? (
                      <p className="text-red-400 mt-1">{msg.content}</p>
                  ) : (
                      <div className="prose prose-invert max-w-none prose-pre:bg-slate-800 prose-pre:p-4 prose-pre:rounded-md mt-1 text-gray-300">
                        <ReactMarkdown components={markdownComponents}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                  )}
              </div>
          </div>
        ))}
        {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role !== MessageRole.MODEL && (
          <div className="flex items-start gap-4 p-4 my-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700">
                  <RobotIcon />
              </div>
              <div className="flex-1 pt-1">
                  <strong className="text-sm font-semibold text-gray-400">Cyber Architect AI</strong>
                   <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                   </div>
              </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ResponseDisplay;