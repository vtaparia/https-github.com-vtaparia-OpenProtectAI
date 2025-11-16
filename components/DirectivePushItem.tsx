// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React from 'react';
import { ServerEvent, DirectivePush, AllEventTypes, AgentUpgradeDirective, YaraRuleUpdateDirective } from '../types';
import { DirectiveIcon } from './icons/DirectiveIcon';

interface DirectivePushItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const DirectivePushItem: React.FC<DirectivePushItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as DirectivePush;
  const { directive } = payload;

  let title = 'Directive Pushed';
  let description = 'A generic directive was sent to agents.';
  let details = 'General Update';

  if (directive.type === 'AGENT_UPGRADE') {
    const upgradeDirective = directive as AgentUpgradeDirective;
    title = 'Agent Upgrade Initiated';
    description = `Pushing upgrade to version ${upgradeDirective.version} for ${upgradeDirective.target_os} agents.`;
    details = `Version: ${upgradeDirective.version}`;
  } else if (directive.type === 'YARA_RULE_UPDATE') {
    const yaraDirective = directive as YaraRuleUpdateDirective;
    title = 'YARA Rule Pushed';
    description = `Pushing updated YARA rule "${yaraDirective.rule_name}" to agent fleet.`;
    details = `Rule: ${yaraDirective.rule_name}`;
  }

  return (
    <div className="p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border-l-4 border-cyan-500 overflow-hidden transition-colors duration-300 cursor-pointer"
         onClick={() => onSelectItem(event)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-cyan-400">
          <DirectiveIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-cyan-300">{title}</p>
          <p className="text-xs text-gray-300 mt-1">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
              {details}
            </span>
            {/* Provided a locale to toLocaleTimeString for consistent time formatting. */}
            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectivePushItem;