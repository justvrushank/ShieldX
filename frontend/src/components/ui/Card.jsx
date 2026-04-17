import { motion } from 'framer-motion'

export default function Card({
  children,
  padding = 'p-4',
  bordered = false,
  interactive = false,
  onClick,
  className = '',
  style = {},
}) {
  const baseStyle = {
    background: 'var(--bg-card)',
    borderRadius: 16,
    boxShadow: 'var(--shadow-card)',
    ...(bordered ? { border: '1px solid var(--border)' } : {}),
    ...style,
  }

  if (interactive) {
    return (
      <motion.div
        className={`${padding} ${className}`}
        style={{ ...baseStyle, cursor: 'pointer' }}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(34,197,94,0.12), inset 0 0 0 1px rgba(34,197,94,0.2)' }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`${padding} ${className}`}
      style={baseStyle}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(34,197,94,0.08)' }}
    >
      {children}
    </motion.div>
  )
}
