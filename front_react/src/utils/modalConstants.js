// Общие стили для модальных окон
export const MODAL_OVERLAY_STYLES = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
export const MODAL_CONTENT_STYLES = "bg-[#1C1C1C] rounded-lg overflow-hidden";
export const MODAL_HEADER_STYLES = "text-[#F5F5F5] text-xl font-semibold mb-4 text-center font-sans";

// Стили для кнопок
export const BUTTON_PRIMARY_STYLES = "bg-[#FF4D00] hover:bg-[#cc3d00] text-white px-6 py-2 rounded-md transition-colors";
export const BUTTON_SECONDARY_STYLES = "bg-[#2B2B2B] hover:bg-[#3A3A3A] text-gray-300 px-6 py-2 rounded-md transition-colors";

// Анимации
export const PAGE_VARIANTS = {
  initial: {
    opacity: 0,
    x: '50vw',
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: '-50vw',
  },
};

export const PAGE_TRANSITION = {
  duration: 0.25,
  ease: 'easeOut',
};

export const BOTTOM_BUTTON_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

export const LEFT_BUTTON_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  whileHover: {
    scale: 1.05,
    rotate: -10,
    transition: { duration: 0.3 },
  },
  whileTap: {
    scale: 0.95,
    rotate: -5,
    transition: { duration: 0.1 },
  },
};

export const RIGHT_BUTTON_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  whileHover: {
    scale: 1.05,
    rotate: 10,
    transition: { duration: 0.3 },
  },
  whileTap: {
    scale: 0.95,
    rotate: 5,
    transition: { duration: 0.1 },
  },
};