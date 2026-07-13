import { useState, useEffect, useRef } from "react";
import { FiVolume2, FiVolumeX, FiWind, FiDroplet, FiRadio } from "react-icons/fi";
import { WiRain, WiThunderstorm } from "react-icons/wi";
import { TbTree, TbFlame, TbBug } from "react-icons/tb";
import { getContent } from "../services/api";

const soundScenes = [
  { id: "rain", name: "Rain", icon: <WiRain size={20} className="text-white" />, files: ["rain", "rain-2"] },
  { id: "thunder", name: "Thunder", icon: <WiThunderstorm size={20} className="text-white" />, files: ["thunder"] },
  { id: "wind", name: "Wind", icon: <FiWind size={16} className="text-white" />, files: ["wind", "wind-2"] },
  { id: "forest", name: "Forest", icon: <TbTree size={18} className="text-white" />, files: ["forest"] },
  { id: "ocean", name: "Ocean", icon: <FiDroplet size={16} className="text-white" />, files: ["ocean"] },
  { id: "fire", name: "Fireplace", icon: <TbFlame size={18} className="text-white" />, files: ["fire"] },
  { id: "night", name: "Night", icon: <TbBug size={18} className="text-white" />, files: ["night"] },
  { id: "white-noise", name: "White Noise", icon: <FiRadio size={16} className="text-white" />, files: ["white-noise"] },
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
      .catch((err) => { setRecommended([]); setLoading(false); });
  }, [weather]);

  const toggleSound = (scene) => {
    if (playing === scene.id) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setPlaying(null);
    } else {
      if (audioRef.current) { audioRef.current.pause(); }
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiVolume2 className="text-white" /> Weather Sounds
        </h3>
        {playing && (
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-16 h-1 accent-white/50" />
          </div>
        )}
      </div>

      {recommended.length > 0 && (
        <div className="mb-3">
          <p className="text-white/30 text-[11px] mb-1">Recommended for current weather</p>
          <div className="flex gap-1.5 flex-wrap">
            {recommended.map((sound) => {
              const scene = soundScenes.find((s) => s.id === sound.id);
              return scene ? (
                <span key={sound.id} className="text-[11px] px-2 py-1 rounded-lg bg-blue-400/10 text-blue-300">{scene.icon} {scene.name}</span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {soundScenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => toggleSound(scene)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              playing === scene.id ? "bg-white/10 ring-1 ring-white/20" : "bg-white/5 hover:bg-white/8"
            }`}
          >
            <span className="text-lg">{scene.icon}</span>
            <span className="text-[11px] text-white/40">{scene.name}</span>
            {playing === scene.id && <FiVolumeX className="text-white/40 text-[11px]" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeatherSounds;
