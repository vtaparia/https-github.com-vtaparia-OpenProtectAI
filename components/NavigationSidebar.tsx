

import React from 'react';
import { DashboardIcon, AgentIcon, ServerIcon, IncidentReviewIcon, AutomationIcon } from './icons/NavIcons';

export type View = 'Dashboard' | 'Agent Fleet' | 'Server Intelligence' | 'Incident Review' | 'Automation';

interface NavigationSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: View;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-3 text-xs font-medium rounded-lg transition-colors ${
            isActive ? 'bg-cyan-600/50 text-cyan-300' : 'text-gray-400 hover:bg-slate-700/50'
        }`}
    >
        {icon}
        <span className="mt-1">{label}</span>
    </button>
);

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="w-28 bg-slate-900/75 p-3 space-y-3 border-r border-slate-700/50 shrink-0">
        <NavItem 
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={activeView === 'Dashboard'}
            onClick={() => onViewChange('Dashboard')}
        />
        <NavItem 
            icon={<AgentIcon />}
            label="Agent Fleet"
            isActive={activeView === 'Agent Fleet'}
            onClick={() => onViewChange('Agent Fleet')}
        />
        <NavItem 
            icon={<ServerIcon />}
            label="Server Intelligence"
            isActive={activeView === 'Server Intelligence'}
            onClick={() => onViewChange('Server Intelligence')}
        />
         <NavItem 
            icon={<IncidentReviewIcon />}
            label="Incident Review"
            isActive={activeView === 'Incident Review'}
            onClick={() => onViewChange('Incident Review')}
        />
        <div className="border-t border-slate-700/50 my-2"></div>
        <NavItem 
            icon={<AutomationIcon />}
            label="Automation"
            isActive={activeView === 'Automation'}
            onClick={() => onViewChange('Automation')}
        />
    </nav>
  );
};

export default NavigationSidebar;