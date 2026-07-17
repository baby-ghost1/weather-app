import { useState, useEffect, useRef } from "react";
import { FiVolume2, FiVolumeX, FiWind, FiDroplet, FiRadio } from "react-icons/fi";
import { WiRain, WiThunderstorm } from "react-icons/wi";
import { TbTree, TbFlame, TbBug } from "react-icons/tb";
import { getContent } from "../services/api";

const soundScenes = [
  { id: "rain", name: "Rain", icon: WiRain, files: ["rain", "rain-2"], color: "#60a5fa" },
  { id: "thunder", name: "Thunder", icon: WiThunderstorm, files: ["thunder"], color: "#a78bfa" },
  { id: "wind", name: "Wind", icon: FiWind, files: ["wind", "wind-2"], color: "#22d3ee" },
  { id: "forest", name: "Forest", icon: TbTree, files: ["forest"], color: "#4ade80" },
  { id: "ocean", name: "Ocean", icon: FiDroplet, files: ["ocean"], color: "#38bdf8" },
  { id: "fire", name: "Fireplace", icon: TbFlame, files: ["fire"], color: "#f97316" },
  { id: "night", name: "Night", icon: TbBug, files: ["night"], color: "#a78bfa" },
  { id: "white-noise", name: "White Noise", icon: FiRadio, files: ["white-noise"], color: "#94a3b8" },
];

const WeatherSounds = ({ weather }) => {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(50);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!weather) return;
    setLoading(true);
    getContent("sounds", { weather: weather.main, wind: String(weather.windSpeed) })
      .then((res) => { setRecommended(res.recommended || []); setLoading(false); })
      .catch(() => { setRecommended([]); setLoading(false); });
  }, [weather]);

  const toggleSound = (scene) => {
    if (playing === scene.id) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      const freqs = {
        rain: [400, 800, 2000], thunder: [60, 120, 200], wind: [100, 200, 400],
        forest: [300, 1200, 3000], ocean: [80, 150, 300], fire: [200, 500, 1000],
        night: [4000, 6000, 8000], "white-noise": [100, 1000, 5000],
      }[scene.id] || [500, 1000, 2000];
      for (let i = 0; i < bufferSize; i++) {
        let sample = 0;
        freqs.forEach((f) => { sample += Math.sin((2 * Math.PI * f * i) / ctx.sampleRate) * 0.1; });
        sample += (Math.random() * 2 - 1) * 0.05;
        output[i] = sample * (volume / 100);
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = volume / 100;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
      audioRef.current = { pause: () => { src.stop(); ctx.close(); } };
      setPlaying(scene.id);
    }
  };

  useEffect(() => {
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiVolume2 className="text-white" /> Weather Sounds
        </h3>
        {playing && (
          <div className="flex items-center gap-2">
            <FiVolumeX className="text-white/30 text-[11px]" />
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-16 h-1 accent-white/50" />
          </div>
        )}
      </div>

      {/* recommended */}
      {recommended.length > 0 && (
        <div className="mb-4 p-2.5 rounded-xl bg-blue-400/[0.06] border border-blue-400/10">
          <p className="text-blue-300/50 text-[10px] uppercase tracking-wider mb-1.5">Recommended for current weather</p>
          <div className="flex gap-1.5 flex-wrap">
            {recommended.map((sound) => {
              const scene = soundScenes.find((s) => s.id === sound.id);
              if (!scene) return null;
              const Icon = scene.icon;
              return (
                <span key={sound.id} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-blue-400/10 text-blue-300">
                  <Icon size={12} /> {scene.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* sound grid */}
      <div className="grid grid-cols-4 gap-2">
        {soundScenes.map((scene) => {
          const isActive = playing === scene.id;
          const Icon = scene.icon;
          return (
            <button
              key={scene.id}
              onClick={() => toggleSound(scene)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                isActive ? "bg-white/[0.1] ring-1" : "bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
              style={isActive ? { ringColor: `${scene.color}40` } : {}}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? "scale-110" : ""}`} style={{ backgroundColor: isActive ? `${scene.color}20` : "rgba(255,255,255,0.04)" }}>
                <Icon size={18} style={{ color: isActive ? scene.color : "rgba(255,255,255,0.3)" }} />
              </div>
              <span className={`text-[10px] ${isActive ? "text-white/70" : "text-white/30"}`}>{scene.name}</span>
              {isActive && (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((b) => (
                    <div key={b} className="w-0.5 rounded-full animate-pulse" style={{ height: `${6 + b * 2}px`, backgroundColor: scene.color, animationDelay: `${b * 0.15}s` }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherSounds;
