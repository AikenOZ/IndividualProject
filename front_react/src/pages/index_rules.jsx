import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import burgerIcon from '@/assets/burger.svg';
import birdIcon from '@/assets/Vector.svg';
import triggerIcon from '@/assets/Trigger Alert.svg';
import editIcon from '@/assets/Edit.svg';
import deleteIcon from '@/assets/Trash Delete.svg';
import data from '@/utils/storage.json';

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
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

const menuItemVariants = {
  hover: {
    scale: 1.02,
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const IndexRulesPage = () => {
  const navigate = useNavigate();
  const navControls = useAnimation();

  const [rules, setRules] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Проверяем наличие токена
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    // Загружаем данные при авторизованном пользователе
    if (token) {
      const userRules = data.user?.rules || [];
      setRules(userRules);
    }

    // Анимация для nav
    navControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
    });

    // Обработчик клика вне меню
    const handleClickOutside = (event) => {
      if (openMenuId !== null) {
        const menuElement = document.getElementById(`menu-${openMenuId}`);
        const burgerButton = document.getElementById(`burger-${openMenuId}`);

        if (
          menuElement &&
          !menuElement.contains(event.target) &&
          burgerButton &&
          !burgerButton.contains(event.target)
        ) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navControls, openMenuId]);

  const handleCreateClick = async () => {
    setIsExiting(true);
    await navControls.start({
      y: -20,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    });
  };

  const handleAuthClick = () => {
    navigate('/auth/signin');
  };

  const handleLogout = async () => {
    try {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth/signin', { replace: true });

      // Запрос на сервер в фоне
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/add-rule/canvas');
  };

  const BurgerMenuContent = ({ ruleId }) => (
    <motion.div
      id={`menu-${ruleId}`}
      className="absolute right-0 mt-2 w-52 bg-white/95 rounded-lg shadow-lg text-gray-800 z-50 backdrop-blur-sm border border-gray-100"
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
          <span className="text-sm leading-tight text-left">Редактировать</span>
        </motion.li>

        <motion.li
          className="flex items-center px-4 py-3 cursor-pointer text-red-600"
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
        className="bg-gray-50 h-screen overflow-hidden text-gray-800 relative"
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
            {isAuthenticated && (
              <h1 className="text-2xl font-light tracking-wide text-gray-800">
                Ваши тренировки
              </h1>
            )}

            <div className="flex gap-3">
              {isAuthenticated ? (
                <>
                  <motion.button
                    onClick={handleCreateClick}
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl font-normal leading-none translate-y-[-2px] mr-3">
                      +
                    </span>
                    <span className="font-normal text-[15px]">Создать</span>
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-normal text-[15px]">Выйти</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={handleAuthClick}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-normal text-[15px]">Авторизация</span>
                </motion.button>
              )}
            </div>
          </motion.div>
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: 'calc(100% - 75px)',
              height: '1px',
              background: 'rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>

        <div className="p-6">
          {/* Если пользователь не авторизован – показываем только сообщение или пустой экран */}
          {!isAuthenticated && (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-82px)] text-gray-500">
              <img
                src={birdIcon}
                alt="Empty state"
                className="w-14 h-14 mb-5 object-contain opacity-70"
              />
              <p className="mb-2 text-[15px] font-extralight">
                Вы не авторизованы
              </p>
              <p className="text-sm opacity-80 font-light">
                Пожалуйста, пройдите авторизацию.
              </p>
            </div>
          )}

          {isAuthenticated && (
            <>
              {rules.length > 0 ? (
                <div className="relative">
                  <table className="w-full table-auto border-separate border-spacing-y-3">
                    <thead className="text-sm text-gray-500 uppercase">
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
                          className={`text-sm rounded-lg transition-all duration-300 bg-white ${
                            openMenuId === rule.id
                              ? 'shadow-md'
                              : 'hover:shadow-lg hover:scale-[1.02]'
                          }`}
                          style={{
                            position: 'relative',
                            zIndex: rules.length - index,
                          }}
                        >
                          <td className="p-4">{rule.name}</td>
                          <td className="p-4">{rule.description}</td>
                          <td className="p-4">
                            {rule.connectedDevices.join(', ')}
                          </td>
                          <td className="p-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked={rule.status === 'active'}
                              />
                              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                            </label>
                          </td>
                          <td className="p-4 text-right">
                            <div className="relative">
                              <button
                                id={`burger-${rule.id}`}
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === rule.id ? null : rule.id
                                  )
                                }
                              >
                                <img
                                  src={burgerIcon}
                                  alt="Options"
                                  className="w-8 h-8"
                                />
                              </button>
                              <AnimatePresence>
                                {openMenuId === rule.id && (
                                  <BurgerMenuContent ruleId={rule.id} />
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-82px)] text-gray-500">
                  <img
                    src={birdIcon}
                    alt="Empty state"
                    className="w-14 h-14 mb-5 object-contain opacity-70"
                  />
                  <p className="mb-2 text-[15px] font-extralight">
                    У вас нету созданных тренировок
                  </p>
                  <p className="text-sm opacity-80 font-light">
                    Для создания вашей первой тренировки, нажмите на кнопку
                    "Создать".
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IndexRulesPage;
