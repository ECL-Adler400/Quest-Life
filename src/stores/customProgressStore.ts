import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomProgressBar, ProgressBarRule, ProgressBarMilestone, ProgressBarHistoryEntry } from '@/types';
import { db } from '@/lib/database';
import { useUserStore } from './userStore';

interface CustomProgressState {
  progressBars: CustomProgressBar[];
  loading: boolean;
  error: string | null;
  
  // Actions
  initializeProgressBars: () => Promise<void>;
  createProgressBar: (progressBar: Omit<CustomProgressBar, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => Promise<void>;
  updateProgressBar: (id: string, updates: Partial<CustomProgressBar>) => Promise<void>;
  deleteProgressBar: (id: string) => Promise<void>;
  
  // Value management
  updateProgressValue: (id: string, change: number, reason: string, triggerType: string) => Promise<void>;
  setProgressValue: (id: string, value: number, reason: string) => Promise<void>;
  
  // Rule management
  addRule: (progressBarId: string, rule: Omit<ProgressBarRule, 'id'>, type: 'increment' | 'decrement') => Promise<void>;
  removeRule: (progressBarId: string, ruleId: string, type: 'increment' | 'decrement') => Promise<void>;
  
  // Milestone management
  addMilestone: (progressBarId: string, milestone: Omit<ProgressBarMilestone, 'id' | 'achieved' | 'achievedAt'>) => Promise<void>;
  checkMilestones: (progressBarId: string) => Promise<void>;
  
  // Quest integration
  processQuestCompletion: (questId: string, questType: string, isPositive?: boolean) => Promise<void>;
  
  // Utility
  getProgressBar: (id: string) => CustomProgressBar | undefined;
  getProgressBarsByCategory: (category: string) => CustomProgressBar[];
  shouldTriggerRule: (rule: ProgressBarRule, questId: string, questType: string, isPositive: boolean) => boolean;
}

const generateId = () => `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useCustomProgressStore = create<CustomProgressState>()(
  persist(
    (set, get) => ({
      progressBars: [],
      loading: false,
      error: null,

      initializeProgressBars: async () => {
        set({ loading: true, error: null });
        try {
          // TODO: Load from database when implemented
          // For now, create some demo progress bars
          const demoProgressBars: CustomProgressBar[] = [
            {
              id: 'fitness_level',
              name: 'Fitness Level',
              description: 'Track your physical fitness progress',
              icon: '💪',
              color: '#22c55e',
              currentValue: 25,
              targetValue: 100,
              visualizationType: 'bar',
              rules: {
                increment: [
                  {
                    id: 'rule_1',
                    triggerType: 'habit_positive',
                    value: 5,
                    description: 'Exercise or workout completed'
                  }
                ],
                decrement: [
                  {
                    id: 'rule_2',
                    triggerType: 'habit_negative',
                    value: -2,
                    description: 'Skipped planned workout'
                  }
                ]
              },
              milestones: [
                {
                  id: 'milestone_1',
                  value: 50,
                  title: 'Getting Stronger',
                  description: 'You are halfway to peak fitness!',
                  reward: { type: 'gold', amount: 100 },
                  achieved: false
                },
                {
                  id: 'milestone_2',
                  value: 100,
                  title: 'Fitness Master',
                  description: 'You have reached peak physical condition!',
                  reward: { type: 'gems', amount: 5 },
                  achieved: false
                }
              ],
              history: [],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          
          set({ progressBars: demoProgressBars, loading: false });
        } catch (error) {
          set({ error: 'Failed to load progress bars', loading: false });
        }
      },

      createProgressBar: async (progressBarData) => {
        try {
          const newProgressBar: CustomProgressBar = {
            ...progressBarData,
            id: generateId(),
            history: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          set(state => ({ 
            progressBars: [...state.progressBars, newProgressBar] 
          }));
        } catch (error) {
          set({ error: 'Failed to create progress bar' });
        }
      },

      updateProgressBar: async (id, updates) => {
        try {
          set(state => ({
            progressBars: state.progressBars.map(pb => 
              pb.id === id ? { ...pb, ...updates, updatedAt: new Date() } : pb
            )
          }));
        } catch (error) {
          set({ error: 'Failed to update progress bar' });
        }
      },

      deleteProgressBar: async (id) => {
        try {
          set(state => ({
            progressBars: state.progressBars.filter(pb => pb.id !== id)
          }));
        } catch (error) {
          set({ error: 'Failed to delete progress bar' });
        }
      },

      updateProgressValue: async (id, change, reason, triggerType) => {
        const progressBar = get().getProgressBar(id);
        if (!progressBar) return;
        
        const oldValue = progressBar.currentValue;
        const newValue = Math.max(0, Math.min(progressBar.targetValue, oldValue + change));
        
        const historyEntry: ProgressBarHistoryEntry = {
          id: generateId(),
          date: new Date(),
          previousValue: oldValue,
          newValue: newValue,
          change: change,
          reason: reason,
          triggerType: triggerType
        };
        
        await get().updateProgressBar(id, {
          currentValue: newValue,
          history: [...progressBar.history, historyEntry]
        });
        
        await get().checkMilestones(id);
      },

      setProgressValue: async (id, value, reason) => {
        const progressBar = get().getProgressBar(id);
        if (!progressBar) return;
        
        const change = value - progressBar.currentValue;
        await get().updateProgressValue(id, change, reason, 'manual');
      },

      addRule: async (progressBarId, rule, type) => {
        const progressBar = get().getProgressBar(progressBarId);
        if (!progressBar) return;
        
        const newRule = { ...rule, id: generateId() };
        const newRules = { ...progressBar.rules };
        newRules[type] = [...newRules[type], newRule];
        
        await get().updateProgressBar(progressBarId, { rules: newRules });
      },

      removeRule: async (progressBarId, ruleId, type) => {
        const progressBar = get().getProgressBar(progressBarId);
        if (!progressBar) return;
        
        const newRules = { ...progressBar.rules };
        newRules[type] = newRules[type].filter(rule => rule.id !== ruleId);
        
        await get().updateProgressBar(progressBarId, { rules: newRules });
      },

      addMilestone: async (progressBarId, milestone) => {
        const progressBar = get().getProgressBar(progressBarId);
        if (!progressBar) return;
        
        const newMilestone: ProgressBarMilestone = {
          ...milestone,
          id: generateId(),
          achieved: false
        };
        
        await get().updateProgressBar(progressBarId, {
          milestones: [...progressBar.milestones, newMilestone]
        });
      },

      checkMilestones: async (progressBarId) => {
        const progressBar = get().getProgressBar(progressBarId);
        if (!progressBar) return;
        
        const { addGold, addGems, addXP } = useUserStore.getState();
        
        for (const milestone of progressBar.milestones) {
          if (!milestone.achieved && progressBar.currentValue >= milestone.value) {
            const updatedMilestones = progressBar.milestones.map(m => 
              m.id === milestone.id ? { ...m, achieved: true, achievedAt: new Date() } : m
            );
            
            await get().updateProgressBar(progressBarId, { milestones: updatedMilestones });
            
            if (milestone.reward) {
              switch (milestone.reward.type) {
                case 'gold':
                  await addGold(milestone.reward.amount);
                  break;
                case 'gems':
                  await addGems(milestone.reward.amount);
                  break;
                case 'xp':
                  await addXP(milestone.reward.amount);
                  break;
              }
            }
          }
        }
      },

      processQuestCompletion: async (questId, questType, isPositive = true) => {
        const { progressBars } = get();
        
        for (const progressBar of progressBars) {
          for (const rule of progressBar.rules.increment) {
            if (shouldTriggerRule(rule, questId, questType, isPositive)) {
              await get().updateProgressValue(
                progressBar.id,
                rule.value,
                rule.description,
                rule.triggerType
              );
            }
          }
          
          for (const rule of progressBar.rules.decrement) {
            if (shouldTriggerRule(rule, questId, questType, isPositive)) {
              await get().updateProgressValue(
                progressBar.id,
                rule.value,
                rule.description,
                rule.triggerType
              );
            }
          }
        }
      },

      // Helper method to determine if a rule should trigger
      shouldTriggerRule: (rule: ProgressBarRule, questId: string, questType: string, isPositive: boolean) => {
        switch (rule.triggerType) {
          case 'quest_complete':
            return rule.triggerTaskId ? rule.triggerTaskId === questId : true;
          case 'daily_complete':
            return questType === 'daily' && (rule.triggerTaskId ? rule.triggerTaskId === questId : true);
          case 'habit_positive':
            return questType === 'habit' && isPositive && (rule.triggerTaskId ? rule.triggerTaskId === questId : true);
          case 'habit_negative':
            return questType === 'habit' && !isPositive && (rule.triggerTaskId ? rule.triggerTaskId === questId : true);
          default:
            return false;
        }
      },

      getProgressBar: (id) => {
        return get().progressBars.find(pb => pb.id === id);
      },

      getProgressBarsByCategory: (category) => {
        return get().progressBars;
      }
    }),
    {
      name: 'quest-life-custom-progress-store',
      partialize: (state) => ({ progressBars: state.progressBars })
    }
  )
);

// Helper function outside the store
const shouldTriggerRule = (rule: ProgressBarRule, questId: string, questType: string, isPositive: boolean) => {
  switch (rule.triggerType) {
    case 'quest_complete':
      return rule.triggerTaskId ? rule.triggerTaskId === questId : true;
    case 'daily_complete':
      return questType === 'daily' && (rule.triggerTaskId ? rule.triggerTaskId === questId : true);
    case 'habit_positive':
      return questType === 'habit' && isPositive && (rule.triggerTaskId ? rule.triggerTaskId === questId : true);
    case 'habit_negative':
      return questType === 'habit' && !isPositive && (rule.triggerTaskId ? rule.triggerTaskId === questId : true);
    default:
      return false;
  }
};
