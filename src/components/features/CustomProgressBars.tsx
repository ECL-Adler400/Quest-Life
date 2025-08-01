import React, { useState } from 'react';
import { useCustomProgressStore } from '@/stores/customProgressStore';
import { CustomProgressBar } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, TrendingUp, Target, Award } from 'lucide-react';
import { CreateProgressBarModal } from './CreateProgressBarModal';

export const CustomProgressBars: React.FC = () => {
  const { progressBars, loading, error } = useCustomProgressStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProgressBar, setSelectedProgressBar] = useState<CustomProgressBar | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading progress bars: {error}</p>
      </div>
    );
  }

  const renderProgressBar = (progressBar: CustomProgressBar) => {
    const progressPercentage = (progressBar.currentValue / progressBar.targetValue) * 100;
    const nextMilestone = progressBar.milestones.find(m => !m.achieved && m.value > progressBar.currentValue);
    
    return (
      <Card key={progressBar.id} className="card-crystal p-4 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => setSelectedProgressBar(progressBar)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{progressBar.icon}</span>
            <div>
              <h3 className="font-semibold text-white">{progressBar.name}</h3>
              {progressBar.description && (
                <p className="text-sm text-gray-400">{progressBar.description}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {progressBar.currentValue}/{progressBar.targetValue}
            </div>
            <div className="text-sm text-gray-400">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
        
        {/* Progress visualization */}
        {progressBar.visualizationType === 'bar' && (
          <div className="mb-3">
            <ProgressBar 
              value={progressPercentage} 
              className="h-3"
              style={{ 
                background: `linear-gradient(90deg, ${progressBar.color}, ${progressBar.color}dd)` 
              }}
            />
          </div>
        )}
        
        {progressBar.visualizationType === 'circle' && (
          <div className="flex justify-center mb-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={progressBar.color}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
        )}
        
        {/* Next milestone */}
        {nextMilestone && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            <span>Next: {nextMilestone.title} at {nextMilestone.value}</span>
          </div>
        )}
        
        {/* Recent achievements */}
        {progressBar.milestones.some(m => m.achieved) && (
          <div className="flex items-center gap-2 mt-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">
              {progressBar.milestones.filter(m => m.achieved).length} milestone{progressBar.milestones.filter(m => m.achieved).length !== 1 ? 's' : ''} achieved
            </span>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Custom Progress Bars
          </h2>
          <p className="text-gray-400 mt-1">
            Track any metric that matters to you
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="btn-crystal flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Button>
      </div>

      {/* Progress bars grid */}
      {progressBars.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {progressBars.map(renderProgressBar)}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No Custom Progress Bars Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first custom progress bar to start tracking what matters most to you.
          </p>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="btn-crystal"
          >
            Create Your First Progress Bar
          </Button>
        </div>
      )}

      {/* Create Progress Bar Modal */}
      <CreateProgressBarModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Progress Bar Detail Modal */}
      {selectedProgressBar && (
        <Modal
          isOpen={!!selectedProgressBar}
          onClose={() => setSelectedProgressBar(null)}
          title={selectedProgressBar.name}
        >
          <div className="space-y-6">
            {/* Progress visualization */}
            <div className="text-center">
              <div className="text-4xl mb-2">{selectedProgressBar.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedProgressBar.currentValue} / {selectedProgressBar.targetValue}
              </h3>
              <ProgressBar 
                value={(selectedProgressBar.currentValue / selectedProgressBar.targetValue) * 100}
                className="h-4 mb-4"
              />
            </div>

            {/* Rules */}
            <div>
              <h4 className="font-semibold text-white mb-3">Progress Rules</h4>
              <div className="space-y-2">
                {selectedProgressBar.rules.increment.map(rule => (
                  <div key={rule.id} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">+{rule.value}</span>
                    <span className="text-gray-300">{rule.description}</span>
                  </div>
                ))}
                {selectedProgressBar.rules.decrement.map(rule => (
                  <div key={rule.id} className="flex items-center gap-2 text-sm">
                    <span className="text-red-400">{rule.value}</span>
                    <span className="text-gray-300">{rule.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h4 className="font-semibold text-white mb-3">Milestones</h4>
              <div className="space-y-2">
                {selectedProgressBar.milestones.map(milestone => (
                  <div key={milestone.id} className={`flex items-center justify-between p-2 rounded ${
                    milestone.achieved ? 'bg-green-900/30 border border-green-700' : 'bg-gray-800/50'
                  }`}>
                    <div>
                      <div className="font-medium text-white">{milestone.title}</div>
                      <div className="text-sm text-gray-400">{milestone.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{milestone.value}</div>
                      {milestone.achieved && (
                        <Badge className="bg-green-600 text-white text-xs">Achieved</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent history */}
            {selectedProgressBar.history.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3">Recent Activity</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedProgressBar.history.slice(-5).reverse().map(entry => (
                    <div key={entry.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{entry.reason}</span>
                      <div className="flex items-center gap-2">
                        <span className={entry.change > 0 ? 'text-green-400' : 'text-red-400'}>
                          {entry.change > 0 ? '+' : ''}{entry.change}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
