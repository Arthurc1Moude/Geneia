'use client';

import { useState } from 'react';

interface InstallScreenProps {
  darkMode: boolean;
  onBack: () => void;
  onInstall: (type: 'full' | 'minimal', path: string) => void;
}

export default function InstallScreen({ darkMode, onBack, onInstall }: InstallScreenProps) {
  const [selectedType, setSelectedType] = useState<'full' | 'minimal' | null>(null);
  const [installPath, setInstallPath] = useState('/usr/local/geneia');
  const [customPath, setCustomPath] = useState(false);

  const selectPath = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.selectInstallPath();
      if (path) {
        setInstallPath(path);
        setCustomPath(true);
      }
    }
  };

  const handleInstall = () => {
    if (selectedType) {
      onInstall(selectedType, installPath);
    }
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Choose Installation Type
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Select the installation that best fits your needs
        </p>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => setSelectedType('full')}
            className={`bg-slate-50 dark:bg-slate-900 border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedType === 'full' 
                ? 'border-indigo-600 dark:border-indigo-500 shadow-lg' 
                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Full Installation</h3>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'full' 
                  ? 'border-indigo-600 dark:border-indigo-500' 
                  : 'border-slate-300 dark:border-slate-600'
              }`}>
                {selectedType === 'full' && (
                  <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
                )}
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Complete IDE with all features, modules, and tools
            </p>
            
            <div className="space-y-2 mb-6">
              <Feature text="Geneia Compiler & Runtime" />
              <Feature text="Desktop IDE Application" />
              <Feature text="All Modules (GWS, GNEL, G_Render, G_Web)" />
              <Feature text="50+ Example Programs" />
              <Feature text="Complete Documentation" />
              <Feature text="Editor Support Files (VS Code, Vim, etc)" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Recommended</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">~200 MB</span>
            </div>
          </div>

          <div 
            onClick={() => setSelectedType('minimal')}
            className={`bg-slate-50 dark:bg-slate-900 border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedType === 'minimal' 
                ? 'border-indigo-600 dark:border-indigo-500 shadow-lg' 
                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Minimal Installation</h3>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'minimal' 
                  ? 'border-indigo-600 dark:border-indigo-500' 
                  : 'border-slate-300 dark:border-slate-600'
              }`}>
                {selectedType === 'minimal' && (
                  <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
                )}
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Just the compiler and essential CLI tools
            </p>
            
            <div className="space-y-2 mb-6">
              <Feature text="Geneia Compiler & Runtime" />
              <Feature text="Core Modules Only" />
              <Feature text="CLI Tools" />
              <Feature text="Basic Documentation" />
              <FeatureDisabled text="No Desktop IDE" />
              <FeatureDisabled text="No Examples" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">For servers</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">~50 MB</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Installation Path</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={installPath}
              onChange={(e) => setInstallPath(e.target.value)}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={selectPath}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Browse
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Default: /usr/local/geneia (requires sudo on Linux/macOS)
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleInstall}
            disabled={!selectedType}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Install Geneia
          </button>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-slate-700 dark:text-slate-300">{text}</span>
    </div>
  );
}

function FeatureDisabled({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <svg className="w-4 h-4 text-slate-400 dark:text-slate-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span className="text-slate-400 dark:text-slate-600">{text}</span>
    </div>
  );
}
