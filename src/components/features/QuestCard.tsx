import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quest } from '@/types';
import { useQuestStore } from '@/stores/questStore';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Zap, 
  Star, 
  Edit, 
  Trash2,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';
import { format, formatDistanceToNow, isToday } from 'date-fns';
import toast from 'react-hot-toast';

interface QuestCardProps {
  quest: Quest;
  onEdit?: (quest: Quest) => void;
  compact?: boolean;
}

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger'
} as const;

const categoryIcons: Record<string, React.ReactNode> = {
  health: '💪',
  work: '💼',
  learning: '📚',
  social: '👥',
  personal: '✨',
  creative: '🎨',
  default: '🎯'
};

export function QuestCard({ quest, onEdit, compact = false }: QuestCardProps) {
  const { completeQuest, deleteQuest } = useQuestStore();
  const { t } = useTranslation();

  const isDaily = quest.type === 'daily';
  const isCompleted = quest.status === 'completed';
  const isCompletedToday = isDaily && quest.completedDates.some(date => 
    isToday(new Date(date))
  );
  const canComplete = !isCompleted && !isCompletedToday;

  const handleComplete = async () => {
    try {
      await completeQuest(quest.id);
      toast.success(t('questCompleted'), {
        icon: '🎉',
        duration: 3000
      });
    } catch (error) {
      toast.error(t('notEnoughStamina'), {
        icon: '⚡',
        duration: 3000
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this quest?')) {
      await deleteQuest(quest.id);
      toast.success(t('questDeleted'));
    }
  };

  return (
    <Card 
      className={clsx(
        'transition-all duration-200',
        {
          'opacity-75': isCompleted || isCompletedToday,
          'border-green-200 bg-green-50 dark:bg-green-900/20': isCompletedToday
        }
      )}
      hoverable
    >
      <div className={clsx('space-y-3', compact ? 'p-3' : 'p-4')}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-lg">
              {categoryIcons[quest.category] || categoryIcons.default}
            </span>
            <div className="flex-1">
              <h3 className={clsx(
                'font-semibold text-gray-900 dark:text-white',
                compact ? 'text-sm' : 'text-base',
                (isCompleted || isCompletedToday) && 'line-through'
              )}>
                {quest.title}
              </h3>
              {quest.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {quest.description}
                </p>
              )}
            </div>
          </div>
          
          {(isCompleted || isCompletedToday) && (
            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
          )}
        </div>

        {/* Quest Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge 
              variant={difficultyColors[quest.difficulty]}
              size="sm"
            >
              {t(quest.difficulty)}
            </Badge>
            
            {quest.type === 'daily' && quest.streak > 0 && (
              <Badge variant="info" size="sm">
                🔥 {quest.streak}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-500" />
              <span>{quest.xpReward}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap size={14} className="text-green-500" />
              <span>{quest.staminaCost}</span>
            </div>
          </div>
        </div>

        {/* Deadline for long-term quests */}
        {quest.type === 'longterm' && quest.deadline && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar size={14} className="text-gray-500" />
            <span className={clsx(
              'text-gray-600 dark:text-gray-400',
              new Date(quest.deadline) < new Date() && 'text-red-600 dark:text-red-400'
            )}>
              Due {formatDistanceToNow(new Date(quest.deadline), { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          {canComplete && (
            <Button
              onClick={handleComplete}
              size="sm"
              className="flex-1"
            >
              <Target size={14} className="mr-1" />
              {t('complete')}
            </Button>
          )}
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(quest)}
          >
            <Edit size={14} />
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
}