import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatINRShort } from '../../utils/formatters'

const LOSS_COLORS = {
  good: '#12B76A',
  medium: '#F79009',
  high: '#F04438',
}

const DEFAULT_FORM = {
  city: 'Hyderabad',
  trigger_type: 'FLOOD',
  num_workers: 100,
  days: 7,
  payout_amount: 600,
  weekly_premium: 58,
}

const gaugeMeta = (lossRatio = 0) => {
  if (lossRatio < 0.65) return { label: 'Healthy', color: LOSS_COLORS.good }
  if (lossRatio <= 0.85) return { label: 'Watchlist', color: LOSS_COLORS.medium }
  return { label: 'Stress', color: LOSS_COLORS.high }
}

const mockSummary = {
  total_premiums: 4500000,
  total_payouts: 1200000,
  loss_ratio: 0.42,
  active_exposure: 28000000,
  trend: [
    { date: 'Mon', premiums: 300, payouts: 100 },
    { date: 'Tue', premiums: 350, payouts: 150 },
    { date: 'Wed', premiums: 400, payouts: 50 },
    { date: 'Thu', premiums: 450, payouts: 200 },
    { date: 'Fri', premiums: 200, payouts: 0 },
    { date: 'Sat', premiums: 550, payouts: 300 },
    { date: 'Sun', premiums: 600, payouts: 150 }
  ]
}

const mockReserve = {
  reserve_required: 15000000,
  current_buffer: 18000000,
  reserve_gap: -3000000
}

const mockExposure = [
    { city: 'Hyderabad', total_exposure: 8000000, workers: 450 },
    { city: 'Mumbai', total_exposure: 12000000, workers: 600 },
    { city: 'Chennai', total_exposure: 4000000, workers: 250 },
    { city: 'Bengaluru', total_exposure: 6000000, workers: 300 }
]

