import { motion } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useUserStore } from '@/stores/userStore';
import { useTranslation } from 'react-i18next';
import { Star, Heart, Zap, Coins, Gem, Shield, Sword, Brain, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function UserStatusBars() {
  const { user, takeDamage } = useUserStore();
  const { t } = useTranslation();

  if (!user) return null;

  const currentLevelXP = Math.pow(user.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(user.level, 2) * 100;
  const xpProgress = user.xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  // Class information
  const getClassInfo = () => {
    switch (user.class) {
      case 'warrior':
        return { icon: '⚔️', name: 'Warrior', color: 'text-red-400', bgColor: 'bg-red-900/20' };
      case 'mage':
        return { icon: '🔮', name: 'Mage', color: 'text-blue-400', bgColor: 'bg-blue-900/20' };
      case 'healer':
        return { icon: '💚', name: 'Healer', color: 'text-green-400', bgColor: 'bg-green-900/20' };
      case 'rogue':
        return { icon: '🗡️', name: 'Rogue', color: 'text-purple-400', bgColor: 'bg-purple-900/20' };
      default:
        return null;
    }
  };

  const classInfo = getClassInfo();

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* User Header with Avatar and Class */}
      <div className="card-crystal p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{user.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Level {user.level}</span>
                {classInfo && (
                  <Badge className={`${classInfo.bgColor} ${classInfo.color} text-xs`}>
                    {classInfo.icon} {classInfo.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Coins className="w-4 h-4" />
              <span className="font-semibold">{user.gold}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <Gem className="w-4 h-4" />
              <span className="font-semibold">{user.gems}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Status Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Health (HP) */}
        <div className="card-crystal p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="text-red-400 w-4 h-4" />
              <span className="font-medium text-white text-sm">Health</span>
            </div>
            <span className="text-xs text-gray-400">
              {user.hp}/{user.maxHp}
            </span>
          </div>
          <div className="status-bar hp-bar">
            <div 
              className="status-bar-fill transition-all duration-500"
              style={{ width: `${(user.hp / user.maxHp) * 100}%` }}
            />
          </div>
          {user.hp <= user.maxHp * 0.25 && (
            <p className="text-xs text-red-400 mt-1">⚠️ Low health! Complete tasks to recover.</p>
          )}
        </div>

        {/* Mana (if unlocked) */}
        {user.maxMana > 0 && (
          <div className="card-crystal p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="text-blue-400 w-4 h-4" />
                <span className="font-medium text-white text-sm">Mana</span>
              </div>
              <span className="text-xs text-gray-400">
                {user.mana}/{user.maxMana}
              </span>
            </div>
            <div className="status-bar mana-bar">
              <div 
                className="status-bar-fill transition-all duration-500"
                style={{ width: `${(user.mana / user.maxMana) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Experience */}
        <div className="card-crystal p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400 w-4 h-4" />
              <span className="font-medium text-white text-sm">Experience</span>
            </div>
            <span className="text-xs text-gray-400">
              {xpProgress}/{xpNeeded}
            </span>
          </div>
          <div className="status-bar xp-bar">
            <div 
              className="status-bar-fill crystal-progress transition-all duration-500"
              style={{ width: `${(xpProgress / xpNeeded) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Streak */}
        <div className="card-crystal p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="font-medium text-white text-sm">Streak</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-400">
                {user.currentStreak}
              </div>
              <div className="text-xs text-gray-500">
                Best: {user.longestStreak}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats (if class is unlocked) */}
      {user.class && (
        <div className="card-crystal p-3">
          <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            Character Stats
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sword className="w-3 h-3 text-red-400" />
              <span className="text-gray-400">STR:</span>
              <span className="text-white font-medium">{user.stats.strength}</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3 text-blue-400" />
              <span className="text-gray-400">INT:</span>
              <span className="text-white font-medium">{user.stats.intelligence}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-gray-400">CON:</span>
              <span className="text-white font-medium">{user.stats.constitution}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 text-purple-400" />
              <span className="text-gray-400">PER:</span>
              <span className="text-white font-medium">{user.stats.perception}</span>
            </div>
          </div>
        </div>
      )}

      {/* Class unlock hint */}
      {!user.class && user.level >= 10 && (
        <div className="card-crystal p-3 border border-purple-400/50">
          <div className="text-center">
            <div className="text-purple-400 mb-2">✨</div>
            <h4 className="font-medium text-white text-sm mb-1">Classes Unlocked!</h4>
            <p className="text-xs text-gray-400 mb-2">
              You can now choose a class to specialize your character.
            </p>
            <button className="btn-crystal text-xs px-3 py-1">
              Choose Class
            </button>
          </div>
        </div>
      )}

      {/* Mana unlock hint */}
      {user.level < 10 && (
        <div className="card-crystal p-3 border border-blue-400/30">
          <div className="text-center">
            <div className="text-blue-400 mb-2">🔮</div>
            <h4 className="font-medium text-white text-sm mb-1">Level {10 - user.level} more to unlock:</h4>
            <p className="text-xs text-gray-400">
              • Mana system & class abilities\n• Character classes (Warrior, Mage, Healer, Rogue)
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}