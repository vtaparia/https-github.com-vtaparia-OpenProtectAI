


import React from 'react';
import { DashboardIcon, AgentIcon, ServerIcon, IncidentReviewIcon, AutomationIcon, MitreAttackIcon } from './icons/NavIcons';

export type View = 'Dashboard' | 'Agent Fleet' | 'Server Intelligence' | 'Incident Review' | 'MITRE ATT&CK' | 'Automation';

interface NavigationSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  themeStyles: Record<string, string>;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: View;
    isActive: boolean;
    onClick: () => void;
    themeStyles: Record<string, string>;
}> = ({ icon, label, isActive, onClick, themeStyles }) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-3 text-xs font-medium rounded-lg transition-colors ${
            isActive ? `${themeStyles.navActiveBg} ${themeStyles.textAccent}` : `${themeStyles.textSecondary} ${themeStyles.navHoverBg}`
        }`}
    >
        {icon}
        <span className="mt-1">{label}</span>
    </button>
);

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ activeView, onViewChange, themeStyles }) => {
  return (
    <nav className={`w-28 p-3 space-y-3 shrink-0 ${themeStyles.navBg} ${themeStyles.borderRight}`}>
        <NavItem 
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={activeView === 'Dashboard'}
            onClick={() => onViewChange('Dashboard')}
            themeStyles={themeStyles}
        />
        <NavItem 
            icon={<AgentIcon />}
            label="Agent Fleet"
            isActive={activeView === 'Agent Fleet'}
            onClick={() => onViewChange('Agent Fleet')}
            themeStyles={themeStyles}
        />
        <NavItem 
            icon={<ServerIcon />}
            label="Server Intelligence"
            isActive={activeView === 'Server Intelligence'}
            onClick={() => onViewChange('Server Intelligence')}
            themeStyles={themeStyles}
        />
         <NavItem 
            icon={<IncidentReviewIcon />}
            label="Incident Review"
            isActive={activeView === 'Incident Review'}
            onClick={() => onViewChange('Incident Review')}
            themeStyles={themeStyles}
        />
        <NavItem 
            icon={<AutomationIcon />}
            label="Automation"
            isActive={activeView === 'Automation'}
            onClick={() => onViewChange('Automation')}
            themeStyles={themeStyles}
        />
        <NavItem 
            icon={<MitreAttackIcon />}
            label="MITRE ATT&CK"
            isActive={activeView === 'MITRE ATT&CK'}
            onClick={() => onViewChange('MITRE ATT&CK')}
            themeStyles={themeStyles}
        />
    </nav>
  );
};

export default NavigationSidebar;