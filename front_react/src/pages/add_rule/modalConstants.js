// modalConstants.js

export const BOTTOM_BUTTON_CONTAINER_VARIANTS = {
    hidden: {
      opacity: 0,
      y: 10, // Reduced distance for snappier appearance
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2, // Faster overall animation
        ease: "easeOut",
        staggerChildren: 0.05, // Faster stagger between children
      },
    },
  };
  
  export const LEFT_BUTTON_VARIANTS = {
    hidden: {
      opacity: 0,
      x: -10, // Reduced distance
      rotate: -90, // Less rotation for quicker reset
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    whileHover: {
      scale: 1.05,
      rotate: -8, // Smaller rotation for faster response
      transition: {
        duration: 0.1, // Very quick hover response
        ease: "easeOut",
      },
    },
    whileTap: {
      scale: 0.95,
      rotate: -15,
      transition: {
        duration: 0.05, // Nearly instant feedback
        ease: "easeOut",
      },
    },
  };
  
  export const RIGHT_BUTTON_VARIANTS = {
    hidden: {
      opacity: 0,
      x: 10,
      rotate: 90,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    whileHover: {
      scale: 1.05,
      rotate: 8,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
    whileTap: {
      scale: 0.95,
      rotate: 15,
      transition: {
        duration: 0.05,
        ease: "easeOut",
      },
    },
  };
  
  export const CENTER_CONTAINER_VARIANTS = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Faster stagger
      },
    },
  };
  
  export const LEFT_CENTER_ICON_VARIANTS = {
    hidden: {
      opacity: 0,
      x: -10,
      rotate: 90,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };
  
  export const RIGHT_CENTER_ICON_VARIANTS = {
    hidden: {
      opacity: 0,
      x: 10,
      rotate: -90,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };