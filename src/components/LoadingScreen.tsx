'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Logo } from './Logo';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'eating' | 'morph' | 'hold'>('eating');
// ... (lines 9-166)


  useEffect(() => {
    // Stage 1: Eating moves to center (approx 2s)
    const morphTimer = setTimeout(() => {
      setStage('morph');
    }, 2000);

    // Stage 2: Morph to text (takes ~0.5s), then hold
    const holdTimer = setTimeout(() => {
      setStage('hold');
    }, 2500);

    // Stage 3: Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(morphTimer);
      clearTimeout(holdTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Pacman "mouth" animation variants
  const biteVariants = {
    animate: {
      rotate: [0, 45, 0],
      transition: {
        duration: 0.25,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  const topJawVariants = {
    animate: {
      rotate: [0, -45, 0],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const
      }
    }
  };

  const bottomJawVariants = {
    animate: {
      rotate: [0, 45, 0],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120] overflow-hidden">
      <AnimatePresence>
        {stage === 'eating' && (
          <motion.div
            key="container"
            className="relative w-full max-w-2xl h-32 flex items-center"
          >
            {/* Glowing Line being eaten */}
            <motion.div
              className="absolute right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              initial={{ left: '10%', opacity: 0 }}
              animate={{ left: '10%', opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              style={{ top: '50%', width: '80%' }}
            >
              {/* Mask to hide line as pacman moves? 
                  Instead of strict masking, we can just position the pacman on top of it.
                  Or simpler: The line is just a static background element that gets covered or revealed?
                  Let's make the line "shrink" from the left as pacman moves? 
                  Actually, moving pacman over it is easier.
               */}
            </motion.div>

            {/* Particles */}
            {[...Array(6)].map((_, i) => (
               <motion.div
                 key={`particle-${i}`}
                 className="absolute w-2 h-2 bg-blue-400 rounded-full blur-[1px]"
                 initial={{ x: 0, opacity: 0 }}
                 animate={{
                   x: -100 - Math.random() * 50,
                   y: (Math.random() - 0.5) * 40,
                   opacity: [0, 0.8, 0],
                   scale: [0.5, 1, 0]
                 }}
                 transition={{
                   duration: 0.8,
                   repeat: Infinity,
                   delay: i * 0.1,
                   ease: "easeOut"
                 }}
                 style={{
                   // Better approach: Attach particles to the Pacman motion value if possible, 
                   // or just let them spawn from center-left and move left to simulate speed trail.
                   left: '50%', // We will move the parent container or pacman actually.
                 }}
               />
            ))}
            
            {/* Pacman Character */}
            <motion.div
              className="absolute z-10"
              initial={{ left: '-10%' }}
              animate={{ left: '50%', x: '-50%' }}
              transition={{ duration: 2, ease: "linear" }}
            >
               {/* Vector Pacman - Two semi-circles rotating */}
               <div className="relative w-12 h-12">
                 <motion.div 
                   className="absolute top-0 w-full h-[50%] bg-yellow-400 rounded-t-full origin-bottom"
                   variants={topJawVariants}
                   animate="animate"
                 />
                 <motion.div 
                   className="absolute bottom-0 w-full h-[50%] bg-yellow-400 rounded-b-full origin-top"
                   variants={bottomJawVariants}
                   animate="animate"
                 />
                 {/* Eye */}
                 <div className="absolute top-[15%] right-[25%] w-2 h-2 bg-[#0B1120] rounded-full" />
               </div>
               
               {/* Trailing Particles (Parented to Pacman) */}
               <motion.div className="absolute top-1/2 right-full flex gap-1 -translate-y-1/2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-blue-400/50 rounded-full"
                      animate={{
                        x: [-10, -30],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "linear"
                      }}
                    />
                  ))}
               </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(stage === 'morph' || stage === 'hold') && (
           <motion.div
             key="brand-text"
             className="absolute flex flex-col items-center"
             initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
             animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
             transition={{ duration: 0.6, ease: "easeOut" }}
           >
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
               The <span className="text-blue-500">GameOn</span> Co.
             </h1>
             <motion.div 
               className="mt-2 h-1 bg-blue-500 rounded-full"
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
             />
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingScreen;
