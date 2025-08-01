import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Target, 
  Calendar, 
  User, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobile?: boolean;
}

const navItems = [
  { path: '/dashboard', icon: Home, labelKey: 'dashboard' },
  { path: '/quests', icon: Target, labelKey: 'quests' },
  { path: '/calendar', icon: Calendar, labelKey: 'calendar' },
  { path: '/profile', icon: User, labelKey: 'profile' },
  { path: '/settings', icon: Settings, labelKey: 'settings' }
];

export function Navigation({ currentPath, onNavigate, isMobile = false }: NavigationProps) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
              <img src="/images/quest-logo.jpg" alt="Quest Life" className="w-8 h-8 rounded" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Quest Life</h1>
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <motion.nav
          className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50"
          initial={{ x: -256 }}
          animate={{ x: isSidebarOpen ? 0 : -256 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-8">
              <img src="/images/quest-logo.jpg" alt="Quest Life" className="w-8 h-8 rounded" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Quest Life</h1>
            </div>
            
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={clsx(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>

        {/* Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
          <div className="flex justify-around items-center py-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={clsx(
                    'flex flex-col items-center space-y-1 px-3 py-2 transition-colors',
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <img src="/images/quest-logo.jpg" alt="Quest Life" className="w-10 h-10 rounded" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Quest Life</h1>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}