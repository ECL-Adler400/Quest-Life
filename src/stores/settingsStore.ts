import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '@/types';
import { db } from '@/lib/database';

interface SettingsState {
  settings: Settings;
  loading: boolean;
  error: string | null;
  
  // Actions
  initializeSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  updateTheme: (theme: 'light' | 'dark' | 'auto') => Promise<void>;
  updateLanguage: (language: 'en' | 'de') => Promise<void>;
  updateAccentColor: (color: string) => Promise<void>;
  toggleNotifications: () => Promise<void>;
  
  // Helper methods
  applyTheme: (theme: 'light' | 'dark' | 'auto') => void;
  applyAccentColor: (color: string) => void;
}

const defaultSettings: Settings = {
  theme: 'auto',
  language: 'en',
  accentColor: '#3B82F6',
  notificationsEnabled: true,
  reminderTime: '09:00',
  weeklyReportEnabled: true
};

export const useSettingsStore = create<SettingsState>()((
  persist(
    (set, get) => ({
      settings: defaultSettings,
      loading: false,
      error: null,

      initializeSettings: async () => {
        set({ loading: true, error: null });
        try {
          const settingsArray = await db.settings.toArray();
          if (settingsArray.length > 0) {
            set({ settings: settingsArray[0], loading: false });
          } else {
            await db.settings.add(defaultSettings);
            set({ settings: defaultSettings, loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to load settings', loading: false });
        }
      },

      updateSettings: async (updates) => {
        const { settings } = get();
        const newSettings = { ...settings, ...updates };
        
        try {
          // Update in database
          const settingsArray = await db.settings.toArray();
          if (settingsArray.length > 0) {
            await db.settings.update(settingsArray[0].id || 1, newSettings);
          } else {
            await db.settings.add(newSettings);
          }
          
          set({ settings: newSettings });
          
          // Apply theme changes
          if (updates.theme) {
            get().applyTheme(updates.theme);
          }
          
          // Apply accent color changes
          if (updates.accentColor) {
            get().applyAccentColor(updates.accentColor);
          }
        } catch (error) {
          set({ error: 'Failed to update settings' });
        }
      },

      updateTheme: async (theme) => {
        await get().updateSettings({ theme });
      },

      updateLanguage: async (language) => {
        await get().updateSettings({ language });
      },

      updateAccentColor: async (color) => {
        await get().updateSettings({ accentColor: color });
      },

      toggleNotifications: async () => {
        const { settings } = get();
        await get().updateSettings({ 
          notificationsEnabled: !settings.notificationsEnabled 
        });
      },

      // Helper methods
      applyTheme: (theme: 'light' | 'dark' | 'auto') => {
        if (typeof window === 'undefined') return;
        
        const root = document.documentElement;
        
        if (theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
          root.setAttribute('data-theme', theme);
        }
      },

      applyAccentColor: (color: string) => {
        if (typeof window === 'undefined') return;
        
        const root = document.documentElement;
        root.style.setProperty('--accent', color);
        
        // Calculate contrasting text color
        const rgb = hexToRgb(color);
        if (rgb) {
          const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
          const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
          root.style.setProperty('--accent-text', textColor);
        }
      }
    }),
    {
      name: 'quest-life-settings-store',
      partialize: (state) => ({ settings: state.settings })
    }
  )
));

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}