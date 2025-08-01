import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTranslation } from 'react-i18next';
import { 
  Palette, 
  Globe, 
  Monitor, 
  Sun, 
  Moon, 
  Bell, 
  Clock,
  BarChart3,
  Download,
  RefreshCw,
  Smartphone,
  Copy,
  Calendar as CalendarIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const presetColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6366F1'  // Indigo
];

export function SettingsPage() {
  const { settings, updateSettings, updateTheme, updateLanguage, updateAccentColor, toggleNotifications } = useSettingsStore();
  const { t, i18n } = useTranslation();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const handleLanguageChange = async (language: 'en' | 'de') => {
    await updateLanguage(language);
    i18n.changeLanguage(language);
    toast.success(t('settingsSaved'));
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    await updateTheme(theme);
    toast.success(t('settingsSaved'));
  };

  const handleColorChange = async (color: string) => {
    await updateAccentColor(color);
    toast.success(t('settingsSaved'));
  };

  const handleSync = async () => {
    try {
      setIsSync(true);
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSyncTime(new Date());
      toast.success(t('syncSuccess'));
    } catch (error) {
      toast.error(t('syncError'));
    } finally {
      setIsSync(false);
    }
  };

  const handleCalendarExport = () => {
    try {
      // Generate ICS content
      const icsContent = generateICSContent();
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quest-life-calendar.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t('calendarExported'));
    } catch (error) {
      toast.error(t('calendarExportError'));
    }
  };

  const generateICSContent = () => {
    const now = new Date();
    const icsHeader = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Quest Life//Quest Life Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ].join('\r\n');
    
    const icsFooter = 'END:VCALENDAR';
    
    // Add sample daily reminder
    const dailyReminder = [
      'BEGIN:VEVENT',
      'UID:daily-quest-reminder@questlife.app',
      'DTSTART:' + format(now, 'yyyyMMdd') + 'T090000Z',
      'DTEND:' + format(now, 'yyyyMMdd') + 'T090000Z',
      'SUMMARY:Daily Quest Reminder',
      'DESCRIPTION:Time to check your daily quests in Quest Life!',
      'RRULE:FREQ=DAILY',
      'END:VEVENT'
    ].join('\r\n');
    
    return [icsHeader, dailyReminder, icsFooter].join('\r\n');
  };

  const copyCalendarLink = () => {
    const link = 'webcal://questlife.app/calendar.ics';
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Calendar link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('customizeExperience')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Monitor className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('theme')}
              </h2>
            </div>
            
            <div className="space-y-3">
              {[
                { key: 'light', icon: Sun, label: t('light') },
                { key: 'dark', icon: Moon, label: t('dark') },
                { key: 'auto', icon: Monitor, label: t('auto') }
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as any)}
                  className={clsx(
                    'w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all',
                    settings.theme === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <Icon size={20} className={settings.theme === key ? 'text-blue-500' : 'text-gray-500'} />
                  <span className={clsx(
                    'font-medium',
                    settings.theme === key ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="text-green-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('language')}
              </h2>
            </div>
            
            <div className="space-y-3">
              {[
                { key: 'en', label: 'English', flag: '🇺🇸' },
                { key: 'de', label: 'Deutsch', flag: '🇩🇪' }
              ].map(({ key, label, flag }) => (
                <button
                  key={key}
                  onClick={() => handleLanguageChange(key as any)}
                  className={clsx(
                    'w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all',
                    settings.language === key
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <span className="text-xl">{flag}</span>
                  <span className={clsx(
                    'font-medium',
                    settings.language === key ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Color Customization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="text-purple-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('accentColor')}
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Preset Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('presetColors')}
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={clsx(
                        'w-12 h-12 rounded-lg transition-all hover:scale-110',
                        settings.accentColor === color && 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Account Sync */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sync className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('accountSync')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('syncDescription')}
              </p>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {isSync ? t('syncEnabled') : t('syncDisabled')}
                  </div>
                  {lastSyncTime && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('lastSync', { time: format(lastSyncTime, 'MMM d, h:mm a') })}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleSync} 
                  size="sm" 
                  disabled={isSync}
                  variant="secondary"
                >
                  {isSync ? t('loading') : t('syncNow')}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Calendar Export */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="text-green-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('exportCalendar')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('calendarDescription')}
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleCalendarExport} 
                  variant="secondary" 
                  fullWidth
                >
                  <Download size={16} className="mr-2" />
                  {t('exportToCalendar')}
                </Button>
                
                <Button 
                  onClick={copyCalendarLink} 
                  variant="tertiary" 
                  fullWidth
                >
                  <Copy size={16} className="mr-2" />
                  {t('copyLink')}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="text-orange-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('notifications')}
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Enable Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t('pushNotifications')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('getReminded')}
                  </p>
                </div>
                <button
                  onClick={toggleNotifications}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
              
              {/* Reminder Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reminderTime')}
                </label>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              {/* Weekly Report */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t('weeklyReport')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('weeklyProgress')}
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ weeklyReportEnabled: !settings.weeklyReportEnabled })}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.weeklyReportEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.weeklyReportEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Install App */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="text-indigo-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('installApp')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('installDescription')}
              </p>
              
              <Button 
                onClick={() => setShowInstallGuide(true)} 
                variant="secondary" 
                fullWidth
              >
                <Smartphone size={16} className="mr-2" />
                {t('showInstallGuide')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Install Guide Modal */}
      <Modal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        title={t('installGuideTitle')}
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            {t('installGuideDescription')}
          </p>
          
          {/* iOS Instructions */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('iosInstall')}
            </h3>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t('iosStep1')}</li>
              <li>{t('iosStep2')}</li>
              <li>{t('iosStep3')}</li>
              <li>{t('iosStep4')}</li>
            </ol>
          </div>
          
          {/* Mac Instructions */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('macInstall')}
            </h3>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t('macStep1')}</li>
              <li>{t('macStep2')}</li>
              <li>{t('macStep3')}</li>
            </ol>
          </div>
          
          {/* Android Instructions */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('androidInstall')}
            </h3>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t('androidStep1')}</li>
              <li>{t('androidStep2')}</li>
              <li>{t('androidStep3')}</li>
              <li>{t('androidStep4')}</li>
            </ol>
          </div>
          
          {/* Windows Instructions */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('windowsInstall')}
            </h3>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t('windowsStep1')}</li>
              <li>{t('windowsStep2')}</li>
              <li>{t('windowsStep3')}</li>
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
}