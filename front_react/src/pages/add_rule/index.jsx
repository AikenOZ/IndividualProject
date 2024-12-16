import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Import components
import DeviceModal from '@/components/Modals/DeviceModal';
import ActionModal from '@/components/Modals/ActionModal';
import SaveRuleModal from '@/components/Modals/SaveRuleModal';
import LogicModal from '@/components/Modals/LogicModal';

// Import assets
import deviceNotif from '@/assets/Device Notif.svg';
import actionButton from '@/assets/actionbutton.svg';

// Import constants
import {
  BOTTOM_BUTTON_CONTAINER_VARIANTS,
  LEFT_BUTTON_VARIANTS,
  RIGHT_BUTTON_VARIANTS,
} from '@/utils/modalConstants';

// Animation variants for center icons
const centerIconVariants = {
  whileHover: {
    scale: 1.1,
    transition: { duration: 0.2 }
  },
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

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

function AddRule() {
  const navigate = useNavigate();
  const navControls = useAnimation();
  const bottomButtonsControls = useAnimation();

  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const imagesToLoad = 4;

  // Modal states
  const [isDeviceModalOpen, setDeviceModalOpen] = useState(false);
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [isSaveRuleModalOpen, setSaveRuleModalOpen] = useState(false);
  const [isLogicModalOpen, setLogicModalOpen] = useState(false);

  useEffect(() => {
    navControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  }, [navControls]);

  const handleBackClick = async () => {
    setIsExiting(true);
    await navControls.start({
      y: -20,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    });
  };

  const handleImageLoad = () => {
    setImagesLoadedCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (imagesLoadedCount === imagesToLoad) {
      bottomButtonsControls.start('visible');
    }
  }, [imagesLoadedCount, bottomButtonsControls]);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="bg-[#1E1E1E] min-h-screen font-sans"
        variants={pageVariants}
        initial="initial"
        animate={isExiting ? "exit" : "animate"}
        exit="exit"
        transition={pageTransition}
        onAnimationComplete={() => isExiting && navigate('/')}
      >
        <div className="relative">
          <motion.div
            className="px-6 py-6 bg-transparent flex justify-between items-center max-w-[calc(100%-20px)] mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={navControls}
          >
            <motion.button
              onClick={handleBackClick}
              className="flex items-center gap-4 text-[#F5F5F5] text-2xl font-light tracking-wide"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-[#F5F5F5] text-xl">←</span>
              <span>Новая тренировка</span>
            </motion.button>
            <motion.button
              className="bg-[#FF4D00] text-white px-6 py-2.5 rounded-lg text-[15px] font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSaveRuleModalOpen(true)}
            >
              Создать
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

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="flex gap-32">
            <div className="flex flex-col items-center text-center">
              <motion.div 
                className="w-14 h-14 rounded flex items-center justify-center mb-5 cursor-pointer"
                variants={centerIconVariants}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={() => setDeviceModalOpen(true)}
              >
                <img
                  src={deviceNotif}
                  alt="Device Icon"
                  className="w-20 h-20"
                  onLoad={handleImageLoad}
                />
              </motion.div>
              <h3 className="text-[#F5F5F5] text-lg font-semibold mb-2">
                Выберите группы мышц
              </h3>
              <p className="text-[#808080] text-sm font-light max-w-[280px] leading-relaxed">
                Выберите группы мышц, которые вы хотите тренировать, ИИ подберет план
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <motion.div 
                className="w-14 h-14 rounded flex items-center justify-center mb-5 cursor-pointer"
                variants={centerIconVariants}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={() => setActionModalOpen(true)}
              >
                <img
                  src={actionButton}
                  alt="Action Icon"
                  className="w-20 h-20"
                  onLoad={handleImageLoad}
                />
              </motion.div>
              <h3 className="text-[#F5F5F5] text-lg font-semibold mb-2">
                Укажите ваши пропорции
              </h3>
              <p className="text-[#808080] text-sm font-light max-w-[280px] leading-relaxed">
                Укажите пропорции вашего тела, это позволит подобрать наилучший план
              </p>
            </div>
          </div>

          <motion.div
            className="flex items-center justify-center w-full h-[80px] px-4"
            style={{
              position: 'fixed',
              bottom: '20px',
            }}
            variants={BOTTOM_BUTTON_CONTAINER_VARIANTS}
            initial="hidden"
            animate={bottomButtonsControls}
          >
            <div className="flex items-center justify-between w-[120px]">
              <motion.div
                className="flex items-center justify-center w-[60px] h-[60px] cursor-pointer"
                onClick={() => setDeviceModalOpen(true)}
                variants={LEFT_BUTTON_VARIANTS}
                whileHover="whileHover"
                whileTap="whileTap"
              >
                <img
                  src={deviceNotif}
                  alt="Device Icon"
                  className="w-[52px] h-[52px]"
                  onLoad={handleImageLoad}
                />
              </motion.div>

              <motion.div
                className="flex items-center justify-center w-[60px] h-[60px] cursor-pointer"
                onClick={() => setActionModalOpen(true)}
                variants={RIGHT_BUTTON_VARIANTS}
                whileHover="whileHover"
                whileTap="whileTap"
              >
                <img
                  src={actionButton}
                  alt="Action Icon"
                  className="w-[52px] h-[52px]"
                  onLoad={handleImageLoad}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Modal components */}
        <DeviceModal isOpen={isDeviceModalOpen} onClose={() => setDeviceModalOpen(false)} />
        <ActionModal isOpen={isActionModalOpen} onClose={() => setActionModalOpen(false)} />
        <SaveRuleModal isOpen={isSaveRuleModalOpen} onClose={() => setSaveRuleModalOpen(false)} />
        <LogicModal isOpen={isLogicModalOpen} onClose={() => setLogicModalOpen(false)} />
      </motion.div>
    </AnimatePresence>
  );
}

export default AddRule;