export default function ActuarialDashboard() {
  const [summary, setSummary] = useState(null)
  const [reserve, setReserve] = useState(null)
  const [exposure, setExposure] = useState([])
  const [scenario, setScenario] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)

  const load = async () => {
    setLoading(true)
    setTimeout(() => {
      setSummary(mockSummary)
      setReserve(mockReserve)
      setExposure(mockExposure)
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    handleSimulate()
  }, [])

  const handleSimulate = async () => {
    setSimulating(true)
    setTimeout(() => {
      // Mock scenario calculation
      const mult = form.num_workers * form.days;
      setScenario({
        premium_collected: mult * form.weekly_premium / 7,
        payout_expected: mult * form.payout_amount * 0.1, // mock 10% chance
        loss_ratio: 0.6 + (Math.random() * 0.3),
        risk_level: 'MEDIUM'
      })
      setSimulating(false)
    }, 800)
  }

  const ratio = summary?.loss_ratio || 0
  const gauge = gaugeMeta(ratio)
  const gaugePercent = Math.min(Math.round(ratio * 100), 100)
  const trend = summary?.trend || []

  const cityExposureChart = useMemo(
    () => exposure.map((city) => ({
      city: city.city,
      exposure: Math.round(city.total_exposure || 0),
      workers: city.workers || 0,
    })),
    [exposure]
  )

  const kpis = [
    { label: 'Total Premium Collected', value: formatINRShort(summary?.total_premiums || 0), sub: 'Lifetime written premium', color: '#D97757' },
    { label: 'Total Payouts', value: formatINRShort(summary?.total_payouts || 0), sub: 'Paid claims only', color: '#2E90FA' },
    { label: 'Loss Ratio', value: `${Math.round((summary?.loss_ratio || 0) * 100)}%`, sub: gauge.label, color: gauge.color },
    { label: 'Active Exposure', value: formatINRShort(summary?.active_exposure || 0), sub: 'Live event-linked exposure', color: '#7A5AF8' },
  ]

  return (
    <motion.div className="min-h-screen text-slate-100 pb-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="pt-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Risk & Exposure Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800 transition-colors">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-3xl font-bold mt-2 leading-tight" style={{ color: kpi.color }}>
                {loading ? '...' : kpi.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6 mt-2">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-6">
              <p className="text-lg font-semibold text-white">Loss Ratio Gauge</p>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: gauge.color, background: `${gauge.color}20` }}>{gauge.label}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div style={{ position: 'relative', width: 148, height: 148 }}>
                <svg width="148" height="148" viewBox="0 0 148 148">
                  <circle cx="74" cy="74" r="60" fill="none" stroke="#1E293B" strokeWidth="12" />
                  <circle
                    cx="74"
                    cy="74"
                    r="60"
                    fill="none"
                    stroke={gauge.color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * gaugePercent / 100)}
                    transform="rotate(-90 74 74)"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="text-3xl font-bold text-white">{gaugePercent}%</span>
                  <span className="text-[11px] text-slate-400">Loss Ratio</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 w-full">
                <div className="rounded-xl p-3 border border-emerald-500/20 bg-emerald-500/10">
                  <p className="text-xs font-semibold text-emerald-400">Green zone (Below 65%)</p>
                  <p className="text-[11px] text-emerald-400/80 mt-1">Sustainable weekly book. Optimal operating range.</p>
                </div>
                <div className="rounded-xl p-3 border border-amber-500/20 bg-amber-500/10">
                  <p className="text-xs font-semibold text-amber-400">Yellow zone (65%–85%)</p>
                  <p className="text-[11px] text-amber-400/80 mt-1">Watch reserves and potential trigger clustering closely.</p>
                </div>
                <div className="rounded-xl p-3 border border-rose-500/20 bg-rose-500/10">
                  <p className="text-xs font-semibold text-rose-400">Red zone (Above 85%)</p>
                  <p className="text-[11px] text-rose-400/80 mt-1">Critical. Reprice, cap exposure, or inject reserve immediately.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-lg font-semibold text-white">Scenario Simulator</p>
              <button onClick={handleSimulate} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20">
                {simulating ? 'Running...' : 'Run Scenario'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <select value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} className="h-11 rounded-xl bg-slate-800 border border-slate-700 px-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                {['Hyderabad', 'Mumbai', 'Chennai', 'Bengaluru', 'Delhi'].map((city) => <option key={city}>{city}</option>)}
              </select>
              <select value={form.trigger_type} onChange={(e) => setForm((prev) => ({ ...prev, trigger_type: e.target.value }))} className="h-11 rounded-xl bg-slate-800 border border-slate-700 px-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                {['FLOOD', 'OUTAGE', 'CURFEW', 'AIR_QUALITY', 'FESTIVAL_DISRUPTION'].map((trigger) => <option key={trigger}>{trigger}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-4 mb-6 bg-slate-800 border border-slate-700 p-4 rounded-xl">
              <div>
                <label className="text-xs font-semibold text-slate-400 flex justify-between mb-2">
                  <span>Number of Workers</span>
                  <span className="text-indigo-400">{form.num_workers}</span>
                </label>
                <input type="range" min="10" max="500" step="10" value={form.num_workers} onChange={(e) => setForm((prev) => ({ ...prev, num_workers: Number(e.target.value) }))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <div className="mt-2">
                <label className="text-xs font-semibold text-slate-400 flex justify-between mb-2">
                  <span>Days of Cover</span>
                  <span className="text-indigo-400">{form.days}</span>
                </label>
                <input type="range" min="1" max="14" step="1" value={form.days} onChange={(e) => setForm((prev) => ({ ...prev, days: Number(e.target.value) }))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4">
                <p className="text-xs text-slate-400">Premium Collected</p>
                <p className="text-xl font-bold text-white mt-1">{formatINRShort(scenario?.premium_collected || 0)}</p>
              </div>
              <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4">
                <p className="text-xs text-slate-400">Payout Expected</p>
                <p className="text-xl font-bold text-white mt-1">{formatINRShort(scenario?.payout_expected || 0)}</p>
              </div>
              <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4">
                <p className="text-xs text-slate-400">Est. Loss Ratio</p>
                <p className="text-xl font-bold text-white mt-1">{Math.round((scenario?.loss_ratio || 0) * 100)}%</p>
              </div>
              <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4">
                <p className="text-xs text-slate-400">Risk Level</p>
                <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded text-xs font-semibold" style={{ background: `${gaugeMeta(scenario?.loss_ratio || 0).color}20`, color: gaugeMeta(scenario?.loss_ratio || 0).color }}>
                  {scenario?.risk_level || 'LOW'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-2">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
            <p className="text-lg font-semibold text-white mb-5">Premium vs Payout Trend</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="premiumFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97757" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D97757" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="payoutFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E90FA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2E90FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }} itemStyle={{ color: '#F8FAFC' }} />
                <Area type="monotone" dataKey="premiums" stroke="#D97757" fill="url(#premiumFill)" strokeWidth={2} />
                <Area type="monotone" dataKey="payouts" stroke="#2E90FA" fill="url(#payoutFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
            <p className="text-lg font-semibold text-white mb-5">City Exposure</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cityExposureChart} margin={{top: 20, right: 0, left: -20, bottom: 0}}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="city" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }} />
                <Bar dataKey="exposure" fill="#818CF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Required Reserve</p>
            <p className="text-3xl font-bold text-white mt-1">{formatINRShort(reserve?.reserve_required || 0)}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Current Buffer</p>
            <p className="text-3xl font-bold text-white mt-1">{formatINRShort(reserve?.current_buffer || 0)}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Reserve Gap</p>
            <p className="text-3xl font-bold mt-1" style={{ color: (reserve?.reserve_gap || 0) > 0 ? '#F04438' : '#10B981' }}>
              {formatINRShort(reserve?.reserve_gap || 0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
