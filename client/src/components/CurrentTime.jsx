import { useState, useEffect } from "react";

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-white/80 text-center animate-fade-in">
      <p className="text-5xl font-light tracking-wide gradient-text">
        {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
      </p>
      <p className="text-sm mt-1 text-white/60">
        {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
};

export default CurrentTime;
