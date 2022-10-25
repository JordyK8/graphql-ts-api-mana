export default [
  {
    name: 'cmd_dlx_queue',
    options: {
      durable: true,
      noAck: false,
    }
  },
  {
    name: 'delayed_cmd_queue',
    options: {
      durable: true,
      deadLetterExchange: 'commands',
      noAck: true,
    }
  },
  {
    name: 'delayed_1m_cmd_queue',
    options: { 
      durable: true,
      deadLetterExchange: 'commands',
      noAck: true,
      messageTtl: 60000,
    }
  },
  {
    name: 'delayed_2m_cmd_queue',
    options: { 
      durable: true,
      deadLetterExchange: 'commands',
      noAck: true,
      messageTtl: 120000,
    }
  },
  {
    name: 'delayed_5m_cmd_queue',
    options: { 
      durable: true,
      deadLetterExchange: 'commands',
      noAck: true,
      messageTtl: 300000,
    }
  },
  {
    name: 'delayed_10m_cmd_queue',
    options: { 
      durable: true,
      deadLetterExchange: 'commands',
      noAck: true,
      messageTtl: 600000,
    }
  },
  {
    name: 'delayed_15m_cmd_queue',
    options: { 
      durable: true,
      deadLetterExchange: 'commands',
      noAck: true,
      messageTtl: 900000,
    }
  },
  {
    name: 'delayed_30m_cmd_queue',
    options: { 
      durable: true,
      deadLetterExchange: 'commands',
      noAck: true,
      messageTtl: 1800000,
    }
  },
]