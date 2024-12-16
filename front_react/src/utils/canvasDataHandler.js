// utils/canvasDataHandler.js

export const createCanvasData = (rule) => {
    // Преобразуем данные правила в формат для canvas
    const deviceNode = {
      id: `device-${rule.id}`,
      type: 'device',
      position: { x: 250, y: 200 },
      data: {
        label: rule.connectedDevices[0], // Первое подключенное устройство
        type: rule.connectedDevices[1] || 'Device', // Второе устройство или дефолтное значение
        conditions: parseConditionsFromDescription(rule.description)
      }
    };
  
    const actionNode = {
      id: `action-${rule.id}`,
      type: 'action',
      position: { x: 700, y: 200 },
      data: {
        label: getActionFromDescription(rule.description),
        recipient: getRecipientFromDescription(rule.description),
        type: getActionTypeFromDescription(rule.description),
        message: ''
      }
    };
  
    const edge = {
      id: `e${rule.id}`,
      source: `device-${rule.id}`,
      target: `action-${rule.id}`,
      animated: true,
      style: { stroke: '#FF4D00' },
      type: 'smoothstep'
    };
  
    return {
      nodes: [deviceNode, actionNode],
      edges: [edge]
    };
  };
  
  // Вспомогательные функции для парсинга description
  const parseConditionsFromDescription = (description) => {
    // Парсим условия из строки описания
    // Пример: "IF Temperature is > 30°C" -> { field: "Temperature", operator: ">", value: "30°C" }
    const conditions = [];
    const ifPart = description.split('THEN')[0].replace('IF ', '');
    const conditionParts = ifPart.split(' and ');
  
    conditionParts.forEach(part => {
      const matches = part.match(/([\w\s]+)\s*(>|<|=)\s*([\d°C%]+)/);
      if (matches) {
        conditions.push({
          field: matches[1].trim(),
          operator: matches[2],
          value: matches[3]
        });
      }
    });
  
    return conditions;
  };
  
  const getActionFromDescription = (description) => {
    const thenPart = description.split('THEN ')[1];
    if (thenPart.includes('send an E-mail')) return 'Send e-mail';
    if (thenPart.includes('send a Notification')) return 'Send notification';
    if (thenPart.includes('trigger an alarm')) return 'Trigger alarm';
    return 'Action';
  };
  
  const getRecipientFromDescription = (description) => {
    const matches = description.match(/to ([\w@.]+)/);
    return matches ? matches[1] : '';
  };
  
  const getActionTypeFromDescription = (description) => {
    if (description.includes('E-mail')) return 'email';
    if (description.includes('Notification')) return 'notification';
    if (description.includes('alarm')) return 'alarm';
    return 'action';
  };