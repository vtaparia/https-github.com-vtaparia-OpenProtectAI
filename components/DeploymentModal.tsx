// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React, { useState } from 'react';
import { WindowsIcon, LinuxIcon, AppleIcon, AndroidIcon, AWSIcon, AzureIcon } from './icons/OSIcons';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Platform = 'Windows' | 'Linux' | 'macOS' | 'Android' | 'AWS' | 'Azure';

const AzureInfraGuide: React.FC = () => (
    <div className="text-xs text-gray-300 space-y-4">
        <div>
            <h4 className="font-bold text-gray-100 mb-1">LWServer VM Setup on Azure</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
                <li>
                    <strong>Create Virtual Machine:</strong>
                    <ul className="list-disc list-inside ml-4">
                        <li><strong>Image:</strong> Ubuntu Server 22.04 LTS</li>
                        <li><strong>Size:</strong> `Standard_D2s_v3` (or similar)</li>
                    </ul>
                </li>
                <li>
                    <strong>Networking:</strong>
                     <ul className="list-disc list-inside ml-4">
                        <li>Assign to a Virtual Network (VNet).</li>
                        <li>Configure Network Security Group (NSG) rules:
                            <ul className="list-['-_'] list-inside ml-6">
                                <li><strong>Inbound:</strong> Allow TCP on port `50051` from your agent IP ranges.</li>
                                <li><strong>Outbound:</strong> Allow TCP on port `443` to your Central Server's load balancer IP.</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                 <li>
                    <strong>Bootstrap Script (Custom Data):</strong> Use this `cloud-init` script in the 'Custom data' field under 'Advanced' settings during VM creation to automate setup.
                    <pre className="bg-gray-900 rounded-md p-2 mt-1 font-mono text-xs text-gray-300 whitespace-pre-wrap break-words">
                        <code>
{`#cloud-config
package_update: true
packages:
  - docker.io
runcmd:
  - systemctl start docker
  - systemctl enable docker
  - docker pull your-registry.io/lw-server:latest
  - docker run -d -p 50051:50051 --restart=always \\
    --name=lwserver \\
    -e CONFIG_VAR=... \\
    your-registry.io/lw-server:latest`}
                        </code>
                    </pre>
                </li>
            </ol>
        </div>
        <div>
            <h4 className="font-bold text-gray-100 mb-1">Central Server on Azure (High-Level)</h4>
            <p className="text-gray-400">Deploy the central platform using Azure-native services for scalability: <strong className="text-gray-300">AKS</strong> for compute, <strong className="text-gray-300">Event Hubs</strong> for messaging, <strong className="text-gray-300">Azure ML</strong> for analytics, and <strong className="text-gray-300">Azure Data Explorer</strong> for threat hunting.</p>
        </div>
    </div>
);

