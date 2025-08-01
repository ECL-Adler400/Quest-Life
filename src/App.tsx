import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/components/pages/Dashboard';
import { QuestsPage } from '@/components/pages/QuestsPage';
import { CalendarPage } from '@/components/pages/CalendarPage';
import { ProfilePage } from '@/components/pages/ProfilePage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { LevelUpModal } from '@/components/features/LevelUpModal';
import { useUserStore } from '@/stores/userStore';
import { useQuestStore } from '@/stores/questStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { initializeDefaultData } from '@/lib/database';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import '@/i18n';

function App() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  const { user, initializeUser } = useUserStore();
  const { initializeQuests } = useQuestStore();
  const { initializeSettings } = useSettingsStore();
  const { i18n } = useTranslation();

  // Initialize app data
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDefaultData();
        await initializeUser();
        await initializeQuests();
        await initializeSettings();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };
    
    initialize();
  }, [initializeUser, initializeQuests, initializeSettings]);

  // Watch for level changes
  useEffect(() => {
    if (user) {
      const prevLevel = Number(localStorage.getItem('prevLevel') || '1');
      if (user.level > prevLevel) {
        setNewLevel(user.level);
        setShowLevelUp(true);
        localStorage.setItem('prevLevel', user.level.toString());
      }
    }
  }, [user?.level]);

  // Update language based on settings
  useEffect(() => {
    const settings = useSettingsStore.getState().settings;
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <Dashboard />;
      case '/quests':
        return <QuestsPage />;
      case '/calendar':
        return <CalendarPage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <Layout
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      >
        {renderPage()}
      </Layout>
      
      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        newLevel={newLevel}
      />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #333)',
            border: '1px solid var(--toast-border, #e5e7eb)'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
    </div>
  );
}

export default App;