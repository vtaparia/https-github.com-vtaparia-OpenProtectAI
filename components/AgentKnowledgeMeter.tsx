import React from 'react';

interface AgentKnowledgeMeterProps {
  level: number; // A value between 0 and 100
  themeStyles: Record<string, string>;
}

const AgentKnowledgeMeter: React.FC<AgentKnowledgeMeterProps> = ({ level, themeStyles }) => {
  const safeLevel = Math.max(0, Math.min(100, level));

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-semibold ${themeStyles.textSecondary}`}>Agent Knowledge Level</span>
        <span className="text-sm font-bold text-green-400">{safeLevel.toFixed(1)}%</span>
      </div>
      <div className={`w-full rounded-full h-2.5 ${themeStyles.meterBg}`}>
        <div
          className="bg-gradient-to-r from-emerald-500 to-green-400 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safeLevel}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AgentKnowledgeMeter;