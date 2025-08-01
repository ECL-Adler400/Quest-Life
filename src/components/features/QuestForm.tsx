import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Quest } from '@/types';
import { useQuestStore } from '@/stores/questStore';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const questSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['daily', 'habit', 'todo', 'reward']),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['trivial', 'easy', 'medium', 'hard']),
  deadline: z.string().optional()
});

type QuestFormData = z.infer<typeof questSchema>;

interface QuestFormProps {
  quest?: Quest;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  'health', 'work', 'learning', 'social', 'personal', 'creative'
];

const difficulties = ['trivial', 'easy', 'medium', 'hard'];

const xpRewards = {
  trivial: 5,
  easy: 10,
  medium: 25,
  hard: 50
};

const goldRewards = {
  trivial: 1,
  easy: 2,
  medium: 5,
  hard: 10
};

const staminaCosts = {
  trivial: 5,
  easy: 10,
  medium: 20,
  hard: 35
};

export function QuestForm({ quest, onSuccess, onCancel }: QuestFormProps) {
  const { addQuest, updateQuest } = useQuestStore();
  const { t } = useTranslation();
  const isEditing = !!quest;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: quest ? {
      title: quest.title,
      description: quest.description || '',
      type: quest.type,
      category: quest.category,
      difficulty: quest.difficulty,
      deadline: quest.deadline ? quest.deadline.toISOString().split('T')[0] : ''
    } : {
      type: 'daily',
      difficulty: 'medium'
    }
  });

  const watchedDifficulty = watch('difficulty', 'medium');
  const watchedType = watch('type', 'daily');

  const onSubmit = async (data: QuestFormData) => {
    try {
      const questData = {
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        difficulty: data.difficulty,
        xpReward: xpRewards[data.difficulty],
        goldReward: goldRewards[data.difficulty],
        staminaCost: staminaCosts[data.difficulty],
        deadline: data.deadline ? new Date(data.deadline) : undefined
      };

      if (isEditing) {
        await updateQuest(quest.id, questData);
        toast.success(t('questUpdated'));
      } else {
        await addQuest(questData);
        toast.success(t('questCreated'));
      }
      
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save quest');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <Input
        label={t('questTitle')}
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter quest title..."
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('questDescription')}
        </label>
        <textarea
          {...register('description')}
          className={clsx(
            'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
            'rounded-lg bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-all duration-200 resize-none'
          )}
          rows={3}
          placeholder="Describe your quest..."
        />
      </div>

      {/* Type and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            {...register('type')}
            className={clsx(
              'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
              'rounded-lg bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            )}
          >
            <option value="daily">{t('dailyQuests')}</option>
            <option value="longterm">{t('longtermQuests')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('questCategory')}
          </label>
          <select
            {...register('category')}
            className={clsx(
              'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
              'rounded-lg bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            )}
          >
            <option value="">Select category...</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {t(category)}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('questDifficulty')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map(difficulty => (
            <label
              key={difficulty}
              className={clsx(
                'flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all',
                watchedDifficulty === difficulty
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              )}
            >
              <input
                type="radio"
                value={difficulty}
                {...register('difficulty')}
                className="sr-only"
              />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {t(difficulty)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {xpRewards[difficulty]} XP
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {staminaCosts[difficulty]} Stamina
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Deadline for long-term quests */}
      {watchedType === 'longterm' && (
        <Input
          type="date"
          label={t('questDeadline')}
          {...register('deadline')}
          min={new Date().toISOString().split('T')[0]}
        />
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {isEditing ? t('save') : t('create')}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
        )}
      </div>
    </form>
  );
}