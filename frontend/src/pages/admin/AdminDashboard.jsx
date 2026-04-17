import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Badge from '../../components/ui/Badge'
import { PayoutProcessingModal } from '../../components/ui/PayoutProcessingModal'
import { getAdminDashboardStats, getZoneRiskMonitor, simulateTrigger } from '../../services/api'
import { formatINRShort } from '../../utils/formatters'
import { useDemoStore } from '../../store/demoStore'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
}

const QUICK_SIMS = [
  {
    key: 'FLOOD',
    label: 'Simulate Flood',
    icon: '🌊',
    city: 'Hyderabad',
    amount: 120,
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.1)',
    border: 'rgba(56,189,248,0.25)',
    activity: { icon: '⚡', text: 'Heavy rain detected — Hyderabad zone' },
  },
  {
    key: 'OUTAGE',
    label: 'Simulate Outage',
    icon: '📡',
    city: 'Mumbai',
    amount: 90,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
    activity: { icon: '⚠️', text: 'Platform outage detected — Mumbai zone' },
  },
  {
    key: 'FRAUD',
    label: 'Simulate Fraud',
    icon: '🛡️',
    city: 'Chennai',
    amount: 0,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
    activity: { icon: '🚨', text: 'Fraud signal blocked — Chennai zone' },
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [zoneRisk, setZoneRisk] = useState(null)
  const [loading, setLoading] = useState(true)

  const [simCity, setSimCity] = useState('Hyderabad')
  const [simType, setSimType] = useState('FLOOD')
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState(null)
  const [quickSimming, setQuickSimming] = useState(null) // key of quick sim in progress

  const openPayoutModal  = useDemoStore((s) => s.openPayoutModal)
  const closePayoutModal = useDemoStore((s) => s.closePayoutModal)
  const addActivity      = useDemoStore((s) => s.addActivity)
  const setLastSimPayout = useDemoStore((s) => s.setLastSimPayout)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const statsData = await getAdminDashboardStats()
        setStats(statsData)
        const zoneData = await getZoneRiskMonitor()
        setZoneRisk(zoneData)
      } catch (err) {
        console.error('Error loading dashboard', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  // Quick simulation handler
  const handleQuickSim = async (sim) => {
    if (quickSimming) return
    setQuickSimming(sim.key)

    // Fire activity entry immediately
    addActivity(sim.activity)

    // Open payout modal
    openPayoutModal({ triggerType: sim.label, city: sim.city, amount: sim.amount })

    // Attempt real backend call (best-effort)
    try {
      await simulateTrigger(sim.city, sim.key)
    } catch (_) {}

    // Broadcast to worker dashboard (if fraud, no payout)
    if (sim.key !== 'FRAUD') {
      // Wait for modal animation to proceed a bit
      setTimeout(() => {
        setLastSimPayout({ triggerType: sim.label, city: sim.city, amount: sim.amount })
      }, 3600)
    }

    setQuickSimming(null)
  }

  const handleSimulate = async () => {
    setSimulating(true)
    setSimResult(null)
    try {
      const result = await simulateTrigger(simCity, simType)
      setSimResult({
        success: true,
        message: result?.message || `${simType} trigger fired in ${simCity}`,
      })
      const statsData = await getAdminDashboardStats().catch(() => null)
      if (statsData) setStats(statsData)
      const zoneData = await getZoneRiskMonitor().catch(() => null)
      if (zoneData) setZoneRisk(zoneData)
    } catch (error) {
      setSimResult({
        success: false,
        message: error?.detail || error?.message || 'Trigger simulation failed',
      })
    } finally {
      setSimulating(false)
      setTimeout(() => setSimResult(null), 5000)
    }
  }

  const { overview, financials, tier_breakdown, claims_by_trigger } = stats || {}
  
  return (
    <motion.div className="min-h-screen pb-8" style={{ background: 'var(--bg-primary)' }} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="mt-3 flex flex-col gap-3">
      
        {/* KPI Grid */}
        <div className="px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Row 1 */}
            <div className="rounded-card shadow-card p-3.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-medium font-body tracking-[0.5px]" style={{ color: 'var(--text-tertiary)' }}>Active policies</p>
              <p className="font-display font-bold text-[24px] mt-1 leading-tight" style={{ color: '#818CF8' }}>{loading ? '...' : overview?.active_policies}</p>
            </div>
            <div className="rounded-card shadow-card p-3.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-medium font-body tracking-[0.5px]" style={{ color: 'var(--text-tertiary)' }}>Claims today</p>
              <p className="font-display font-bold text-[24px] mt-1 leading-tight" style={{ color: '#F59E0B' }}>{loading ? '...' : overview?.claims_today}</p>
            </div>
            <div className="rounded-card shadow-card p-3.5 md:col-span-1 col-span-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-medium font-body tracking-[0.5px]" style={{ color: 'var(--text-tertiary)' }}>Pending review</p>
              <p className={`font-display font-bold text-[24px] mt-1 leading-tight`} style={{ color: overview?.pending_manual_review > 0 ? '#EF4444' : '#22C55E' }}>
                {loading ? '...' : overview?.pending_manual_review}
              </p>
            </div>
            
            {/* Row 2 */}
            <div className="rounded-card shadow-card p-3.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-medium font-body tracking-[0.5px]" style={{ color: 'var(--text-tertiary)' }}>Monthly premium</p>
              <p className="font-display font-bold text-[24px] mt-1 leading-tight" style={{ color: '#22C55E' }}>
                {loading ? '...' : `₹${financials?.monthly_premium_collected?.toLocaleString('en-IN')}`}
              </p>
            </div>
            <div className="rounded-card shadow-card p-3.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-medium font-body tracking-[0.5px]" style={{ color: 'var(--text-tertiary)' }}>Monthly payouts</p>
              <p className="font-display font-bold text-[24px] mt-1 leading-tight" style={{ color: '#22D3EE' }}>
                {loading ? '...' : `₹${financials?.monthly_payouts?.toLocaleString('en-IN')}`}
              </p>
            </div>
            <div className="rounded-card shadow-card p-3.5 md:col-span-1 col-span-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-[11px] font-medium font-body tracking-[0.5px]" style={{ color: 'var(--text-tertiary)' }}>Loss ratio</p>
              <p className={`font-display font-bold text-[24px] mt-1 leading-tight`} style={{ color: financials?.loss_ratio > 65 ? '#EF4444' : '#22C55E' }}>
                {loading ? '...' : (
                  <>
                    {financials?.loss_ratio}%
                    {stats?.data_mode === 'demo' && (
                      <span style={{ marginLeft: 8, fontSize: 10, background: 'rgba(99,102,241,0.15)', color: '#A5B4FC', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(99,102,241,0.25)', letterSpacing: '0.5px', verticalAlign: 'super', fontFamily: 'Inter' }}>DEMO</span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tier Breakdown */}
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 mt-1">
            <div className="flex-shrink-0 rounded-card shadow-card px-4 py-3 min-w-[130px]" style={{ background: 'rgba(253,186,2,0.08)', border: '1px solid rgba(253,186,2,0.2)' }}>
              <p className="text-[13px] font-medium font-body flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>🥇 Gold workers</p>
              <p className="font-display font-bold text-[20px] mt-1" style={{ color: '#FDB022' }}>{loading ? '...' : tier_breakdown?.gold}</p>
            </div>
            <div className="flex-shrink-0 rounded-card shadow-card px-4 py-3 min-w-[130px]" style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)' }}>
              <p className="text-[13px] font-medium font-body flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>🥈 Silver workers</p>
              <p className="font-display font-bold text-[20px] mt-1" style={{ color: '#94A3B8' }}>{loading ? '...' : tier_breakdown?.silver}</p>
            </div>
            <div className="flex-shrink-0 rounded-card shadow-card px-4 py-3 min-w-[130px]" style={{ background: 'rgba(205,127,50,0.08)', border: '1px solid rgba(205,127,50,0.2)' }}>
              <p className="text-[13px] font-medium font-body flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>🥉 Bronze workers</p>
              <p className="font-display font-bold text-[20px] mt-1" style={{ color: '#CD7F32' }}>{loading ? '...' : tier_breakdown?.bronze}</p>
            </div>
          </div>
        </div>

        {/* ── Simulation Panel ── */}
        <div style={{ margin: '8px 16px' }}>
          {/* Quick sim buttons */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 16,
            padding: 20,
            marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Simulation
              </p>
              <span style={{
                marginLeft: 'auto', fontSize: 10, fontWeight: 700, fontFamily: 'Inter',
                background: 'rgba(99,102,241,0.15)', color: '#818CF8',
                border: '1px solid rgba(99,102,241,0.25)',
                padding: '2px 8px', borderRadius: 99, letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>
                Demo mode
              </span>
            </div>
            <p style={{ fontSize: 12, fontFamily: 'Inter', color: 'var(--text-tertiary)', margin: '0 0 16px' }}>
              Fire a trigger to see the full payout flow — modal, activity feed, and worker dashboard update.
            </p>

            {/* 3 quick buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {QUICK_SIMS.map((sim) => {
                const isActive = quickSimming === sim.key
                return (
                  <motion.button
                    key={sim.key}
                    onClick={() => handleQuickSim(sim)}
                    disabled={!!quickSimming}
                    whileHover={{ scale: quickSimming ? 1 : 1.04, y: quickSimming ? 0 : -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px',
                      borderRadius: 12,
                      border: `1px solid ${sim.border}`,
                      background: isActive ? sim.bg : 'var(--bg-card)',
                      color: sim.color,
                      fontSize: 13, fontWeight: 700, fontFamily: 'Inter',
                      cursor: quickSimming ? 'not-allowed' : 'pointer',
                      opacity: quickSimming && !isActive ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? `0 4px 16px ${sim.border}` : 'none',
                    }}
                  >
                    {isActive ? (
                      <div style={{ width: 16, height: 16, border: `2px solid ${sim.color}`, borderTopColor: 'transparent', borderRadius: 999, animation: 'spin 0.7s linear infinite' }} />
                    ) : (
                      <span style={{ fontSize: 16 }}>{sim.icon}</span>
                    )}
                    {isActive ? 'Firing...' : sim.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Advanced trigger form (existing, preserved) */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
            <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Advanced — manual trigger
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={simCity} onChange={(e) => setSimCity(e.target.value)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter', outline: 'none', cursor: 'pointer' }}>
                {['Hyderabad', 'Mumbai', 'Chennai', 'Bengaluru', 'Delhi'].map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <select value={simType} onChange={(e) => setSimType(e.target.value)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter', outline: 'none', cursor: 'pointer' }}>
                <option value="FLOOD">Flood alert</option>
                <option value="OUTAGE">Platform outage</option>
                <option value="CURFEW">Government curfew</option>
              </select>
              <motion.button onClick={handleSimulate} disabled={simulating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: simulating ? 'var(--bg-card)' : 'linear-gradient(135deg,#6366F1,#4F46E5)', color: simulating ? 'var(--text-tertiary)' : 'white', fontSize: 13, fontWeight: 700, fontFamily: 'Inter', cursor: simulating ? 'not-allowed' : 'pointer', boxShadow: simulating ? 'none' : '0 4px 12px rgba(99,102,241,0.35)', transition: 'all 0.2s ease' }}>
                {simulating ? 'Simulating...' : 'Fire trigger'}
              </motion.button>
              {simResult && (
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ background: simResult.success ? 'rgba(18,183,106,0.1)' : 'rgba(240,68,56,0.1)', border: simResult.success ? '1px solid rgba(18,183,106,0.25)' : '1px solid rgba(240,68,56,0.25)', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: 'Inter', color: simResult.success ? '#12B76A' : '#F04438' }}>
                  {simResult.message}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Zone Risk Monitor */}
        <div className="mx-4 rounded-card shadow-card overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3.5 flex flex-col sm:flex-row sm:justify-between sm:items-center" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[14px] font-semibold font-body" style={{ color: 'var(--text-primary)' }}>Zone risk monitor</span>
            {zoneRisk?.summary?.critical_zones > 0 && (
              <span style={{ fontSize: 12, fontWeight: 600, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '4px 10px', borderRadius: 8, marginTop: 8 }}>
                ⚠️ {zoneRisk.summary.critical_zones} zones at critical risk · ₹{zoneRisk.summary.total_potential_exposure?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 500 }}>
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.05)', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th className="px-4 py-3 font-body">City</th>
                  <th className="px-4 py-3 font-body">Risk</th>
                  <th className="px-4 py-3 font-body">Active policies</th>
                  <th className="px-4 py-3 font-body">Claims/month</th>
                  <th className="px-4 py-3 font-body">Exposure</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 13, fontFamily: 'Inter' }}>
                {(zoneRisk?.zones || []).map((zone) => (
                  <tr key={zone.city} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{zone.city}</td>
                    <td className="px-4 py-3">
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: zone.risk_color === 'red' ? 'rgba(239,68,68,0.15)' : zone.risk_color === 'orange' ? 'rgba(245,158,11,0.15)' : zone.risk_color === 'yellow' ? 'rgba(253,186,2,0.15)' : 'rgba(34,197,94,0.15)',
                        color: zone.risk_color === 'red' ? '#EF4444' : zone.risk_color === 'orange' ? '#F59E0B' : zone.risk_color === 'yellow' ? '#FDB022' : '#22C55E',
                      }}>
                        {zone.risk_color === 'red' && '🔴'}
                        {zone.risk_color === 'orange' && '🟠'}
                        {zone.risk_color === 'yellow' && '🟡'}
                        {zone.risk_color === 'green' && '🟢'}
                        {' '}{zone.risk_level}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{zone.active_policies}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{zone.claims_this_month}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>₹{zone.potential_exposure_inr?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {!zoneRisk?.zones?.length && !loading && (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>No zones actively monitored — you're all set 👍</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claims by Trigger */}
        <div className="mx-4 rounded-card shadow-card overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[14px] font-semibold font-body" style={{ color: 'var(--text-primary)' }}>Claims by trigger</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 400 }}>
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.05)', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th className="px-4 py-3 font-body">Trigger type</th>
                  <th className="px-4 py-3 font-body">Count</th>
                  <th className="px-4 py-3 font-body text-right">Total payout</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 13, fontFamily: 'Inter' }}>
                {(claims_by_trigger || []).map((trigger) => (
                  <tr key={trigger._id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{trigger._id}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{trigger.count}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: '#22C55E' }}>₹{trigger.total_payout?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {!claims_by_trigger?.length && !loading && (
                  <tr>
                    <td colSpan="3" style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>No claims found this month.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payout processing modal — mounted at admin level too for the quick sim flow */}
      <PayoutProcessingModal />
    </motion.div>
  )
}

