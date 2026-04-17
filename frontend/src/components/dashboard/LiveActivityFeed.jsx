import { AnimatePresence, motion } from 'framer-motion'
import { useDemoStore } from '../../store/demoStore'

function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 5)  return 'just now'
  if (secs < 60) return secs + 's ago'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return mins + 'm ago'
  return Math.floor(mins / 60) + 'h ago'
}

export function LiveActivityFeed() {
  const feed = useDemoStore((s) => s.activityFeed)

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 12, height: 12 }}>
          <span style={{
            position: 'absolute', inset: 0,
            borderRadius: 999,
            background: '#22C55E',
            opacity: 0.3,
            animation: 'pulse-ring 1.5s ease-out infinite',
          }} />
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22C55E', display: 'block' }} />
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter', color: 'var(--text-primary)' }}>
          Live activity
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10, fontWeight: 600, fontFamily: 'Inter',
          color: '#22C55E',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.2)',
          padding: '2px 8px',
          borderRadius: 99,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          Monitoring
        </span>
      </div>

      {/* Feed entries */}
      <div style={{ maxHeight: 260, overflowY: 'auto', padding: '6px 0' }}>
        <AnimatePresence initial={false}>
          {feed.slice(0, 8).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 16px',
                borderBottom: '1px solid var(--border-light)',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <p style={{
                  flex: 1,
                  fontSize: 13, fontFamily: 'Inter',
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {item.text}
                </p>
                <span style={{
                  fontSize: 11, fontFamily: 'Inter',
                  color: 'var(--text-tertiary)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}>
                  {timeAgo(item.ts)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
