import { useState, useEffect } from "react";
import { FiRepeat } from "react-icons/fi";
import { getUnits, convertUnit } from "../services/api";

const UnitConverter = () => {
  const [units, setUnits] = useState([]);
  const [type, setType] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [input, setInput] = useState("25");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUnits()
      .then((res) => {
        setUnits(res);
        if (res && Object.keys(res).length > 0) {
          const firstType = Object.keys(res)[0];
          setType(firstType);
          setFromUnit(res[firstType][0]?.id || "");
          setToUnit(res[firstType][1]?.id || "");
        }
        setLoading(false);
      })
      .catch((err) => { setLoading(false); });
  }, []);

  useEffect(() => {
    if (!input || !fromUnit || !toUnit || !type) return;
    const timer = setTimeout(() => {
      convertUnit(parseFloat(input), fromUnit, toUnit, type)
        .then((res) => setResult(res ? `${res.value} ${res.symbol}` : ""))
        .catch(() => setResult(""));
    }, 300);
    return () => clearTimeout(timer);
  }, [input, fromUnit, toUnit, type]);

  const handleTypeChange = (t) => {
    setType(t);
    setFromUnit(units[t][0]?.id || "");
    setToUnit(units[t][1]?.id || "");
    setInput("");
  };

  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-white/40 text-xs">Loading units...</p></div>;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiRepeat className="text-white" /> Unit Converter
        </h3>
      </div>

      <div className="flex gap-1 mb-3 flex-wrap">
        {Object.keys(units).map((t) => (
          <button key={t} onClick={() => handleTypeChange(t)} className={`text-[11px] px-2 py-1 rounded-lg capitalize transition-all ${type === t ? "bg-white/10 text-white" : "bg-white/5 text-white/30 hover:text-white/50"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          placeholder="Enter value"
        />
        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-white text-[11px] focus:outline-none">
          {(units[type] || []).map((u) => <option key={u.id} value={u.id} className="bg-[#0f1923]">{u.symbol}</option>)}
        </select>
      </div>

      <div className="flex justify-center text-white/20 text-xs mb-3">↓</div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-medium">
          {result || "—"}
        </div>
        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-white text-[11px] focus:outline-none">
          {(units[type] || []).map((u) => <option key={u.id} value={u.id} className="bg-[#0f1923]">{u.symbol}</option>)}
        </select>
      </div>
    </div>
  );
};

export default UnitConverter;
