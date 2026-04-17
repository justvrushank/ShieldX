import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, ShieldCheck, DollarSign } from 'lucide-react'
import { LandingNav } from '../components/layout/LandingNav'
import { LandingFooter } from '../components/layout/LandingFooter'
import LiveSystemFeed from '../components/ui/LiveSystemFeed'

// ── Video background for hero ──────────────────────────────────────────
const VideoBackground = () => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
    <video
      autoPlay muted loop playsInline
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '100%', minHeight: '100%',
        objectFit: 'cover', opacity: 0.25,
      }}
    >
      <source
        src="https://res.cloudinary.com/dqwm8wgg8/video/upload/v1774194675/m3wmgks3mlvhur17jybt.mp4"
        type="video/mp4"
      />
    </video>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.85) 60%, rgba(15,23,42,0.95) 100%)',
    }} />
  </div>
)

// ── AI News data ───────────────────────────────────────────────────────
const AI_NEWS = [
  { tag: '🌊 Flood',      color: '#38BDF8', title: 'IMD Red Alert — Hyderabad flooding',           source: 'IMD SACHET',    time: 'Live',      impact: '32 workers auto-covered' },
  { tag: '📱 Outage',     color: '#F59E0B', title: 'Zepto app down — Mumbai zone',                 source: 'Downdetector',  time: '2h ago',    impact: '18 payout claims processed' },
  { tag: '🚫 Curfew',     color: '#A78BFA', title: 'Section 144 — North Bengaluru',               source: 'District Admin', time: '5h ago',    impact: '9 workers covered' },
  { tag: '🌧️ Alert',      color: '#38BDF8', title: 'Orange alert — Chennai coastal zones',         source: 'IMD SACHET',    time: '8h ago',    impact: '14 workers pre-covered' },
  { tag: '⚡ Outage',     color: '#F59E0B', title: 'Swiggy partial outage — Delhi',               source: 'Downdetector',  time: '12h ago',   impact: 'Monitoring active' },
  { tag: '🔬 Research',   color: '#6366F1', title: '12M gig workers face zero income protection', source: 'NASSCOM 2024',  time: '3 days ago', impact: 'The problem we solve' },
]

const NewsCard = ({ item }) => (
  <div style={{
    width: 260, flexShrink: 0,
    background: '#1E293B', borderRadius: 16,
    padding: '16px 18px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
    border: '1px solid #334155',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif',
        color: item.color, background: `${item.color}18`,
        padding: '3px 8px', borderRadius: 999,
      }}>{item.tag}</span>
      <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{item.time}</span>
    </div>
    <p style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#F1F5F9', margin: '0 0 8px', lineHeight: 1.4 }}>{item.title}</p>
    <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>{item.source}</p>
    <div style={{ background: 'rgba(99,102,241,0.12)', borderRadius: 8, padding: '6px 10px', display: 'flex', gap: 6, border: '1px solid rgba(99,102,241,0.2)' }}>
      <span style={{ fontSize: 10 }}>🛡️</span>
      <p style={{ fontSize: 11, color: '#A5B4FC', fontFamily: 'Inter, sans-serif', fontWeight: 600, margin: 0 }}>{item.impact}</p>
    </div>
  </div>
)

