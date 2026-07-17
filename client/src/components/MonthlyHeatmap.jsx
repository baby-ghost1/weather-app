import { useMemo } from "react";
import { FiCalendar } from "react-icons/fi";

const MonthlyHeatmap = ({ weather }) => {
  const months = useMemo(() => {
    if (!weather) return [];
    const currentMonth = new Date().getMonth() + 1;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames.map((name, i) => {
      const estTemp = weather.temp + Math.sin(((i + 1 - currentMonth) / 12) * Math.PI * 2) * 8;
      const estPrecip = 30 + Math.sin(((i + 1 + 2) / 12) * Math.PI * 2) * 40;
      let tempColor = "#4ade80";
      if (estTemp > 35) tempColor = "#ef4444";
      else if (estTemp > 30) tempColor = "#f97316";
      else if (estTemp > 20) tempColor = "#facc15";
      else if (estTemp > 10) tempColor = "#60a5fa";
      return {
        name,
        temp: Math.round(estTemp),
        precip: Math.max(0, Math.round(estPrecip)),
        tempColor,
        isCurrent: i + 1 === currentMonth,
      };
    });
  }, [weather]);

  if (!weather) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCalendar className="text-white" /> Monthly Heatmap
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#60a5fa]" />
            <span className="text-white/25 text-[10px]">Cool</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-white/25 text-[10px]">Hot</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => (
          <div key={i} className={`rounded-xl p-2.5 text-center transition-all ${m.isCurrent ? "ring-1 ring-white/20 bg-white/[0.06]" : "bg-white/[0.02]"}`}>
            <p className={`text-[11px] font-medium mb-1.5 ${m.isCurrent ? "text-white" : "text-white/40"}`}>{m.name}</p>
            {/* temp bar */}
            <div className="w-full h-2 rounded-full bg-white/[0.06] mb-1.5 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(((m.temp + 10) / 50) * 100, 100)}%`, backgroundColor: m.tempColor, opacity: m.isCurrent ? 1 : 0.6 }} />
            </div>
            <p className="text-[11px] font-medium" style={{ color: m.tempColor }}>{m.temp}°</p>
            {/* precip bar */}
            <div className="w-full h-1 rounded-full bg-white/[0.06] mt-1 overflow-hidden">
              <div className="h-full rounded-full bg-blue-400/50" style={{ width: `${m.precip}%` }} />
            </div>
            <p className="text-[9px] text-white/20 mt-0.5">{m.precip}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyHeatmap;
