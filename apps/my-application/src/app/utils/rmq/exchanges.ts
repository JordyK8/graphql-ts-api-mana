export default [
  // Delay and retry config options
  { name: 'commands', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: 'delayed_cmds', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: 'dlx.cmds', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: '1m_delayed_cmds', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: '2m_delayed_cmds', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: '5m_delayed_cmds', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: '10m_delayed_cmds', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: '15m_delayed_cmds', type: 'topic', options: { durable: true, autoDelete: false }},
  { name: '30m_delayed_cmds', type: 'topic', options: { durable: true, autoDelete: false }},
]
