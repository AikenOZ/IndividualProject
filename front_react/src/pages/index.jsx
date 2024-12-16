import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import birdIcon from '@/assets/Vector.svg';

// Unified animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    filter: "blur(10px)",
  }
};

const pageTransition = {
  duration: 0.4,
  ease: "easeInOut"
};

const EmptyPage = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const navControls = useAnimation();

  React.useEffect(() => {
    navControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  }, [navControls]);

  const handleButtonClick = async () => {
    setIsExiting(true);
    await navControls.start({
      y: -20,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="bg-[#1E1E1E] h-screen overflow-hidden"
        variants={pageVariants}
        initial="initial"
        animate={isExiting ? "exit" : "animate"}
        exit="exit"
        transition={pageTransition}
        onAnimationComplete={() => isExiting && navigate('/add-rule')}
      >
        <div className="relative">
          <motion.div
            className="px-6 py-6 bg-transparent flex justify-between items-center max-w-[calc(100%-20px)] mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={navControls}
          >
            <h1 className="text-[#F5F5F5] text-2xl font-light tracking-wide">
              Rules Engine
            </h1>
            <motion.button
              onClick={handleButtonClick}
              className="bg-[#FF4D00] text-white px-6 py-2.5 rounded-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-normal leading-none translate-y-[-2px] mr-3">+</span>
              <span className="font-normal text-[15px]">Add Rule</span>
            </motion.button>
          </motion.div>
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{ 
              width: 'calc(100% - 75px)',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.5)'
            }}
          />
        </div>

        <div className="flex flex-col items-center justify-center h-[calc(100vh-82px)] text-[#808080]">
          <img
            src={birdIcon}
            alt="Empty state"
            className="w-14 h-14 mb-5 object-contain opacity-70"
          />
          <p className="mb-2 text-[15px] font-extralight">
            You have not added any rules
          </p>
          <p className="text-sm opacity-80 font-light">
            To create your first rule, click the "Add Rule" button
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmptyPage;