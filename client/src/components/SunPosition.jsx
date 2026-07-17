import { useMemo } from "react";
import { FiSun } from "react-icons/fi";
import { formatTime } from "../utils/format";

const quadraticBezier = (t, p0, p1, p2) => {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
};

const formatHours = (h) => {
  const abs = Math.abs(h);
  const hrs = Math.floor(abs);
  const mins = Math.round((abs - hrs) * 60);
  return `${hrs}h ${mins}m`;
};

const SunPosition = ({ weather }) => {
  const sunData = useMemo(() => {
    if (!weather?.sunrise || !weather?.sunset) return null;
    const now = Date.now() / 1000;
    const sunrise = weather.sunrise;
    const sunset = weather.sunset;
    const isDaytime = now >= sunrise && now <= sunset;
    const daylight = sunset - sunrise;
    const elapsed = now - sunrise;
    const progress = daylight > 0 ? Math.max(0, Math.min(1, elapsed / daylight)) : 0;
    const solarNoon = (sunrise + sunset) / 2;
    const hoursUntilNoon = (solarNoon - now) / 3600;
    const remaining = isDaytime ? Math.max(0, sunset - now) : 0;
    const totalHours = Math.floor(daylight / 3600);
    const totalMins = Math.round((daylight % 3600) / 60);
    const remainHours = Math.floor(remaining / 3600);
    const remainMins = Math.round((remaining % 3600) / 60);
    const pct = Math.round(progress * 100);
    return { isDaytime, progress, solarNoon, hoursUntilNoon, remaining, totalHours, totalMins, remainHours, remainMins, pct };
  }, [weather]);

  if (!sunData) return null;

  const t = sunData.progress;
  const sunX = quadraticBezier(t, 20, 150, 280);
  const sunY = quadraticBezier(t, 115, -10, 115);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSun className="text-white" /> Sun Position
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sunData.isDaytime ? "bg-yellow-400/20 text-yellow-300" : "bg-blue-400/20 text-blue-300"}`}>
          {sunData.isDaytime ? "☀️ Daytime" : "🌙 Nighttime"}
        </span>
      </div>

      {/* daylight duration + progress */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-yellow-400/[0.08]">
          <FiSun className="text-yellow-400/40 text-[11px]" />
          <span className="text-yellow-300/60 text-[11px]">{sunData.totalHours}h {sunData.totalMins}m of daylight</span>
        </div>
        {sunData.isDaytime && (
          <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.04]">
            <span className="text-white/30 text-[11px]">{sunData.remainHours}h {sunData.remainMins}m left</span>
          </div>
        )}
      </div>

      {/* SVG arc */}
      <div className="relative w-full h-36 mb-4">
        <svg viewBox="0 0 300 140" className="w-full h-full">
          {/* dashed arc path */}
          <path d="M 20 115 Q 150 -10 280 115" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />

          {/* horizon line */}
          <line x1="20" y1="115" x2="280" y2="115" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* horizon labels */}
          <text x="20" y="133" fill="rgba(255,255,255,0.25)" fontSize="8" textAnchor="middle">Sunrise</text>
          <text x="280" y="133" fill="rgba(255,255,255,0.25)" fontSize="8" textAnchor="middle">Sunset</text>

          {/* daytime sun — on the bezier curve */}
          {sunData.isDaytime && (
            <g>
              {/* sun glow */}
              <circle cx={sunX} cy={sunY} r="18" fill="#fbbf24" opacity="0.1">
                <animate attributeName="r" values="16;20;16" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* sun body */}
              <circle cx={sunX} cy={sunY} r="10" fill="#fbbf24" className="transition-all duration-1000">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* sun rays */}
              {[0, 45, 90, 135].map((angle) => {
                const a = ((angle - 90) * Math.PI) / 180;
                return (
                  <line
                    key={angle}
                    x1={sunX + 14 * Math.cos(a)}
                    y1={sunY + 14 * Math.sin(a)}
                    x2={sunX + 19 * Math.cos(a)}
                    y2={sunY + 19 * Math.sin(a)}
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  >
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin={`${angle / 360}s`} />
                  </line>
                );
              })}
              {/* progress text */}
              <text x={sunX} y={sunY - 20} fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">{sunData.pct}%</text>
            </g>
          )}

          {/* nighttime moon — along horizon */}
          {!sunData.isDaytime && (
            <g>
              <circle cx={sunX} cy={125} r="10" fill="#cbd5e1" opacity="0.4" />
              <circle cx={sunX + 3} cy={123} r="8" fill="#1e293b" />
            </g>
          )}
        </svg>
      </div>

      {/* sunrise, solar noon, sunset grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-lg p-2">
          <p className="text-yellow-300 text-[11px]">Sunrise</p>
          <p className="text-white text-xs font-medium">{formatTime(weather.sunrise)}</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-white/40 text-[11px]">Solar Noon</p>
          <p className="text-white text-xs font-medium">{formatTime((weather.sunrise + weather.sunset) / 2)}</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-orange-400 text-[11px]">Sunset</p>
          <p className="text-white text-xs font-medium">{formatTime(weather.sunset)}</p>
        </div>
      </div>

      {/* until solar noon */}
      {sunData.isDaytime && (
        <p className="text-white/30 text-[11px] text-center mt-2">
          {sunData.hoursUntilNoon > 0
            ? `${formatHours(sunData.hoursUntilNoon)} until solar noon`
            : `Solar noon passed ${formatHours(-sunData.hoursUntilNoon)} ago`}
        </p>
      )}
    </div>
  );
};

export default SunPosition;
