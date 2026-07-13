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
      .catch((err) => { setError("Failed to load quiz"); setLoading(false); });
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

  if (!quizStarted) {
    return (
      <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <FiHelpCircle className="text-white" /> Weather Quiz
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-3">Test your weather knowledge! 5 random questions.</p>
        <button onClick={startQuiz} className="w-full glass rounded-xl py-2.5 text-white/80 text-sm hover:bg-white/10 transition-colors">
          Start Quiz
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <FiHelpCircle className="text-white" /> Weather Quiz
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-4xl mb-2">{score === 5 ? "🏆" : score >= 3 ? "🎉" : "📚"}</p>
          <p className="text-white text-2xl font-medium">{score}/{shuffledQs.length}</p>
          <p className="text-white/40 text-xs mt-1">
            {score === 5 ? "Perfect! You're a weather expert!" :
             score >= 3 ? "Great job! Keep learning!" :
             "Good try! Practice makes perfect!"}
          </p>
          <button onClick={startQuiz} className="mt-4 glass rounded-xl px-6 py-2.5 text-white/80 text-sm hover:bg-white/10 transition-colors flex items-center gap-2 mx-auto">
            <FiRefreshCw className="text-white" /> Play Again
          </button>
        </div>
      </div>
    );
  }

  const q = shuffledQs[currentQ];

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiHelpCircle className="text-white" /> Weather Quiz
        </h3>
        <span className="text-white/40 text-xs">{currentQ + 1}/{shuffledQs.length}</span>
      </div>

      <p className="text-white text-sm font-medium mb-4">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = "bg-white/5 hover:bg-white/10 text-white/70";
          if (answered) {
            if (i === q.correct) style = "bg-green-500/20 text-green-300 border border-green-500/30";
            else if (i === selected) style = "bg-red-500/20 text-red-300 border border-red-500/30";
            else style = "bg-white/5 text-white/30";
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left p-3 rounded-xl text-xs transition-all ${style}`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <button onClick={nextQuestion} className="mt-4 w-full glass rounded-xl py-2.5 text-white/80 text-sm hover:bg-white/10 transition-colors">
          {currentQ + 1 < shuffledQs.length ? "Next Question" : "See Results"}
        </button>
      )}
    </div>
  );
};

export default WeatherQuiz;
