import { useState, useEffect } from "react";
import { getUVIndex } from "../services/api";
import { FiSun, FiMoon, FiShield, FiAlertTriangle, FiClock, FiDroplet } from "react-icons/fi";

const isNighttime = (sunrise, sunset) => {
  if (!sunrise || !sunset) return false;
  const now = Date.now() / 1000;
  return now < sunrise || now > sunset;
};

const getProtectionTime = (uv) => {
  if (uv <= 2) return "No protection needed";
  if (uv <= 5) return "Wear sunscreen, hat, and sunglasses";
  if (uv <= 7) return "Protection essential — limit outdoor time 10am–4pm";
  if (uv <= 10) return "Extra protection needed — minimize sun exposure";
  return "Avoid outdoor exposure — extreme UV levels";
};

const getSPF = (uv) => {
  if (uv <= 2) return null;
  if (uv <= 5) return "SPF 30+";
  if (uv <= 7) return "SPF 50+";
  if (uv <= 10) return "SPF 50+ Broad Spectrum";
  return "SPF 100+ Broad Spectrum";
};

const getWearNow = (uv) => {
  if (uv <= 2) return null;
  if (uv <= 5) return { items: ["Sunscreen", "Sunglasses"], icon: "🧴" };
  if (uv <= 7) return { items: ["Sunscreen", "Hat", "Sunglasses"], icon: "🧢" };
  if (uv <= 10) return { items: ["Sunscreen", "Hat", "Sunglasses", "Light clothing"], icon: "👒" };
  return { items: ["Stay indoors", "Cover all skin", "Avoid sun"], icon: "⚠️" };
};

const getUVColor = (uv) => {
  if (uv <= 2) return "#4ade80";
  if (uv <= 5) return "#facc15";
  if (uv <= 7) return "#f97316";
  if (uv <= 10) return "#ef4444";
  return "#a855f7";
};

const simulateHourlyUV = (currentUV) => {
  const hour = new Date().getHours();
  const hours = [];
  for (let i = 1; i <= 4; i++) {
    const h = hour + i;
    const factor = h < 12 ? (h - 6) / 6 : Math.max(0, (18 - h) / 6);
    const simUV = Math.round(currentUV * Math.max(0.1, factor) * 10) / 10;
    const display = Math.max(0, Math.min(11, simUV));
    const ampm = h >= 12 ? "PM" : "AM";
    const label = `${h % 12 || 12}${ampm}`;
    hours.push({ time: label, uv: display, color: getUVColor(display) });
  }
  return hours;
};

const UVIndexCard = ({ lat, lon, sunrise, sunset }) => {
  const [uv, setUv] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    setError("");
    getUVIndex(lat, lon).then((res) => { if (res.success) setUv(res.data); else setError("Failed to load UV index."); setLoading(false); }).catch(() => { setError("Failed to load UV index."); setLoading(false); });
  }, [lat, lon]);

  if (loading) return <div className="glass rounded-2xl p-5 animate-scale-in"><div className="shimmer h-4 w-16 rounded mb-3" /><div className="shimmer h-8 w-12 rounded mb-2" /><div className="shimmer h-3 w-40 rounded" /></div>;
  if (error) return <div className="glass rounded-2xl p-5 animate-scale-in"><p className="text-red-300 text-xs">{error}</p></div>;
  if (!uv) return null;

  const night = isNighttime(sunrise, sunset);
  const displayValue = night ? 0 : uv.value;
  const displayLevel = night ? { level: "None", color: "#64748b" } : uv;
  const pct = Math.min((displayValue / 11) * 100, 100);
  const uvColor = getUVColor(displayValue);
  const spf = getSPF(displayValue);
  const wearNow = getWearNow(displayValue);
  const hourly = simulateHourlyUV(displayValue);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in relative overflow-hidden">
      {/* gradient glow */}
      {!night && (
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-15 transition-all duration-700" style={{ backgroundColor: uvColor }} />
      )}

      {/* header */}
      <div className="flex items-center justify-between mb-3 relative">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">UV Index</h3>
        {night ? (
          <FiMoon className="text-white/20 text-sm" />
        ) : (
          <FiSun className="text-sm" style={{ color: uvColor }} />
        )}
      </div>

      {/* big UV number + sun icon + level */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-end gap-3">
          <span className="text-6xl font-light leading-none" style={{ color: uvColor }}>{displayValue}</span>
          <span className="text-sm font-medium px-2.5 py-1 rounded-full mb-1 text-black" style={{ backgroundColor: uvColor }}>{displayLevel.level}</span>
        </div>
        {!night && (
          <div className="relative">
            <FiSun className="text-4xl" style={{ color: uvColor, filter: `drop-shadow(0 0 12px ${uvColor}40)` }} />
          </div>
        )}
      </div>

      {/* peak hours badge */}
      {!night && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-400/[0.08] border border-yellow-400/10 mb-3">
          <FiClock className="text-yellow-400/50 text-xs shrink-0" />
          <p className="text-yellow-300/60 text-[11px]">UV peaks at 10am–4pm. Seek shade during these hours.</p>
        </div>
      )}

      {/* protection tip */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.04] mb-3">
        <FiShield className="text-white/30 text-xs shrink-0 mt-0.5" />
        <p className="text-white/40 text-[11px] leading-relaxed">{night ? "Sun is down — UV index is 0." : getProtectionTime(displayValue)}</p>
      </div>

      {/* SPF + wear now */}
      {!night && (spf || wearNow) && (
        <div className="flex gap-2 mb-3">
          {spf && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04]">
              <FiDroplet className="text-white/30 text-[11px]" />
              <span className="text-white/50 text-[11px] font-medium">{spf}</span>
            </div>
          )}
          {wearNow && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04]">
              <span className="text-xs">{wearNow.icon}</span>
              <span className="text-white/50 text-[11px]">{wearNow.items.join(", ")}</span>
            </div>
          )}
        </div>
      )}

      {/* color bar with dot */}
      <div className="mb-3">
        <div className="relative w-full h-3 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div className="bg-green-400" style={{ flex: 1 }} />
            <div className="bg-yellow-400" style={{ flex: 1 }} />
            <div className="bg-orange-400" style={{ flex: 1 }} />
            <div className="bg-red-400" style={{ flex: 1 }} />
            <div className="bg-purple-500" style={{ flex: 1 }} />
          </div>
          <div className="absolute w-4 h-8 bg-white rounded-full shadow-lg border-2 transition-all duration-700" style={{ left: `calc(${pct}% - 8px)`, top: "calc(50% - 16px)", borderColor: uvColor }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/25 mt-1.5 px-0.5">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
          <span>Very High</span>
          <span>Extreme</span>
        </div>
      </div>

      {/* hourly UV mini forecast */}
      {!night && (
        <div className="flex gap-2 mb-3">
          {hourly.map((h, i) => (
            <div key={i} className="flex-1 text-center py-2 rounded-lg bg-white/[0.03]">
              <p className="text-white/30 text-[10px] mb-1">{h.time}</p>
              <p className="text-xs font-medium" style={{ color: h.color }}>{h.uv}</p>
              <div className="w-full h-1 rounded-full bg-white/[0.06] mt-1.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(h.uv / 11) * 100}%`, backgroundColor: h.color }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* advice */}
      {!night && (
        <p className="text-white/40 text-[11px] leading-relaxed">{uv.advice}</p>
      )}
    </div>
  );
};

export default UVIndexCard;
