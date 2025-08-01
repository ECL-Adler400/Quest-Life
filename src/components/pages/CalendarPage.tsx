import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useQuestStore } from '@/stores/questStore';
import { useTranslation } from 'react-i18next';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Target
} from 'lucide-react';
import { clsx } from 'clsx';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';

export function CalendarPage() {
  const { quests } = useQuestStore();
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'all' | 'daily' | 'todo' | 'habit'>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getQuestsForDate = (date: Date) => {
    return quests.filter(quest => {
      if (filter !== 'all' && quest.type !== filter) return false;
      
      // For daily quests, check if completed on this date
      if (quest.type === 'daily') {
        return quest.completedDates.some(completedDate => 
          isSameDay(new Date(completedDate), date)
        );
      }
      
      // For todo quests, check if deadline is on this date
      if (quest.type === 'todo' && quest.deadline) {
        return isSameDay(new Date(quest.deadline), date);
      }
      
      return false;
    });
  };

  const getDateInfo = (date: Date) => {
    const questsOnDate = getQuestsForDate(date);
    const completedQuests = questsOnDate.filter(q => 
      q.status === 'completed' || 
      (q.type === 'daily' && q.completedDates.some(d => isSameDay(new Date(d), date)))
    );
    
    return {
      questCount: questsOnDate.length,
      completedCount: completedQuests.length,
      completionRate: questsOnDate.length > 0 ? (completedQuests.length / questsOnDate.length) * 100 : 0
    };
  };

  const selectedDateQuests = selectedDate ? getQuestsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('calendar')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your quest completion over time
          </p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Quests</option>
            <option value="daily">Daily Quests</option>
            <option value="longterm">Long-term Quests</option>
          </select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const { questCount, completionRate } = getDateInfo(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={clsx(
                      'relative p-2 h-16 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg',
                      {
                        'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500': isSelected,
                        'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': isTodayDate && !isSelected,
                        'text-gray-900 dark:text-gray-100': isSameMonth(day, currentDate) && !isTodayDate,
                        'text-gray-400 dark:text-gray-600': !isSameMonth(day, currentDate)
                      }
                    )}
                  >
                    <div className="font-medium">{format(day, 'd')}</div>
                    
                    {questCount > 0 && (
                      <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center">
                        <div 
                          className={clsx(
                            'w-full h-1.5 rounded-full',
                            {
                              'bg-green-400': completionRate === 100,
                              'bg-yellow-400': completionRate > 0 && completionRate < 100,
                              'bg-gray-300 dark:bg-gray-600': completionRate === 0
                            }
                          )}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Selected Date Details */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="text-purple-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
              </h3>
            </div>
            
            {selectedDate ? (
              <div className="space-y-4">
                {selectedDateQuests.length > 0 ? (
                  <>
                    {/* Quest Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedDateQuests.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Quests
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedDateQuests.filter(q => 
                            q.status === 'completed' || 
                            (q.type === 'daily' && q.completedDates.some(d => 
                              isSameDay(new Date(d), selectedDate)
                            ))
                          ).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Completed
                        </div>
                      </div>
                    </div>
                    
                    {/* Quest List */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Quests:
                      </h4>
                      {selectedDateQuests.map(quest => (
                        <div 
                          key={quest.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {quest.title}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {quest.category}
                            </div>
                          </div>
                          <Badge 
                            variant={quest.status === 'completed' ? 'success' : 'default'}
                            size="sm"
                          >
                            {quest.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Target className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 dark:text-gray-400">
                      No quests on this date
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600 dark:text-gray-400">
                  Select a date to view quest details
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}