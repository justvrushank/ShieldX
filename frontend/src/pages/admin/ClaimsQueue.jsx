import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { getAdminClaims, approveClaim, rejectClaim } from '../../services/api'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
}

const TRIGGER_ICONS = {
  FLOOD: '🌊',
  OUTAGE: '🔌',
  CURFEW: '🚫',
  AQI: '💨',
  FESTIVAL: '🎊',
  UNKNOWN: '⚠️'
}

export default function ClaimsQueue() {
  const [claims, setClaims] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [triggerFilter, setTriggerFilter] = useState('ALL')
  const [tierFilter, setTierFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchClaims = async () => {
    setLoading(true)
    try {
      const res = await getAdminClaims({
        status: statusFilter,
        trigger_type: triggerFilter,
        tier: tierFilter,
        limit: 100
      })
      setClaims(res?.claims || [])
    } catch {
      setClaims([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [statusFilter, triggerFilter, tierFilter])

  const handleApprove = async (claimId) => {
    await approveClaim(claimId)
    fetchClaims()
  }

  const handleReject = async (claimId) => {
    const reason = prompt("Enter rejection reason:", "Manual review — does not meet criteria")
    if (reason !== null) {
      await rejectClaim(claimId, reason)
      fetchClaims()
    }
  }

  const exportToExcel = () => {
    const rows = claims.map((claim) => ({
      'Claim ID': claim.id || claim._id,
      Worker: claim.worker_name || claim.worker?.name || 'Unknown',
      City: claim.worker_city || claim.worker?.city || '',
      'Trigger Type': claim.trigger_type || '',
      'Amount (Rs)': claim.amount || 0,
      'Tier': claim.payout_tier || '',
      Status: claim.status || '',
      'Fraud Score': claim.fraud_score?.toFixed?.(3) || '0.000',
      'Fraud Risk': claim.fraud_risk_label || '',
      'Created At': claim.created_at || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Claims')
    XLSX.writeFile(wb, `Claims_${statusFilter}_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const filteredClaims = claims.filter(c => {
    const searchLow = searchQuery.toLowerCase()
    return (
      (c.worker_name || c.worker?.name || '').toLowerCase().includes(searchLow) ||
      (c._id || '').toLowerCase().includes(searchLow)
    )
  })

  // Badge mapping
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'AUTO_APPROVED':
      case 'APPROVED':
      case 'PAID':
        return 'bg-green-500/20 text-green-400 border-green-500/20'
      case 'MANUAL_REVIEW':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/20'
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/20'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/20'
    }
  }

  return (
    <motion.div className="w-full pb-8 text-slate-200" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">Claims Queue</h1>
          <p className="text-sm text-slate-400 mt-1">Review, monitor, and approve automated payouts</p>
        </div>
        <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-indigo-400 border border-slate-700 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider">
          <Download size={15} />
          Export Data
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-slate-700 bg-slate-800/80 shadow-sm flex-1">
          <Search size={16} className="text-slate-500 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search verified worker or claim ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm font-body text-white placeholder:text-slate-500 outline-none bg-transparent" 
          />
        </div>

        <div className="flex flex-wrap gap-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs font-body text-slate-200 outline-none cursor-pointer">
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="AUTO_APPROVED">Auto Approved</option>
              <option value="MANUAL_REVIEW">Manual Review</option>
              <option value="PAID">Paid</option>
              <option value="APPROVED">Processing Payout</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="w-px h-6 bg-slate-700 self-center hidden sm:block"></div>
          <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trigger</span>
            <select value={triggerFilter} onChange={(e) => setTriggerFilter(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs font-body text-slate-200 outline-none cursor-pointer">
              <option value="ALL">All Events</option>
              <option value="FLOOD">🌊 Flood</option>
              <option value="OUTAGE">🔌 Outage</option>
              <option value="CURFEW">🚫 Curfew</option>
              <option value="AQI">💨 AQI</option>
              <option value="FESTIVAL">🎊 Festival</option>
            </select>
          </div>
          <div className="w-px h-6 bg-slate-700 self-center hidden sm:block"></div>
          <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tier</span>
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs font-body text-slate-200 outline-none cursor-pointer">
              <option value="ALL">All Coverage</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700/60">
                <th className="px-5 py-4">Worker & ID</th>
                <th className="px-5 py-4">Trigger & Rule</th>
                <th className="px-5 py-4">ML Fraud Assessment</th>
                <th className="px-5 py-4 text-right">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-500">
                    <div className="flex animate-pulse justify-center">Authenticating state with active nodes...</div>
                  </td>
                </tr>
              ) : filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <AlertCircle size={32} className="text-slate-600" />
                      <p className="text-sm text-slate-400">No active claims align with these parameters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredClaims.map((claim, idx) => (
                    <motion.tr 
                      key={claim._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      className={`group hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 ${
                        claim.status === 'MANUAL_REVIEW' ? 'bg-rose-900/10 odd:bg-rose-900/10' : 'odd:bg-slate-800 even:bg-slate-900/30'
                      }`}
                    >
                      {/* Worker & claim Details */}
                      <td className="px-5 py-4">
                        <p className="text-[13px] font-bold text-slate-100 flex items-center gap-2">
                          {claim.worker_name || claim.worker?.name || 'Worker'}
                          <span className="text-[10px] font-normal text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded uppercase">{claim.worker_city || claim.worker?.city || 'Unknown'}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-mono">ID: {claim._id?.slice(0, 8)}</p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-medium bg-slate-900 border border-slate-700 px-2 py-0.5 rounded shadow-sm">
                            {TRIGGER_ICONS[claim.trigger_type] || '⚠️'} {claim.trigger_type}
                          </span>
                        </div>
                      </td>

                      {/* ML Assessment */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm border uppercase tracking-wider ${
                            claim.fraud_risk_color === 'red' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                            claim.fraud_risk_color === 'yellow' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                            'text-green-400 bg-green-500/10 border-green-500/20'
                          }`}>
                            Score: {claim.fraud_score?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-xs text-slate-400">{claim.fraud_risk_label || 'Verified'}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[15px] font-bold font-display text-white">₹{claim.amount}</span>
                          {claim.payout_tier && (
                            <span className="text-[10px] text-cyan-400 uppercase tracking-widest mt-0.5 font-bold">
                              {claim.payout_tier} Bracket
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border shadow-sm ${getBadgeStyle(claim.status)}`}>
                          {claim.status === 'AUTO_APPROVED' ? 'Auto Approved' : 
                           claim.status === 'PAID' ? 'Settled' : 
                           claim.status === 'APPROVED' ? 'Cleared' :
                           claim.status === 'MANUAL_REVIEW' ? 'Review Flagged' : 
                           claim.status === 'REJECTED' ? 'Blocked' :
                           claim.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {claim.status === 'MANUAL_REVIEW' ? (
                          <div className="flex justify-end gap-2 outline-none">
                            <button onClick={() => handleApprove(claim._id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 text-green-400 active:scale-95 transition-all outline-none" title="Approve">
                              <CheckCircle2 size={15} />
                            </button>
                            <button onClick={() => handleReject(claim._id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-400 active:scale-95 transition-all outline-none" title="Reject">
                              <XCircle size={15} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>

                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
