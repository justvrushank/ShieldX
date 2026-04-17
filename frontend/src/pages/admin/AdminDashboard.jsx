import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAdminDashboardStats, getZoneRiskMonitor, simulateTrigger } from '../../services/api'
import { PayoutProcessingModal } from '../../components/ui/PayoutProcessingModal'
import { useDemoStore } from '../../store/demoStore'

const QUICK_SIMS = [
  {
    key: 'FLOOD',
    label: 'Simulate Flood',
    icon: '🌊',
    city: 'Hyderabad',
    amount: 120,
    activity: { icon: '⚡', text: 'Heavy rain detected — Hyderabad zone' },
  },
  {
    key: 'OUTAGE',
    label: 'Simulate Outage',
    icon: '📡',
    city: 'Mumbai',
    amount: 90,
    activity: { icon: '⚠️', text: 'Platform outage detected — Mumbai zone' },
  },
  {
    key: 'FRAUD',
    label: 'Simulate Fraud',
    icon: '🛡️',
    city: 'Chennai',
    amount: 0,
    activity: { icon: '🚨', text: 'Fraud signal blocked — Chennai zone' },
  },
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
    const loadData = async () => {
      try {
        const statsData = await getAdminDashboardStats()
        const zoneData = await getZoneRiskMonitor()
        setStats(statsData)
        setZoneRisk(zoneData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleQuickSim = async (sim) => {
    if (quickSimming) return
    setQuickSimming(sim.key)

    addActivity(sim.activity)

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
        setLastSimPayout({
          triggerType: sim.label,
          city: sim.city,
          amount: sim.amount,
        })
      }, 3000)
    }

    setQuickSimming(null)
  }

  const { overview, financials, claims_by_trigger } = stats || {}

  return (
    <motion.div className="min-h-screen bg-slate-900 text-white p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">Live system overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="Active policies" value={overview?.active_policies} loading={loading} />
        <Card title="Claims today" value={overview?.claims_today} loading={loading} />
        <Card title="Pending review" value={overview?.pending_manual_review} loading={loading} />
        <Card title="Monthly premium" value={`₹${financials?.monthly_premium_collected?.toLocaleString('en-IN')}`} loading={loading} />
        <Card title="Monthly payouts" value={`₹${financials?.monthly_payouts?.toLocaleString('en-IN')}`} loading={loading} />
        <Card title="Loss ratio" value={`${financials?.loss_ratio}%`} loading={loading} />
      </div>

      {/* SIMULATION PANEL */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
        <h2 className="font-semibold mb-3">⚡ Simulation</h2>
        <div className="flex gap-3 flex-wrap">
          {QUICK_SIMS.map((sim) => (
            <button
              key={sim.key}
              onClick={() => handleQuickSim(sim)}
              disabled={!!quickSimming}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition"
            >
              {quickSimming === sim.key ? 'Running...' : sim.label}
            </button>
          ))}
        </div>
      </div>

      {/* ZONE TABLE */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 font-semibold border-b border-slate-700">Zone risk monitor</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-xs">
            <tr>
              <th className="p-3 text-left">City</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Policies</th>
              <th className="p-3">Claims</th>
              <th className="p-3">Exposure</th>
            </tr>
          </thead>
          <tbody>
            {(zoneRisk?.zones || []).map((z) => (
              <tr key={z.city} className="border-t border-slate-700">
                <td className="p-3">{z.city}</td>
                <td className="p-3">{z.risk_level}</td>
                <td className="p-3">{z.active_policies}</td>
                <td className="p-3">{z.claims_this_month}</td>
                <td className="p-3">₹{z.potential_exposure_inr?.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CLAIMS TABLE */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 font-semibold border-b border-slate-700">Claims by trigger</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-xs">
            <tr>
              <th className="p-3 text-left">Trigger</th>
              <th className="p-3">Count</th>
              <th className="p-3">Total payout</th>
            </tr>
          </thead>
          <tbody>
            {(claims_by_trigger || []).map((t) => (
              <tr key={t._id} className="border-t border-slate-700">
                <td className="p-3">{t._id}</td>
                <td className="p-3">{t.count}</td>
                <td className="p-3">₹{t.total_payout?.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <PayoutProcessingModal />
    </motion.div>
  )
}

function Card({ title, value, loading }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-xl font-bold mt-1">{loading ? '...' : value}</p>
    </div>
  )
}