'use client';

import { useState, useEffect } from 'react';

interface DependencyCheckProps {
  darkMode: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function DependencyCheck({ darkMode, onBack, onNext }: DependencyCheckProps) {
  const [checking, setChecking] = useState(true);
  const [dependencies, setDependencies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.checkDependencies().then((deps) => {
        setDependencies(deps);
        setChecking(false);
      });
    } else {
      // Mock data for development
      setTimeout(() => {
        setDependencies({
          git: true,
          make: true,
          gpp: true,
          node: true
        });
        setChecking(false);
      }, 1500);
    }
  }, []);

  const allPassed = Object.values(dependencies).every(v => v);

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          System Requirements Check
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-12 text-center">
          Verifying that your system has the necessary tools to build and install Geneia
        </p>

        <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="space-y-4">
            {checking ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <DependencyItem name="Git" installed={dependencies.git} />
                <DependencyItem name="Make" installed={dependencies.make} />
                <DependencyItem name="G++ Compiler" installed={dependencies.gpp} />
                <DependencyItem name="Node.js" installed={dependencies.node} />
              </>
            )}
          </div>

          {!checking && !allPassed && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Some dependencies are missing. The installer will attempt to download pre-built binaries instead.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={checking}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function DependencyItem({ name, installed }: { name: string; installed: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <span className="text-slate-700 dark:text-slate-300 font-medium">{name}</span>
      <div className="flex items-center gap-2">
        {installed ? (
          <>
            <span className="text-sm text-green-600 dark:text-green-400">Installed</span>
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </>
        ) : (
          <>
            <span className="text-sm text-amber-600 dark:text-amber-400">Missing</span>
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}
