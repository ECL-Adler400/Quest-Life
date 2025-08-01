import { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { useSettingsStore } from '@/stores/settingsStore';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Layout({ children, currentPath, onNavigate }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { settings, applyTheme, applyAccentColor } = useSettingsStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Apply theme and accent color on mount and settings change
    applyTheme(settings.theme);
    applyAccentColor(settings.accentColor);
  }, [settings.theme, settings.accentColor, applyTheme, applyAccentColor]);

  return (
    <div className={clsx(
      'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
      isMobile ? 'pt-16 pb-20' : 'pl-64'
    )}>
      <Navigation 
        currentPath={currentPath} 
        onNavigate={onNavigate} 
        isMobile={isMobile}
      />
      
      <main className={clsx(
        'transition-all duration-200',
        isMobile ? 'px-4 py-6' : 'px-8 py-8'
      )}>
        {children}
      </main>
    </div>
  );
}