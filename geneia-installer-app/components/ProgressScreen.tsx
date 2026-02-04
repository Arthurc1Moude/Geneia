'use client';

import { useState, useEffect } from 'react';

interface ProgressScreenProps {
  darkMode: boolean;
  installType: 'full' | 'minimal';
  installPath: string;
  onComplete: () => void;
}

export default function ProgressScreen({ darkMode, installType, installPath, onComplete }: ProgressScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Preparing installation...');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onInstallProgress((data) => {
        setProgress(data.percentage);
        setCurrentStep(data.message);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${data.message}`]);
      });

      // Start installation
      window.electronAPI.installGeneia({
        installPath: installPath || '/usr/local/geneia',
        installType
      }).then(() => {
        setTimeout(onComplete, 1000);
      }).catch((error) => {
        setLogs(prev => [...prev, `[ERROR] ${error.message}`]);
      });
    }
  }, [installType, installPath, onComplete]);

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Installing Geneia IDE
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-12">
          {installType === 'full' ? 'Full installation' : 'Minimal installation'} to {installPath}
        </p>

        <div className="w-full mb-8">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-slate-700 dark:text-slate-300 font-medium">{currentStep}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-mono">{progress}%</p>
          </div>
        </div>

        <div className="w-full bg-slate-900 dark:bg-black rounded-xl p-6 mb-8 h-80 overflow-y-auto font-mono text-sm border border-slate-700">
          {logs.map((log, index) => (
            <div key={index} className="text-green-400 mb-1">
              {log}
            </div>
          ))}
        </div>

        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    </div>
  );
}
