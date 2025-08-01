import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quest, QuestFilter } from '@/types';
import { db } from '@/lib/database';
import { useUserStore } from './userStore';
import { useCustomProgressStore } from './customProgressStore';

interface QuestState {
  quests: Quest[];
  filteredQuests: Quest[];
  currentFilter: QuestFilter;
  loading: boolean;
  error: string | null;
  
  // Actions
  initializeQuests: () => Promise<void>;
  addQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt' | 'completedDates' | 'streak' | 'status' | 'completedAt'>) => Promise<void>;
  updateQuest: (id: string, updates: Partial<Quest>) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  completeQuest: (id: string) => Promise<void>;
  setFilter: (filter: QuestFilter) => void;
  applyFilter: () => void;
  getTodayQuests: () => Quest[];
  getUpcomingDeadlines: () => Quest[];
}

const generateId = () => `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isCompletedToday = (quest: Quest): boolean => {
  return quest.completedDates.some(date => isToday(new Date(date)));
};

export const useQuestStore = create<QuestState>()((
  persist(
    (set, get) => ({
      quests: [],
      filteredQuests: [],
      currentFilter: { type: 'all', status: 'active' },
      loading: false,
      error: null,

      initializeQuests: async () => {
        set({ loading: true, error: null });
        try {
          const quests = await db.quests.toArray();
          set({ quests, loading: false });
          get().applyFilter();
        } catch (error) {
          set({ error: 'Failed to load quests', loading: false });
        }
      },

      addQuest: async (questData) => {
        try {
          const newQuest: Quest = {
            ...questData,
            id: generateId(),
            completedDates: [],
            streak: 0,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await db.quests.add(newQuest);
          set(state => ({ 
            quests: [...state.quests, newQuest] 
          }));
          get().applyFilter();
        } catch (error) {
          set({ error: 'Failed to create quest' });
        }
      },

      updateQuest: async (id, updates) => {
        try {
          const updatedQuest = {
            ...updates,
            updatedAt: new Date()
          };
          
          await db.quests.update(id, updatedQuest);
          set(state => ({
            quests: state.quests.map(quest => 
              quest.id === id ? { ...quest, ...updatedQuest } : quest
            )
          }));
          get().applyFilter();
        } catch (error) {
          set({ error: 'Failed to update quest' });
        }
      },

      deleteQuest: async (id) => {
        try {
          await db.quests.delete(id);
          set(state => ({
            quests: state.quests.filter(quest => quest.id !== id)
          }));
          get().applyFilter();
        } catch (error) {
          set({ error: 'Failed to delete quest' });
        }
      },

      completeQuest: async (id) => {
        const quest = get().quests.find(q => q.id === id);
        if (!quest) return;
        
        // Enhanced completion with new reward system
        const { user, spendStamina, addXP, addGold, addGems, incrementStreak, updateUser } = useUserStore.getState();
        const { processQuestCompletion } = useCustomProgressStore.getState();
        if (!user) return;
        
        const canComplete = await spendStamina(quest.staminaCost);
        if (!canComplete) {
          set({ error: 'Not enough stamina to complete this quest!' });
          return;
        }
        
        try {
          const now = new Date();
          const newCompletedDates = [...quest.completedDates, now];
          
          // Calculate streak for daily quests
          let newStreak = quest.streak;
          if (quest.type === 'daily') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const completedYesterday = quest.completedDates.some(date => 
              new Date(date).toDateString() === yesterday.toDateString()
            );
            
            if (completedYesterday || quest.streak === 0) {
              newStreak = quest.streak + 1;
            } else {
              newStreak = 1; // Reset streak if gap
            }
          }
          
          const updates: Partial<Quest> = {
            completedDates: newCompletedDates,
            streak: newStreak,
            completedAt: now
          };
          
          // Mark todo quests as completed
          if (quest.type === 'todo') {
            updates.status = 'completed';
          }
          
          await get().updateQuest(id, updates);
          
          // Award enhanced rewards (XP, Gold, Gems)
          await addXP(quest.xpReward);
          if (quest.goldReward && quest.goldReward > 0) {
            await addGold(quest.goldReward);
          }
          if (quest.manaReward && quest.manaReward > 0 && user.maxMana > 0) {
            // TODO: Add mana restoration method
          }
          
          // Update user stats
          await updateUser({ 
            totalQuests: user.totalQuests + 1,
            completedQuests: user.completedQuests + 1
          });
          
          // Update streak for daily quests
          if (quest.type === 'daily' && newStreak > quest.streak) {
            await incrementStreak();
          }
          
          // Process custom progress bar updates
          const isPositive = quest.type !== 'habit' || quest.isPositive !== false;
          await processQuestCompletion(quest.id, quest.type, isPositive);
          
        } catch (error) {
          set({ error: 'Failed to complete quest' });
        }
      },

      setFilter: (filter) => {
        set({ currentFilter: filter });
        get().applyFilter();
      },

      applyFilter: () => {
        const { quests, currentFilter } = get();
        let filtered = [...quests];
        
        if (currentFilter.type && currentFilter.type !== 'all') {
          filtered = filtered.filter(quest => quest.type === currentFilter.type);
        }
        
        if (currentFilter.status && currentFilter.status !== 'all') {
          filtered = filtered.filter(quest => quest.status === currentFilter.status);
        }
        
        if (currentFilter.category) {
          filtered = filtered.filter(quest => quest.category === currentFilter.category);
        }
        
        if (currentFilter.difficulty && currentFilter.difficulty !== 'all') {
          filtered = filtered.filter(quest => quest.difficulty === currentFilter.difficulty);
        }
        
        set({ filteredQuests: filtered });
      },

      getTodayQuests: () => {
        const { quests } = get();
        return quests.filter(quest => 
          quest.type === 'daily' && 
          quest.status === 'active' &&
          !isCompletedToday(quest)
        );
      },

      getUpcomingDeadlines: () => {
        const { quests } = get();
        const upcoming = quests.filter(quest => 
          quest.type === 'todo' && 
          quest.status === 'active' && 
          quest.deadline
        );
        
        return upcoming.sort((a, b) => {
          if (!a.deadline || !b.deadline) return 0;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }).slice(0, 5); // Return top 5 upcoming
      }
    }),
    {
      name: 'quest-life-quest-store',
      partialize: (state) => ({ 
        quests: state.quests,
        currentFilter: state.currentFilter
      })
    }
  )
));