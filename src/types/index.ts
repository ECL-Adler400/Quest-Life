export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  description?: string;
  xp: number;
  level: number;
  // Habitica-inspired stats
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  gold: number;
  gems: number;
  // Legacy stats (keeping for backward compatibility)
  stamina: number;
  maxStamina: number;
  wellness: number;
  maxWelness: number;
  // Class system
  class?: 'warrior' | 'mage' | 'healer' | 'rogue';
  classUnlockedAt?: Date;
  stats: {
    strength: number; // STR - affects quest rewards and damage
    intelligence: number; // INT - affects mana and magic abilities
    constitution: number; // CON - affects HP and damage resistance
    perception: number; // PER - affects finding rare items and critical hits
  };
  // Streaks and tracking
  currentStreak: number;
  longestStreak: number;
  totalQuests: number;
  completedQuests: number;
  // Equipment
  equippedItems: {
    weapon?: string;
    armor?: string;
    accessory?: string;
    pet?: string;
    mount?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'habit' | 'todo' | 'reward';
  category: string;
  xpReward: number;
  goldReward: number;
  manaReward?: number;
  staminaCost: number;
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'archived';
  deadline?: Date;
  completedAt?: Date;
  completedDates: Date[];
  streak: number;
  // Habit-specific fields
  isPositive?: boolean; // For habits: true = good habit, false = bad habit
  // Custom progress bar integration
  linkedProgressBars?: string[]; // IDs of progress bars this quest affects
  createdAt: Date;
  updatedAt: Date;
}

export interface FutureSelfVision {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  motivation: string;
  linkedQuestIds: string[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface Settings {
  id?: number;
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'de';
  accentColor: string;
  notificationsEnabled: boolean;
  reminderTime: string;
  weeklyReportEnabled: boolean;
}

export interface GameStats {
  totalXP: number;
  totalLevels: number;
  totalQuests: number;
  totalStreak: number;
  favoriteDifficulty: string;
  averageCompletion: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
}

export type QuestFilter = {
  type?: 'daily' | 'longterm' | 'all';
  status?: 'active' | 'completed' | 'archived' | 'all';
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
};

export type CalendarEvent = {
  date: Date;
  quests: Quest[];
  completionRate: number;
  totalXP: number;
};

// ========== NEW CUSTOM PROGRESS BARS (Key Innovation) ==========
export interface CustomProgressBar {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  currentValue: number;
  targetValue: number;
  visualizationType: 'bar' | 'circle' | 'crystal';
  // Increment/Decrement Rules
  rules: {
    increment: ProgressBarRule[];
    decrement: ProgressBarRule[];
  };
  // Milestones and rewards
  milestones: ProgressBarMilestone[];
  // History tracking
  history: ProgressBarHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressBarRule {
  id: string;
  triggerType: 'quest_complete' | 'daily_complete' | 'habit_positive' | 'habit_negative' | 'manual';
  triggerTaskId?: string; // For specific quest/daily/habit
  value: number; // Amount to increment/decrement
  description: string;
}

export interface ProgressBarMilestone {
  id: string;
  value: number;
  title: string;
  description: string;
  reward?: {
    type: 'gold' | 'gems' | 'xp' | 'item';
    amount: number;
    itemId?: string;
  };
  achieved: boolean;
  achievedAt?: Date;
}

export interface ProgressBarHistoryEntry {
  id: string;
  date: Date;
  previousValue: number;
  newValue: number;
  change: number;
  reason: string;
  triggerType: string;
}

// ========== EQUIPMENT & INVENTORY SYSTEM ==========
export interface Equipment {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  statBoosts: {
    strength?: number;
    intelligence?: number;
    constitution?: number;
    perception?: number;
  };
  specialEffects?: string[];
  goldCost: number;
  gemCost?: number;
  levelRequirement: number;
  classRestriction?: 'warrior' | 'mage' | 'healer' | 'rogue';
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  questsToUnlock: number;
  unlockedAt?: Date;
  mount?: {
    id: string;
    name: string;
    icon: string;
    questsToUnlock: number;
  };
}

// ========== CLASS SYSTEM ==========
export interface ClassInfo {
  id: 'warrior' | 'mage' | 'healer' | 'rogue';
  name: string;
  description: string;
  icon: string;
  primaryStats: string[];
  abilities: ClassAbility[];
  statBonuses: {
    strength?: number;
    intelligence?: number;
    constitution?: number;
    perception?: number;
  };
}

export interface ClassAbility {
  id: string;
  name: string;
  description: string;
  icon: string;
  manaCost: number;
  cooldown: number; // in hours
  effect: {
    type: 'heal' | 'damage_immunity' | 'xp_boost' | 'gold_boost' | 'streak_freeze';
    value: number;
    duration?: number; // in hours
  };
  levelRequirement: number;
  lastUsed?: Date;
}

// ========== SOCIAL & PARTY SYSTEM ==========
export interface Party {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  leaderId: string;
  questId?: string; // Current active party quest
  createdAt: Date;
}

export interface PartyQuest {
  id: string;
  partyId: string;
  title: string;
  description: string;
  type: 'boss' | 'collection' | 'challenge';
  progress: number;
  targetProgress: number;
  memberContributions: Record<string, number>;
  rewards: {
    xp: number;
    gold: number;
    items?: string[];
  };
  startedAt: Date;
  completedAt?: Date;
}