import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';
import { User } from '../types';
import { api } from '../api';
import { Star } from 'lucide-react';

export default function ProfileWizard({ user, onComplete }: { user: User, onComplete: (user: User) => void }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  const handleNext = async () => {
    if (step === 1 && name) {
      setStep(2);
    } else if (step === 2) {
      setAnimating(true);
      // Simulate API call to complete profile and add 10,000 points
      const updatedUser = await api.updateUser({ ...user, name, profileCompleted: true, points: user.points + 10000 });
      setTimeout(() => {
        onComplete(updatedUser);
      }, 2500); // Wait for animation
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FFF8F0] flex flex-col items-center justify-center p-4 overflow-y-auto">
       <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm flex flex-col gap-6">
              <div className="text-center">
                <h1 className="text-4xl font-black uppercase text-black mb-2 leading-none">Welcome to redeem-n.fun</h1>
                <p className="text-lg font-bold text-gray-600">What should we call you?</p>
              </div>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full text-center text-2xl font-black p-4 border-4 border-black rounded-[24px] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
              <button 
                onClick={handleNext}
                disabled={!name}
                className="w-full bg-[#1E88E5] text-white font-black text-2xl py-4 rounded-[24px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all disabled:opacity-50"
              >
                Next
              </button>
            </motion.div>
          )}
          {step === 2 && !animating && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-sm flex flex-col gap-6 text-center">
              <div>
                <h1 className="text-4xl font-black uppercase text-black mb-2 leading-none">Complete Profile</h1>
                <p className="text-lg font-bold text-gray-600">Get 10,000 points instantly!</p>
              </div>
              <div className="w-32 h-32 mx-auto bg-[#FDD835] rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <Star size={64} className="text-black fill-black" />
              </div>
              <button 
                onClick={handleNext}
                className="w-full bg-[#43A047] text-white font-black text-2xl py-4 rounded-[24px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
              >
                Claim Points
              </button>
            </motion.div>
          )}
          {animating && (
            <motion.div key="animating" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ duration: 1, repeat: Infinity }}
                className="w-32 h-32 bg-[#FDD835] rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              >
                <Star size={64} className="text-black fill-black" />
              </motion.div>
              <h1 className="text-5xl font-black text-[#43A047] uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">+10,000 pts</h1>
              <p className="text-xl font-black text-black">Profile Complete!</p>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
