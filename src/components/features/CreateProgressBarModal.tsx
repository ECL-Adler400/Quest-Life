import React, { useState } from 'react';
import { useCustomProgressStore } from '@/stores/customProgressStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Plus, Minus, Target, Zap } from 'lucide-react';

interface CreateProgressBarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProgressBarForm {
  name: string;
  description: string;
  icon: string;
  color: string;
  targetValue: number;
  visualizationType: 'bar' | 'circle' | 'crystal';
  incrementRules: { description: string; value: number; triggerType: string; }[];
  decrementRules: { description: string; value: number; triggerType: string; }[];
  milestones: { value: number; title: string; description: string; rewardType: string; rewardAmount: number; }[];
}

const defaultForm: ProgressBarForm = {
  name: '',
  description: '',
  icon: '🎯',
  color: '#A060FF',
  targetValue: 100,
  visualizationType: 'bar',
  incrementRules: [],
  decrementRules: [],
  milestones: []
};

const commonIcons = ['🎯', '💪', '🧠', '❤️', '🌱', '📚', '🎵', '🎨', '🏃‍♂️', '🧘‍♀️', '💼', '👥'];
const commonColors = ['#A060FF', '#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];

export const CreateProgressBarModal: React.FC<CreateProgressBarModalProps> = ({ isOpen, onClose }) => {
  const { createProgressBar } = useCustomProgressStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ProgressBarForm>(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setStep(1);
    setForm(defaultForm);
    onClose();
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    
    setLoading(true);
    try {
      await createProgressBar({
        name: form.name,
        description: form.description,
        icon: form.icon,
        color: form.color,
        currentValue: 0,
        targetValue: form.targetValue,
        visualizationType: form.visualizationType,
        rules: {
          increment: form.incrementRules.map(rule => ({
            id: '',
            triggerType: rule.triggerType as any,
            value: rule.value,
            description: rule.description
          })),
          decrement: form.decrementRules.map(rule => ({
            id: '',
            triggerType: rule.triggerType as any,
            value: -Math.abs(rule.value),
            description: rule.description
          }))
        },
        milestones: form.milestones.map(milestone => ({
          id: '',
          value: milestone.value,
          title: milestone.title,
          description: milestone.description,
          reward: {
            type: milestone.rewardType as any,
            amount: milestone.rewardAmount
          },
          achieved: false
        }))
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create progress bar:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIncrementRule = () => {
    setForm(prev => ({
      ...prev,
      incrementRules: [...prev.incrementRules, { description: '', value: 1, triggerType: 'manual' }]
    }));
  };

  const addDecrementRule = () => {
    setForm(prev => ({
      ...prev,
      decrementRules: [...prev.decrementRules, { description: '', value: 1, triggerType: 'manual' }]
    }));
  };

  const addMilestone = () => {
    setForm(prev => ({
      ...prev,
      milestones: [...prev.milestones, { value: 0, title: '', description: '', rewardType: 'gold', rewardAmount: 10 }]
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Fitness Level, Social Confidence"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
            <Input
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this tracks"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Value</label>
            <Input
              type="number"
              value={form.targetValue}
              onChange={(e) => setForm(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 100 }))}
              min="1"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {commonIcons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setForm(prev => ({ ...prev, icon }))}
                  className={`p-3 text-2xl rounded border-2 transition-colors ${
                    form.icon === icon 
                      ? 'border-purple-400 bg-purple-900/30' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {commonColors.map(color => (
                <button
                  key={color}
                  onClick={() => setForm(prev => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded border-2 transition-all ${
                    form.color === color 
                      ? 'border-white scale-110' 
                      : 'border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Visualization Style</label>
            <div className="grid grid-cols-3 gap-3">
              {[{ value: 'bar', label: 'Progress Bar' }, { value: 'circle', label: 'Circle' }, { value: 'crystal', label: 'Crystal' }].map(option => (
                <button
                  key={option.value}
                  onClick={() => setForm(prev => ({ ...prev, visualizationType: option.value as any }))}
                  className={`p-3 rounded border-2 text-sm transition-colors ${
                    form.visualizationType === option.value 
                      ? 'border-purple-400 bg-purple-900/30 text-white' 
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Progress Rules</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-400">Increment Rules (Positive)</h4>
              <Button onClick={addIncrementRule} size="sm" className="text-xs">
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {form.incrementRules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Description (e.g., Complete workout)"
                    value={rule.description}
                    onChange={(e) => {
                      const newRules = [...form.incrementRules];
                      newRules[index].description = e.target.value;
                      setForm(prev => ({ ...prev, incrementRules: newRules }));
                    }}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="+"
                    value={rule.value}
                    onChange={(e) => {
                      const newRules = [...form.incrementRules];
                      newRules[index].value = parseInt(e.target.value) || 1;
                      setForm(prev => ({ ...prev, incrementRules: newRules }));
                    }}
                    className="w-16"
                  />
                  <Button
                    onClick={() => {
                      const newRules = form.incrementRules.filter((_, i) => i !== index);
                      setForm(prev => ({ ...prev, incrementRules: newRules }));
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-red-400">Decrement Rules (Negative)</h4>
              <Button onClick={addDecrementRule} size="sm" className="text-xs">
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {form.decrementRules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Description (e.g., Skip planned activity)"
                    value={rule.description}
                    onChange={(e) => {
                      const newRules = [...form.decrementRules];
                      newRules[index].description = e.target.value;
                      setForm(prev => ({ ...prev, decrementRules: newRules }));
                    }}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="-"
                    value={rule.value}
                    onChange={(e) => {
                      const newRules = [...form.decrementRules];
                      newRules[index].value = parseInt(e.target.value) || 1;
                      setForm(prev => ({ ...prev, decrementRules: newRules }));
                    }}
                    className="w-16"
                  />
                  <Button
                    onClick={() => {
                      const newRules = form.decrementRules.filter((_, i) => i !== index);
                      setForm(prev => ({ ...prev, decrementRules: newRules }));
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Milestones & Rewards</h3>
          <Button onClick={addMilestone} size="sm" className="text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add Milestone
          </Button>
        </div>
        
        <div className="space-y-3">
          {form.milestones.map((milestone, index) => (
            <Card key={index} className="p-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Milestone title"
                    value={milestone.title}
                    onChange={(e) => {
                      const newMilestones = [...form.milestones];
                      newMilestones[index].title = e.target.value;
                      setForm(prev => ({ ...prev, milestones: newMilestones }));
                    }}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    value={milestone.value}
                    onChange={(e) => {
                      const newMilestones = [...form.milestones];
                      newMilestones[index].value = parseInt(e.target.value) || 0;
                      setForm(prev => ({ ...prev, milestones: newMilestones }));
                    }}
                    className="w-20"
                  />
                </div>
                <Input
                  placeholder="Description"
                  value={milestone.description}
                  onChange={(e) => {
                    const newMilestones = [...form.milestones];
                    newMilestones[index].description = e.target.value;
                    setForm(prev => ({ ...prev, milestones: newMilestones }));
                  }}
                />
                <div className="flex gap-2">
                  <select
                    value={milestone.rewardType}
                    onChange={(e) => {
                      const newMilestones = [...form.milestones];
                      newMilestones[index].rewardType = e.target.value;
                      setForm(prev => ({ ...prev, milestones: newMilestones }));
                    }}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  >
                    <option value="gold">Gold</option>
                    <option value="gems">Gems</option>
                    <option value="xp">XP</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={milestone.rewardAmount}
                    onChange={(e) => {
                      const newMilestones = [...form.milestones];
                      newMilestones[index].rewardAmount = parseInt(e.target.value) || 10;
                      setForm(prev => ({ ...prev, milestones: newMilestones }));
                    }}
                    className="w-20"
                  />
                  <Button
                    onClick={() => {
                      const newMilestones = form.milestones.filter((_, i) => i !== index);
                      setForm(prev => ({ ...prev, milestones: newMilestones }));
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Custom Progress Bar">
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNum === step
                  ? 'bg-purple-600 text-white'
                  : stepNum < step
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {stepNum}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-700">
          <Button
            onClick={handlePrev}
            disabled={step === 1}
            variant="outline"
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNext} disabled={!form.name.trim()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !form.name.trim()}>
              {loading ? 'Creating...' : 'Create Progress Bar'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
