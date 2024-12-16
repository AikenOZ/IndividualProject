// Animation variants
export const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };
  
  export const menuItemVariants = {
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
  
  export const LEFT_BUTTON_VARIANTS = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
    whileHover: { 
      scale: 1.1,
      rotate: -10,
      transition: { duration: 0.2 }
    },
    whileTap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  export const RIGHT_BUTTON_VARIANTS = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
    whileHover: { 
      scale: 1.1,
      rotate: 10,
      transition: { duration: 0.2 }
    },
    whileTap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  export const BOTTOM_BUTTON_CONTAINER_VARIANTS = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    }
  };
  
  export const pageVariants = {
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
  
  export const pageTransition = {
    duration: 0.4,
    ease: "easeInOut"
  };
  
  // Node Styles
  export const nodeStyles = {
    deviceNode: {
      background: '#2B2B2B',
      color: '#F5F5F5',
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '12px',
      minWidth: '280px',
    },
    actionNode: {
      background: '#2B2B2B',
      color: '#F5F5F5',
      border: 'none',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '12px',
      minWidth: '240px',
    }
  };
  
  // Edge Styles
  export const edgeStyles = {
    default: {
      stroke: '#00FF00',
    },
    animated: true,
    labelStyle: { 
      fill: '#F5F5F5', 
      fontFamily: 'sans-serif' 
    },
    labelBgStyle: { 
      fill: 'transparent' 
    }
  };
  
  // CSS Overrides
  export const hideWatermark = `
    .react-flow__attribution {
      display: none !important;
    }
    .react-flow__controls {
      display: none !important;
    }
  `;
  
  // Layout Styles
  export const layoutStyles = {
    canvas: {
      width: '100%',
      height: 'calc(100vh - 85px)'
    },
    bottomButtons: {
      position: 'fixed',
      bottom: '5px',
      left: '0',
      right: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '80px',
      padding: '0 16px',
      zIndex: 1000
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'between',
      width: '120px'
    },
    buttonWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '60px',
      height: '60px',
      cursor: 'pointer'
    },
    buttonIcon: {
      width: '52px',
      height: '52px'
    }
  };