import { useState, useEffect, useRef } from "react";
import { FiGithub, FiTwitter, FiLinkedin, FiHeart } from "react-icons/fi";

const links = [
  { label: "GitHub", href: "https://github.com/baby-ghost1/weather-app", icon: FiGithub },
  { label: "Twitter", href: "https://twitter.com", icon: FiTwitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FiLinkedin },
];

const Footer = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="relative mt-auto pt-6 pb-4 border-t border-white/[0.04]">
      {/* animated divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </div>

      {/* social links */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: hovered === i ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.8)",
                opacity: visible ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
              }}
            >
              <Icon className="text-white/40 group-hover:text-white/80 text-sm transition-colors" />
              {hovered === i && (
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-white/40 whitespace-nowrap animate-fade-in">
                  {link.label}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* divider dots */}
      <div className="flex items-center justify-center gap-1 mb-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-white/10"
            style={{
              transform: visible ? "scale(1)" : "scale(0)",
              transition: `all 0.4s cubic-bezier(0.16,1,0.3,1) ${0.6 + i * 0.08}s`,
            }}
          />
        ))}
      </div>

      {/* credits */}
      <div
        className="text-center space-y-2"
        style={{
          transform: visible ? "translateY(0)" : "translateY(10px)",
          opacity: visible ? 1 : 0,
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }}
      >
        <p className="text-white/30 text-[11px] tracking-wide">
          Crafted with <FiHeart className="inline text-[10px] text-red-400/70 mx-0.5" /> by <span className="text-white/40 font-medium">WeatherFlow</span>
        </p>
        <p className="text-white/15 text-[10px]">
          Powered by <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/50 transition-colors underline underline-offset-2 decoration-white/15">OpenWeatherMap</a> &middot; Data updated every 15 min
        </p>
        <p className="text-white/10 text-[10px] pt-1">
          &copy; {new Date().getFullYear()} WeatherFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
