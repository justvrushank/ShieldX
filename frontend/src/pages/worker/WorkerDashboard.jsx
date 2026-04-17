import { useEffect, useState } from "react";

const mockUser = {
  name: "Ravi Kumar",
  city: "Chennai",
};

const initialPayouts = [
  {
    id: 1,
    type: "Flood",
    amount: 120,
    time: "just now",
  },
  {
    id: 2,
    type: "Outage",
    amount: 95,
    time: "2 min ago",
  },
];

export default function WorkerDashboard() {
  const [payouts, setPayouts] = useState(initialPayouts);
  const [balance, setBalance] = useState(215);

  // Simulate new payouts every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newPayout = {
        id: Date.now(),
        type: Math.random() > 0.5 ? "Flood" : "Outage",
        amount: Math.floor(Math.random() * 100) + 50,
        time: "just now",
      };

      setPayouts((prev) => [newPayout, ...prev.slice(0, 4)]);
      setBalance((prev) => prev + newPayout.amount);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Welcome, {mockUser.name}
        </h1>
        <p className="text-slate-400">
          Monitoring activity in {mockUser.city}
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-slate-900 rounded-2xl p-6 mb-6 border border-slate-800 shadow-lg">
        <p className="text-slate-400 text-sm">Total Payouts Received</p>
        <h2 className="text-3xl font-bold mt-2">₹{balance}</h2>
        <p className="text-green-400 text-sm mt-1">
          System active • payouts enabled
        </p>
      </div>

      {/* Live Feed */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <p className="text-sm text-green-400">LIVE SYSTEM FEED</p>
        </div>

        <div className="space-y-3">
          {payouts.map((payout) => (
            <div
              key={payout.id}
              className="flex justify-between items-center bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition"
            >
              <div>
                <p className="text-sm">
                  ⚡ {payout.type} detected — {mockUser.city}
                </p>
                <p className="text-xs text-slate-400">{payout.time}</p>
              </div>
              <p className="text-green-400 font-semibold">
                +₹{payout.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-slate-400">
        System is monitoring events 24/7 — payouts are automatic
      </div>
    </div>
  );
}
