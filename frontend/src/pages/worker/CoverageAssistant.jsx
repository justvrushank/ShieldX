import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Bot, User, Zap } from 'lucide-react'
import { useWorkerStore } from '../../store/workerStore'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
}

const QUICK_QUESTIONS = [
  'How does signal verification work?',
  'What triggers auto-execution?',
  'How is my reliability index computed?',
  'What is my max exposure coverage?',
  'How fast is execution after verification?',
  'Can I switch policy tier mid-cycle?',
]

// Keyword-based fallback answers
const FAQ_ANSWERS = {
  'payout': 'ShieldX executes payouts automatically via Razorpay Payouts API within 2 hours of signal verification. No claim submission is required — the engine detects the trigger, runs the 7-signal fraud evaluation, and initiates the UPI transfer autonomously.',
  'claim': 'Executions are initiated automatically when the system detects a verified trigger signal in your zone (IMD flood alert, platform outage, or curfew order). There is no manual claim process — the decision engine handles evaluation and execution end-to-end.',
  'premium': 'Your premium is computed as: base rate × zone flood hazard coefficient × your reliability index. Base rate starts at ₹49/week. A reliability index above 0.75 unlocks a 15% automatic discount. Your exact computation is visible before policy activation.',
  'coverage': 'Your maximum exposure coverage cap is ₹600 per policy cycle (weekly). Flood and curfew signals trigger 100% of cap. Platform outage signals trigger 75% (₹450), accounting for potential alternate-platform activity.',
  'fast': 'Target execution window is under 2 hours from signal confirmation. Once fraud evaluation clears, the Razorpay payout API is called synchronously. The entire pipeline is automated — no human intervention involved.',
  'plan': 'Policy tiers can be switched between cycles. Mid-cycle switching is not supported to preserve weekly risk pricing integrity. Navigate to the Coverage module to compare and queue a tier change.',
  'flood': 'Flood signals are ingested from IMD SACHET RSS feeds and cross-validated against rainfall intensity and district boundary data. A RED or ORANGE alert in your registered zone with verified recent delivery activity triggers full execution.',
  'outage': 'Platform outage signals are detected via Downdetector report volume thresholds plus official platform status page polling. Both sources must confirm the outage before execution is authorized — single-source signals are rejected.',
  'curfew': 'Curfew triggers are sourced from district administration channels and verified news APIs. Confirmed Section 144 or government curfew orders in your zone initiate full 100% execution if you were active within 6 hours.',
  'risk': 'Your reliability index (0.0–1.0) reflects delivery consistency, claim frequency patterns, GPS zone correlation, and activity recency. Higher index → lower fraud probability → lower premium. It is recalculated at every renewal cycle.',
  'zone': 'Your delivery zone is a ~5km radius around your registered GPS coordinates. Zone flood hazard coefficient is derived from historical IMD alert frequency for that geography. High-hazard zones carry higher multipliers but also see more frequent trigger events.',
  'refund': 'Premiums are non-refundable as they fund real-time monitoring infrastructure for your zone during the active cycle. If your executed payouts exceed premiums paid in a cycle, your net ROI is positive — which occurs frequently in high-risk zones.',
}

function getKeywordAnswer(question) {
  const lower = question.toLowerCase()
  for (const [keyword, answer] of Object.entries(FAQ_ANSWERS)) {
    if (lower.includes(keyword)) return answer
  }
  return null
}

function buildSystemPrompt(worker) {
  return `You are ShieldX Risk Intelligence Assistant — an AI advisor embedded in the ShieldX real-time parametric risk engine for gig delivery workers.

Worker context:
- Name: ${worker?.name || 'Worker'}
- City: ${worker?.city || 'Unknown'}
- Zone: ${worker?.zone || 'Unknown'}
- Reliability Index: ${worker?.riskScore || '0.75'}
- Risk Tier: ${worker?.riskTier || 'MEDIUM'}
- Active Policy: ${worker?.activePolicy ? 'Yes — ' + (worker?.activePolicy?.planName || 'Standard') + ' tier' : 'No active policy'}
- Max Exposure Coverage: ₹600/cycle
- Weekly Premium: ₹${worker?.premium || 58}/week

ShieldX system capabilities:
- Monitors 3 signal classes: IMD SACHET flood alerts, platform outage signals (Downdetector + status pages), and government curfew orders
- Auto-executes payouts via Razorpay Payouts API within 2 hours of signal verification
- 7-signal Isolation Forest fraud evaluation runs on every event
- Policy tiers: Sentinel (₹49/week), Guardian (₹58/week), Apex (₹69/week)
- Coverage cap: ₹600/cycle for all tiers
- Reliability index affects premium rate (above 0.75 = 15% discount)

Respond with precision and analytical depth. Use technical but accessible language. Reference the worker's specific zone and reliability data where relevant. Keep responses under 3 sentences unless the question requires more detail. Use ₹ for Indian Rupees.`
}

