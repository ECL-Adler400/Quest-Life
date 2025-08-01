import Dexie, { Table } from 'dexie';
import { User, Quest, FutureSelfVision, Achievement, Settings, CustomProgressBar, Equipment, Pet } from '@/types';

export class QuestLifeDatabase extends Dexie {
  users!: Table<User>;
  quests!: Table<Quest>;
  visions!: Table<FutureSelfVision>;
  achievements!: Table<Achievement>;
  settings!: Table<Settings>;
  customProgressBars!: Table<CustomProgressBar>;
  equipment!: Table<Equipment>;
  pets!: Table<Pet>;

  constructor() {
    super('QuestLifeDatabase');
    
    // Version 1: Original schema
    this.version(1).stores({
      users: '++id, name, email, xp, level, stamina, createdAt',
      quests: '++id, title, type, category, status, deadline, createdAt',
      visions: '++id, title, targetDate, progress, createdAt',
      achievements: '++id, title, category, isUnlocked, unlockedAt',
      settings: '++id, theme, language, accentColor'
    });
    
    // Version 2: Enhanced Habitica-inspired features
    this.version(2).stores({
      users: '++id, name, email, xp, level, hp, mana, gold, gems, class, stamina, createdAt',
      quests: '++id, title, type, category, status, difficulty, goldReward, deadline, createdAt',
      visions: '++id, title, targetDate, progress, createdAt',
      achievements: '++id, title, category, isUnlocked, unlockedAt',
      settings: '++id, theme, language, accentColor',
      customProgressBars: '++id, name, currentValue, targetValue, createdAt',
      equipment: '++id, name, type, rarity, levelRequirement',
      pets: '++id, name, species, rarity, questsToUnlock'
    }).upgrade(tx => {
      // Migrate existing users to new schema
      return tx.table('users').toCollection().modify(user => {
        // Add new Habitica-inspired fields if they don't exist
        if (user.hp === undefined) user.hp = 50;
        if (user.maxHp === undefined) user.maxHp = 50;
        if (user.mana === undefined) user.mana = 0;
        if (user.maxMana === undefined) user.maxMana = 0;
        if (user.gold === undefined) user.gold = 0;
        if (user.gems === undefined) user.gems = 0;
        if (user.stats === undefined) {
          user.stats = {
            strength: 0,
            intelligence: 0,
            constitution: 0,
            perception: 0
          };
        }
        if (user.equippedItems === undefined) {
          user.equippedItems = {
            weapon: undefined,
            armor: undefined,
            accessory: undefined,
            pet: undefined,
            mount: undefined
          };
        }
      });
    });
  }
}

export const db = new QuestLifeDatabase();

// Initialize default data
export const initializeDefaultData = async () => {
  try {
    const userCount = await db.users.count();
    if (userCount === 0) {
      // Create default user with enhanced Habitica-inspired features
      const defaultUser: User = {
        id: 'default',
        name: 'Adventurer',
        description: 'Ready to embark on life quests!',
        xp: 0,
        level: 1,
        
        // Habitica-inspired stats
        hp: 50,
        maxHp: 50,
        mana: 0,
        maxMana: 0,
        gold: 0,
        gems: 0,
        
        // Legacy stats (maintaining compatibility)
        stamina: 100,
        maxStamina: 100,
        wellness: 100,
        maxWelness: 100,
        
        // Class system (unlocked at level 10)
        class: undefined,
        classUnlockedAt: undefined,
        
        // Base stats
        stats: {
          strength: 0,
          intelligence: 0,
          constitution: 0,
          perception: 0
        },
        
        // Equipment slots
        equippedItems: {
          weapon: undefined,
          armor: undefined,
          accessory: undefined,
          pet: undefined,
          mount: undefined
        },
        
        // Tracking
        currentStreak: 0,
        longestStreak: 0,
        totalQuests: 0,
        completedQuests: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.users.add(defaultUser);
    }

    const settingsCount = await db.settings.count();
    if (settingsCount === 0) {
      // Create default settings
      const defaultSettings: Settings = {
        theme: 'auto',
        language: 'en',
        accentColor: '#3B82F6',
        notificationsEnabled: true,
        reminderTime: '09:00',
        weeklyReportEnabled: true
      };
      await db.settings.add(defaultSettings);
    }

    // Initialize achievements
    const achievementCount = await db.achievements.count();
    if (achievementCount === 0) {
      const defaultAchievements: Achievement[] = [
        {
          id: 'first-quest',
          title: 'First Steps',
          description: 'Complete your first quest',
          icon: '🎯',
          category: 'milestone',
          requirement: 1,
          progress: 0,
          isUnlocked: false
        },
        {
          id: 'streak-7',
          title: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: '🔥',
          category: 'streak',
          requirement: 7,
          progress: 0,
          isUnlocked: false
        },
        {
          id: 'level-5',
          title: 'Rising Hero',
          description: 'Reach Level 5',
          icon: '⭐',
          category: 'level',
          requirement: 5,
          progress: 0,
          isUnlocked: false
        },
        {
          id: 'quests-50',
          title: 'Quest Master',
          description: 'Complete 50 quests',
          icon: '👑',
          category: 'completion',
          requirement: 50,
          progress: 0,
          isUnlocked: false
        }
      ];
      await db.achievements.bulkAdd(defaultAchievements);
    }
  } catch (error) {
    console.error('Failed to initialize default data:', error);
  }
};