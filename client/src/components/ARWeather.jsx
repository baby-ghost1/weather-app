import { useState, useRef, useEffect } from "react";
import { FiCamera, FiX } from "react-icons/fi";
import { WiDaySunny, WiRain, WiDayRain, WiFog, WiThunderstorm } from "react-icons/wi";
import { TbSnowflake } from "react-icons/tb";
import { useUnit } from "../context/UnitContext";

const ARWeather = ({ weather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const { tempUnit } = useUnit();

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch {
      setError("Camera access denied. Please allow camera in browser settings.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [isOpen]);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  if (!weather) return null;

  const getWeatherIcon = (main) => {
    const map = {
      Clear: <WiDaySunny size={22} className="text-yellow-300" />,
      Clouds: <WiDaySunny size={22} className="text-gray-300" />,
      Rain: <WiRain size={22} className="text-blue-300" />,
      Snow: <TbSnowflake size={20} className="text-cyan-200" />,
      Thunderstorm: <WiThunderstorm size={22} className="text-yellow-400" />,
      Drizzle: <WiDayRain size={22} className="text-blue-200" />,
      Haze: <WiFog size={22} className="text-gray-300" />,
      Mist: <WiFog size={22} className="text-gray-300" />,
    };
    return map[main] || <WiDaySunny size={22} className="text-yellow-300" />;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="glass rounded-2xl p-4 hover-lift animate-scale-in min-w-[220px] text-left transition-all hover:bg-white/15"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-400/15 flex items-center justify-center shrink-0">
            <FiCamera className="text-purple-300" />
          </div>
          <div className="min-w-0">
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">AR View</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {getWeatherIcon(weather.main)}
              <span className="text-white/60 text-[11px]">{weather.temp}{tempUnit} · {weather.description}</span>
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 glass rounded-full p-3 text-white hover:bg-white/20 transition-colors z-10"
          >
            <FiX className="text-xl" />
          </button>

          {error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-strong rounded-2xl p-6 text-center max-w-sm mx-4">
                <p className="text-white/80 text-sm mb-2">{error}</p>
                <button onClick={() => setIsOpen(false)} className="text-white/40 text-xs hover:text-white/60">Close</button>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-6 left-6 glass-strong rounded-2xl p-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getWeatherIcon(weather.main)}</span>
                  <div>
                    <p className="text-white text-3xl font-light">{weather.temp}{tempUnit}</p>
                    <p className="text-white/60 text-xs">{weather.city}{weather.state ? `, ${weather.state}` : ""}, {weather.country}</p>
                  </div>
                </div>
                <p className="text-white/40 text-xs mt-1 capitalize">{weather.description}</p>
              </div>

              <div className="absolute bottom-8 left-6 right-6 glass-strong rounded-2xl p-4 animate-slide-up">
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-blue-300 text-lg">{weather.humidity}%</p>
                    <p className="text-white/40 text-[11px]">Humidity</p>
                  </div>
                  <div>
                    <p className="text-cyan-300 text-lg">{weather.windSpeed}</p>
                    <p className="text-white/40 text-[11px]">Wind</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-lg">{weather.pressure}</p>
                    <p className="text-white/40 text-[11px]">Pressure</p>
                  </div>
                  <div>
                    <p className="text-sky-300 text-lg">{weather.clouds}%</p>
                    <p className="text-white/40 text-[11px]">Clouds</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ARWeather;