export default function CoverageAssistant() {
  const navigate = useNavigate()
  const worker = useWorkerStore(s => s.worker)
  const activePolicy = useWorkerStore(s => s.activePolicy)
  const messagesEndRef = useRef(null)

  const workerWithPolicy = { ...worker, activePolicy }

  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'assistant',
      text: `ShieldX Risk Intelligence online. ${worker?.name?.split(' ')[0] ? `I have your risk profile loaded, ${worker.name.split(' ')[0]}.` : ''} Ask me about your coverage logic, trigger thresholds, fraud scoring, or policy terms — I can analyze your specific zone and reliability data.`,
      timestamp: new Date().toISOString(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { id: Date.now().toString(), role: 'user', text: text.trim(), timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Try keyword-based answer first (always available)
      const keywordAnswer = getKeywordAnswer(text)

      // Try Anthropic API via backend proxy if available
      const token = localStorage.getItem('gp-access-token') || localStorage.getItem('gp-token')
      let aiResponse = null

      if (token) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
          const resp = await fetch(`${apiUrl}/api/v1/assistant/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: text,
              system_prompt: buildSystemPrompt(workerWithPolicy),
            }),
            signal: AbortSignal.timeout(8000),
          })
          if (resp.ok) {
            const data = await resp.json()
            aiResponse = data.response
          }
        } catch {
          // Fallback to keyword matching
        }
      }

      const finalAnswer = aiResponse || keywordAnswer || generateFallback(text)
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: finalAnswer,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Query processing encountered an issue. Check your connection and retry — or rephrase as a more specific question.',
        timestamp: new Date().toISOString(),
      }])
    }
    setLoading(false)
  }

  const generateFallback = (question) => {
    const lower = question.toLowerCase()
    if (lower.includes('hello') || lower.includes('hi')) return `ShieldX Risk Intelligence online — how can I help you analyze your coverage or policy parameters?`
    if (lower.includes('thank')) return `Acknowledged. If you have further questions about your signals, executions, or reliability index, I am ready.`
    if (lower.includes('how') && lower.includes('work')) return `ShieldX continuously monitors your delivery zone for IMD flood alerts, platform outage signals, and curfew orders. When a verified trigger fires, the decision engine evaluates and executes a payout to your UPI automatically.`
    return `I can analyze your specific zone risk, reliability index, policy terms, or execution logic. Try asking about a specific trigger class or your premium calculation.`
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-secondary)' }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #D97757, #B85C3A)',
        padding: '16px 16px 20px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 999,
              width: 36, height: 36,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 800, color: 'white', margin: 0 }}>
                Coverage Assistant
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: '#12B76A' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter' }}>
                  Online · Ask me anything
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick questions */}
      <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                fontSize: 12, fontFamily: 'Inter', fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: 8,
              alignItems: 'flex-end',
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: 'linear-gradient(135deg, #D97757, #B85C3A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Bot size={14} color="white" />
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #D97757, #B85C3A)'
                : 'var(--bg-card)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-light)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <p style={{
                fontSize: 14, fontFamily: 'Inter', lineHeight: 1.5, margin: 0,
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              }}>
                {msg.text}
              </p>
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <User size={14} color="var(--text-secondary)" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: 'linear-gradient(135deg, #D97757, #B85C3A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={14} color="white" />
              </div>
              <div style={{
                padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{ width: 6, height: 6, borderRadius: 999, background: '#D97757' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px 24px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-light)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center',
          background: 'var(--bg-secondary)',
          borderRadius: 999,
          padding: '8px 8px 8px 16px',
          border: '1.5px solid var(--border-light)',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about your coverage..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: 14, fontFamily: 'Inter',
              color: 'var(--text-primary)',
            }}
          />
          <motion.button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 36, height: 36,
              borderRadius: 999,
              border: 'none',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #D97757, #B85C3A)'
                : 'var(--border-light)',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Send size={15} color={input.trim() && !loading ? 'white' : 'var(--text-tertiary)'} />
          </motion.button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'Inter', textAlign: 'center', marginTop: 8 }}>
          <Zap size={10} style={{ display: 'inline', marginRight: 3 }} />
          Powered by ShieldX AI
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  )
}
