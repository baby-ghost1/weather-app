import { useEffect, useRef } from "react";

const WeatherParticles = ({ weatherMain }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles = [];

    const createParticle = () => {
      if (weatherMain === "Clear") {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.3 - 0.15,
          speedY: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.3 + 0.1,
          type: "light",
        };
      }
      if (weatherMain === "Rain" || weatherMain === "Drizzle") {
        return {
          x: Math.random() * canvas.width,
          y: -10,
          size: Math.random() * 1.5 + 0.5,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 8 + 4,
          opacity: Math.random() * 0.4 + 0.1,
          type: "rain",
        };
      }
      if (weatherMain === "Snow") {
        return {
          x: Math.random() * canvas.width,
          y: -10,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          type: "snow",
        };
      }
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.2 + 0.05,
        type: "dust",
      };
    };

    const count = weatherMain === "Rain" ? 60 : weatherMain === "Snow" ? 40 : weatherMain === "Clear" ? 25 : 15;
    particles = Array.from({ length: count }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.type === "light") {
          p.opacity += Math.sin(Date.now() / 1000 + i) * 0.005;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, Math.min(0.4, p.opacity))})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "rain") {
          ctx.strokeStyle = `rgba(174, 194, 224, ${p.opacity})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 2);
          ctx.stroke();
        } else if (p.type === "snow") {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.y > canvas.height + 10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = createParticle();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [weatherMain]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ opacity: 0.6 }}
    />
  );
};

export default WeatherParticles;