const platformConfig: Record<Platform, { icon: React.FC; script: (tenantId: string, lwServerUrl: string) => string; infraGuide?: React.FC }> = {
    Windows: {
        icon: WindowsIcon,
        script: (tenantId: string, lwServerUrl: string) => `[Net.ServicePointManager]::SecurityProtocol = 'Tls12';
Invoke-WebRequest -Uri "https://installers.your-cdn.com/agent-latest.msi" -OutFile "C:\\Windows\\Temp\\agent.msi";
msiexec /i "C:\\Windows\\Temp\\agent.msi" /quiet TENANT_ID="${tenantId}" LW_SERVER="${lwServerUrl}"`,
    },
    Linux: {
        icon: LinuxIcon,
        script: (tenantId: string, lwServerUrl: string) => `#!/bin/bash
curl -sO https://installers.your-cdn.com/agent-latest.deb
sudo dpkg -i agent-latest.deb
sudo /opt/cyber-agent/bin/configure --tenant-id=${tenantId} --lw-server=${lwServerUrl}`,
    },
    macOS: {
        icon: AppleIcon,
        script: (tenantId: string, lwServerUrl: string) => `curl -sO https://installers.your-cdn.com/agent-latest.pkg
sudo installer -pkg agent-latest.pkg -target /
sudo /usr/local/bin/cyber-agent-ctl configure ${tenantId} ${lwServerUrl}`,
    },
    AWS: {
        icon: AWSIcon,
        script: (tenantId: string, lwServerUrl: string) => `#!/bin/bash
# For use in EC2 User Data
curl -sO https://installers.your-cdn.com/agent-latest.deb
sudo dpkg -i agent-latest.deb
sudo /opt/cyber-agent/bin/configure --tenant-id=${tenantId} --lw-server=${lwServerUrl}`,
    },
    Azure: {
        icon: AzureIcon,
        script: () => `az vm run-command invoke \\
  --resource-group YOUR_RESOURCE_GROUP \\
  --name YOUR_VM_NAME \\
  --command-id RunShellScript \\
  --scripts "curl -sO https://installers.your-cdn.com/agent-latest.deb && sudo dpkg -i agent-latest.deb && sudo /opt/cyber-agent/bin/configure --tenant-id=YOUR_TENANT_ID --lw-server=grpcs://lwserver.your-domain.com:443"`,
        infraGuide: AzureInfraGuide,
    },
    Android: {
        icon: AndroidIcon,
        script: () => `1. Open the Corporate App Store.
2. Search for "Cyber Security Agent".
3. Tap Install and follow the on-screen prompts.
4. Open the app and scan the enrollment QR code.`,
    },
};

const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Windows');
  const [activeTab, setActiveTab] = useState<'agent' | 'infra'>('agent');
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return null;
  }
  
  const config = platformConfig[selectedPlatform];
  const scriptContent = config.script('YOUR_TENANT_ID', 'grpcs://lwserver.your-domain.com:443');
  const hasInfraGuide = !!config.infraGuide;

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setActiveTab('agent'); // Reset to agent tab on platform change
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-4xl text-gray-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Deploy New Agent</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 text-2xl leading-none">&times;</button>
        </header>

        <main className="p-6 flex-1 flex flex-col md:flex-row gap-6 min-h-[50vh]">
            <nav className="md:w-1/3 space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Select Target Platform</h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">These options generate scripts for installing endpoint agents.</p>
                {Object.keys(platformConfig).map(p => {
                    const plat = p as Platform;
                    const Icon = platformConfig[plat].icon;
                    return (
                        <button
                            key={plat}
                            onClick={() => handlePlatformSelect(plat)}
                            className={`w-full flex items-center gap-3 p-3 text-left rounded-md transition-colors ${selectedPlatform === plat ? 'bg-cyan-600/50' : 'hover:bg-gray-700'}`}
                        >
                            <Icon />
                            <span className="font-semibold">{plat}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="md:w-2/3 flex flex-col">
                {hasInfraGuide && (
                    <div className="flex border-b border-gray-700 mb-4">
                        <button 
                            onClick={() => setActiveTab('agent')}
                            className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'agent' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            Agent Deployment
                        </button>
                        <button 
                            onClick={() => setActiveTab('infra')}
                            className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'infra' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            Infrastructure Guide
                        </button>
                    </div>
                )}
                
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'agent' && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Deployment Instructions</h3>
                            <div className="bg-gray-900 rounded-md p-4 font-mono text-sm text-gray-300 relative">
                                <pre className="whitespace-pre-wrap break-words">
                                    <code>{scriptContent}</code>
                                </pre>
                                {selectedPlatform !== 'Android' && (
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                            </div>
                             <p className="text-xs text-gray-500 mt-2">
                                Run the command above with administrative privileges on the target device.
                            </p>
                        </div>
                    )}
                    {activeTab === 'infra' && hasInfraGuide && config.infraGuide && (
                        <div className="pr-2">
                            <config.infraGuide />
                        </div>
                    )}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default DeploymentModal;