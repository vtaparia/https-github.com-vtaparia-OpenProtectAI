// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React from 'react';

interface PayloadDetailsViewProps {
  payload: Record<string, any>;
}

const formatValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
}

const formatKey = (key: string): string => {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const PayloadDetailsView: React.FC<PayloadDetailsViewProps> = ({ payload }) => {
  return (
    <div className="text-xs text-gray-400 font-mono bg-gray-900/70 p-2 rounded-md space-y-1">
        {Object.entries(payload).map(([key, value]) => (
             <div key={key} className="grid grid-cols-3 gap-1">
                <span className="text-gray-500 col-span-1">{formatKey(key)}:</span>
                <pre className="text-gray-300 col-span-2 whitespace-pre-wrap break-all">{formatValue(value)}</pre>
            </div>
        ))}
    </div>
  );
};

export default PayloadDetailsView;