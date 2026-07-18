import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../api';

export default function Splash({ onFinish }: { onFinish: () => void }) {
  const [logo, setLogo] = useState('');

  useEffect(() => {
    api.getSettings().then(s => {
      setLogo(s.splashLogo || '/favicon.png');
      setTimeout(onFinish, 2500); // 2.5s splash
    });
  }, [onFinish]);

  return (
    <div className="absolute inset-0 bg-[#FFF8F0] z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-48 h-48 rounded-full overflow-hidden border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white"
      >
        {logo && <img src={logo} alt="Splash Logo" className="w-full h-full object-cover" />}
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-4xl font-black tracking-tighter uppercase text-black"
      >
        redeem-n.fun
      </motion.h1>
    </div>
  );
}
