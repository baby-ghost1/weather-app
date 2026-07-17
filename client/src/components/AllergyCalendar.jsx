import { useMemo } from "react";
import { FiCalendar } from "react-icons/fi";
import { TbTree, TbPlant2, TbLeaf, TbBug, TbMushroom, TbFlower } from "react-icons/tb";

const iconMap = {
  "Tree Pollen": <TbTree size={18} className="text-white" />,
  "Grass Pollen": <TbPlant2 size={18} className="text-white" />,
  "Weed Pollen": <TbLeaf size={18} className="text-white" />,
  "Dust Mites": <TbBug size={18} className="text-white" />,
  "Mold Spores": <TbMushroom size={18} className="text-white" />,
  "Ragweed": <TbFlower size={18} className="text-white" />,
};

const ALLERGENS = [
  { name: "Tree Pollen", months: [2, 3, 4, 5], peak: "Mar-Apr" },
  { name: "Grass Pollen", months: [4, 5, 6, 7, 8], peak: "May-Jun" },
  { name: "Weed Pollen", months: [7, 8, 9, 10], peak: "Aug-Sep" },
  { name: "Dust Mites", months: [5, 6, 7, 8, 9], peak: "Jul-Aug" },
  { name: "Mold Spores", months: [6, 7, 8, 9, 10], peak: "Aug-Sep" },
  { name: "Ragweed", months: [8, 9, 10], peak: "Sep" },
];

const allergenColors = {
  "Tree Pollen": "#4ade80",
  "Grass Pollen": "#a3e635",
  "Weed Pollen": "#fb923c",
  "Dust Mites": "#f87171",
  "Mold Spores": "#c084fc",
  "Ragweed": "#facc15",
};

const getAllergyRiskScore = (month) => {
  const active = ALLERGENS.filter((a) => a.months.includes(month));
  const count = active.length;
  let score = 100 - count * 15;
  if (count >= 4) score -= 10;
  return Math.max(0, Math.min(100, score));
};

const getRiskCategory = (score) => {
  if (score >= 80) return { label: "Low Risk", color: "#00e400" };
  if (score >= 60) return { label: "Moderate", color: "#8BC34A" };
  if (score >= 40) return { label: "Elevated", color: "#ffff00" };
  if (score >= 20) return { label: "High", color: "#ff7e00" };
  return { label: "Very High", color: "#ff0000" };
};

const monthIntensity = (month, allergens) => {
  const activeCount = allergens.filter((a) => a.months.includes(month)).length;
  if (activeCount >= 4) return "high";
  if (activeCount >= 2) return "mid";
  if (activeCount >= 1) return "low";
  return "none";
};

const AllergyCalendar = ({ weather }) => {
  const currentMonth = new Date().getMonth() + 1;

  const { activeAllergens, monthAllergens } = useMemo(() => {
    const active = ALLERGENS.filter((a) => a.months.includes(currentMonth));
    return { activeAllergens: active, monthAllergens: ALLERGENS };
  }, [currentMonth]);

  const score = useMemo(() => getAllergyRiskScore(currentMonth), [currentMonth]);
  const category = getRiskCategory(score);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCalendar className="text-white" /> Allergy Calendar
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: category.color }}>
          {category.label}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={category.color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{score}</span>
            <span className="text-white/30 text-[9px] mt-0.5">/100</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-white/40 text-[11px] mb-1">Current month</p>
          <p className="text-white text-sm font-medium">{months[currentMonth - 1]}</p>
          <p className="text-white/40 text-[11px] mt-0.5">
            {activeAllergens.length} active allergen{activeAllergens.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {activeAllergens.length === 0 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-400/10 text-green-300 text-[11px]">
            <TbLeaf size={14} />
            <span>Low allergy risk this month</span>
          </div>
        ) : (
          activeAllergens.map((a) => (
            <div
              key={a.name}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]"
              style={{ backgroundColor: `${allergenColors[a.name]}15`, color: allergenColors[a.name] }}
            >
              {iconMap[a.name] || <TbLeaf size={14} className="text-white" />}
              <span className="font-medium">{a.name}</span>
              <span className="opacity-60">Peak: {a.peak}</span>
            </div>
          ))
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-[300px]">
          {months.map((m, i) => {
            const intensity = monthIntensity(i + 1, monthAllergens);
            const isCurrent = i + 1 === currentMonth;
            const intensityStyle =
              intensity === "high"
                ? "bg-red-400/25 text-red-300"
                : intensity === "mid"
                ? "bg-orange-400/20 text-orange-300"
                : intensity === "low"
                ? "bg-yellow-400/15 text-yellow-300"
                : "bg-green-400/10 text-green-400/50";
            return (
              <div
                key={m}
                className={`flex-1 text-center py-1.5 rounded text-[11px] transition-all font-medium ${
                  isCurrent ? "bg-white/20 text-white ring-1 ring-white/20" : intensityStyle
                }`}
              >
                {m}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllergyCalendar;
