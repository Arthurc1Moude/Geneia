'use client';

import { useState } from 'react';

interface SuccessScreenProps {
  darkMode: boolean;
  installPath: string;
}

export default function SuccessScreen({ darkMode, installPath }: SuccessScreenProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopied(command);
    setTimeout(() => setCopied(null), 2000);
  };

  const launchIDE = () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal('geneia-studio://launch');
    }
  };

  const closeInstaller = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Installation Complete
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-12">
          Geneia IDE has been successfully installed on your system
        </p>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 w-full border border-slate-200 dark:border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Quick Start</h3>
          
          <div className="space-y-3">
            <CommandBox command="geneia --version" description="Check installation" copied={copied} onCopy={copyCommand} />
            <CommandBox command="geneia hello.gn" description="Run your first program" copied={copied} onCopy={copyCommand} />
            <CommandBox command="geneia --help" description="View all commands" copied={copied} onCopy={copyCommand} />
          </div>

          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Installation Path</p>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 font-mono mt-1">{installPath}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={launchIDE}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
          >
            Launch IDE
          </button>
          <button
            onClick={closeInstaller}
            className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close Installer
          </button>
        </div>
      </div>
    </div>
  );
}

function CommandBox({ command, description, copied, onCopy }: { 
  command: string; 
  description: string; 
  copied: string | null; 
  onCopy: (cmd: string) => void;
}) {
  return (
    <div className="bg-slate-900 dark:bg-black rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <code className="text-green-400 font-mono text-sm">{command}</code>
        <button
          onClick={() => onCopy(command)}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors"
        >
          {copied === command ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}
