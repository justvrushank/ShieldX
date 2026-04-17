export const faqs = [
  {
    id: 1, category: 'coverage',
    question: 'What events does ShieldX cover?',
    answer: 'ShieldX watches for three things: floods and heavy rain alerts from IMD (India\'s weather authority), app outages on Zepto, Swiggy, Blinkit, and Amazon, and government curfews in your area. When any of these happen in your zone, we pay you automatically — no forms, no calls needed.',
    followUps: [2, 4],
  },
  {
    id: 2, category: 'coverage',
    question: 'Why is air pollution (AQI) not covered?',
    answer: 'During high pollution days, deliveries usually keep running — sometimes even increase. Since your income isn\'t actually stopped by pollution, it doesn\'t qualify for a payout. ShieldX only pays when something physically stops you from earning in your zone.',
    followUps: [1, 3],
  },
  {
    id: 3, category: 'coverage',
    question: 'What is NOT covered by ShieldX?',
    answer: 'ShieldX doesn\'t cover personal situations like taking a day off, falling sick, bike breakdowns, or accidents. We only pay when an outside event — like a flood, platform outage, or curfew — stops deliveries in your zone. If platforms are still running, there\'s no payout.',
    followUps: [1, 4],
  },
  {
    id: 4, category: 'payout',
    question: 'How quickly do I get paid?',
    answer: 'Usually within 2 hours of the event being confirmed. Once we verify the event and check that you were recently active, the money goes straight to your UPI — no claim filing needed. You\'ll get a notification the moment the payment is sent.',
    followUps: [5, 6],
  },
  {
    id: 5, category: 'payout',
    question: 'How much will I receive per payout?',
    answer: 'Up to ₹600/week. Floods and government curfews pay the full ₹600. Platform outages pay ₹450 — since other apps might still be working. Your final payout depends on how recently you completed a delivery before the event.',
    followUps: [4, 6],
  },
  {
    id: 6, category: 'payout',
    question: 'How does ShieldX know I was working?',
    answer: 'We check when you last completed a delivery. If it was within 2 hours of the event — full payout. Between 2 and 6 hours — partial payout. More than 6 hours — your case goes to a quick manual check. No input from you is needed.',
    followUps: [4, 5],
  },
  {
    id: 7, category: 'premium',
    question: 'How is my weekly premium set?',
    answer: 'It starts at ₹49, then adjusts based on how flood-prone your zone is and how consistently you deliver. Active workers with a clean track record get automatic discounts. You\'ll see your exact price before confirming your plan.',
    followUps: [8, 9],
  },
  {
    id: 8, category: 'premium',
    question: 'How can I lower my premium?',
    answer: 'Deliver consistently, stay active during your regular hours, and keep a clean payout history. Once your reliability score crosses 0.75, you automatically get a 15% discount — about ₹7 off per week. Your score is updated every week.',
    followUps: [7, 9],
  },
  {
    id: 9, category: 'premium',
    question: 'When does my coverage renew?',
    answer: 'Your coverage runs Monday to Sunday. Every Sunday, the week\'s premium is collected via UPI auto-debit. You\'ll get a reminder 24 hours before. If the payment doesn\'t go through, coverage pauses until the next successful payment.',
    followUps: [7, 8],
  },
  {
    id: 10, category: 'claims',
    question: 'What happens if my payout is under review?',
    answer: 'Sometimes we need a quick confirmation from you — you\'ll see a prompt in the app asking you to confirm your zone. This is just a check to keep things fair. Honest cases are resolved within 4 hours. We never assume the worst.',
    followUps: [6, 11],
  },
  {
    id: 11, category: 'general',
    question: 'How do I cancel my coverage?',
    answer: 'Go to Profile → Manage Coverage → Cancel. Your cancellation kicks in at the end of the current week. No cancellation fee. We stop monitoring your zone as soon as you confirm.',
    followUps: [9, 12],
  },
  {
    id: 12, category: 'general',
    question: 'Which delivery apps does ShieldX track?',
    answer: 'Zepto, Swiggy, Blinkit, and Amazon Delivery. We cross-check outages using multiple sources before paying anyone — so you\'re protected against false alerts, and real outages are always caught.',
    followUps: [1, 4],
  },
]

export const categories = [
  { id: 'all',      label: 'All' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'payout',   label: 'Payouts' },
  { id: 'premium',  label: 'Premium' },
  { id: 'claims',   label: 'My Claims' },
  { id: 'general',  label: 'General' },
]
