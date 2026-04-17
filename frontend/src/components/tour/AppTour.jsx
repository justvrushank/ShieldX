import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const TOUR_STEPS = [
  {
    id: 'welcome',
    target: null,
    page: '/dashboard',
    title: 'ShieldX is online 🛡️',
    body: 'Real-time parametric risk engine running. We continuously scan IMD signals, platform health, and government feeds — executing payouts the moment a verified trigger fires in your zone.',
    emoji: '🛡️',
  },
  {
    id: 'policy-card',
    target: '#policy-hero-card',
    page: '/dashboard',
    title: 'Active Policy Engine',
    body: 'Your coverage ceiling, renewal window, deployed capital, and reliability index — all live. The green indicator confirms ShieldX is actively monitoring your exposure.',
    emoji: '💳',
  },
  {
    id: 'alert-card',
    target: '#alert-banner',
    page: '/dashboard',
    title: 'Risk Signal Feed',
    body: 'When ShieldX detects high-probability rainfall or outage signals in your zone, this feed activates. Exposure windows are extended automatically — zero action required from you.',
    emoji: '⚠️',
  },
  {
    id: 'zone-status',
    target: '#zone-status-card',
    page: '/dashboard',
    title: 'Zone Intelligence',
    body: 'Live IMD signal status, platform uptime, and curfew feeds for your 5km exposure zone. Polled every 15 minutes across 4 independent data sources.',
    emoji: '📡',
  },
  {
    id: 'coverage-page',
    target: null,
    page: '/coverage',
    title: 'Policy Tiers',
    body: 'Three risk tiers — Sentinel ₹49/wk, Guardian ₹58/wk, Apex ₹69/wk. Each tier enables flood, outage, and curfew signal monitoring for your zone with auto-execution.',
    emoji: '📋',
  },
  {
    id: 'claims-page',
    target: null,
    page: '/claims',
    title: 'Decision Log',
    body: 'Every signal event, fraud evaluation, and execution decision logged in real time. Fully auditable — see exactly why each payout was approved or flagged.',
    emoji: '📊',
  },
  {
    id: 'forecast-page',
    target: null,
    page: '/forecast',
    title: 'Predictive Risk Forecast',
    body: '7-day flood probability curve powered by ML. Map risk windows before signals fire. Your exposure is plotted against live IMD weather data daily.',
    emoji: '🌤️',
  },
  {
    id: 'zone-intel-page',
    target: null,
    page: '/zone-intel',
    title: 'Zone Analytics',
    body: 'Historical trigger frequency, compound risk patterns, and active event overlays for your delivery zone. Data-driven zone scoring updated weekly.',
    emoji: '🗺️',
  },
  {
    id: 'earnings-page',
    target: null,
    page: '/earnings',
    title: 'Income Recovery Ledger',
    body: 'Capital recovered through executed payouts vs. deployed premiums. Your net position and ROI curve — updated after every decision execution.',
    emoji: '💰',
  },
  {
    id: 'assistant-page',
    target: null,
    page: '/assistant',
    title: 'Risk Intelligence Assistant',
    body: 'Query your coverage logic, trigger thresholds, fraud scoring methodology, or policy terms. AI-powered, context-aware — not a generic support bot.',
    emoji: '🤖',
  },
  {
    id: 'support-page',
    target: null,
    page: '/support',
    title: 'Human Escalation',
    body: 'For decisions requiring manual override or clarification. Team responds within 24 hours. All tickets are time-stamped and fully tracked.',
    emoji: '🎧',
  },
  {
    id: 'profile-page',
    target: null,
    page: '/profile',
    title: 'Identity & Configuration',
    body: 'Update UPI endpoint, delivery zone, and notification triggers. Your profile drives the reliability index that directly affects your premium calculation.',
    emoji: '👤',
  },
  {
    id: 'done',
    target: null,
    page: null,
    title: 'System ready 🚀',
    body: 'Activate policy → ShieldX monitors → Signal detected → Fraud evaluated → Payout executed to UPI in under 2 hours. Fully automated.',
    emoji: '🚀',
    last: true,
  },
]

