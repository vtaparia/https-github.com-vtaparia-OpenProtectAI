import React from 'react';

interface AgentKnowledgeMeterProps {
  level: number; // A value between 0 and 100
}

const AgentKnowledgeMeter: React.FC<AgentKnowledgeMeterProps> = ({ level }) => {
  const safeLevel = Math.max(0, Math.min(100, level));

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-gray-300">Agent Knowledge Level</span>
        <span className="text-sm font-bold text-green-400">{safeLevel.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-emerald-500 to-green-400 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safeLevel}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AgentKnowledgeMeter;
