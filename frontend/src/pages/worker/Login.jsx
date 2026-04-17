import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Info } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useWorkerStore } from '../../store/workerStore'
import { getUserByUid, loginWithFirebase } from '../../services/api'
import { signInWithEmail, signInWithGoogle } from '../../services/firebase'

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
}
const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const user = await signInWithGoogle()
      const existing = await getUserByUid(user.uid)
      if (!existing?.user) {
        sessionStorage.setItem('gp-pending-profile', JSON.stringify(user))
        navigate('/complete-profile')
        return
      }
      const data = await loginWithFirebase(user.idToken, user.name, user.phone)
      localStorage.setItem('gp-access-token', data.access_token)
      localStorage.setItem('gp-token', data.access_token)
      const { login } = useWorkerStore.getState()
      login(data.worker)
      navigate(data.requires_profile ? '/complete-profile' : '/dashboard')
    } catch (e) {
      setError(e?.message || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    setError('')
    setLoading(true)
    try {
      const user = await signInWithEmail(email, password)
      const data = await loginWithFirebase(user.idToken, user.name || '', user.phone || '')

      localStorage.setItem('gp-access-token', data.access_token)
      localStorage.setItem('gp-token', data.access_token)
      const { login } = useWorkerStore.getState()
      login(data.worker)
      navigate(data.requires_profile ? '/complete-profile' : '/dashboard')
    } catch (e) {
      setError(e?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg-primary)' }}>
      {/* LEFT: Gradient panel */}
      <div
        className="w-full lg:w-1/2 lg:min-h-screen relative flex-shrink-0 flex items-center justify-center p-8"
        style={{
          minHeight: 220,
          background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #0D1117 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, borderRadius: 999, background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 400, width: '100%' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            borderRadius: 12,
            padding: '8px 16px',
            marginBottom: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 24, fontWeight: 500, color: 'white', letterSpacing: '-0.02em' }}>
              ShieldX
            </span>
          </div>

          <h2 style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 16
          }}>
            Real-time payout system for delivery workers.
          </h2>
          <p style={{
            fontSize: 15, fontFamily: 'Inter, sans-serif',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
          }}>
            Secure access to your monitoring dashboard and settings.
          </p>
        </div>
      </div>

      {/* RIGHT: Form panel */}
      <motion.div
        className="flex-1 flex flex-col lg:justify-center lg:max-w-xl lg:mx-auto lg:px-12"
        initial="initial"
        animate="animate"
        variants={container}
      >
        {/* Mobile-only heading */}
        <div className="px-6 pt-6 pb-4 lg:hidden">
          <motion.h1
            variants={item}
            className="font-display font-bold text-[28px] leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            System active.
          </motion.h1>

          <motion.p
            variants={item}
            className="font-body text-[14px] leading-relaxed mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Detecting anomalies securely.
          </motion.p>
        </div>

        {/* Desktop heading */}
        <motion.div variants={item} className="hidden lg:block mb-6">
          <h1 style={{
            fontFamily: 'Bricolage Grotesque',
            fontSize: 28, fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 6px',
          }}>
            Welcome back
          </h1>
          <p style={{
            fontSize: 15, fontFamily: 'Inter',
            color: 'var(--text-secondary)',
          }}>
            Sign in to your ShieldX account
          </p>
        </motion.div>

        {/* Demo access card */}
        <motion.div
          variants={item}
          className="mx-4 mb-4 rounded-card p-5 lg:mx-0"
          style={{
            background: 'var(--bg-primary)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div className="mt-2">
            <Button onClick={() => navigate('/worker')} fullWidth>
              Enter as Demo Worker →
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
