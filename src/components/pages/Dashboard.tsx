import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { UserStatusBars } from '@/components/features/UserStatusBars';
import { QuestCard } from '@/components/features/QuestCard';
import { CustomProgressBars } from '@/components/features/CustomProgressBars';
import { useUserStore } from '@/stores/userStore';
import { useQuestStore } from '@/stores/questStore';
import { useCustomProgressStore } from '@/stores/customProgressStore';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Target, TrendingUp, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';

export function Dashboard() {
  const { user } = useUserStore();
  const { getTodayQuests, getUpcomingDeadlines } = useQuestStore();
  const { initializeProgressBars } = useCustomProgressStore();
  const { t } = useTranslation();

  const todayQuests = getTodayQuests();
  const upcomingDeadlines = getUpcomingDeadlines();

  // Initialize custom progress bars
  useEffect(() => {
    initializeProgressBars();
  }, [initializeProgressBars]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header with Crystal Theme */}
      <motion.div
        className="text-center py-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/quest-logo.jpg" alt="Quest Life" className="w-12 h-12 rounded-lg shadow-lg" />
            <h1 className="text-4xl font-bold text-white flex items-center gap-2">
              Quest Life
              <Sparkles className="w-8 h-8 text-purple-400 magical-pulse" />
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-purple-300">
            Ready to level up your life? ✨
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-purple-600/20 backdrop-blur-sm"></div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Status Bars */}
        <div className="xl:col-span-1">
          <UserStatusBars />
          
          {/* Quick Stats with Crystal Theme */}
          <motion.div
            className="mt-6 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="card-crystal p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {user.completedQuests}
              </div>
              <div className="text-sm text-gray-400">
                Completed
              </div>
            </div>
            
            <div className="card-crystal p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round((user.completedQuests / Math.max(user.totalQuests, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-400">
                Success Rate
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle & Right Columns - Quest Lists and Progress Bars */}
        <div className="xl:col-span-2 space-y-6">
          {/* Custom Progress Bars Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CustomProgressBars />
          </motion.div>
          {/* Today's Quests with Crystal Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Target className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">
                Today's Quests
              </h2>
              <span className="bg-purple-900/30 border border-purple-400/50 text-purple-300 text-sm px-2 py-1 rounded-full">
                {todayQuests.length}
              </span>
            </div>
            
            {todayQuests.length > 0 ? (
              <div className="space-y-3">
                {todayQuests.slice(0, 5).map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    compact
                  />
                ))}
                {todayQuests.length > 5 && (
                  <Card className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      +{todayQuests.length - 5} more quests...
                    </p>
                  </Card>
                )}
              </div>
            ) : (
              <div className="card-crystal text-center py-8">
                <Target className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-400">
                  No quests for today. Time to create some!
                </p>
              </div>
            )}
          </motion.div>

          {/* Upcoming Deadlines with Crystal Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="text-orange-400" size={24} />
              <h2 className="text-xl font-semibold text-white">
                Upcoming Deadlines
              </h2>
            </div>
            
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((quest) => (
                  <div key={quest.id} className="card-crystal p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {quest.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {quest.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-orange-400">
                          {quest.deadline && formatDistanceToNow(new Date(quest.deadline), { addSuffix: true })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {quest.xpReward} XP + {quest.goldReward || 0} Gold
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-crystal text-center py-8">
                <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-400">
                  No upcoming deadlines. You're all caught up!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}