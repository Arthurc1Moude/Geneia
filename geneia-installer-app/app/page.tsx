'use client';

import { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import InstallScreen from '@/components/InstallScreen';
import ProgressScreen from '@/components/ProgressScreen';
import SuccessScreen from '@/components/SuccessScreen';
import TitleBar from '@/components/TitleBar';
import DependencyCheck from '@/components/DependencyCheck';

type Screen = 'welcome' | 'dependencies' | 'install' | 'progress' | 'success';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [installPath, setInstallPath] = useState<string>('');
  const [installType, setInstallType] = useState<'full' | 'minimal'>('full');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.getSystemInfo().then(setSystemInfo);
    }
    
    // Check system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const handleInstallStart = (type: 'full' | 'minimal', path: string) => {
    setInstallType(type);
    setInstallPath(path);
    setCurrentScreen('progress');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`h-screen w-screen ${darkMode ? 'dark' : ''}`}>
      <div className="h-full w-full bg-white dark:bg-slate-800 flex flex-col">
        <TitleBar darkMode={darkMode} onToggleTheme={toggleTheme} />
        
        <div className="flex-1 overflow-hidden">
          {currentScreen === 'welcome' && (
            <WelcomeScreen 
              systemInfo={systemInfo}
              darkMode={darkMode}
              onNext={() => setCurrentScreen('dependencies')}
            />
          )}
          
          {currentScreen === 'dependencies' && (
            <DependencyCheck
              darkMode={darkMode}
              onBack={() => setCurrentScreen('welcome')}
              onNext={() => setCurrentScreen('install')}
            />
          )}
          
          {currentScreen === 'install' && (
            <InstallScreen 
              darkMode={darkMode}
              onBack={() => setCurrentScreen('dependencies')}
              onInstall={handleInstallStart}
            />
          )}
          
          {currentScreen === 'progress' && (
            <ProgressScreen 
              darkMode={darkMode}
              installType={installType}
              installPath={installPath}
              onComplete={() => setCurrentScreen('success')}
            />
          )}
          
          {currentScreen === 'success' && (
            <SuccessScreen 
              darkMode={darkMode}
              installPath={installPath}
            />
          )}
        </div>

        <footer className="h-10 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            Developed by Moude AI Inc. • Version 1.0.0
          </p>
        </footer>
      </div>
    </div>
  );
}
