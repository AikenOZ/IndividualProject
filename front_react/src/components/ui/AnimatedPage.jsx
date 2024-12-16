// AnimatedPage.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const animations = (direction) => ({
  initial: {
    opacity: 0,
    x: direction === 'left' ? '-100%' : '100%',
  },
  animate: {
    opacity: 1,
    x: '0%',
  },
  exit: {
    opacity: 0,
    x: direction === 'left' ? '100%' : '-100%',
  },
});

const transition = {
  duration: 0.4, // Увеличенная продолжительность для плавности
  ease: [0.43, 0.13, 0.23, 0.96], // Кастомная кривая Безье
};

const AnimatedPage = ({ children, direction = 'right' }) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return (
    <motion.div
      variants={animations(direction)}
      initial={isFirstRender ? false : 'initial'}
      animate="animate"
      exit="exit"
      transition={transition}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)', // Промоутим элемент в свой слой
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
