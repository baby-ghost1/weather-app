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

const AllergyCalendar = ({ weather }) => {
  const currentMonth = new Date().getMonth() + 1;

  const { activeAllergens, monthAllergens } = useMemo(() => {
    const active = ALLERGENS.filter((a) => a.months.includes(currentMonth));
    return { activeAllergens: active, monthAllergens: ALLERGENS };
  }, [currentMonth]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCalendar className="text-white" /> Allergy Calendar
        </h3>
        <span className="text-white/40 text-[11px]">{months[currentMonth - 1]}</span>
      </div>

      <div className="space-y-2 mb-4">
        {activeAllergens.length === 0 ? (
          <p className="text-green-400 text-xs">Low allergy risk this month</p>
        ) : (
          activeAllergens.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <span className="text-sm">{iconMap[a.name] || <TbLeaf size={18} className="text-white" />}</span>
              <span className="text-white/60 text-xs flex-1">{a.name}</span>
              <span className="text-orange-300 text-[11px]">Peak: {a.peak}</span>
            </div>
          ))
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-[300px]">
          {months.map((m, i) => {
            const hasAllergy = monthAllergens.some((a) => a.months && a.months.includes(i + 1));
            const isCurrent = i + 1 === currentMonth;
            return (
              <div
                key={m}
                className={`flex-1 text-center py-1 rounded text-[11px] transition-all ${
                  isCurrent ? "bg-white/20 text-white font-bold" :
                  hasAllergy ? "bg-orange-400/20 text-orange-300" :
                  "bg-green-400/10 text-green-400/50"
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
