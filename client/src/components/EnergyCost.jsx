import { useState, useMemo } from "react";
import { FiZap, FiInfo } from "react-icons/fi";

const appliances = [
  { id: "ac", name: "AC (1.5T)", wattage: 1500, color: "#60a5fa", icon: "❄️" },
  { id: "heater", name: "Heater", wattage: 1500, color: "#f97316", icon: "🔥" },
  { id: "water-heater", name: "Geyser", wattage: 2000, color: "#ef4444", icon: "🚿" },
  { id: "fridge", name: "Refrigerator", wattage: 150, color: "#22d3ee", icon: "🧊" },
  { id: "washing", name: "Washing Machine", wattage: 500, color: "#a78bfa", icon: "👕" },
  { id: "fan", name: "Fan", wattage: 75, color: "#34d399", icon: "🌀" },
  { id: "light", name: "LED Lights (5)", wattage: 50, color: "#facc15", icon: "💡" },
  { id: "tv", name: "TV (43\")", wattage: 100, color: "#f472b6", icon: "📺" },
  { id: "iron", name: "Iron", wattage: 1000, color: "#fb923c", icon: "👔" },
  { id: "computer", name: "Computer", wattage: 200, color: "#818cf8", icon: "💻" },
  { id: "mixer", name: "Mixer/Grinder", wattage: 500, color: "#c084fc", icon: "🍹" },
  { id: "microwave", name: "Microwave", wattage: 1200, color: "#f43f5e", icon: "🍳" },
];

const tips = [
  { text: "Set AC to 26°C — every 1°C lower increases bill by 6%.", icon: "❄️" },
  { text: "Use LED bulbs — they use 75% less energy than incandescent.", icon: "💡" },
  { text: "Unplug chargers & appliances on standby — phantom load adds 5-10% to bills.", icon: "🔌" },
  { text: "Service AC filters monthly — dirty filters increase energy use by 15%.", icon: "🔧" },
  { text: "Use timer on geysers — run only 30 min before use, not all day.", icon: "⏰" },
  { text: "Run washing machine with full loads — half loads use same energy.", icon: "👕" },
  { text: "Keep fridge at 4°C (fridge) and -18°C (freezer) for optimal efficiency.", icon: "🧊" },
  { text: "Use natural light during day — reduces lighting cost to zero.", icon: "☀️" },
];

const EnergyCost = ({ weather }) => {
  const [hours, setHours] = useState(() => {
    const defaults = {};
    appliances.forEach((a) => { defaults[a.id] = a.id === "fridge" ? 24 : a.id === "fan" ? 8 : a.id === "light" ? 10 : a.id === "tv" ? 6 : 0; });
    return defaults;
  });
  const [unitCost, setUnitCost] = useState(6);

  const calculations = useMemo(() => {
    let totalWattHours = 0;
    const breakdown = appliances.map((a) => {
      const h = hours[a.id] || 0;
      const wh = h * a.wattage;
      const units = wh / 1000;
      const cost = Math.round(units * unitCost * 100) / 100;
      totalWattHours += wh;
      return { ...a, hours: h, units: Math.round(units * 100) / 100, cost: Math.round(cost) };
    });
    const totalUnits = totalWattHours / 1000;
    const totalDaily = Math.round(totalUnits * unitCost);
    const totalMonthly = totalDaily * 30;
    return { breakdown, totalUnits: Math.round(totalUnits * 10) / 10, totalDaily, totalMonthly };
  }, [hours, unitCost]);

  const maxCost = Math.max(...calculations.breakdown.map((b) => b.cost), 1);

  const getRingColor = (cost) => {
    if (cost <= 50) return "#34d399";
    if (cost <= 100) return "#fbbf24";
    if (cost <= 200) return "#f97316";
    if (cost <= 300) return "#f43f5e";
    return "#dc2626";
  };

  const getCostLabel = (cost) => {
    if (cost <= 50) return "Low";
    if (cost <= 100) return "Moderate";
    if (cost <= 200) return "High";
    return "Very High";
  };

  const ringColor = getRingColor(calculations.totalDaily);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiZap className="text-white" /> Energy Cost
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.05]">
          <span className="text-white/30 text-[10px]">₹/unit</span>
          <input
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-10 bg-transparent text-white text-[11px] font-medium text-right focus:outline-none"
          />
        </div>
      </div>

      {/* ring + totals */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={ringColor} strokeWidth="2.5" strokeDasharray={`${Math.min((calculations.totalDaily / 500) * 100, 100)}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiZap className="text-xs mb-0.5" style={{ color: ringColor }} />
            <span className="text-white text-lg font-bold leading-none">₹{calculations.totalDaily}</span>
            <span className="text-[8px] font-medium" style={{ color: ringColor }}>{getCostLabel(calculations.totalDaily)}</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">{calculations.totalUnits}</p>
            <p className="text-white/30 text-[10px]">Units/day</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">₹{calculations.totalMonthly.toLocaleString()}</p>
            <p className="text-white/30 text-[10px]">/month</p>
          </div>
        </div>
      </div>

      {/* appliances with sliders */}
      <div className="space-y-3 mb-4">
        {calculations.breakdown.filter((a) => a.hours > 0 || a.wattage >= 500).map((a) => (
          <div key={a.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{a.icon}</span>
                <span className="text-white/60 text-[11px]">{a.name}</span>
                <span className="text-white/20 text-[9px]">({a.wattage}W)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[11px]">{a.hours}h</span>
                <span className="text-[10px] font-medium" style={{ color: a.cost > 0 ? a.color : "rgba(255,255,255,0.2)" }}>
                  {a.cost > 0 ? `₹${a.cost}` : "—"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="24"
                value={hours[a.id] || 0}
                onChange={(e) => setHours((prev) => ({ ...prev, [a.id]: parseInt(e.target.value) }))}
                className="flex-1 h-1 rounded-full appearance-none bg-white/10 cursor-pointer"
                style={{ accentColor: a.color }}
              />
              {a.hours > 0 && (
                <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden shrink-0">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(a.units / Math.max(calculations.totalUnits, 1)) * 100}%`, backgroundColor: a.color }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* cost breakdown bar */}
      {calculations.totalDaily > 0 && (
        <div className="mb-4">
          <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1.5">Cost Breakdown</p>
          <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
            {calculations.breakdown.filter((a) => a.cost > 0).map((a) => (
              <div key={a.id} className="h-full transition-all" style={{ width: `${(a.cost / calculations.totalDaily) * 100}%`, backgroundColor: a.color }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
            {calculations.breakdown.filter((a) => a.cost > 0).map((a) => (
              <div key={a.id} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-white/25 text-[9px]">{a.name} ₹{a.cost}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* tips */}
      <div className="p-3 rounded-xl bg-green-400/[0.04] border border-green-400/10">
        <div className="flex items-center gap-1.5 mb-2">
          <FiInfo className="text-green-400/50 text-[11px]" />
          <span className="text-green-300/50 text-[10px] uppercase tracking-wider font-medium">Energy Saving Tips</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {tips.slice(0, 4).map((tip, i) => (
            <div key={i} className="flex items-start gap-1.5 p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[10px] shrink-0 mt-0.5">{tip.icon}</span>
              <span className="text-white/30 text-[9px] leading-relaxed">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyCost;