const NewsRow = ({ items, direction = -1 }) => (
  <div style={{ overflow: 'hidden', marginBottom: 16 }}>
    <motion.div
      style={{ display: 'flex', gap: 16, width: 'max-content' }}
      animate={{ x: direction === -1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
      transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
    >
      {[...items, ...items].map((item, i) => <NewsCard key={i} item={item} />)}
    </motion.div>
  </div>
)

// ── Pricing plans ──────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Daily Shield', price: 12, period: 'day', badge: 'Most affordable', badgeColor: 'green',
    zone: 'Perfect for workers who want flexible daily protection',
    features: ['24-hour protection window', 'Income-based payout (₹400–₹900)', 'All 5 trigger types covered', 'Instant UPI payout'],
    cta: 'Get daily →',
  },
  {
    name: 'Basic', price: 49, period: 'week', zone: 'Low risk zone', popular: false,
    features: ['Up to ₹600/week coverage', 'IMD flood trigger', 'Platform outage trigger', 'Govt curfew trigger', 'UPI instant payout', 'AI 24h flood forecast', 'Basic risk score'],
    cta: 'Get basic',
  },
  {
    name: 'Standard', price: 62, period: 'week', badge: 'Most popular', badgeColor: 'indigo', zone: 'Medium risk zone', popular: true,
    features: ['Up to ₹600/week coverage', 'All 3 triggers included', 'UPI instant payout < 2 hrs', 'AI 24h flood forecast', 'Worker risk score tracking', 'Activity verification', 'Priority claim review', 'Flood alert notifications'],
    cta: 'Get standard →',
  },
  {
    name: 'Premium', price: 89, period: 'week', zone: 'High risk zone', popular: false,
    features: ['Up to ₹600/week coverage', 'All 3 triggers included', 'UPI instant payout < 1 hr', 'AI 7-day forecast', 'Auto coverage extension', 'Priority fraud protection', 'Dedicated claim tracking', 'WhatsApp alerts', '24/7 support priority'],
    cta: 'Get premium',
  },
]

