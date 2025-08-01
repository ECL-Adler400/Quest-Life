import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { db } from '@/lib/database';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Legacy actions (maintaining compatibility)
  initializeUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  spendStamina: (amount: number) => Promise<boolean>;
  restoreStamina: (amount: number) => Promise<void>;
  updateWellness: (amount: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
  levelUp: () => Promise<void>;
  
  // NEW HABITICA-INSPIRED ACTIONS
  // Health & Damage System
  takeDamage: (amount: number, reason?: string) => Promise<void>;
  healHP: (amount: number) => Promise<void>;
  checkDeath: () => Promise<boolean>;
  handleDeath: () => Promise<void>;
  
  // Mana System
  spendMana: (amount: number) => Promise<boolean>;
  restoreMana: (amount: number) => Promise<void>;
  
  // Currency System
  addGold: (amount: number) => Promise<void>;
  spendGold: (amount: number) => Promise<boolean>;
  addGems: (amount: number) => Promise<void>;
  spendGems: (amount: number) => Promise<boolean>;
  
  // Class System
  unlockClass: (className: 'warrior' | 'mage' | 'healer' | 'rogue') => Promise<void>;
  changeClass: (className: 'warrior' | 'mage' | 'healer' | 'rogue') => Promise<void>;
  useClassAbility: (abilityId: string) => Promise<boolean>;
  
  // Stats System
  addStats: (stats: Partial<User['stats']>) => Promise<void>;
  calculateTotalStats: () => User['stats'];
  
  // Equipment System
  equipItem: (itemId: string, slot: keyof User['equippedItems']) => Promise<void>;
  unequipItem: (slot: keyof User['equippedItems']) => Promise<void>;
}

const calculateLevelFromXP = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const calculateXPForLevel = (level: number): number => {
  // XP needed for level: (level - 1)^2 * 100
  return Math.pow(level - 1, 2) * 100;
};

