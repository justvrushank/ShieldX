import { create } from 'zustand'

const SEED_EVENTS = [
  { id: 1, icon: '\uD83D\uDFE2', text: 'Coverage active for 1,240 workers', ts: Date.now() - 12000 },
  { id: 2, icon: '\uD83D\uDCB0', text: '\u20B9120 payout processed \u2014 Ravi K.', ts: Date.now() - 28000 },
  { id: 3, icon: '\u26A1', text: 'Heavy rain detected \u2014 Hyderabad zone', ts: Date.now() - 55000 },
]

export const useDemoStore = create((set) => ({
  // Live activity feed
  activityFeed: SEED_EVENTS,
  addActivity: (entry) =>
    set((s) => ({
      activityFeed: [
        { ...entry, id: Date.now() + Math.random(), ts: Date.now() },
        ...s.activityFeed,
      ].slice(0, 10),
    })),

  // Payout processing modal
  showPayoutModal: false,
  payoutModalEvent: null,
  openPayoutModal: (event) => set({ showPayoutModal: true, payoutModalEvent: event }),
  closePayoutModal: () => set({ showPayoutModal: false, payoutModalEvent: null }),

  // Last simulated payout (broadcast to worker dashboard)
  lastSimPayout: null,
  setLastSimPayout: (payout) => set({ lastSimPayout: payout }),
}))
