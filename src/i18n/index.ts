import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      quests: 'Quests',
      calendar: 'Calendar',
      profile: 'Profile',
      settings: 'Settings',
      
      // Dashboard
      welcome: 'Welcome back, {{name}}!',
      levelLabel: 'Level {{level}}',
      xpLabel: 'XP',
      staminaLabel: 'Stamina',
      wellnessLabel: 'Wellness',
      currentStreak: 'Current Streak',
      todayQuests: "Today's Quests",
      upcomingDeadlines: 'Upcoming Deadlines',
      readyToConquer: 'Ready to conquer today\'s challenges?',
      completed: 'Completed',
      successRate: 'Success Rate',
      totalQuests: 'Total Quests',
      noQuestsToday: 'No quests for today. Time to create some!',
      noUpcomingDeadlines: 'No upcoming deadlines. You\'re all caught up!',
      moreQuests: '+{{count}} more quests...',
      
      // Quests
      createQuest: 'Create Quest',
      dailyQuests: 'Daily Quests',
      longtermQuests: 'Long-term Quests',
      questTitle: 'Quest Title',
      questDescription: 'Description',
      questCategory: 'Category',
      questDifficulty: 'Difficulty',
      questXPReward: 'XP Reward',
      questStaminaCost: 'Stamina Cost',
      questDeadline: 'Deadline',
      manageQuests: 'Manage your life quests and track your progress',
      searchQuests: 'Search quests...',
      filters: 'Filters',
      allTypes: 'All Types',
      allStatus: 'All Status',
      allDifficulties: 'All Difficulties',
      allCategories: 'All Categories',
      noQuestsFound: 'No quests found',
      adjustFilters: 'Try adjusting your search or filters',
      createFirstQuest: 'Create your first quest to get started!',
      editQuest: 'Edit Quest',
      enterQuestTitle: 'Enter quest title...',
      describeQuest: 'Describe your quest...',
      selectCategory: 'Select category...',
      type: 'Type',
      presetColors: 'Preset Colors',
      customColor: 'Custom Color',
      showPicker: 'Show Picker',
      hidePicker: 'Hide Picker',
      applyColor: 'Apply Color',
      
      // Quest Management
      due: 'Due',
      deleteConfirm: 'Are you sure you want to delete this quest?',
      
      // Difficulties
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      
      // Categories
      health: 'Health',
      work: 'Work',
      learning: 'Learning',
      social: 'Social',
      personal: 'Personal',
      creative: 'Creative',
      
      // Actions
      complete: 'Complete',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      create: 'Create',
      close: 'Close',
      continue: 'Continue',
      install: 'Install',
      export: 'Export',
      sync: 'Sync',
      
      // Status
      active: 'Active',
      completed: 'Completed',
      archived: 'Archived',
      
      // Gamification
      levelUp: 'LEVEL UP!',
      congratulations: 'Congratulations!',
      questCompleted: 'Quest Completed!',
      xpEarned: '+{{amount}} XP earned!',
      streakIncreased: 'Streak increased to {{count}} days!',
      levelUpBonus: 'Level Up Bonuses:',
      maxStamina: '+{{amount}} Max Stamina',
      maxWellness: '+{{amount}} Max Wellness',
      fullRestore: 'Full Stamina & Wellness Restore',
      bonusXP: '+{{amount}} Bonus XP',
      continueQuest: 'Continue Your Quest!',
      reachedLevel: 'You\'ve reached Level {{level}}!',
      
      // Profile
      manageProfile: 'Manage your profile and view your achievements',
      editProfile: 'Edit Profile',
      yourName: 'Your name',
      tellAbout: 'Tell us about yourself...',
      noDescription: 'No description yet.',
      totalXP: 'Total XP',
      questsCompleted: 'Quests Completed',
      longestStreak: 'Longest Streak',
      days: '{{count}} days',
      best: 'Best: {{count}}',
      progressOverview: 'Progress Overview',
      progressCharts: 'Progress charts coming soon!',
      
      // Future Self
      futureSelf: 'Future Self',
      visionTitle: 'Vision Title',
      visionDescription: 'Describe your future self',
      targetDate: 'Target Date',
      motivation: 'What motivates you?',
      linkQuests: 'Link Quests',
      
      // Settings
      theme: 'Theme',
      language: 'Language',
      accentColor: 'Accent Color',
      notifications: 'Notifications',
      reminderTime: 'Reminder Time',
      weeklyReport: 'Weekly Report',
      customizeExperience: 'Customize your Quest Life experience',
      pushNotifications: 'Push Notifications',
      getReminded: 'Get reminded about your daily quests',
      weeklyProgress: 'Receive weekly progress summaries',
      accountSync: 'Account Sync',
      syncDescription: 'Sync your data across devices',
      enableSync: 'Enable Sync',
      exportCalendar: 'Export Calendar',
      calendarDescription: 'Export your quests to calendar apps',
      exportToCalendar: 'Export to Calendar',
      installApp: 'Install App',
      installDescription: 'Install Quest Life as a native app',
      showInstallGuide: 'Show Install Guide',
      
      // Themes
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      
      // Calendar
      trackProgress: 'Track your quest completion over time',
      today: 'Today',
      selectDate: 'Select a date',
      selectDateView: 'Select a date to view quest details',
      noQuestsDate: 'No quests on this date',
      
      // Install Guide
      installGuideTitle: 'Install Quest Life',
      installGuideDescription: 'Get the best experience by installing Quest Life as a native app on your device.',
      iosInstall: 'On iOS (iPhone/iPad)',
      iosStep1: '1. Open Safari and visit Quest Life',
      iosStep2: '2. Tap the Share button at the bottom',
      iosStep3: '3. Scroll down and tap "Add to Home Screen"',
      iosStep4: '4. Tap "Add" to install the app',
      macInstall: 'On Mac (Safari)',
      macStep1: '1. Open Safari and visit Quest Life',
      macStep2: '2. Click "File" in the menu bar',
      macStep3: '3. Select "Add to Dock"',
      androidInstall: 'On Android (Chrome)',
      androidStep1: '1. Open Chrome and visit Quest Life',
      androidStep2: '2. Tap the three dots menu',
      androidStep3: '3. Tap "Add to Home screen"',
      androidStep4: '4. Tap "Add" to install',
      windowsInstall: 'On Windows (Chrome/Edge)',
      windowsStep1: '1. Open your browser and visit Quest Life',
      windowsStep2: '2. Click the install icon in the address bar',
      windowsStep3: '3. Click "Install" to add to your apps',
      
      // Sync System
      syncEnabled: 'Sync Enabled',
      syncDisabled: 'Sync Disabled',
      lastSync: 'Last sync: {{time}}',
      syncNow: 'Sync Now',
      syncSuccess: 'Data synced successfully!',
      syncError: 'Sync failed. Please try again.',
      
      // Calendar Export
      calendarExported: 'Calendar exported successfully!',
      calendarExportError: 'Failed to export calendar.',
      copyLink: 'Copy Calendar Link',
      calendarLink: 'Calendar Link',
      calendarLinkDescription: 'Copy this link and add it to your calendar app as a subscription.',
      
      // Messages
      notEnoughStamina: 'Not enough stamina to complete this quest!',
      questCreated: 'Quest created successfully!',
      questUpdated: 'Quest updated successfully!',
      questDeleted: 'Quest deleted successfully!',
      settingsSaved: 'Settings saved successfully!',
      profileUpdated: 'Profile updated successfully!',
      avatarUpdated: 'Avatar updated!',
      profileUpdateFailed: 'Failed to update profile',
      avatarUpdateFailed: 'Failed to update avatar',
      loading: 'Loading...',
      
      // Placeholders
      emailPlaceholder: 'Enter your email...',
      passwordPlaceholder: 'Enter your password...',
      
      // Common
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      ok: 'OK',
      yes: 'Yes',
      no: 'No'
    }
  },
  de: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      quests: 'Quests',
      calendar: 'Kalender',
      profile: 'Profil',
      settings: 'Einstellungen',
      
      // Dashboard
      welcome: 'Willkommen zurück, {{name}}!',
      levelLabel: 'Level {{level}}',
      xpLabel: 'EP',
      staminaLabel: 'Ausdauer',
      wellnessLabel: 'Wohlbefinden',
      currentStreak: 'Aktuelle Serie',
      todayQuests: 'Heutige Quests',
      upcomingDeadlines: 'Bevorstehende Fristen',
      readyToConquer: 'Bereit, die heutigen Herausforderungen zu meistern?',
      completed: 'Abgeschlossen',
      successRate: 'Erfolgsquote',
      totalQuests: 'Gesamt Quests',
      noQuestsToday: 'Keine Quests für heute. Zeit, welche zu erstellen!',
      noUpcomingDeadlines: 'Keine bevorstehenden Fristen. Du bist auf dem neuesten Stand!',
      moreQuests: '+{{count}} weitere Quests...',
      
      // Quests
      createQuest: 'Quest erstellen',
      dailyQuests: 'Tägliche Quests',
      longtermQuests: 'Langzeit-Quests',
      questTitle: 'Quest-Titel',
      questDescription: 'Beschreibung',
      questCategory: 'Kategorie',
      questDifficulty: 'Schwierigkeit',
      questXPReward: 'EP-Belohnung',
      questStaminaCost: 'Ausdauerkosten',
      questDeadline: 'Frist',
      manageQuests: 'Verwalte deine Lebens-Quests und verfolge deinen Fortschritt',
      searchQuests: 'Quests suchen...',
      filters: 'Filter',
      allTypes: 'Alle Typen',
      allStatus: 'Alle Status',
      allDifficulties: 'Alle Schwierigkeiten',
      allCategories: 'Alle Kategorien',
      noQuestsFound: 'Keine Quests gefunden',
      adjustFilters: 'Versuche deine Suche oder Filter anzupassen',
      createFirstQuest: 'Erstelle deine erste Quest, um zu beginnen!',
      editQuest: 'Quest bearbeiten',
      enterQuestTitle: 'Quest-Titel eingeben...',
      describeQuest: 'Beschreibe deine Quest...',
      selectCategory: 'Kategorie auswählen...',
      type: 'Typ',
      presetColors: 'Vordefinierte Farben',
      customColor: 'Benutzerdefinierte Farbe',
      showPicker: 'Auswahl anzeigen',
      hidePicker: 'Auswahl verbergen',
      applyColor: 'Farbe anwenden',
      
      // Quest Management
      due: 'Fällig',
      deleteConfirm: 'Bist du sicher, dass du diese Quest löschen möchtest?',
      
      // Difficulties
      easy: 'Einfach',
      medium: 'Mittel',
      hard: 'Schwer',
      
      // Categories
      health: 'Gesundheit',
      work: 'Arbeit',
      learning: 'Lernen',
      social: 'Sozial',
      personal: 'Persönlich',
      creative: 'Kreativ',
      
      // Actions
      complete: 'Abschließen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      create: 'Erstellen',
      close: 'Schließen',
      continue: 'Weiter',
      install: 'Installieren',
      export: 'Exportieren',
      sync: 'Synchronisieren',
      
      // Status
      active: 'Aktiv',
      completed: 'Abgeschlossen',
      archived: 'Archiviert',
      
      // Gamification
      levelUp: 'LEVEL UP!',
      congratulations: 'Glückwunsch!',
      questCompleted: 'Quest abgeschlossen!',
      xpEarned: '+{{amount}} EP erhalten!',
      streakIncreased: 'Serie auf {{count}} Tage erhöht!',
      levelUpBonus: 'Level-Up Boni:',
      maxStamina: '+{{amount}} Max Ausdauer',
      maxWellness: '+{{amount}} Max Wohlbefinden',
      fullRestore: 'Vollständige Ausdauer & Wohlbefinden Wiederherstellung',
      bonusXP: '+{{amount}} Bonus EP',
      continueQuest: 'Setze deine Quest fort!',
      reachedLevel: 'Du hast Level {{level}} erreicht!',
      
      // Profile
      manageProfile: 'Verwalte dein Profil und sieh deine Erfolge an',
      editProfile: 'Profil bearbeiten',
      yourName: 'Dein Name',
      tellAbout: 'Erzähle uns von dir...',
      noDescription: 'Noch keine Beschreibung.',
      totalXP: 'Gesamt EP',
      questsCompleted: 'Abgeschlossene Quests',
      longestStreak: 'Längste Serie',
      days: '{{count}} Tage',
      best: 'Beste: {{count}}',
      progressOverview: 'Fortschritt Übersicht',
      progressCharts: 'Fortschritt-Diagramme kommen bald!',
      
      // Future Self
      futureSelf: 'Zukünftiges Ich',
      visionTitle: 'Visions-Titel',
      visionDescription: 'Beschreibe dein zukünftiges Ich',
      targetDate: 'Zieldatum',
      motivation: 'Was motiviert dich?',
      linkQuests: 'Quests verknüpfen',
      
      // Settings
      theme: 'Design',
      language: 'Sprache',
      accentColor: 'Akzentfarbe',
      notifications: 'Benachrichtigungen',
      reminderTime: 'Erinnerungszeit',
      weeklyReport: 'Wochenbericht',
      customizeExperience: 'Passe deine Quest Life Erfahrung an',
      pushNotifications: 'Push-Benachrichtigungen',
      getReminded: 'Lass dich an deine täglichen Quests erinnern',
      weeklyProgress: 'Erhalte wöchentliche Fortschritts-Zusammenfassungen',
      accountSync: 'Konto-Synchronisation',
      syncDescription: 'Synchronisiere deine Daten geräteübergreifend',
      enableSync: 'Sync aktivieren',
      exportCalendar: 'Kalender exportieren',
      calendarDescription: 'Exportiere deine Quests in Kalender-Apps',
      exportToCalendar: 'In Kalender exportieren',
      installApp: 'App installieren',
      installDescription: 'Installiere Quest Life als native App',
      showInstallGuide: 'Installationsanleitung anzeigen',
      
      // Themes
      light: 'Hell',
      dark: 'Dunkel',
      auto: 'Automatisch',
      
      // Calendar
      trackProgress: 'Verfolge deine Quest-Abschlüsse über die Zeit',
      today: 'Heute',
      selectDate: 'Datum auswählen',
      selectDateView: 'Wähle ein Datum aus, um Quest-Details anzuzeigen',
      noQuestsDate: 'Keine Quests an diesem Datum',
      
      // Install Guide
      installGuideTitle: 'Quest Life installieren',
      installGuideDescription: 'Erhalte die beste Erfahrung, indem du Quest Life als native App auf deinem Gerät installierst.',
      iosInstall: 'Auf iOS (iPhone/iPad)',
      iosStep1: '1. Öffne Safari und besuche Quest Life',
      iosStep2: '2. Tippe unten auf den Teilen-Button',
      iosStep3: '3. Scrolle nach unten und tippe auf "Zum Home-Bildschirm"',
      iosStep4: '4. Tippe "Hinzufügen" um die App zu installieren',
      macInstall: 'Auf Mac (Safari)',
      macStep1: '1. Öffne Safari und besuche Quest Life',
      macStep2: '2. Klicke "Datei" in der Menüleiste',
      macStep3: '3. Wähle "Zum Dock hinzufügen"',
      androidInstall: 'Auf Android (Chrome)',
      androidStep1: '1. Öffne Chrome und besuche Quest Life',
      androidStep2: '2. Tippe auf das Drei-Punkte-Menü',
      androidStep3: '3. Tippe "Zum Startbildschirm hinzufügen"',
      androidStep4: '4. Tippe "Hinzufügen" um zu installieren',
      windowsInstall: 'Auf Windows (Chrome/Edge)',
      windowsStep1: '1. Öffne deinen Browser und besuche Quest Life',
      windowsStep2: '2. Klicke das Installieren-Symbol in der Adressleiste',
      windowsStep3: '3. Klicke "Installieren" um zu deinen Apps hinzuzufügen',
      
      // Sync System
      syncEnabled: 'Sync aktiviert',
      syncDisabled: 'Sync deaktiviert',
      lastSync: 'Letzte Sync: {{time}}',
      syncNow: 'Jetzt synchronisieren',
      syncSuccess: 'Daten erfolgreich synchronisiert!',
      syncError: 'Synchronisation fehlgeschlagen. Bitte versuche es erneut.',
      
      // Calendar Export
      calendarExported: 'Kalender erfolgreich exportiert!',
      calendarExportError: 'Kalender-Export fehlgeschlagen.',
      copyLink: 'Kalender-Link kopieren',
      calendarLink: 'Kalender-Link',
      calendarLinkDescription: 'Kopiere diesen Link und füge ihn in deiner Kalender-App als Abonnement hinzu.',
      
      // Messages
      notEnoughStamina: 'Nicht genug Ausdauer für diese Quest!',
      questCreated: 'Quest erfolgreich erstellt!',
      questUpdated: 'Quest erfolgreich aktualisiert!',
      questDeleted: 'Quest erfolgreich gelöscht!',
      settingsSaved: 'Einstellungen erfolgreich gespeichert!',
      profileUpdated: 'Profil erfolgreich aktualisiert!',
      avatarUpdated: 'Avatar aktualisiert!',
      profileUpdateFailed: 'Profil-Update fehlgeschlagen',
      avatarUpdateFailed: 'Avatar-Update fehlgeschlagen',
      loading: 'Lädt...',
      
      // Placeholders
      emailPlaceholder: 'E-Mail eingeben...',
      passwordPlaceholder: 'Passwort eingeben...',
      
      // Common
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Vorherige',
      finish: 'Fertig',
      ok: 'OK',
      yes: 'Ja',
      no: 'Nein'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;