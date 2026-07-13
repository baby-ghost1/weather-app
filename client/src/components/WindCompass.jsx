// import { useUnit } from "../context/UnitContext";

// const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
// const cardinals = [
//   { label: "N", angle: 0, color: "#ef4444" },
//   { label: "E", angle: 90, color: "rgba(255,255,255,0.4)" },
//   { label: "S", angle: 180, color: "rgba(255,255,255,0.4)" },
//   { label: "W", angle: 270, color: "rgba(255,255,255,0.4)" },
// ];

// const getWindDesc = (speed) => {
//   if (speed < 0.5) return "Calm";
//   if (speed < 1.5) return "Light Air";
//   if (speed < 3.3) return "Light Breeze";
//   if (speed < 5.5) return "Gentle Breeze";
//   if (speed < 8) return "Moderate Breeze";
//   if (speed < 10.7) return "Fresh Breeze";
//   if (speed < 13.8) return "Strong Breeze";
//   if (speed < 17.1) return "Near Gale";
//   if (speed < 20.7) return "Gale";
//   if (speed < 24.4) return "Strong Gale";
//   if (speed < 28.4) return "Storm";
//   if (speed < 32.6) return "Violent Storm";
//   return "Hurricane";
// };

// const WindCompass = ({ speed, deg, gust }) => {
//   const { speedUnit } = useUnit();
//   const dir = dirs[Math.round((deg || 0) / 45) % 8];
//   const windDesc = getWindDesc(speed);
//   const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

//   return (
//     <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
//       <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4">Wind</h3>

//       {/* compass */}
//       <div className="flex justify-center mb-4">
//         <div className="relative w-36 h-36">
//           <svg viewBox="0 0 100 100" className="w-full h-full">
//             {/* outer ring */}
//             <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
//             <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

//             {/* tick marks */}
//             {ticks.map((t) => {
//               const a = ((t - 90) * Math.PI) / 180;
//               const isCardinal = t % 90 === 0;
//               const r1 = 44;
//               const r2 = isCardinal ? 40 : 42;
//               return (
//                 <line
//                   key={t}
//                   x1={50 + r1 * Math.cos(a)}
//                   y1={50 + r1 * Math.sin(a)}
//                   x2={50 + r2 * Math.cos(a)}
//                   y2={50 + r2 * Math.sin(a)}
//                   stroke={isCardinal ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}
//                   strokeWidth={isCardinal ? 1.5 : 0.5}
//                 />
//               );
//             })}

//             {/* cardinal labels */}
//             {cardinals.map((c) => {
//               const a = ((c.angle - 90) * Math.PI) / 180;
//               return (
//                 <text
//                   key={c.label}
//                   x={50 + 34 * Math.cos(a)}
//                   y={50 + 34 * Math.sin(a)}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   className="text-[10px] font-semibold"
//                   fill={c.color}
//                 >
//                   {c.label}
//                 </text>
//               );
//             })}

//             {/* wind direction arrow */}
//             <g transform={`rotate(${deg || 0}, 50, 50)`} className="transition-transform duration-1000">
//               <line x1="50" y1="18" x2="50" y2="44" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
//               <polygon points="50,12 46,22 54,22" fill="rgba(255,255,255,0.85)" />
//               <circle cx="50" cy="50" r="2.5" fill="rgba(255,255,255,0.5)" />
//             </g>

//             {/* center glow */}
//             <circle cx="50" cy="50" r="6" fill="rgba(255,255,255,0.05)" />
//           </svg>
//         </div>
//       </div>

//       {/* speed info — centered */}
//       <div className="flex flex-col items-center gap-2">
//         <div className="text-center">
//           <p className="text-white text-4xl font-light leading-none">{speed}</p>
//           <p className="text-white/40 text-[11px] mt-1">{speedUnit}</p>
//         </div>
//         <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05]">
//           <div className="w-1.5 h-1.5 rounded-full bg-white/40" style={{ transform: `rotate(${deg || 0}deg)` }} />
//           <span className="text-white/60 text-xs font-medium">{dir}</span>
//         </div>
//         <span className="text-white/30 text-[11px]">{windDesc}</span>
//         {gust && (
//           <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04]">
//             <span className="text-white/25 text-[10px]">Gust</span>
//             <span className="text-white/50 text-[11px] font-medium">{gust} {speedUnit}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WindCompass;





import { useUnit } from "../context/UnitContext";

const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const cardinals = [
  { label: "N", angle: 0, color: "#ff4757" }, // Vibrant accent red for North
  { label: "E", angle: 90, color: "rgba(255,255,255,0.45)" },
  { label: "S", angle: 180, color: "rgba(255,255,255,0.45)" },
  { label: "W", angle: 270, color: "rgba(255,255,255,0.45)" },
];

