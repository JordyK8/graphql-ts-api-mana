export default [
  // Default config options
  // Delay and retry config options
  { source: 'dlx.cmds', queue: 'cmd_dlx_queue', pattern: 'cmd.#' },
  { source: 'delayed_cmds', queue: 'delayed_cmd_queue', pattern: '#' },
  { source: '1m_delayed_cmds', queue: 'delayed_1m_cmd_queue', pattern: '#' },
  { source: '2m_delayed_cmds', queue: 'delayed_2m_cmd_queue', pattern: '#' },
  { source: '5m_delayed_cmds', queue: 'delayed_5m_cmd_queue', pattern: '#' },
  { source: '10m_delayed_cmds', queue: 'delayed_10m_cmd_queue', pattern: '#' },
  { source: '15m_delayed_cmds', queue: 'delayed_15m_cmd_queue', pattern: '#' },
  { source: '30m_delayed_cmds', queue: 'delayed_30m_cmd_queue', pattern: '#' },
]