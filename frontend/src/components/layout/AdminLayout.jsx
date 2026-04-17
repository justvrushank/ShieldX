import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileCheck, BarChart2, FileText,
  Menu, X, RefreshCw, Bell, LogOut, Headphones, Activity, Users,
} from 'lucide-react'

const ADMIN_NAV = [
  { label: 'Overview',       icon: LayoutDashboard, path: '/admin' },
  { label: 'Risk Overview',   icon: Activity,         path: '/admin/actuarial' },
  { label: 'Claims',         icon: FileCheck,        path: '/admin/claims' },
  { label: 'Analytics',      icon: BarChart2,        path: '/admin/analytics' },
  { label: 'Workers',        icon: Users,            path: '/admin/workers' },
  { label: 'Insurer View',   icon: FileText,         path: '/admin/insurer' },
  { label: 'Reports',        icon: FileText,         path: '/admin/reports' },
  { label: 'Support Inbox',  icon: Headphones,       path: '/admin/support', badge: 'live' },
]

const PAGE_TITLES = {
  '/admin': 'Overview',
  '/admin/actuarial': 'Risk Overview',
  '/admin/claims': 'Claims Queue',
  '/admin/analytics': 'Analytics',
  '/admin/reports': 'Reports',
  '/admin/insurer': 'Insurer View',
  '/admin/support': 'Support Inbox',
  '/admin/workers': 'Workers Management',
}

function safelyParseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

function checkAdminAuthSecurely() {
  const token = localStorage.getItem('gp-admin-token') || localStorage.getItem('gp-admin-access-token')
  const authRaw = localStorage.getItem('gp-admin-auth')
  const isDevAuth = import.meta.env.DEV && authRaw && (() => {
    try { return JSON.parse(authRaw)?.authenticated === true } catch { return false }
  })()

  if (!token && !isDevAuth) return false

  if (token) {
    const payload = safelyParseJwt(token)
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      localStorage.removeItem('gp-admin-token')
      localStorage.removeItem('gp-admin-access-token')
      localStorage.removeItem('gp-admin-auth')
      localStorage.removeItem('gp-admin-user')
      return false
    }
  }
  return true
}

function AdminSidebar({ onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="bg-slate-900 border-r border-slate-800" style={{
      width: 220,
      padding: '20px 10px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px', marginBottom: 28 }}>
        <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          ShieldX
        </span>
        <p style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Inter', margin: 0, marginLeft: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Admin
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto bg-transparent border-none cursor-pointer p-1"
          >
            <X size={18} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ADMIN_NAV.map(item => {
          const active = item.path === '/admin' 
            ? location.pathname === '/admin' 
            : location.pathname.startsWith(item.path)
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.97 }}
              onClick={() => { navigate(item.path); onClose?.() }}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-none cursor-pointer w-full text-left transition-all duration-300 ${active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
              style={{
                fontFamily: 'Inter', fontWeight: active ? 600 : 500, fontSize: 13
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[9px] font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
              {active && !item.badge && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-transparent border-none cursor-pointer flex items-center gap-2 px-3 py-2 w-full text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span style={{ fontSize: 12, fontFamily: 'Inter' }}>← Worker App</span>
        </button>
        <p className="text-[10px] text-slate-600 font-inter text-center mt-2">
          ShieldX v1.0 · Admin Console
        </p>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  if (!checkAdminAuthSecurely()) {
    return <Navigate to="/admin/login" replace />
  }

  const parentPath = '/' + location.pathname.split('/').slice(1, 3).join('/')
  const pageTitle = PAGE_TITLES[location.pathname] || PAGE_TITLES[parentPath] || 'Admin'
  const breadcrumb = `Admin / ${pageTitle}`

  const handleRefresh = () => {
    window.dispatchEvent(new CustomEvent('admin-refresh'))
    // Removed window.location.reload() to preserve SPA state
    // Views should listen to 'admin-refresh' to refetch their own data
  }

  const handleLogout = () => {
    localStorage.removeItem('gp-admin-token')
    localStorage.removeItem('gp-admin-access-token')
    localStorage.removeItem('gp-admin-auth')
    localStorage.removeItem('gp-admin-user')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200 font-body">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 bottom-0 flex-col z-20"
        style={{ width: 220 }}
      >
        <AdminSidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 shadow-2xl"
              style={{ width: 220 }}
            >
              <AdminSidebar onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-[220px] flex-1 min-h-screen flex flex-col">
        {/* Topbar */}
        <div className="sticky top-0 z-30 h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center px-5 gap-3">
          <button
            className="lg:hidden bg-transparent border-none cursor-pointer p-1"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={20} className="text-slate-400" />
          </button>

          <p className="text-[13px] font-medium text-slate-400 flex-1 tracking-wide">
            {breadcrumb}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              title="Refresh data"
              aria-label="Refresh data"
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 active:scale-95 transition-all text-slate-400 hover:text-indigo-400"
            >
              <RefreshCw size={14} />
            </button>
            <button
              aria-label="Notifications"
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 active:scale-95 transition-all text-slate-400 hover:text-indigo-400 relative"
            >
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]"></span>
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 active:scale-95 transition-all text-slate-400 hover:text-rose-400"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