export function AppTour({ onClose }) {
  const [step, setStep] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const [navigating, setNavigating] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const current = TOUR_STEPS[step]
  const waitingForPage = useRef(null)

  useEffect(() => {
    if (waitingForPage.current && location.pathname === waitingForPage.current.page) {
      const nextStep = waitingForPage.current.step
      waitingForPage.current = null
      setTimeout(() => {
        setStep(nextStep)
        setNavigating(false)
      }, 500)
    }
  }, [location.pathname])

  const goToStep = (nextStepIdx) => {
    const nextStep = TOUR_STEPS[nextStepIdx]
    if (!nextStep) return
    if (nextStep.page && nextStep.page !== location.pathname) {
      setNavigating(true)
      waitingForPage.current = { page: nextStep.page, step: nextStepIdx }
      navigate(nextStep.page)
    } else {
      setStep(nextStepIdx)
    }
  }

  const next = () => {
    if (current.last) {
      navigate('/dashboard')
      onClose()
      return
    }
    goToStep(step + 1)
  }

  const prev = () => {
    if (step <= 0) return
    goToStep(step - 1)
  }

  const handleClose = () => {
    if (location.pathname !== '/dashboard') navigate('/dashboard')
    onClose()
  }

  const updateTargetRect = useCallback(() => {
    if (current.target) {
      const el = document.querySelector(current.target)
      if (el) {
        const rect = el.getBoundingClientRect()
        setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      } else {
        setTargetRect(null)
      }
    } else {
      setTargetRect(null)
    }
  }, [current.target])

  useEffect(() => {
    if (current.target) {
      const el = document.querySelector(current.target)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const timer = setTimeout(updateTargetRect, 400)
      return () => clearTimeout(timer)
    } else {
      setTargetRect(null)
    }
  }, [step, current.target, updateTargetRect])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 8000,
        }}
      />

      {/* Spotlight */}
      <AnimatePresence>
        {current.target && targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              borderRadius: 16,
              border: '2.5px solid #D97757',
              background: 'rgba(255,255,255,0.08)',
              boxShadow: '0 0 0 5px rgba(217,119,87,0.2), 0 0 20px rgba(217,119,87,0.15)',
              zIndex: 8001,
              pointerEvents: 'none',
              transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Tooltip — always bottom-center, shifted right on desktop for sidebar */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: navigating ? 0.6 : 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          bottom: 'calc(24px + env(safe-area-inset-bottom))',
          left: 16,
          right: 16,
          zIndex: 8002,
          // On desktop: shift right to account for 240px sidebar
          maxWidth: 420,
          marginLeft: 'auto',
          marginRight: 'auto',
          background: 'white',
          borderRadius: 18,
          padding: '18px 20px 20px',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
        }}
        className="lg:left-[calc(50%+120px)] lg:right-auto lg:translate-x-[-50%]"
      >
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 3, borderRadius: 999,
                background: i <= step ? '#D97757' : '#F0F0F2',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>{current.emoji}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, fontFamily: 'Inter',
              color: '#D97757', letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>
              {step + 1} / {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: '#F4F4F5', border: 'none', borderRadius: 999,
              width: 28, height: 28, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <X size={14} color="#6B6B6B" />
          </button>
        </div>

        <h3 style={{
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: 18, fontWeight: 800, color: '#0F0F0F',
          margin: '0 0 6px', lineHeight: 1.3,
        }}>
          {current.title}
        </h3>

        <p style={{
          fontSize: 13, color: '#6B6B6B', fontFamily: 'Inter, sans-serif',
          lineHeight: 1.55, margin: '0 0 16px',
        }}>
          {current.body}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && (
            <button
              onClick={prev}
              disabled={navigating}
              style={{
                padding: '10px 14px', borderRadius: 10,
                border: '1.5px solid #E4E4E7', background: 'white',
                fontSize: 13, fontWeight: 600, fontFamily: 'Inter', color: '#0F0F0F',
                cursor: navigating ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                opacity: navigating ? 0.4 : 1, flexShrink: 0,
              }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}

          <button
            onClick={next}
            disabled={navigating}
            style={{
              flex: 1, padding: '11px 16px', borderRadius: 10, border: 'none',
              background: current.last ? 'linear-gradient(135deg, #12B76A, #0E9B58)' : '#D97757',
              fontSize: 14, fontWeight: 700, fontFamily: 'Inter', color: 'white',
              cursor: navigating ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: current.last ? '0 4px 16px rgba(18,183,106,0.35)' : '0 4px 16px rgba(217,119,87,0.35)',
              opacity: navigating ? 0.6 : 1,
            }}
          >
            {navigating ? (
              <>
                <div style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: 999,
                  animation: 'spin 0.8s linear infinite',
                }} />
                Loading module...
              </>
            ) : current.last ? (
              'Begin monitoring 🚀'
            ) : (
              <>Next <ArrowRight size={15} /></>
            )}
          </button>
        </div>

        {!current.last && (
          <button
            onClick={handleClose}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: 'none', border: 'none', color: '#9B9B9B',
              fontSize: 12, fontFamily: 'Inter', cursor: 'pointer',
              marginTop: 10, padding: 4,
            }}
          >
            Skip walkthrough
          </button>
        )}
      </motion.div>
    </>
  )
}

export default AppTour
