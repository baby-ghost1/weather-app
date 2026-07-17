import { useMemo } from "react";
import { FiDroplet, FiThermometer, FiPercent } from "react-icons/fi";

const calcDewPoint = (temp, humidity) => {
  if (!humidity || humidity <= 0) return 0;
  const a = (17.27 * temp) / (237.7 + temp) + Math.log(humidity / 100);
  if (!isFinite(a)) return 0;
  return Math.round((237.7 * a) / (17.27 - a));
};

const getComfortLevel = (dp) => {
  if (dp < 10) return { label: "Very Dry", color: "#ff9800", tip: "Use moisturizer, stay hydrated", score: Math.round(((10 - dp) / 10) * 100) };
  if (dp < 16) return { label: "Comfortable", color: "#00e400", tip: "Ideal comfort level", score: Math.round(100 - ((16 - dp) / 6) * 30) };
  if (dp < 21) return { label: "Slightly Humid", color: "#ffff00", tip: "Minor discomfort possible", score: Math.round(70 - ((21 - dp) / 5) * 20) };
  if (dp < 24) return { label: "Humid", color: "#ff7e00", tip: "Feels sticky & uncomfortable", score: Math.round(50 - ((24 - dp) / 3) * 20) };
  return { label: "Very Humid", color: "#ff0000", tip: "Oppressive heat. Limit outdoor time.", score: Math.round(30 - Math.min((dp - 24) * 5, 30)) };
};

const getScalePosition = (dp) => Math.min(Math.max((dp / 30) * 100, 0), 100);

const DewPoint = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const dp = calcDewPoint(weather.temp, weather.humidity);
    const comfort = getComfortLevel(dp);
    const position = getScalePosition(dp);
    return { dp, comfort, position };
  }, [weather]);

  if (!weather || !data) return null;

  const { dp, comfort, position } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiDroplet className="text-white" /> Dew Point
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: comfort.color }}>{comfort.label}</span>
      </div>

      {/* score ring + info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={comfort.color} strokeWidth="2.5" strokeDasharray={`${comfort.score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiDroplet className="text-white text-sm mb-0.5" />
            <span className="text-white text-xl font-bold leading-none">{dp}°</span>
            <span className="text-white/30 text-[9px]">dew point</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="glass rounded-lg p-2 text-center">
            <FiThermometer className="mx-auto mb-0.5 text-orange-300" size={14} />
            <p className="text-white text-sm font-medium">{weather.temp}°</p>
            <p className="text-white/30 text-[10px]">Temperature</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <FiPercent className="mx-auto mb-0.5 text-blue-300" size={14} />
            <p className="text-white text-sm font-medium">{weather.humidity}%</p>
            <p className="text-white/30 text-[10px]">Humidity</p>
          </div>
        </div>
      </div>

      {/* scale bar with dot indicator */}
      <div className="mb-4">
        <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #ff9800, #00e400, #ffff00, #ff7e00, #ff0000)" }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg transition-all duration-700" style={{ left: `calc(${position}% - 7px)`, backgroundColor: comfort.color }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1.5">
          <span>Dry (0°)</span>
          <span>Comfortable (10-16°)</span>
          <span>Humid (21°+)</span>
        </div>
      </div>

      {/* comfort badges */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: "Very Dry", range: "<10°", color: "#ff9800" },
          { label: "Comfortable", range: "10-16°", color: "#00e400" },
          { label: "Slightly Humid", range: "16-21°", color: "#ffff00" },
          { label: "Humid", range: "21-24°", color: "#ff7e00" },
          { label: "Very Humid", range: "24°+", color: "#ff0000" },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: `${b.color}15` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-[10px] font-medium" style={{ color: b.color }}>{b.label}</span>
            <span className="text-white/20 text-[9px]">{b.range}</span>
          </div>
        ))}
      </div>

      {/* tip */}
      <div className="mt-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-400/10 text-blue-300">
        <FiDroplet size={12} />
        <span className="text-[11px]">{comfort.tip}</span>
      </div>
    </div>
  );
};

export default DewPoint;