// ── Main Landing ───────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A' }}>
      <LandingNav />

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px max(20px, 5vw) 80px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #0D1117 100%)',
      }}>
        <VideoBackground />

        {/* Ambient glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 320, height: 320, borderRadius: 999, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: 260, height: 260, borderRadius: 999, background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, width: '100%', display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* LEFT: Copy */}
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            {/* LIVE badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(34,197,94,0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 999, padding: '6px 16px 6px 8px',
                marginBottom: 28,
              }}
            >
              <span style={{
                background: '#22C55E', color: 'white',
                fontSize: 10, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                padding: '2px 8px', borderRadius: 999, letterSpacing: '0.5px',
              }}>LIVE</span>
              <span style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                System active & monitoring
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 25 }}
              style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 800, color: 'white',
                lineHeight: 1.05, letterSpacing: -2,
                margin: '0 0 24px',
                textShadow: '0 2px 40px rgba(0,0,0,0.4)',
              }}
            >
              Get paid when your<br />
              <span style={{
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                city shuts down.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
                maxWidth: 540, margin: '0 0 40px', fontWeight: 400,
              }}
            >
              ShieldX detects floods, outages, and curfews in real time — and pays you instantly. No forms. No waiting.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
            >
              <motion.button
                onClick={() => navigate('/worker')}
                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '15px 32px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: 'white', fontSize: 16, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 24px rgba(34,197,94,0.45)',
                  transition: 'all 0.2s ease',
                }}
              >
                Start monitoring <ArrowRight size={18} />
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '15px 32px', borderRadius: 14,
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: 600,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                See how it works
              </motion.button>
            </motion.div>

            {/* System Moment */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: 20 }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }}></span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Last event:</span> Flood detected in Hyderabad <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> <span style={{ color: '#22C55E', fontWeight: 600 }}>₹120 paid</span>
                </span>
              </div>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 32 }}
            >
              {['⚡ Paid instantly', '🛡️ Real-time system monitoring', '💳 Zero forms or calls'].map(t => (
                <span key={t} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>{t}</span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Live Feed */}
          <div style={{ flex: '1 1 360px', display: 'flex', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
               <LiveSystemFeed />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM SECTION — dark ── */}
      <section style={{ background: '#020617', padding: 'clamp(80px,10vw,120px) max(24px,8vw)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 64 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#6366F1', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>
              The problem
            </p>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, color: 'white', letterSpacing: -1.5, lineHeight: 1.1, maxWidth: 700, margin: 0 }}>
              12 million workers.
              <span style={{ color: '#334155' }}> Zero protection.</span>
            </h2>
          </motion.div>

          {/* Problem Redesign */}
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 24, padding: '48px 24px', marginBottom: 32, display: 'inline-block', minWidth: '80%' }}
            >
              <p style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 800, color: '#22C55E', margin: '0 0 16px', letterSpacing: -2, lineHeight: 1 }}>12M+</p>
              <p style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: 'white', margin: 0 }}>workers unprotected</p>
            </motion.div>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
              {[
                { number: '₹640', label: 'Lost per flood day', color: '#EF4444' },
                { number: '₹4,200Cr', label: 'Annual income lost', color: '#F59E0B' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: '24px 32px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 16,
                    minWidth: 260
                  }}
                >
                  <p style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 36, fontWeight: 800, color: stat.color, margin: '0 0 4px', letterSpacing: -1 }}>{stat.number}</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif', margin: 0 }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <p style={{ fontSize: 18, color: '#94A3B8', fontFamily: 'Inter, sans-serif', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
              Existing systems fail gig workers because they rely on slow claims. We replaced claims with automated payouts triggered by real-time data.
            </p>
          </div>

          {/* Ravi's story */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(15,23,42,0.9))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 20, padding: 'clamp(32px,5vw,56px)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 20, right: 32, fontSize: 180, fontFamily: 'Georgia', color: 'rgba(99,102,241,0.05)', lineHeight: 1, userSelect: 'none' }}>"</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 72, height: 72, borderRadius: 999, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>🛵</div>
              <div>
                <p style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 700, color: 'white', lineHeight: 1.4, margin: '0 0 16px' }}>
                  "July 2024. IMD issues Red Alert. Zepto suspends ops. I lose ₹640 in one day with zero recourse."
                </p>
                <p style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                  Ravi Kumar, 27 · Delivery partner · Kondapur, Hyderabad
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SOLUTION — bento grid ── */}
      <section id="coverage" style={{ background: '#0F172A', padding: 'clamp(80px,10vw,120px) max(24px,8vw)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#6366F1', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>
              The solution
            </p>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
              Auto-pays before Ravi<br />knows it happened.
            </h2>
            <p style={{ fontSize: 18, color: '#94A3B8', fontFamily: 'Inter, sans-serif', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              ShieldX watches your zone around the clock. When something happens, we pay you automatically. You don't lift a finger.
            </p>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* Large left — payout flow */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="md:col-span-7"
              style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 20, padding: 36, overflow: 'hidden', position: 'relative', transition: 'all 0.25s ease' }}
            >
              <p style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#6366F1', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>Zero-touch payout flow</p>
              <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: -0.5 }}>₹600 in 2 hours.<br />No claim filed.</h3>
              <p style={{ fontSize: 14, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 32, lineHeight: 1.5 }}>From flood alert to UPI credit — fully automated.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Trigger detected',   sub: 'IMD Red Alert · Kondapur', time: '2:19 PM', done: true },
                  { label: 'Activity verified',  sub: 'Last order 38 min ago',    time: '2:20 PM', done: true },
                  { label: 'Fraud check passed', sub: 'Score 0.04 · Auto approved', time: '2:21 PM', done: true },
                  { label: '₹600 to your UPI',  sub: 'ravi.kumar@okaxis',         time: '4:16 PM', done: false, active: true },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 16, position: 'relative' }}>
                    {i < 3 && <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 1, background: step.done ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)' }} />}
                    <div style={{ width: 24, height: 24, borderRadius: 999, background: step.done ? '#22C55E' : step.active ? '#6366F1' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                      {step.done ? <span style={{ fontSize: 11, color: 'white' }}>✓</span> : step.active ? (
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: 999, background: 'white' }} />
                      ) : null}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: step.active ? '#A5B4FC' : step.done ? 'white' : 'rgba(255,255,255,0.3)', margin: '0 0 2px' }}>{step.label}</p>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif' }}>{step.time}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif', margin: 0 }}>{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right top — Premium pricing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="md:col-span-5"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', transition: 'all 0.25s ease' }}
            >
              <p style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#6366F1', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Weekly premium</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 72, fontWeight: 800, color: 'white', letterSpacing: -3, lineHeight: 1 }}>₹49</span>
                <span style={{ fontSize: 16, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>/week</span>
              </div>
              <p style={{ fontSize: 14, color: '#94A3B8', fontFamily: 'Inter, sans-serif', margin: '0 0 20px', flex: 1, lineHeight: 1.6 }}>
                Behavior-based pricing. Active workers get up to 15% discount.
              </p>
              <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', margin: '0 0 4px' }}>Coverage cap</p>
                <p style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 800, color: '#A5B4FC', margin: 0 }}>₹600 / week</p>
              </div>
            </motion.div>

            {/* Bottom row — 3 trigger cards */}
            {[
              { icon: '🌊', title: 'IMD flood alerts',    desc: 'Official govt source. Red/Orange alert in your zone = 100% payout.',                    bg: 'rgba(56,189,248,0.08)', iconBg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.2)' },
              { icon: '📱', title: 'Platform outages',    desc: 'Zepto down? Swiggy offline? Dual-verified via Downdetector + status API.',              bg: 'rgba(245,158,11,0.08)', iconBg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.2)' },
              { icon: '🚫', title: 'Govt curfews',        desc: 'Section 144 in your area. District admin API + news verification.',                      bg: 'rgba(34,197,94,0.08)', iconBg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.2)' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="md:col-span-4"
                style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 20, padding: 24, transition: 'all 0.25s ease' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.5 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — 5 steps ── */}
      <section id="how-it-works" style={{ background: '#020617', padding: 'clamp(80px,10vw,120px) max(24px,8vw)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'white', letterSpacing: -1.5 }}>
              From sign-up to payout<br />in minutes.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0, position: 'relative' }}>
            {/* Connector line */}
            <div className="hidden md:block" style={{ position: 'absolute', top: 40, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, #6366F1, #22D3EE)', zIndex: 0 }} />

            {[
              { step: '01', emoji: '📱', title: 'Sign up',     desc: 'Google login. No documents. 2 minutes.' },
              { step: '02', emoji: '📍', title: 'Set your zone', desc: 'GPS auto-detects your delivery area.' },
              { step: '03', emoji: '💳', title: 'Pay ₹49/week', desc: 'UPI auto-debit every Sunday.' },
              { step: '04', emoji: '🤖', title: 'We monitor',  desc: 'AI checks IMD + platforms 24/7.' },
              { step: '05', emoji: '⚡', title: 'Auto-payout', desc: '₹600 to UPI in under 2 hours.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px 32px', position: 'relative', zIndex: 1 }}
              >
                <div style={{ width: 80, height: 80, borderRadius: 999, background: '#1E293B', border: '2px solid #6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 20, boxShadow: '0 4px 24px rgba(99,102,241,0.2)' }}>
                  {step.emoji}
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#6366F1', letterSpacing: '2px', margin: '0 0 6px' }}>STEP {step.step}</p>
                <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE INTELLIGENCE — dual news carousel ── */}
      <section style={{ padding: 'clamp(60px,8vw,80px) 0', background: '#0F172A', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 36, padding: '0 max(24px,5vw)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#64748B', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 8px' }}>
            What's happening right now
          </p>
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: 'white', letterSpacing: -1, margin: 0 }}>
            We never miss an event
          </h2>
        </div>
        <NewsRow items={AI_NEWS} direction={-1} />
        <NewsRow items={[...AI_NEWS].reverse()} direction={1} />
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: 'clamp(80px,10vw,120px) max(24px,8vw)', background: '#020617' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#6366F1', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Pricing</p>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: 'white', letterSpacing: -1, marginBottom: 12 }}>
              Simple, weekly pricing
            </h2>
            <p style={{ fontSize: 16, color: '#94A3B8', fontFamily: 'Inter, sans-serif', maxWidth: 440, margin: '0 auto' }}>
              No annual lock-in. Cancel any week. Premium adjusts automatically as your risk score improves.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'stretch' }}>
            {PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -6, boxShadow: plan.popular ? '0 16px 48px rgba(99,102,241,0.3)' : '0 8px 32px rgba(0,0,0,0.4)' }}
                style={{
                  background: '#1E293B', borderRadius: 20, padding: 28,
                  border: plan.badgeColor === 'green' ? '2px solid #22C55E' : plan.popular ? '2px solid #6366F1' : '1px solid #334155',
                  boxShadow: plan.badgeColor === 'green' ? '0 8px 40px rgba(34,197,94,0.15)' : plan.popular ? '0 8px 40px rgba(99,102,241,0.2)' : '0 2px 16px rgba(0,0,0,0.3)',
                  position: 'relative', display: 'flex', flexDirection: 'column',
                  transition: 'all 0.25s ease',
                }}
              >
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: plan.badgeColor === 'green' ? 'linear-gradient(135deg,#22C55E,#16A34A)' : 'linear-gradient(135deg,#6366F1,#4F46E5)', color: 'white', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif', padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}
                <p style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>{plan.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 48, fontWeight: 800, color: 'white', letterSpacing: -2 }}>₹{plan.price}</span>
                  <span style={{ fontSize: 14, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>/{plan.period || 'week'}</span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', margin: '0 0 20px', lineHeight: 1.4 }}>{plan.zone}</p>
                <div style={{ height: 1, background: '#334155', margin: '0 0 20px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 18, height: 18, borderRadius: 999, background: plan.popular ? 'rgba(99,102,241,0.15)' : 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 10, color: plan.popular ? '#A5B4FC' : '#22C55E' }}>✓</span>
                      </div>
                      <span style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#CBD5E1', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => navigate('/worker')}
                  whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', marginTop: 24, padding: '13px', borderRadius: 12, border: plan.popular ? 'none' : '1.5px solid #334155', background: plan.popular ? 'linear-gradient(135deg,#6366F1,#4F46E5)' : 'transparent', color: plan.popular ? 'white' : '#CBD5E1', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: plan.popular ? '0 4px 16px rgba(99,102,241,0.4)' : 'none', transition: 'all 0.2s ease' }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#475569', fontFamily: 'Inter, sans-serif', marginTop: 24 }}>
            Prices vary by zone flood risk and worker risk score. ₹49 is minimum for low-risk zones.
          </p>
        </div>
      </section>

      {/* ── FOR WORKERS — dark section ── */}
      <section id="workers" style={{ padding: 'clamp(60px,8vw,100px) max(24px,8vw)', background: '#0F172A' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#6366F1', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>
              For delivery workers
            </p>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: 'white', letterSpacing: -1.5, lineHeight: 1.1 }}>
              Built for the way you work
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 2 }}>
            {[
              { emoji: '📍', title: 'Zone-based coverage', desc: '5km radius monitoring. Your area, your coverage.', color: '#6366F1' },
              { emoji: '💸', title: 'UPI instant credit',  desc: 'Payout straight to your UPI. No bank forms.',       color: '#22C55E' },
              { emoji: '🤖', title: 'AI fraud protection', desc: 'Honest workers never punished. Fraud caught automatically.', color: '#38BDF8' },
              { emoji: '📊', title: 'Risk score rewards',  desc: 'Consistent workers get lower premiums. Up to 15% off.', color: '#A78BFA' },
              { emoji: '🔔', title: 'Advance warnings',    desc: 'AI predicts floods 24h early. Coverage extends automatically.', color: '#F59E0B' },
              { emoji: '✅', title: 'Zero paperwork',      desc: 'No forms, no documents, no calls. Ever.', color: '#22C55E' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ background: `${item.color}10`, borderColor: `${item.color}25` }}
                style={{
                  padding: 28,
                  border: '1px solid #1E293B',
                  borderRadius: i === 0 ? '16px 0 0 0' : i === 2 ? '0 16px 0 0' : i === 3 ? '0 0 0 16px' : i === 5 ? '0 0 16px 0' : 0,
                  cursor: 'default',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 16,
                }}>
                  {item.emoji}
                </div>
                <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: -0.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) max(24px,8vw)', textAlign: 'center', background: '#020617' }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{ maxWidth: 640, margin: '0 auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(30,41,59,0.9))', borderRadius: 24, padding: 'clamp(40px,6vw,64px)', boxShadow: '0 8px 48px rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', transition: 'all 0.25s ease' }}
        >
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: 'white', letterSpacing: -1, marginBottom: 16 }}>
            Start your protection today
          </h2>
          <p style={{ fontSize: 16, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginBottom: 32, lineHeight: 1.5 }}>
            Join delivery workers across India already running ShieldX. Real-time risk coverage from ₹49/week.
          </p>
          <motion.button
            onClick={() => navigate('/worker')}
            whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: '16px 36px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(99,102,241,0.45)', transition: 'all 0.2s ease' }}
          >
            Activate ShieldX — ₹49/week <ArrowRight size={18} />
          </motion.button>
          <p style={{ fontSize: 12, color: '#475569', fontFamily: 'Inter, sans-serif', marginTop: 16 }}>No commitment · Cancel anytime · UPI payment</p>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  )
}

export default Landing