const getWindDesc = (speed) => {
  if (speed < 0.5) return { text: "Calm", level: 0 };
  if (speed < 1.5) return { text: "Light Air", level: 1 };
  if (speed < 3.3) return { text: "Light Breeze", level: 2 };
  if (speed < 5.5) return { text: "Gentle Breeze", level: 3 };
  if (speed < 8.0) return { text: "Moderate Breeze", level: 4 };
  if (speed < 10.7) return { text: "Fresh Breeze", level: 5 };
  if (speed < 13.8) return { text: "Strong Breeze", level: 6 };
  if (speed < 17.1) return { text: "Near Gale", level: 7 };
  if (speed < 20.7) return { text: "Gale", level: 8 };
  if (speed < 24.4) return { text: "Strong Gale", level: 9 };
  if (speed < 28.4) return { text: "Storm", level: 10 };
  if (speed < 32.6) return { text: "Violent Storm", level: 11 };
  return { text: "Hurricane", level: 12 };
};

const WindCompass = ({ speed, deg, gust }) => {
  const { speedUnit } = useUnit();
  const dir = dirs[Math.round((deg || 0) / 45) % 8];
  const windInfo = getWindDesc(speed);
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in border border-white/5 relative overflow-hidden group">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none transition-all duration-700 group-hover:bg-sky-500/20" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest">Wind</h3>
        <span className="text-[10px] bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded-full text-white/60 font-mono tracking-wider">
          {deg || 0}° {dir}
        </span>
      </div>

      {/* Visual Canvas: Compass Graphic */}
      <div className="flex justify-center mb-6 relative">
        <div className="relative w-40 h-40 flex items-center justify-center bg-white/[0.01] rounded-full p-2 border border-white/[0.02]">
          
          {/* Internal center display layout */}
          <div className="absolute flex flex-col items-center justify-center z-10 pointer-events-none">
            <span className="text-white text-3xl font-extralight tracking-tighter leading-none font-mono">
              {speed}
            </span>
            <span className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5 font-medium">
              {speedUnit}
            </span>
          </div>

          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
            {/* Ambient Tracks */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

            {/* Premium Ticks Grid */}
            {ticks.map((t) => {
              const a = ((t - 90) * Math.PI) / 180;
              const isCardinal = t % 90 === 0;
              const isSubCardinal = t % 45 === 0 && !isCardinal;
              const r1 = 45;
              const r2 = isCardinal ? 40 : isSubCardinal ? 42 : 43.5;
              
              return (
                <line
                  key={t}
                  x1={50 + r1 * Math.cos(a)}
                  y1={50 + r1 * Math.sin(a)}
                  x2={50 + r2 * Math.cos(a)}
                  y2={50 + r2 * Math.sin(a)}
                  stroke={isCardinal ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.12)"}
                  strokeWidth={isCardinal ? 1.2 : 0.6}
                />
              );
            })}

            {/* Clean Typography Cardinal Indicators */}
            {cardinals.map((c) => {
              const a = ((c.angle - 90) * Math.PI) / 180;
              return (
                <text
                  key={c.label}
                  x={50 + 32 * Math.cos(a)}
                  y={50 + 32 * Math.sin(a)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-bold tracking-tight font-sans"
                  fill={c.color}
                >
                  {c.label}
                </text>
              );
            })}

            {/* Glowing Main Directional Tail Arrow */}
            <g transform={`rotate(${deg || 0}, 50, 50)`} className="transition-transform duration-[1200ms] ease-out">
              {/* Sleek Minimalist Neon pointer needle lines */}
              <line x1="50" y1="5" x2="50" y2="15" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(56,189,248,0.6)]" />
              <polygon points="50,2 47,7 53,7" fill="#38bdf8" className="drop-shadow-[0_0_4px_rgba(56,189,248,0.6)]" />
              
              {/* Subtle opposite indicator dot */}
              <circle cx="50" cy="93" r="1.5" fill="rgba(255,255,255,0.2)" />
            </g>

            {/* Centered Ring Base */}
            <circle cx="50" cy="50" r="21" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Primary Description Label */}
      <div className="text-center mb-4">
        <p className="text-white/80 text-xs font-medium tracking-wide transition-colors group-hover:text-white">
          {windInfo.text}
        </p>
      </div>

      {/* Grid Layout Spec Cards */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
        {/* Card 1: Direction angle summary */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all group-hover:bg-white/[0.04]">
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">Bearing</span>
          <span className="text-white/70 text-xs font-semibold font-mono mt-0.5">{deg || 0}°</span>
        </div>

        {/* Card 2: Gust values details */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all group-hover:bg-white/[0.04]">
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">Gusts</span>
          <span className="text-white/70 text-xs font-semibold font-mono mt-0.5 truncate max-w-full px-0.5">
            {gust ? `${gust}` : "—"}
          </span>
        </div>

        {/* Card 3: Beaufort Index Level scale */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all group-hover:bg-white/[0.04]">
          <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">Bft Scale</span>
          <span className="text-white/70 text-xs font-semibold font-mono mt-0.5">F-{windInfo.level}</span>
        </div>
      </div>
    </div>
  );
};

export default WindCompass;