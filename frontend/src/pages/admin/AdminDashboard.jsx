import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAdminDashboardStats, getZoneRiskMonitor, simulateTrigger } from '../../services/api'
import { PayoutProcessingModal } from '../../components/ui/PayoutProcessingModal'
import { useDemoStore } from '../../store/demoStore'

const QUICK_SIMS = [
  { key: 'FLOOD', label: 'Simulate Flood', city: 'Hyderabad', amount: 120 },
  { key: 'OUTAGE', label: 'Simulate Outage', city: 'Mumbai', amount: 90 },
  { key: 'FRAUD', label: 'Simulate Fraud', city: 'Chennai', amount: 0 },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [zoneRisk, setZoneRisk] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quickSimming, setQuickSimming] = useState(null)

  const openPayoutModal = useDemoStore((s) => s.openPayoutModal)
  const addActivity = useDemoStore((s) => s.addActivity)
  const setLastSimPayout = useDemoStore((s) => s.setLastSimPayout)

  useEffect(() => {
    const load = async () => {
      try {
        const s = await getAdminDashboardStats()
        const z = await getZoneRiskMonitor()
        setStats(s)
        setZoneRisk(z)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleQuickSim = async (sim) => {
    if (quickSimming) return
    setQuickSimming(sim.key)

    addActivity({ icon: '⚡', text: `${sim.label} in ${sim.city}` })

    openPayoutModal({
      triggerType: sim.label,
      city: sim.city,
      amount: sim.amount,
    })

    try {
      await simulateTrigger(sim.city, sim.key)
    } catch { }

    if (sim.key !== 'FRAUD') {
      setTimeout(() => {
        setLastSimPayout(sim)
      }, 3000)
    }

    setQuickSimming(null)
  }

  const { overview, financials, claims_by_trigger } = stats || {}

  return (
    <motion.div className="min-h-screen bg-slate-900 text-white p-4 space-y-6">

      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="Active systems" value={overview?.active_policies} loading={loading} />
        <Card title="Payouts today" value={overview?.claims_today} loading={loading} />
        <Card title="Pending review" value={overview?.pending_manual_review} loading={loading} />
        <Card title="Premium" value={`₹${financials?.monthly_premium_collected}`} loading={loading} />
        <Card title="Payouts" value={`₹${financials?.monthly_payouts}`} loading={loading} />
        <Card title="Loss ratio" value={`${financials?.loss_ratio}%`} loading={loading} />
      </div>

      {/* SIMULATION */}
      <div className="bg-slate-800 p-4 rounded-xl">
        <h2 className="mb-3 font-semibold">Simulation</h2>
        <div className="flex gap-2">
          {QUICK_SIMS.map((sim) => (
            <button
              key={sim.key}
              onClick={() => handleQuickSim(sim)}
              className="bg-indigo-600 px-3 py-2 rounded"
            >
              {sim.label}
            </button>
          ))}
        </div>
      </div>

      {/* ZONES */}
      <div className="bg-slate-800 p-4 rounded-xl">
        <h2 className="mb-2 font-semibold">Zone Risk</h2>
        {(zoneRisk?.zones || []).map((z) => (
          <div key={z.city}>{z.city} — {z.risk_level}</div>
        ))}
      </div>

      {/* CLAIMS */}
      <div className="bg-slate-800 p-4 rounded-xl">
        <h2 className="mb-2 font-semibold">Payouts</h2>
        {(claims_by_trigger || []).map((c) => (
          <div key={c._id}>{c._id} — {c.count}</div>
        ))}
      </div>

      <PayoutProcessingModal />
    </motion.div>
  )
}

function Card({ title, value, loading }) {
  return (
    <div className="bg-slate-800 p-3 rounded">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-lg font-bold">{loading ? '...' : value}</p>
    </div>
  )
}