import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import TopBar from '../../components/ui/TopBar'
import { getAdminAnalytics, getFraudAnalytics } from '../../services/api'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
}

const tooltipStyle = {
  contentStyle: {
    background: '#1e293b', // bg-slate-800
    border: '1px solid #334155', // border-slate-700
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#f8fafc', // text-slate-50
  },
}

const axisStyle = {
  tick: { fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }, // text-slate-500
  stroke: '#334155', // border-slate-700
}

function ChartCard({ title, children }) {
  return (
    <div className="mx-4 bg-slate-800 border border-slate-700 rounded-xl shadow-sm p-5 hover:-translate-y-1 transition-all duration-300">
      <p className="text-sm font-bold font-display text-white mb-4 tracking-wide">{title}</p>
      {children}
    </div>
  )
}

export default function Analytics() {
  const [premiumPayoutData, setPremiumPayoutData] = useState([])
  const [lossRatioData, setLossRatioData] = useState([])
  const [fraudData, setFraudData] = useState(null)
  
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const p1 = getAdminAnalytics(period).catch(() => null)
      const p2 = getFraudAnalytics().catch(() => null)
      
      const [json, fraudJson] = await Promise.all([p1, p2])
      
      if (fraudJson) {
        setFraudData(fraudJson)
      }

      if (json && (json.daily_revenue?.length > 0 || json.daily_payouts?.length > 0)) {
        const revByWeek = [0, 0, 0, 0]
        const payByWeek = [0, 0, 0, 0]
        json.daily_revenue?.forEach((d, i) => { revByWeek[Math.min(3, Math.floor(i / 7))] += d.amount })
        json.daily_payouts?.forEach((d, i) => { payByWeek[Math.min(3, Math.floor(i / 7))] += d.amount })
        setPremiumPayoutData([
          { week: 'W1', premium: revByWeek[0], payout: payByWeek[0] },
          { week: 'W2', premium: revByWeek[1], payout: payByWeek[1] },
          { week: 'W3', premium: revByWeek[2], payout: payByWeek[2] },
          { week: 'W4', premium: revByWeek[3], payout: payByWeek[3] },
        ])
        
        const lossData = [0, 1, 2, 3].map(i => {
          const rev = revByWeek[i]
          const pay = payByWeek[i]
          return {
            week: `W${i + 1}`,
            ratio: rev > 0 ? Math.round((pay / rev) * 100) : 0,
            target: 65,
          }
        })
        setLossRatioData(lossData)
      } else {
        setPremiumPayoutData([
          { week: 'W1', premium: 54000, payout: 19000 },
          { week: 'W2', premium: 51000, payout: 22000 },
          { week: 'W3', premium: 58000, payout: 15000 },
          { week: 'W4', premium: 54000, payout: 33000 },
        ])
        setLossRatioData([
          { week: 'W1', ratio: 35, target: 65 },
          { week: 'W2', ratio: 43, target: 65 },
          { week: 'W3', ratio: 26, target: 65 },
          { week: 'W4', ratio: 61, target: 65 },
        ])
      }
    } catch (e) {
      console.error('[Analytics] load fail', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div className="min-h-screen bg-slate-900 pb-24 text-slate-200" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* TopBar equivalent if required, although omitted for spacing if embedded inside AdminLayout */}
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-6">
          
          {fraudData && (
            <>
              {/* Summary Row */}
              <div className="px-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm p-5 hover:-translate-y-1 transition-all duration-300">
                  <p className="text-sm font-bold font-display text-white mb-4 tracking-wide">Pipeline Integrity</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Analyzed</p>
                      <p className="font-display font-bold text-2xl text-white">{fraudData.summary.total_claims_analyzed}</p>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-center">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Flagged</p>
                      <p className="font-display font-bold text-2xl text-rose-400">{fraudData.summary.flagged_for_review}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                      <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Auto-Approved</p>
                      <p className="font-display font-bold text-2xl text-green-400">{fraudData.summary.auto_approved}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Detection Rate</p>
                      <p className="font-display font-bold text-2xl text-white">{fraudData.summary.fraud_detection_rate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signals Breakdown */}
              <ChartCard title="Telemetry Red Flags">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 flex items-start justify-between">
                    <div>
                      <p className="text-xl">🛰️</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 leading-tight tracking-wider">GPS Spoofing<br/>Attempts</p>
                    </div>
                    <span className="font-display font-bold text-xl text-white">{fraudData.signal_breakdown.gps_spoofing_attempts}</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 flex items-start justify-between">
                    <div>
                      <p className="text-xl">🌧️</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 leading-tight tracking-wider">Weather<br/>Mismatches</p>
                    </div>
                    <span className="font-display font-bold text-xl text-white">{fraudData.signal_breakdown.weather_validation_failures}</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 flex items-start justify-between">
                    <div>
                      <p className="text-xl">👤</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 leading-tight tracking-wider">New Account<br/>Flags</p>
                    </div>
                    <span className="font-display font-bold text-xl text-white">{fraudData.signal_breakdown.new_account_flags}</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 flex items-start justify-between">
                    <div>
                      <p className="text-xl">🔄</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 leading-tight tracking-wider">High Freq.<br/>Claimers</p>
                    </div>
                    <span className="font-display font-bold text-xl text-white">{fraudData.signal_breakdown.high_frequency_claimers}</span>
                  </div>
                </div>
              </ChartCard>

              {/* Top Flagged claims */}
              <div className="mx-4 bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/80">
                  <span className="text-sm font-bold font-display text-white">Top Flagged Submissions</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-900/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700/60">
                        <th className="px-5 py-4">Claim ID</th>
                        <th className="px-5 py-4">Location</th>
                        <th className="px-5 py-4">Trigger</th>
                        <th className="px-5 py-4 text-right">Fraud Score</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-200">
                      {(fraudData.top_flagged_claims || []).map((claim) => (
                        <tr key={claim.claim_id} className="odd:bg-slate-800 even:bg-slate-900/30 hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0">
                          <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{claim.claim_id.slice(0, 8)}</td>
                          <td className="px-5 py-3.5 font-semibold text-white">{claim.city}</td>
                          <td className="px-5 py-3.5"><span className="bg-slate-900/50 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">{claim.trigger_type}</span></td>
                          <td className="px-5 py-3.5 text-right">
                            <span className={`px-2 py-1 rounded shadow-sm text-[11px] tracking-wider font-bold border ${claim.fraud_score > 0.85 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
                              {Math.round(claim.fraud_score * 100)} / 100
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!fraudData.top_flagged_claims?.length && (
                        <tr>
                          <td colSpan="4" className="px-5 py-8 text-center text-xs text-slate-500">No high-risk claims flagged recently.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Chart 1: Premium vs Payouts */}
          <ChartCard title="Premium vs Payouts">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={premiumPayoutData} barGap={4}>
                <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="week" {...axisStyle} axisLine={false} tickLine={false} />
                <YAxis {...axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                <Bar dataKey="premium" fill="#6366f1" radius={[4, 4, 0, 0]} name="Premium" />
                <Bar dataKey="payout"  fill="#22d3ee" radius={[4, 4, 0, 0]} name="Payouts" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 2: Loss ratio trend */}
          <ChartCard title="Loss Ratio Trend">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lossRatioData}>
                <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="week" {...axisStyle} axisLine={false} tickLine={false} />
                <YAxis {...axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, '']} />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ fill: '#22d3ee', r: 5, strokeWidth: 2, stroke: '#1e293b' }}
                  name="Loss Ratio"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>
      )}
    </motion.div>
  )
}
