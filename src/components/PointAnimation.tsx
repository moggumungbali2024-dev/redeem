import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';

export default function PointAnimation({ amount, type, onComplete }: { amount: number, type: 'earn' | 'spend', onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.5 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: -50, scale: 1.5 }}
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Star size={80} className="text-[#FDD835] fill-[#FDD835] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" strokeWidth={2} />
            </motion.div>
            <h1 className={`text-6xl font-black uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-2 ${type === 'earn' ? 'text-[#43A047]' : 'text-[#E53935]'}`}>
              {type === 'earn' ? '+' : '-'}{amount}
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
