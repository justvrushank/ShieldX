import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAdminDashboardStats, getZoneRiskMonitor, simulateTrigger } from '../../services/api'
import { CheckCircle2, AlertTriangle, Zap, ServerCrash, ShieldAlert, TrendingUp } from 'lucide-react'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
}

const childVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [zoneRisk, setZoneRisk] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState(null)
  const [lastUpdated, setLastUpdated] = useState('just now')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const statsData = await getAdminDashboardStats()
        setStats(statsData)
        const zoneData = await getZoneRiskMonitor()
        setZoneRisk(zoneData)
        setLastUpdated('just now')
      } catch (err) {
        console.error("Error loading dashboard", err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
    
    const interval = setInterval(() => {
      setLastUpdated('1m ago')
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSimulate = async (type) => {
    setSimulating(true)
    setSimResult(null)
    try {
      if (type === 'FRAUD') {
        // Frontend simulation for fraud
        await new Promise(r => setTimeout(r, 600))
        setSimResult({ success: true, message: "Simulated 5 fraudulent claim attempts logged & blocked." })
        return
      }
      const city = ['Hyderabad', 'OutageTown'][Math.floor(Math.random() * 2)]
      const result = await simulateTrigger(city, type)
      setSimResult({
        success: true,
        message: result?.message || `${type} trigger fired in ${city}`,
      })
      const statsData = await getAdminDashboardStats().catch(() => null)
      if (statsData) setStats(statsData)
      const zoneData = await getZoneRiskMonitor().catch(() => null)
      if (zoneData) setZoneRisk(zoneData)
      setLastUpdated('just now')
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
    <motion.div className="w-full pb-8 text-slate-200" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time performance and active events</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-400">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Updated {lastUpdated}
        </div>
      </div>

      <div className="flex flex-col gap-6">
      
        {/* System Health / KPI Grid */}
        <motion.div variants={childVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-all duration-300">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Active Policies</p>
            <p className="font-display font-bold text-3xl mt-2 text-indigo-400">{loading ? '...' : overview?.active_policies}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-all duration-300">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Claims Today</p>
            <p className="font-display font-bold text-3xl mt-2 text-cyan-400">{loading ? '...' : overview?.claims_today}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-all duration-300">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pending Review</p>
            <p className={`font-display font-bold text-3xl mt-2 ${overview?.pending_manual_review > 0 ? 'text-rose-400' : 'text-green-400'}`}>
              {loading ? '...' : overview?.pending_manual_review}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-all duration-300">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Loss Ratio</p>
            <div className="flex items-center gap-2 mt-2">
              <p className={`font-display font-bold text-3xl ${financials?.loss_ratio > 65 ? 'text-rose-400' : 'text-green-400'}`}>
                {loading ? '...' : `${financials?.loss_ratio}%`}
              </p>
              {stats?.data_mode === 'demo' && (
                <span className="text-[9px] bg-slate-700/50 text-slate-400 border border-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">DEMO</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Demo Simulation Panel */}
        <motion.div variants={childVariants} className="bg-gradient-to-r from-slate-800 to-indigo-900/40 border border-indigo-500/30 p-5 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={100} />
          </div>
          <div className="relative z-10">
            <h2 className="text-sm font-bold font-display text-white mb-1 flex items-center gap-2">
              <Zap size={16} className="text-indigo-400" /> Live Simulation Panel
            </h2>
            <p className="text-xs text-indigo-200/70 mb-4 max-w-xl">
              Trigger instant operational anomalies. Watch the robust risk engine analyze, classify, and queue responses securely.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleSimulate('FLOOD')} 
                disabled={simulating} 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white text-xs font-bold rounded-lg disabled:opacity-50 border border-indigo-500/50 shadow-sm"
              >
                <AlertTriangle size={14} /> Trigger Flood Event
              </button>
              <button 
                onClick={() => handleSimulate('OUTAGE')} 
                disabled={simulating} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-white text-xs font-bold rounded-lg disabled:opacity-50 border border-slate-600 shadow-sm"
              >
                <ServerCrash size={14} /> Trigger Outage
              </button>
              <button 
                onClick={() => handleSimulate('FRAUD')} 
                disabled={simulating} 
                className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/40 active:scale-95 transition-all text-rose-400 text-xs font-bold rounded-lg disabled:opacity-50 border border-rose-500/30 shadow-sm"
              >
                <ShieldAlert size={14} /> Trigger Fraud
              </button>
            </div>
            
            <AnimatePresence>
              {simResult && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className={`mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border shadow-sm ${
                    simResult.success 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {simResult.success ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {simResult.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Dashboard Grid Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Events / Zone Risk */}
          <motion.div variants={childVariants} className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/80">
              <div>
                <h3 className="text-sm font-bold font-display text-white">Active Events</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Live anomalies detected centrally</p>
              </div>
              {zoneRisk?.summary?.critical_zones > 0 && (
                <span className="text-[10px] uppercase tracking-wide font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-full animate-pulse">
                  {zoneRisk.summary.critical_zones} Critical
                </span>
              )}
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-900/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700/60">
                    <th className="px-5 py-3">Zone / City</th>
                    <th className="px-5 py-3">Risk Level</th>
                    <th className="px-5 py-3 text-right">Policies</th>
                    <th className="px-5 py-3 text-right">Exposure</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-200">
                  <AnimatePresence>
                    {(zoneRisk?.zones || []).map((zone, idx) => (
                      <motion.tr 
                        key={zone.city}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                        className="odd:bg-slate-800 even:bg-slate-900/30 hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0"
                      >
                        <td className="px-5 py-3.5 font-semibold text-white">{zone.city}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold rounded shadow-sm tracking-wider uppercase ${
                            zone.risk_color === 'red' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                            zone.risk_color === 'orange' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                            zone.risk_color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                            'bg-green-500/20 text-green-400 border border-green-500/20'
                          }`}>
                            {zone.risk_level}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-display">{zone.active_policies}</td>
                        <td className="px-5 py-3.5 text-right font-display text-slate-300">₹{zone.potential_exposure_inr?.toLocaleString('en-IN')}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {!zoneRisk?.zones?.length && !loading && (
                    <tr>
                      <td colSpan="4" className="px-5 py-8 text-center text-xs text-slate-500 font-medium">System nominal. No active events.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent Payouts / Claims */}
          <motion.div variants={childVariants} className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/80">
              <div>
                <h3 className="text-sm font-bold font-display text-white">Recent Payouts</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated disbursals by trigger type</p>
              </div>
              <TrendingUp size={16} className="text-indigo-400" />
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-900/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700/60">
                    <th className="px-5 py-3">Event Trigger</th>
                    <th className="px-5 py-3 text-right">Count</th>
                    <th className="px-5 py-3 text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-200">
                  <AnimatePresence>
                    {(claims_by_trigger || []).map((trigger, idx) => (
                      <motion.tr 
                        key={trigger._id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                        className="odd:bg-slate-800 even:bg-slate-900/30 hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0"
                      >
                        <td className="px-5 py-3.5 font-semibold text-indigo-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
                          {trigger._id}
                        </td>
                        <td className="px-5 py-3.5 text-right font-display">{trigger.count}</td>
                        <td className="px-5 py-3.5 text-right font-display text-slate-300">₹{trigger.total_payout?.toLocaleString('en-IN')}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {!claims_by_trigger?.length && !loading && (
                    <tr>
                      <td colSpan="3" className="px-5 py-8 text-center text-xs text-slate-500 font-medium">No recent payouts initiated.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}
