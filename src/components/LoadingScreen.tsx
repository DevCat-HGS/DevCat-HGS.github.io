import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const text = "Bienvenido";
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const duration = 4000; // 4 seconds
    const interval = 10; // Update every 10ms
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    // Animate progress bar
    const startTime = Date.now();
    progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
    }, interval);

    // Hide loading screen
    timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  const circleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
      transition: { duration: 1, times: [0, 0.6, 1] }
    }
  };

  const containerVariants = {
    exit: {
      scale: 1.2,
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={containerVariants.exit}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 overflow-hidden"
        >
          {/* Background animated circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "-50%", y: "-50%" }}
                animate={{
                  x: ["-50%", "-30%", "-70%", "-50%"],
                  y: ["-50%", "-70%", "-30%", "-50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "linear"
                }}
                className="absolute left-1/2 top-1/2"
              >
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={circleVariants}
                  className="w-64 h-64 rounded-full bg-teal-500/10"
                  style={{
                    transform: `scale(${1 + i * 0.2})`,
                  }}
                />
              </motion.div>
            ))}
          </div>

          <div className="relative text-center z-10">
            {/* Main content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {text.split('\n').map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: i * 0.5 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-4"
                >
                  {line.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.5 + index * 0.05,
                        ease: "easeOut"
                      }}
                      className="inline-block hover:text-teal-400 transition-colors"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: "80%", opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative mx-auto h-1 bg-slate-700 rounded-full overflow-hidden w-64"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-teal-300"
                style={{ transition: "width 0.01s linear" }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="mt-4 text-teal-400 text-sm font-medium"
            >
              Cargando...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;