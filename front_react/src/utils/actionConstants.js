export const ACTION_TYPES = {
    EMAIL: 'email',
    SMS: 'sms'
  };
  
  export const ACTION_DETAILS = {
    [ACTION_TYPES.EMAIL]: {
      title: 'E-mail',
      description: 'Send notifications via e-mail to one or multiple recipients.',
      placeholder: {
        recipient: 'mainaddress@gmail.com',
        message: 'Type your e-mail message here'
      }
    },
    [ACTION_TYPES.SMS]: {
      title: 'SMS',
      description: 'Send notifications via SMS to one or multiple recipients.',
      placeholder: {
        recipient: 'Phone number',
        message: 'Type your SMS message here'
      }
    }
  };