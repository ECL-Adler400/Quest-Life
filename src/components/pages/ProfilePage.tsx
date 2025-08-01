import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/stores/userStore';
import { useTranslation } from 'react-i18next';
import { Camera, Edit2, Save, X, Star, Target, TrendingUp, Award } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, updateUser } = useUserStore();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    description: user?.description || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateUser(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      description: user.description || ''
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarUrl = e.target?.result as string;
        try {
          await updateUser({ avatar: avatarUrl });
          toast.success('Avatar updated!');
        } catch (error) {
          toast.error('Failed to update avatar');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    {
      icon: <Star className="text-yellow-500" size={24} />,
      label: 'Total XP',
      value: user.xp.toLocaleString(),
      color: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: <Target className="text-blue-500" size={24} />,
      label: 'Quests Completed',
      value: user.completedQuests.toLocaleString(),
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: <TrendingUp className="text-green-500" size={24} />,
      label: 'Current Streak',
      value: `${user.currentStreak} days`,
      color: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: <Award className="text-purple-500" size={24} />,
      label: 'Longest Streak',
      value: `${user.longestStreak} days`,
      color: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('profile')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your profile and view your achievements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Name and Description */}
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Your name"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className={clsx(
                      'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
                      'rounded-lg bg-white dark:bg-gray-800',
                      'text-gray-900 dark:text-gray-100',
                      'placeholder-gray-400 dark:placeholder-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      'transition-all duration-200 resize-none'
                    )}
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} size="sm" className="flex-1">
                      <Save size={16} className="mr-1" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="secondary" size="sm">
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {user.description || 'No description yet.'}
                  </p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    size="sm"
                  >
                    <Edit2 size={16} className="mr-1" />
                    Edit Profile
                  </Button>
                </div>
              )}

              {/* Level Badge */}
              <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full inline-block">
                <span className="font-bold">
                  {t('levelLabel', { level: user.level })}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className={clsx('p-4', stat.color)}>
                  <div className="flex items-center space-x-3">
                    {stat.icon}
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Progress Chart Placeholder */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progress Overview
            </h3>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Progress charts coming soon!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}