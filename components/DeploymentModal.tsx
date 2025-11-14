import React, { useState } from 'react';
import { WindowsIcon, LinuxIcon, AppleIcon, AndroidIcon } from './icons/OSIcons';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Platform = 'Windows' | 'Linux' | 'macOS' | 'Android';

const platformConfig = {
    Windows: {
        icon: WindowsIcon,
        script: (tenantId: string, lwServerUrl: string) => `[Net.ServicePointManager]::SecurityProtocol = 'Tls12';
Invoke-WebRequest -Uri "https://installers.your-cdn.com/agent-latest.msi" -OutFile "C:\\Windows\\Temp\\agent.msi";
msiexec /i "C:\\Windows\\Temp\\agent.msi" /quiet TENANT_ID="${tenantId}" LW_SERVER="${lwServerUrl}"`,
    },
    Linux: {
        icon: LinuxIcon,
        script: (tenantId: string, lwServerUrl: string) => `curl -sO https://installers.your-cdn.com/agent-latest.deb
sudo dpkg -i agent-latest.deb
sudo /opt/cyber-agent/bin/configure --tenant-id=${tenantId} --lw-server=${lwServerUrl}`,
    },
    macOS: {
        icon: AppleIcon,
        script: (tenantId: string, lwServerUrl: string) => `curl -sO https://installers.your-cdn.com/agent-latest.pkg
sudo installer -pkg agent-latest.pkg -target /
sudo /usr/local/bin/cyber-agent-ctl configure ${tenantId} ${lwServerUrl}`,
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
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return null;
  }
  
  const config = platformConfig[selectedPlatform];
  const scriptContent = config.script('YOUR_TENANT_ID', 'grpcs://lwserver.your-domain.com:443');

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
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-3xl text-gray-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Deploy New Agent</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 flex-1 flex flex-col md:flex-row gap-6">
            <nav className="md:w-1/3 space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Select Target Platform</h3>
                {Object.keys(platformConfig).map(p => {
                    const plat = p as Platform;
                    const Icon = platformConfig[plat].icon;
                    return (
                        <button
                            key={plat}
                            onClick={() => setSelectedPlatform(plat)}
                            className={`w-full flex items-center gap-3 p-3 text-left rounded-md transition-colors ${selectedPlatform === plat ? 'bg-cyan-600/50' : 'hover:bg-gray-700'}`}
                        >
                            <Icon />
                            <span className="font-semibold">{plat}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="md:w-2/3">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Deployment Instructions</h3>
                <div className="bg-gray-900 rounded-md p-4 font-mono text-sm text-gray-300 relative h-64 overflow-y-auto">
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
        </main>
      </div>
    </div>
  );
};

export default DeploymentModal;