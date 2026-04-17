import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useDemoStore } from '../../store/demoStore'

const STEPS = [
  { id: 0, label: 'Checking your area...',   icon: '📍', delay: 0 },
  { id: 1, label: 'Confirming event...',      icon: '🌊', delay: 750 },
  { id: 2, label: 'Approving payout...',      icon: '✅', delay: 1500 },
  { id: 3, label: 'Sending to UPI...',        icon: '💸', delay: 2300 },
]

export function PayoutProcessingModal() {
  const showPayoutModal  = useDemoStore((s) => s.showPayoutModal)
  const payoutModalEvent = useDemoStore((s) => s.payoutModalEvent)
  const closePayoutModal = useDemoStore((s) => s.closePayoutModal)

  const [currentStep, setCurrentStep] = useState(-1)
  const [done, setDone]               = useState(false)

  useEffect(() => {
    if (!showPayoutModal) {
      setCurrentStep(-1)
      setDone(false)
      return
    }

    // Sequence through steps
    const timers = STEPS.map((step) =>
      setTimeout(() => setCurrentStep(step.id), step.delay + 200)
    )
    const doneTimer = setTimeout(() => setDone(true), 3300)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(doneTimer)
    }
  }, [showPayoutModal])

  // Auto-close 2.2s after success
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => closePayoutModal(), 2200)
    return () => clearTimeout(t)
  }, [done, closePayoutModal])

  const amount  = payoutModalEvent?.amount  ?? 120
  const city    = payoutModalEvent?.city    ?? 'your area'
  const trigger = payoutModalEvent?.triggerType ?? 'Flood'

  return (
    <AnimatePresence>
      {showPayoutModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={done ? closePayoutModal : undefined}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 10000,
            }}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            style={{
              position: 'fixed',
              zIndex: 10001,
              bottom: 32, left: 16, right: 16,
              maxWidth: 380,
              margin: '0 auto',
              background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: 22,
              padding: '28px 24px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.15)',
            }}
          >
            {!done ? (
              <>
                {/* Header */}
                <div style={{ marginBottom: 24, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Inter', color: '#A5B4FC', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    {trigger} trigger · {city}
                  </p>
                  <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>
                    Processing payout...
                  </h2>
                </div>

                {/* Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {STEPS.map((step) => {
                    const isActive   = currentStep === step.id
                    const isComplete = currentStep > step.id
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: currentStep >= step.id ? 1 : 0.28, x: 0 }}
                        transition={{ duration: 0.3, delay: step.delay / 1000 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 14px',
                          borderRadius: 12,
                          background: isActive ? 'rgba(99,102,241,0.15)' : isComplete ? 'rgba(34,197,94,0.08)' : 'transparent',
                          border: `1px solid ${isActive ? 'rgba(99,102,241,0.35)' : isComplete ? 'rgba(34,197,94,0.2)' : 'transparent'}`,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {/* Icon / spinner / check */}
                        <div style={{ flexShrink: 0, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isComplete ? (
                            <CheckCircle2 size={20} color="#22C55E" />
                          ) : isActive ? (
                            <div style={{
                              width: 20, height: 20,
                              border: '2.5px solid rgba(99,102,241,0.25)',
                              borderTopColor: '#6366F1',
                              borderRadius: 999,
                              animation: 'spin 0.7s linear infinite',
                            }} />
                          ) : (
                            <span style={{ fontSize: 18, opacity: 0.35 }}>{step.icon}</span>
                          )}
                        </div>
                        <p style={{
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 500,
                          fontFamily: 'Inter',
                          color: isComplete ? '#22C55E' : isActive ? '#F1F5F9' : '#64748B',
                          margin: 0,
                          transition: 'color 0.25s',
                        }}>
                          {step.label}
                        </p>
                        {isActive && (
                          <motion.div
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                            style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'Inter', color: '#818CF8', fontWeight: 600 }}
                          >
                            In progress
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 20, height: 4, background: 'rgba(99,102,241,0.15)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, #6366F1, #22D3EE)', borderRadius: 99 }}
                    animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </>
            ) : (
              /* ── Success state ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                  style={{
                    width: 72, height: 72,
                    borderRadius: 999,
                    background: 'radial-gradient(circle, rgba(34,197,94,0.25), rgba(34,197,94,0.05))',
                    border: '2px solid rgba(34,197,94,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 0 30px rgba(34,197,94,0.3)',
                  }}
                >
                  <CheckCircle2 size={36} color="#22C55E" strokeWidth={2} />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Bricolage Grotesque', color: '#F1F5F9', margin: '0 0 6px' }}
                >
                  ₹{amount} sent! 🎉
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ fontSize: 14, fontFamily: 'Inter', color: '#94A3B8', margin: 0 }}
                >
                  ₹{amount} sent to your UPI instantly
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={closePayoutModal}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    marginTop: 22,
                    width: '100%', padding: '12px',
                    borderRadius: 12, border: 'none',
                    background: 'rgba(34,197,94,0.15)',
                    color: '#22C55E',
                    fontSize: 14, fontWeight: 700, fontFamily: 'Inter',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
