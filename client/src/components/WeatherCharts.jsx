import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useUnit } from "../context/UnitContext";
import { formatHour } from "../utils/format";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value}{entry.name === "Pop" ? "%" : entry.name === "Humidity" ? "%" : "°"}
        </p>
      ))}
    </div>
  );
};

const WeatherCharts = ({ hourly }) => {
  const [activeChart, setActiveChart] = useState("temp");
  const { tempUnit } = useUnit();

  if (!hourly?.length) return null;

  const chartData = hourly.slice(0, 12).map((h) => ({
    time: formatHour(h.dtTxt),
    Temp: h.temp,
    Feels: h.feelsLike,
    Humidity: h.humidity,
    Pop: h.pop,
    Wind: h.windSpeed,
  }));

  const charts = {
    temp: { label: "Temperature", dataKey: ["Temp", "Feels"], colors: ["#f97316", "#60a5fa"] },
    humidity: { label: "Humidity", dataKey: ["Humidity"], colors: ["#60a5fa"] },
    pop: { label: "Rain Chance", dataKey: ["Pop"], colors: ["#38bdf8"] },
    wind: { label: "Wind", dataKey: ["Wind"], colors: ["#22d3ee"] },
  };

  const active = charts[activeChart];

  return (
    <div className="w-full glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Weather Trends</h3>
        <div className="flex gap-1">
          {Object.entries(charts).map(([key, chart]) => (
            <button
              key={key}
              onClick={() => setActiveChart(key)}
              className={`text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                activeChart === key ? "bg-white/20 text-white" : "text-white/30 hover:text-white/50"
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {active.dataKey.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={active.colors[i]}
                fill={active.colors[i] === "#f97316" ? "url(#tempGrad)" : "url(#blueGrad)"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: active.colors[i], strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherCharts;
