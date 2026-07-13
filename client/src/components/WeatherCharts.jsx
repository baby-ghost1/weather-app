import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceDot } from "recharts";
import { useUnit } from "../context/UnitContext";
import { formatHour } from "../utils/format";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3.5 py-2.5 text-xs shadow-xl">
      <p className="text-white/50 mb-1.5 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-white/40">{entry.name}:</span>
          <span style={{ color: entry.color }} className="font-medium">
            {entry.value}{entry.name === "Pop" || entry.name === "Humidity" ? "%" : entry.name === "Wind" ? " m/s" : "°"}
          </span>
        </div>
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
    temp: { label: "Temperature", dataKey: ["Temp", "Feels"], colors: ["#f97316", "#60a5fa"], unit: tempUnit, gradId: "tempGrad" },
    humidity: { label: "Humidity", dataKey: ["Humidity"], colors: ["#60a5fa"], unit: "%", gradId: "blueGrad" },
    pop: { label: "Rain Chance", dataKey: ["Pop"], colors: ["#38bdf8"], unit: "%", gradId: "cyanGrad" },
    wind: { label: "Wind", dataKey: ["Wind"], colors: ["#22d3ee"], unit: " m/s", gradId: "cyanGrad2" },
  };

  const active = charts[activeChart];

  const currentValue = chartData[0]?.[active.dataKey[0]] ?? 0;
  const allValues = chartData.map((d) => d[active.dataKey[0]]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  return (
    <div className="w-full glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.25s" }}>
      {/* header: title + current value */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Weather Trends</h3>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-white text-2xl font-light">{currentValue}</span>
            <span className="text-white/30 text-sm">{active.unit}</span>
            {activeChart === "temp" && (
              <span className="text-white/20 text-[11px] ml-1">L:{minVal}° H:{maxVal}°</span>
            )}
          </div>
        </div>

        {/* tabs */}
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

      {/* chart */}
      <div className="h-52">
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
              <linearGradient id="cyanGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} domain={activeChart === "pop" ? [0, 100] : activeChart === "humidity" ? [0, 100] : ["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            {active.dataKey.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={active.colors[i]}
                fill={`url(#${active.gradId})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: active.colors[i], strokeWidth: 0 }}
              />
            ))}
            {/* current hour dot on first line */}
            <ReferenceDot
              x={chartData[0]?.time}
              y={chartData[0]?.[active.dataKey[0]]}
              r={4}
              fill={active.colors[0]}
              stroke="white"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* legend for temp chart */}
      {activeChart === "temp" && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-orange-400" />
            <span className="text-white/30 text-[10px]">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-blue-400" />
            <span className="text-white/30 text-[10px]">Feels Like</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCharts;
