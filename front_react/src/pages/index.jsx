import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import birdIcon from '@/assets/Vector.svg';

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
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Проверяем аутентификацию при монтировании и изменении
    if (!localStorage.getItem('token')) {
      navigate('/auth/signin', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      // Сначала обновляем состояние
      setIsAuthenticated(false);
      
      // Очищаем хранилище
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Делаем редирект
      navigate('/auth/signin', { replace: true });

      // В фоновом режиме делаем запрос на сервер
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Если пользователь не аутентифицирован, не рендерим содержимое
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="bg-gray-50 h-screen overflow-hidden"
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
            <h1 className="text-gray-800 text-2xl font-light tracking-wide">
              Rules Engine
            </h1>
            <div className="flex gap-3">
              <motion.button
                onClick={handleButtonClick}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl font-normal leading-none translate-y-[-2px] mr-3">+</span>
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
            </div>
          </motion.div>
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: 'calc(100% - 75px)',
              height: '1px',
              background: 'rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>

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
            Для создания вашей первой тренировки, нажмите на кнопку "Создать".
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmptyPage;