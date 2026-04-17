import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity } from 'lucide-react'

const MOCK_EVENTS = [
  { id: 1, text: '⚡ Flood detected — Chennai', time: 'just now', color: '#38BDF8' },
  { id: 2, text: '💰 ₹120 payout processed', time: '12s ago', color: '#22C55E' },
  { id: 3, text: '⚠️ Outage — Mumbai zone', time: '45s ago', color: '#F59E0B' },
  { id: 4, text: '⚡ Flood detected — Hyderabad', time: '1m ago', color: '#38BDF8' },
  { id: 5, text: '💰 ₹95 payout processed', time: '2m ago', color: '#22C55E' },
  { id: 6, text: '🛑 Curfew — Bengaluru North', time: '5m ago', color: '#EF4444' },
  { id: 7, text: '💰 ₹450 payout processed', time: '8m ago', color: '#22C55E' },
  { id: 8, text: '⚠️ Outage — Delhi NCR', time: '12m ago', color: '#F59E0B' }
]

export default function LiveSystemFeed() {
  const [events, setEvents] = useState(MOCK_EVENTS.slice(0, 4))
  const [index, setIndex] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => {
        const nextEvent = { ...MOCK_EVENTS[index % MOCK_EVENTS.length], id: Date.now(), time: 'just now' }
        const newEvents = [nextEvent, ...prev.map(p => ({ ...p, time: p.time === 'just now' ? '2s ago' : p.time }))].slice(0, 5)
        return newEvents
      })
      setIndex(prev => prev + 1)
    }, 4500)
    return () => clearInterval(interval)
  }, [index])

  return (
    <div style={{
      background: 'rgba(15,23,42,0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxWidth: 360,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#22C55E' }}></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#22C55E' }}></span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Inter, sans-serif', color: '#22C55E', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
          LIVE
        </span>
        <Activity size={14} color="#94A3B8" style={{ ml: 'auto' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence initial={false}>
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: i === 0 ? 1 : 1 - i * 0.25, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                background: i === 0 ? 'rgba(255,255,255,0.06)' : 'transparent',
                borderRadius: 8,
                borderLeft: i === 0 ? `2px solid ${ev.color}` : '2px solid transparent'
              }}
            >
              <span style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: i === 0 ? 'white' : '#cbd5e1', fontWeight: i === 0 ? 600 : 400 }}>
                {ev.text} <span style={{ color: '#64748B', marginLeft: 4 }}>({ev.time})</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
