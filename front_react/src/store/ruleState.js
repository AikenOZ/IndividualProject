// Начальное состояние для создания правила
const initialRuleState = {
    deviceName: '',
    deviceType: '',
    conditions: [],
    actionType: '',
    recipient: '',
    message: '',
    name: '',
    description: ''
  };
  
  // Функция для создания узла устройства
  const createDeviceNode = (data) => ({
    id: 'device-1',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { 
      label: (
        <div className="text-left">
          <div className="font-semibold mb-2">{data.deviceName}</div>
          <div className="text-sm text-gray-300">{data.deviceType}</div>
          <div className="mt-3 text-sm">
            <div>If:</div>
            {data.conditions.map((condition, idx) => (
              <React.Fragment key={idx}>
                <div>{`${condition.field} ${condition.operator} ${condition.value}`}</div>
                {idx < data.conditions.length - 1 && (
                  <div className="text-gray-400">{condition.logic || 'or'}</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )
    },
    style: {
      background: '#353535',
      color: '#F5F5F5',
      border: 'none',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '250px',
    },
  });
  
  // Функция для создания узла действия
  const createActionNode = (data) => ({
    id: 'action-1',
    type: 'default',
    position: { x: 500, y: 100 },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold mb-2">
            {data.actionType === 'email' ? 'Send e-mail to' : 'Send SMS to'}
          </div>
          <div className="text-sm text-gray-300">{data.recipient}</div>
          {data.message && (
            <div className="text-sm mt-2">{data.message}</div>
          )}
        </div>
      )
    },
    style: {
      background: '#353535',
      color: '#F5F5F5',
      border: 'none',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '250px',
    },
  });
  
  export {
    initialRuleState,
    createDeviceNode,
    createActionNode
  };