export const useUserStore = create<UserState>()((
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      initializeUser: async () => {
        set({ loading: true, error: null });
        try {
          const users = await db.users.toArray();
          if (users.length > 0) {
            set({ user: users[0], loading: false });
          } else {
            // Create default user if none exists
            const defaultUser: User = {
              id: 'default',
              name: 'Adventurer',
              description: 'Ready to embark on life quests!',
              xp: 0,
              level: 1,
              
              // NEW: Habitica-inspired stats
              hp: 50,
              maxHp: 50,
              mana: 0, // Unlocked at level 10
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
            set({ user: defaultUser, loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to initialize user', loading: false });
        }
      },

      updateUser: async (updates) => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = { 
          ...user, 
          ...updates, 
          updatedAt: new Date() 
        };
        
        try {
          await db.users.update(user.id, updatedUser);
          set({ user: updatedUser });
        } catch (error) {
          set({ error: 'Failed to update user' });
        }
      },

      addXP: async (amount) => {
        const { user } = get();
        if (!user) return;
        
        const newXP = user.xp + amount;
        const newLevel = calculateLevelFromXP(newXP);
        const leveledUp = newLevel > user.level;
        
        const updates: Partial<User> = {
          xp: newXP,
          level: newLevel
        };
        
        await get().updateUser(updates);
        
        if (leveledUp) {
          await get().levelUp();
        }
      },

      spendStamina: async (amount) => {
        const { user } = get();
        if (!user || user.stamina < amount) {
          return false;
        }
        
        await get().updateUser({ stamina: user.stamina - amount });
        return true;
      },

      restoreStamina: async (amount) => {
        const { user } = get();
        if (!user) return;
        
        const newStamina = Math.min(user.stamina + amount, user.maxStamina);
        await get().updateUser({ stamina: newStamina });
      },

      updateWellness: async (amount) => {
        const { user } = get();
        if (!user) return;
        
        const newWellness = Math.max(0, Math.min(user.wellness + amount, user.maxWelness));
        await get().updateUser({ wellness: newWellness });
      },

      incrementStreak: async () => {
        const { user } = get();
        if (!user) return;
        
        const newStreak = user.currentStreak + 1;
        const newLongest = Math.max(newStreak, user.longestStreak);
        
        await get().updateUser({ 
          currentStreak: newStreak,
          longestStreak: newLongest
        });
      },

      resetStreak: async () => {
        await get().updateUser({ currentStreak: 0 });
      },

      levelUp: async () => {
        const { user } = get();
        if (!user) return;
        
        // Enhanced level up bonuses (Habitica-inspired)
        const hpBonus = 5;
        const manaBonus = user.level >= 10 ? 5 : 0; // Mana unlocks at level 10
        const staminaBonus = 10;
        const wellnessBonus = 5;
        const statBonus = 1; // Each level gives +1 to a primary stat based on class
        
        const updates: Partial<User> = {
          maxHp: user.maxHp + hpBonus,
          hp: user.maxHp + hpBonus, // Full restore on level up
          maxStamina: user.maxStamina + staminaBonus,
          stamina: user.maxStamina + staminaBonus,
          maxWelness: user.maxWelness + wellnessBonus,
          wellness: user.maxWelness + wellnessBonus
        };
        
        // Unlock mana at level 10
        if (user.level === 10) {
          updates.maxMana = 20;
          updates.mana = 20;
        } else if (user.level > 10) {
          updates.maxMana = user.maxMana + manaBonus;
          updates.mana = user.maxMana + manaBonus;
        }
        
        // Add stat bonus based on class
        if (user.class) {
          const newStats = { ...user.stats };
          switch (user.class) {
            case 'warrior':
              newStats.strength += statBonus;
              newStats.constitution += Math.floor(statBonus / 2);
              break;
            case 'mage':
              newStats.intelligence += statBonus;
              newStats.perception += Math.floor(statBonus / 2);
              break;
            case 'healer':
              newStats.constitution += statBonus;
              newStats.intelligence += Math.floor(statBonus / 2);
              break;
            case 'rogue':
              newStats.perception += statBonus;
              newStats.strength += Math.floor(statBonus / 2);
              break;
          }
          updates.stats = newStats;
        }
        
        await get().updateUser(updates);
      },
      
      // ========== NEW HABITICA-INSPIRED METHODS ==========
      
      // Health & Damage System
      takeDamage: async (amount, reason = 'Unknown') => {
        const { user } = get();
        if (!user) return;
        
        const constitution = get().calculateTotalStats().constitution;
        const damageReduction = Math.floor(constitution * 0.1);
        const actualDamage = Math.max(1, amount - damageReduction);
        
        const newHP = Math.max(0, user.hp - actualDamage);
        await get().updateUser({ hp: newHP });
        
        // Check for death
        if (newHP === 0) {
          await get().handleDeath();
        }
      },
      
      healHP: async (amount) => {
        const { user } = get();
        if (!user) return;
        
        const newHP = Math.min(user.hp + amount, user.maxHp);
        await get().updateUser({ hp: newHP });
      },
      
      checkDeath: async () => {
        const { user } = get();
        return user ? user.hp <= 0 : false;
      },
      
      handleDeath: async () => {
        const { user } = get();
        if (!user) return;
        
        // Death penalties (Habitica-inspired)
        const goldLoss = Math.floor(user.gold * 0.1); // Lose 10% of gold
        const levelLoss = user.level > 1 ? 1 : 0; // Lose 1 level (minimum level 1)
        const xpLoss = user.level > 1 ? calculateXPForLevel(user.level - 1) : 0;
        
        await get().updateUser({
          hp: 1, // Revive with 1 HP
          gold: Math.max(0, user.gold - goldLoss),
          level: user.level - levelLoss,
          xp: xpLoss,
          currentStreak: 0 // Reset streak on death
        });
      },
      
      // Mana System
      spendMana: async (amount) => {
        const { user } = get();
        if (!user || user.mana < amount) {
          return false;
        }
        
        await get().updateUser({ mana: user.mana - amount });
        return true;
      },
      
      restoreMana: async (amount) => {
        const { user } = get();
        if (!user) return;
        
        const newMana = Math.min(user.mana + amount, user.maxMana);
        await get().updateUser({ mana: newMana });
      },
      
      // Currency System
      addGold: async (amount) => {
        const { user } = get();
        if (!user) return;
        
        await get().updateUser({ gold: user.gold + amount });
      },
      
      spendGold: async (amount) => {
        const { user } = get();
        if (!user || user.gold < amount) {
          return false;
        }
        
        await get().updateUser({ gold: user.gold - amount });
        return true;
      },
      
      addGems: async (amount) => {
        const { user } = get();
        if (!user) return;
        
        await get().updateUser({ gems: user.gems + amount });
      },
      
      spendGems: async (amount) => {
        const { user } = get();
        if (!user || user.gems < amount) {
          return false;
        }
        
        await get().updateUser({ gems: user.gems - amount });
        return true;
      },
      
      // Class System
      unlockClass: async (className) => {
        const { user } = get();
        if (!user || user.level < 10) return; // Classes unlock at level 10
        
        await get().updateUser({
          class: className,
          classUnlockedAt: new Date()
        });
      },
      
      changeClass: async (className) => {
        const { user } = get();
        if (!user || user.level < 10) return;
        
        // Class change might cost gems in the future
        await get().updateUser({ class: className });
      },
      
      useClassAbility: async (abilityId) => {
        const { user } = get();
        if (!user || !user.class) return false;
        
        // TODO: Implement specific class abilities
        // This would check cooldowns, mana costs, etc.
        return false;
      },
      
      // Stats System
      addStats: async (stats) => {
        const { user } = get();
        if (!user) return;
        
        const newStats = {
          strength: user.stats.strength + (stats.strength || 0),
          intelligence: user.stats.intelligence + (stats.intelligence || 0),
          constitution: user.stats.constitution + (stats.constitution || 0),
          perception: user.stats.perception + (stats.perception || 0)
        };
        
        await get().updateUser({ stats: newStats });
      },
      
      calculateTotalStats: () => {
        const { user } = get();
        if (!user) return { strength: 0, intelligence: 0, constitution: 0, perception: 0 };
        
        // TODO: Add equipment bonuses
        return { ...user.stats };
      },
      
      // Equipment System
      equipItem: async (itemId, slot) => {
        const { user } = get();
        if (!user) return;
        
        const newEquippedItems = { ...user.equippedItems };
        newEquippedItems[slot] = itemId;
        
        await get().updateUser({ equippedItems: newEquippedItems });
      },
      
      unequipItem: async (slot) => {
        const { user } = get();
        if (!user) return;
        
        const newEquippedItems = { ...user.equippedItems };
        newEquippedItems[slot] = undefined;
        
        await get().updateUser({ equippedItems: newEquippedItems });
      }
    }),
    {
      name: 'quest-life-user-store',
      partialize: (state) => ({ user: state.user })
    }
  )
));