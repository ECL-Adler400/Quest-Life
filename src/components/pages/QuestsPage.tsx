import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { QuestCard } from '@/components/features/QuestCard';
import { QuestForm } from '@/components/features/QuestForm';
import { useQuestStore } from '@/stores/questStore';
import { useTranslation } from 'react-i18next';
import { Quest, QuestFilter } from '@/types';
import { Plus, Filter, Search, Target } from 'lucide-react';
import { clsx } from 'clsx';

export function QuestsPage() {
  const { filteredQuests, currentFilter, setFilter, loading } = useQuestStore();
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBySearch = filteredQuests.filter(quest =>
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (key: keyof QuestFilter, value: any) => {
    setFilter({ ...currentFilter, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            {t('quests')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your life quests and track your progress
          </p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          {t('createQuest')}
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} className="mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={currentFilter.type || 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value === 'all' ? undefined : e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Types</option>
                  <option value="daily">Daily</option>
                  <option value="longterm">Long-term</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={currentFilter.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={currentFilter.difficulty || 'all'}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value === 'all' ? undefined : e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={currentFilter.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value === 'all' ? undefined : e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Categories</option>
                  <option value="health">Health</option>
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="social">Social</option>
                  <option value="personal">Personal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Quest List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredBySearch.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBySearch.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onEdit={setEditingQuest}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Target className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No quests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || Object.values(currentFilter).some(v => v && v !== 'all') 
                ? "Try adjusting your search or filters"
                : "Create your first quest to get started!"
              }
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              {t('createQuest')}
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Create Quest Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('createQuest')}
        size="lg"
      >
        <QuestForm
          onSuccess={() => setIsCreateModalOpen(false)}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Quest Modal */}
      <Modal
        isOpen={!!editingQuest}
        onClose={() => setEditingQuest(null)}
        title="Edit Quest"
        size="lg"
      >
        {editingQuest && (
          <QuestForm
            quest={editingQuest}
            onSuccess={() => setEditingQuest(null)}
            onCancel={() => setEditingQuest(null)}
          />
        )}
      </Modal>
    </div>
  );
}