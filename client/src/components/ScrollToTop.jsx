import { useState, useEffect } from "react";
import { FiChevronUp } from "react-icons/fi";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 glass rounded-full w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 shadow-lg animate-fade-in"
      title="Scroll to top"
    >
      <FiChevronUp className="text-white text-xl" />
    </button>
  );
};

export default ScrollToTop;
