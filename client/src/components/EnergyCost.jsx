import { useMemo } from "react";
import { FiZap, FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

const calcEnergyCost = (weather) => {
  if (!weather) return null;
  const { temp, humidity } = weather;
  let acHours = 0, heaterHours = 0, fanHours = 0;

  if (temp > 25) acHours = Math.min(Math.round((temp - 25) * 0.8), 12);
  if (temp < 15) heaterHours = Math.min(Math.round((15 - temp) * 0.6), 12);
  if (temp >= 20 && temp <= 30) fanHours = 4;
  if (humidity > 70 && temp >= 25) acHours = Math.min(acHours + 2, 14);

  const acCost = acHours * 12;
  const heaterCost = heaterHours * 8;
  const fanCost = fanHours * 2;
  const totalCost = Math.round(acCost + heaterCost + fanCost);
  const monthlyProjection = Math.round(totalCost * 30);

  let tip = "";
  let tipType = "good";
  if (acHours > 8) { tip = "Raise AC to 26°C — saves ~₹40/day."; tipType = "warning"; }
  else if (heaterHours > 8) { tip = "Use layered clothing to reduce heater use."; tipType = "warning"; }
  else if (acHours > 4) { tip = "Use fan with AC to reduce load."; tipType = "caution"; }
  else { tip = "Moderate energy usage expected today."; tipType = "good"; }

  const maxUsage = Math.max(acHours, heaterHours, fanHours, 1);

  return { totalCost, acHours, heaterHours, fanHours, acCost, heaterCost, fanCost, monthlyProjection, tip, tipType, maxUsage };
};

const EnergyCost = ({ weather }) => {
  const energy = useMemo(() => calcEnergyCost(weather), [weather]);

  if (!weather || !energy) return null;

  const tipColorMap = { good: "bg-green-400/10 text-green-300", warning: "bg-orange-400/10 text-orange-300", caution: "bg-yellow-400/10 text-yellow-300" };

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiZap className="text-white" /> Energy Cost
        </h3>
        <span className="text-white/30 text-[11px]">Estimate</span>
      </div>

      {/* total cost + monthly */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray={`${Math.min((energy.totalCost / 200) * 100, 100)}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiZap className="text-yellow-400 text-xs mb-0.5" />
            <span className="text-white text-lg font-bold leading-none">₹{energy.totalCost}</span>
          </div>
        </div>
        <div>
          <p className="text-white text-lg font-medium">~₹{energy.totalCost}/day</p>
          <p className="text-white/40 text-[11px]">≈ ₹{energy.monthlyProjection.toLocaleString()}/month</p>
        </div>
      </div>

      {/* usage bars */}
      <div className="space-y-2.5 mb-4">
        {[
          { label: "AC", hours: energy.acHours, cost: energy.acCost, color: "#60a5fa", rate: "₹12/h" },
          { label: "Heater", hours: energy.heaterHours, cost: energy.heaterCost, color: "#f97316", rate: "₹8/h" },
          { label: "Fan", hours: energy.fanHours, cost: energy.fanCost, color: "#22d3ee", rate: "₹2/h" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-white/50 text-[11px] w-12 shrink-0">{item.label}</span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(item.hours / Math.max(energy.maxUsage, 1)) * 100}%`, backgroundColor: item.color }}
              />
            </div>
            <span className="text-white/40 text-[11px] w-8 text-right shrink-0">{item.hours}h</span>
            <span className="text-white/30 text-[10px] w-10 text-right shrink-0">{item.cost > 0 ? `₹${item.cost}` : "—"}</span>
          </div>
        ))}
      </div>

      {/* rate legend */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
          <span className="text-white/25 text-[10px]">AC ₹12/h</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
          <span className="text-white/25 text-[10px]">Heater ₹8/h</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
          <span className="text-white/25 text-[10px]">Fan ₹2/h</span>
        </div>
      </div>

      {/* tip */}
      <div className={`px-3 py-2 rounded-lg ${tipColorMap[energy.tipType]}`}>
        <p className="text-[11px] text-center">{energy.tip}</p>
      </div>
    </div>
  );
};

export default EnergyCost;
