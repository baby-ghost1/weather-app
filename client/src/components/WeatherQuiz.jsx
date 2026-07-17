import { useState, useEffect } from "react";
import { FiHelpCircle, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { getContent } from "../services/api";

const WeatherQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledQs, setShuffledQs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getContent("quiz", { count: 5 })
      .then((res) => { setQuestions(res); setLoading(false); })
      .catch(() => { setError("Failed to load quiz"); setLoading(false); });
  }, []);

  const startQuiz = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQs(shuffled);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setQuizStarted(true);
    setAnswered(false);
  };

  const handleAnswer = (index) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === shuffledQs[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 < shuffledQs.length) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><div className="shimmer h-4 w-32 rounded mb-3" /><div className="shimmer h-10 w-full rounded mb-2" /><div className="shimmer h-10 w-full rounded" /></div>;

  if (!quizStarted) {
    return (
      <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <FiHelpCircle className="text-white" /> Weather Quiz
          </h3>
        </div>
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-400/10 flex items-center justify-center mx-auto mb-3">
            <FiHelpCircle className="text-purple-400 text-2xl" />
          </div>
          <p className="text-white/60 text-sm mb-1">Test your weather knowledge!</p>
          <p className="text-white/30 text-[11px] mb-4">5 random questions from our collection</p>
          <button onClick={startQuiz} className="px-6 py-2.5 rounded-xl bg-purple-400/20 text-purple-300 text-sm font-medium hover:bg-purple-400/30 transition-colors">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const pct = Math.round((score / shuffledQs.length) * 100);
    const color = score === 5 ? "#4ade80" : score >= 3 ? "#facc15" : "#f97316";
    return (
      <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <FiHelpCircle className="text-white" /> Weather Quiz
          </h3>
        </div>
        <div className="text-center py-4">
          {/* score ring */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
              <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-2xl font-bold">{score}/{shuffledQs.length}</span>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-1">
            {score === 5 ? "Perfect! You're a weather expert!" :
             score >= 3 ? "Great job! Keep learning!" :
             "Good try! Practice makes perfect!"}
          </p>
          <button onClick={startQuiz} className="mt-4 px-6 py-2.5 rounded-xl bg-white/[0.06] text-white/70 text-sm hover:bg-white/[0.1] transition-colors flex items-center gap-2 mx-auto">
            <FiRefreshCw className="text-[14px]" /> Play Again
          </button>
        </div>
      </div>
    );
  }

  const q = shuffledQs[currentQ];
  const progress = ((currentQ + 1) / shuffledQs.length) * 100;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiHelpCircle className="text-white" /> Weather Quiz
        </h3>
        <span className="text-white/40 text-xs">{currentQ + 1}/{shuffledQs.length}</span>
      </div>

      {/* progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/10 mb-4 overflow-hidden">
        <div className="h-full rounded-full bg-purple-400 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* question */}
      <p className="text-white text-sm font-medium mb-4 leading-relaxed">{q.question}</p>

      {/* options */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = "bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-transparent";
          let letterStyle = "bg-white/[0.06] text-white/40";
          if (answered) {
            if (i === q.correct) {
              style = "bg-green-400/10 text-green-300 border border-green-400/20";
              letterStyle = "bg-green-400/20 text-green-300";
            } else if (i === selected) {
              style = "bg-red-400/10 text-red-300 border border-red-400/20";
              letterStyle = "bg-red-400/20 text-red-300";
            } else {
              style = "bg-white/[0.02] text-white/20 border border-transparent";
            }
          }
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center gap-2.5 ${style}`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${letterStyle}`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {answered && i === q.correct && <FiCheck className="ml-auto text-green-400 text-sm shrink-0" />}
              {answered && i === selected && i !== q.correct && <FiX className="ml-auto text-red-400 text-sm shrink-0" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <button onClick={nextQuestion} className="mt-4 w-full py-2.5 rounded-xl bg-white/[0.06] text-white/70 text-sm hover:bg-white/[0.1] transition-colors">
          {currentQ + 1 < shuffledQs.length ? "Next Question" : "See Results"}
        </button>
      )}
    </div>
  );
};

export default WeatherQuiz;
