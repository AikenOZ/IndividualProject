const defaultEdgeStyles = {
    type: 'default',
    animated: true,
    style: {
      stroke: '#00FF00',
      strokeWidth: 2,
      strokeDasharray: 0,
      filter: 'drop-shadow(0 0 3px rgba(0, 255, 0, 0.7))',
    },
    markerEnd: {
      type: 'circle',
      width: 8,
      height: 8,
      color: '#00FF00',
      strokeWidth: 0,
      filled: true,
    },
    markerStart: {
      type: 'circle',
      width: 8,
      height: 8,
      color: '#00FF00',
      strokeWidth: 0,
      filled: true,
    },
    label: 'then',
    labelStyle: {
      fill: '#FFFFFF',
      fontFamily: 'system-ui, sans-serif',
      fontSize: 15,
      fontWeight: 400,
      transform: 'translateY(-16px)', // Move label up
    },
    labelBgStyle: {
      fill: 'transparent',
    },
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelShowBg: false,
    // Center the label horizontally
    labelPosition: 0.5,
    // Remove these as they might interfere
    // labelUpstreamPosition: 0.5,
    // labelDownstreamPosition: 0.5,
    pathOptions: {
      offset: 0,
      borderRadius: 20,
      curvature: 0.3,
    },
    hoverStyle: {
      stroke: '#00FF00',
      strokeWidth: 2.5,
      filter: 'drop-shadow(0 0 5px rgba(0, 255, 0, 0.8))',
    },
    selectedStyle: {
      stroke: '#00FF00',
      strokeWidth: 3,
      filter: 'drop-shadow(0 0 6px rgba(0, 255, 0, 0.9))',
    }
};

const edgeVariants = {
    success: {
        ...defaultEdgeStyles,
    },
    warning: {
        ...defaultEdgeStyles,
    },
    error: {
        ...defaultEdgeStyles,
    }
};

export { defaultEdgeStyles, edgeVariants };