import { useUnit } from "../context/UnitContext";
import { FiRepeat } from "react-icons/fi";

const UnitToggle = () => {
  const { units, toggleUnits, tempUnit, speedUnit } = useUnit();

  return (
    <button
      onClick={toggleUnits}
      className="glass rounded-full px-4 py-2 text-white/70 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
      title={`Switch to ${units === "metric" ? "Imperial" : "Metric"}`}
    >
      <FiRepeat className="text-sm" />
      <span>{tempUnit} / {speedUnit}</span>
    </button>
  );
};

export default UnitToggle;
