import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import burgerIcon from '@/assets/burger.svg';
import birdIcon from '@/assets/Vector.svg';
import triggerIcon from '@/assets/Trigger Alert.svg';
import editIcon from '@/assets/Edit.svg';
import deleteIcon from '@/assets/Trash Delete.svg';
import data from '@/utils/storage.json';

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
  },
};

const pageTransition = {
  duration: 0.4,
  ease: 'easeInOut',
};

const menuVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
};

const menuItemVariants = {
  hover: {
    scale: 1.02,
    backgroundColor: 'rgba(75, 75, 75, 0.8)',
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const IndexRulesPage = () => {
  const navigate = useNavigate();
  const navControls = useAnimation();
  const [rules, setRules] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const userRules = data.user?.rules || [];
    setRules(userRules);

    navControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
    });

    const handleClickOutside = (event) => {
      if (openMenuId !== null) {
        const menuElement = document.getElementById(`menu-${openMenuId}`);
        const burgerButton = document.getElementById(`burger-${openMenuId}`);
        
        if (menuElement && !menuElement.contains(event.target) && 
            burgerButton && !burgerButton.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navControls, openMenuId]);

  const handleButtonClick = async () => {
    setIsExiting(true);
    await navControls.start({
      y: -20,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    });
  };

  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/add-rule/canvas');
  };

  const BurgerMenuContent = ({ ruleId }) => (
    <motion.div
      id={`menu-${ruleId}`}
      className="absolute right-0 mt-2 w-52 bg-[#2B2B2B]/90 rounded-lg shadow-lg text-white z-50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
    >
      <ul className="flex flex-col py-2">
        <motion.li
          className="flex items-center px-4 py-3 cursor-pointer"
          onClick={handleTriggerClick}
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
          data-testid="trigger-menu-item"
        >
          <img src={triggerIcon} alt="Trigger" className="w-5 h-5 mr-3" />
          <span className="text-sm leading-tight text-left">Открыть чат</span>
        </motion.li>
        
        <motion.li
          className="flex items-center px-4 py-3 cursor-pointer"
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <img src={editIcon} alt="Edit" className="w-5 h-5 mr-3" />
          <span className="text-sm leading-tight text-left">
            Редактировать
          </span>
        </motion.li>
        
        <motion.li
          className="flex items-center px-4 py-3 cursor-pointer"
          variants={menuItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <img src={deleteIcon} alt="Delete" className="w-5 h-5 mr-3" />
          <span className="text-sm leading-tight text-left">Удалить</span>
        </motion.li>
      </ul>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="bg-[#1E1E1E] h-screen overflow-hidden text-[#F5F5F5] relative"
        variants={pageVariants}
        initial="initial"
        animate={isExiting ? 'exit' : 'animate'}
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
            <h1 className="text-2xl font-light tracking-wide">Ваши тренировки</h1>
            <motion.button
              onClick={handleButtonClick}
              className="bg-[#FF4D00] text-white px-6 py-2.5 rounded-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-normal leading-none translate-y-[-2px] mr-3">+</span>
              <span className="font-normal text-[15px]">Создать</span>
            </motion.button>
          </motion.div>
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: 'calc(100% - 75px)',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.5)',
            }}
          />
        </div>

        <div className="p-6">
          {rules.length > 0 ? (
            <div className="relative">
              <table className="w-full table-auto border-separate border-spacing-y-3">
                <thead className="text-sm text-[#808080] uppercase">
                  <tr>
                    <th className="text-left p-3">Название</th>
                    <th className="text-left p-3">Описание</th>
                    <th className="text-left p-3">Группы мышц</th>
                    <th className="text-center p-3">Статус</th>
                    <th className="text-left p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule, index) => (
                    <tr
                      key={rule.id}
                      className={`text-sm rounded-lg transition-all duration-300 ${
                        openMenuId === rule.id ? '' : 'hover:shadow-lg hover:scale-[1.02]'
                      }`}
                      style={{
                        position: 'relative',
                        zIndex: rules.length - index,
                      }}
                    >
                      <td className="p-4">{rule.name}</td>
                      <td className="p-4">{rule.description}</td>
                      <td className="p-4">{rule.connectedDevices.join(', ')}</td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={rule.status === 'active'}
                          />
                          <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-[#FF4D00] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                        </label>
                      </td>
                      <td className="p-4 text-right">
                        <div className="relative">
                          <button
                            id={`burger-${rule.id}`}
                            onClick={() => setOpenMenuId(openMenuId === rule.id ? null : rule.id)}
                          >
                            <img
                              src={burgerIcon}
                              alt="Options"
                              className="w-8 h-8"
                            />
                          </button>
                          <AnimatePresence>
                            {openMenuId === rule.id && <BurgerMenuContent ruleId={rule.id} />}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
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
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IndexRulesPage;