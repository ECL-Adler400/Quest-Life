import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { Star, Zap, Heart } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  bonusXP?: number;
}

export function LevelUpModal({ isOpen, onClose, newLevel, bonusXP = 0 }: LevelUpModalProps) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <div className="text-center py-8">
        {/* Confetti Animation */}
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1
          }}
        >
          🎉
        </motion.div>

        {/* Level Up Text */}
        <motion.h1
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t('levelUp')}
        </motion.h1>

        <motion.p
          className="text-xl text-gray-700 dark:text-gray-300 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t('congratulations')} You've reached Level {newLevel}!
        </motion.p>

        {/* Bonuses */}
        <motion.div
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Level Up Bonuses:
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="text-green-500" size={20} />
              <span className="text-gray-700 dark:text-gray-300">
                +10 Max Stamina
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Heart className="text-purple-500" size={20} />
              <span className="text-gray-700 dark:text-gray-300">
                +5 Max Wellness
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span className="text-gray-700 dark:text-gray-300">
                Full Stamina & Wellness Restore
              </span>
            </div>
            
            {bonusXP > 0 && (
              <div className="flex items-center justify-center space-x-2">
                <Star className="text-yellow-500" size={20} />
                <span className="text-gray-700 dark:text-gray-300">
                  +{bonusXP} Bonus XP
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={onClose} size="lg" className="px-8">
            Continue Your Quest!
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}