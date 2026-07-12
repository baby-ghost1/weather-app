import { useUnit } from "../context/UnitContext";

const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const cardinals = ["N", "E", "S", "W"];

const WindCompass = ({ speed, deg }) => {
  const { speedUnit } = useUnit();
  const dir = dirs[Math.round((deg || 0) / 45) % 8];

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in flex flex-col items-center">
      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 self-start">Wind</h3>

      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {cardinals.map((d, i) => {
            const a = (i * 90 * Math.PI) / 180;
            return (
              <text key={d} x={50 + 40 * Math.sin(a)} y={50 - 40 * Math.cos(a)} textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-white/40 font-medium">
                {d}
              </text>
            );
          })}

          <g transform={`rotate(${deg || 0}, 50, 50)`} className="transition-transform duration-1000">
            <line x1="50" y1="20" x2="50" y2="45" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
            <polygon points="50,14 46,22 54,22" fill="rgba(255,255,255,0.8)" />
            <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.6)" />
          </g>
        </svg>
      </div>

      <div className="text-center mt-2">
        <p className="text-white text-2xl font-medium">{speed}</p>
        <p className="text-white/50 text-xs">{dir} · {speedUnit}</p>
      </div>
    </div>
  );
};

export default WindCompass;
