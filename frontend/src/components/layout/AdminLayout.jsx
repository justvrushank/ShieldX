import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileCheck, BarChart2, FileText,
  Menu, X, RefreshCw, Bell, LogOut, Headphones, Activity, Users,
} from 'lucide-react'

const ADMIN_NAV = [
  { label: 'Overview',       icon: LayoutDashboard, path: '/admin' },
  { label: 'Risk Overview',  icon: Activity,        path: '/admin/actuarial' },
  { label: 'Claims',         icon: FileCheck,       path: '/admin/claims' },
  { label: 'Analytics',      icon: BarChart2,       path: '/admin/analytics' },
  { label: 'Workers',        icon: Users,           path: '/admin/workers' },
  { label: 'Insurer View',   icon: FileText,        path: '/admin/insurer' },
  { label: 'Reports',        icon: FileText,        path: '/admin/reports' },
  { label: 'Support Inbox',  icon: Headphones,      path: '/admin/support', badge: 'live' },
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

/* ── Shared focus ring utility class (Tailwind) ── */
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900'



/* ── Route matching helper ── */
function isRouteActive(itemPath, currentPath) {
  if (itemPath === '/admin') return currentPath === '/admin'
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/')
}

/* ── Sidebar (shared between desktop & mobile drawer) ── */
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
            aria-label="Close navigation drawer"
            title="Close navigation drawer"
            className={`ml-auto bg-transparent border-none cursor-pointer p-1 rounded-lg text-slate-400 hover:text-white transition-colors ${FOCUS_RING}`}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ADMIN_NAV.map(item => {
          const active = isRouteActive(item.path, location.pathname)
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (location.pathname !== item.path) {
                  navigate(item.path)
                }
                onClose?.()
              }}
              aria-label={`Navigate to ${item.label}`}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-none cursor-pointer w-full text-left transition-all duration-300 ${FOCUS_RING} ${active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              style={{
                fontFamily: 'Inter', fontWeight: active ? 600 : 500, fontSize: 13
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[9px] font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider" aria-label={`${item.label} status: ${item.badge}`}>
                  {item.badge}
                </span>
              )}
              {active && !item.badge && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" aria-hidden="true" />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Switch to Worker App"
          className={`bg-transparent border-none cursor-pointer flex items-center gap-2 px-3 py-2 w-full text-slate-500 hover:text-slate-200 transition-colors rounded-lg ${FOCUS_RING}`}
        >
          <span style={{ fontSize: 12, fontFamily: 'Inter' }}>← Worker App</span>
        </button>
        <p className="text-[10px] text-slate-500 font-inter text-center mt-2">
          ShieldX v1.0 · Admin Console
        </p>
      </div>
    </div>
  )
}

/* ── Main layout ── */
export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const drawerRef = useRef(null)



  // ─── Escape key closes drawer ───
  useEffect(() => {
    if (!drawerOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  // ─── Lock body scroll when drawer open ───
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // ─── Focus trap inside drawer ───
  useEffect(() => {
    if (!drawerOpen || !drawerRef.current) return

    const drawer = drawerRef.current
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    const trapFocus = (e) => {
      if (e.key !== 'Tab') return
      const focusables = drawer.querySelectorAll(focusableSelector)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    // Auto-focus first focusable element when drawer opens
    requestAnimationFrame(() => {
      const firstFocusable = drawer.querySelector(focusableSelector)
      firstFocusable?.focus()
    })

    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [drawerOpen])

  // ─── Robust nested title lookup ───
  let pageTitle = 'Admin'
  const segments = location.pathname.split('/').filter(Boolean)
  while (segments.length > 0) {
    const checkPath = '/' + segments.join('/')
    if (PAGE_TITLES[checkPath]) {
      pageTitle = PAGE_TITLES[checkPath]
      break
    }
    segments.pop()
  }

  const breadcrumb = `Admin / ${pageTitle}`

  const handleRefresh = useCallback(() => {
    window.dispatchEvent(new CustomEvent('admin-refresh'))
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('gp-admin-token')
    localStorage.removeItem('gp-admin-access-token')
    localStorage.removeItem('gp-admin-auth')
    localStorage.removeItem('gp-admin-user')
    navigate('/admin', { replace: true })
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200 font-body">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 bottom-0 flex-col z-20"
        aria-label="Admin sidebar"
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
              aria-hidden="true"
            />
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation drawer"
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
        <header
          role="banner"
          className="sticky top-0 z-30 h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center px-5 gap-3"
        >
          <button
            className={`lg:hidden bg-transparent border-none cursor-pointer p-1 rounded-lg text-slate-400 hover:text-white transition-colors ${FOCUS_RING}`}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            title="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <p className="text-[13px] font-medium text-slate-400 flex-1 tracking-wide" aria-live="polite">
            {breadcrumb}
          </p>

          <div className="flex items-center gap-3" role="toolbar" aria-label="Admin actions">
            <button
              onClick={handleRefresh}
              title="Refresh dashboard data"
              aria-label="Refresh dashboard data"
              className={`w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 active:scale-95 transition-all text-slate-400 hover:text-indigo-400 ${FOCUS_RING}`}
            >
              <RefreshCw size={14} />
            </button>
            <button
              title="View notifications"
              aria-label="View notifications"
              className={`w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 active:scale-95 transition-all text-slate-400 hover:text-indigo-400 relative ${FOCUS_RING}`}
            >
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]" aria-hidden="true"></span>
            </button>
            <button
              onClick={handleLogout}
              title="Sign out of admin panel"
              aria-label="Sign out of admin panel"
              className={`w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 active:scale-95 transition-all text-slate-400 hover:text-rose-400 ${FOCUS_RING}`}
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
