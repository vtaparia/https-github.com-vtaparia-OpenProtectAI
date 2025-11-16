// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React from 'react';

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Feature: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-semibold text-cyan-400">{title}</h4>
        <p className="text-gray-400 text-sm mt-1">{children}</p>
    </div>
);

const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl text-gray-200 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold">What's New in v2.0.4</h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-100">Hardened Communication Channels (E2E TLS)</h3>
            
            <Feature title="End-to-End Encryption Hardening">
                Re-validated and hardened the mutual TLS (mTLS) implementation across all communication channels (Agent ↔ LWServer ↔ Central Server). This ensures all telemetry, directives, and intelligence updates are fully encrypted in transit.
            </Feature>
            <Feature title="Zero Trust Policy Enforcement">
                The platform's communication fabric now strictly enforces a Zero Trust security model, where no component is trusted by default and must present a valid client certificate to authenticate, protecting against eavesdropping and man-in-the-middle attacks.
            </Feature>
            
            <div className="border-t border-slate-700 my-6"></div>

            <h3 className="text-lg font-bold text-gray-100">Previous Versions</h3>
            
             <h4 className="text-md font-semibold text-gray-300 mt-2">v2.0.3 - IP Protection & Branding</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                 <Feature title="Copyright Notice">
                    A copyright notice has been added to the application's UI and embedded in all source code files to clearly state the ownership of the intellectual property.
                </Feature>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mt-2">v2.0.2 - Architectural Visibility & SOAR Enhancements</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                 <Feature title="LWServer Knowledge Meter">
                    The main dashboard now includes a "LWServer Knowledge Tier" meter, providing critical visibility into the intelligence level of your data aggregation points.
                </Feature>
                <Feature title="SOAR Action: Outbound Notifications">
                    Playbooks can now be configured to send real-time notifications to external systems, including Slack, MS Teams, and Email.
                </Feature>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mt-2">v2.0.1 - LWServer Fleet Management</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Architectural Visibility">
                    A new "LWServer Fleet" view provides a real-time dashboard of all deployed LWServers, visualizing the critical middle tier of the platform's architecture.
                </Feature>
            </div>
            
            <h4 className="text-md font-semibold text-gray-300 mt-2">v2.0.0 - Zero Trust Communication Fabric</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="End-to-End Encryption (mTLS)">
                    All communication between agents, LWServers, and the central cloud platform is now secured using a Zero Trust model with mutual TLS (mTLS).
                </Feature>
            </div>
        </main>
         <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md">
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ReleaseNotesModal;