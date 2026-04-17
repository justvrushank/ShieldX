import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PayoutProcessingModal } from '../../components/ui/PayoutProcessingModal'
import { useDemoStore } from '../../store/demoStore'
import { LiveActivityFeed } from '../../components/dashboard/LiveActivityFeed'

const QUICK_SIMS = [
  { key: 'FLOOD', label: 'Simulate Flood', city: 'Hyderabad', amount: 120 },
  { key: 'OUTAGE', label: 'Simulate Outage', city: 'Mumbai', amount: 90 },
  { key: 'FRAUD', label: 'Simulate Fraud', city: 'Chennai', amount: 0 },
]

const mockStats = {
  overview: {
    active_policies: 120,
    claims_today: 8,
    pending_manual_review: 2
  },
  financials: {
    monthly_premium_collected: '1.2M',
    monthly_payouts: '42K',
    loss_ratio: 3.5
  },
  claims_by_trigger: [
    { _id: 'FLOOD', count: 4 },
    { _id: 'OUTAGE', count: 3 },
    { _id: 'FRAUD', count: 1 }
  ]
}

const mockZoneRisk = {
  zones: [
    { city: 'Hyderabad', risk_level: 'High - Flood Alert' },
    { city: 'Mumbai', risk_level: 'Medium - Outage' },
    { city: 'Chennai', risk_level: 'Low' }
  ]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [zoneRisk, setZoneRisk] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quickSimming, setQuickSimming] = useState(null)

  const openPayoutModal = useDemoStore((s) => s.openPayoutModal)
  const addActivity = useDemoStore((s) => s.addActivity)
  const setLastSimPayout = useDemoStore((s) => s.setLastSimPayout)

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setStats(mockStats)
      setZoneRisk(mockZoneRisk)
      setLoading(false)
    }, 500)
  }, [])

  const handleQuickSim = async (sim) => {
    if (quickSimming) return
    setQuickSimming(sim.key)

    addActivity({ icon: '⚡', text: `${sim.label} in ${sim.city}` })
    console.log("Simulated event:", sim)

    openPayoutModal({
      triggerType: sim.label,
      city: sim.city,
      amount: sim.amount,
    })

    if (sim.key !== 'FRAUD') {
      setTimeout(() => {
        setLastSimPayout(sim)
      }, 3000)
    }

    setTimeout(() => {
      setQuickSimming(null)
    }, 1000)
  }

  const { overview, financials, claims_by_trigger } = stats || {}

  return (
    <motion.div
      className="text-slate-100 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Overview</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="Active Systems" value={overview?.active_policies} loading={loading} />
        <Card title="Payouts Today" value={overview?.claims_today} loading={loading} />
        <Card title="Pending Review" value={overview?.pending_manual_review} loading={loading} />
        <Card title="Premium" value={`₹${financials?.monthly_premium_collected}`} loading={loading} />
        <Card title="Payouts" value={`₹${financials?.monthly_payouts}`} loading={loading} />
        <Card title="Loss Ratio" value={`${financials?.loss_ratio}%`} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Col */}
        <div className="lg:col-span-2 space-y-6">
          {/* SIMULATION */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-5 rounded-2xl">
            <h2 className="mb-4 font-semibold text-lg text-white">System Simulation</h2>
            <div className="flex flex-wrap gap-3">
              {QUICK_SIMS.map((sim) => (
                <button
                  key={sim.key}
                  onClick={() => handleQuickSim(sim)}
                  className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2.5 rounded-xl font-medium text-sm flex items-center shadow-lg shadow-indigo-500/20"
                >
                  {sim.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ZONES */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-5 rounded-2xl flex flex-col h-full">
              <h2 className="mb-4 font-semibold text-white">Zone Risk Monitor</h2>
              <div className="space-y-3 flex-1">
                {(zoneRisk?.zones || []).map((z) => (
                  <div key={z.city} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl text-sm border border-slate-700/50">
                    <span className="font-medium">{z.city}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${z.risk_level.includes('High') ? 'bg-rose-500/10 text-rose-400' : z.risk_level.includes('Medium') ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {z.risk_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CLAIMS BY TRIGGER */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-5 rounded-2xl flex flex-col h-full">
              <h2 className="mb-4 font-semibold text-white">Payout Distribution</h2>
              <div className="space-y-3 flex-1">
                {(claims_by_trigger || []).map((c) => (
                  <div key={c._id} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl text-sm border border-slate-700/50">
                    <span className="font-medium text-slate-300">{c._id}</span>
                    <span className="bg-slate-700 text-white px-2.5 py-0.5 rounded font-medium">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="lg:col-span-1">
          <LiveActivityFeed />
        </div>
      </div>

      <PayoutProcessingModal />
    </motion.div>
  )
}

function Card({ title, value, loading }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-5 rounded-2xl hover:bg-slate-800 transition-colors">
      <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{loading ? '...' : value}</p>
    </div>
  )
}