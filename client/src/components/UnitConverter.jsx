import { useState, useEffect } from "react";
import { FiRepeat, FiArrowDown } from "react-icons/fi";
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
      .catch(() => { setLoading(false); });
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
    setResult("");
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><div className="shimmer h-4 w-32 rounded mb-3" /><div className="shimmer h-10 w-full rounded mb-2" /><div className="shimmer h-10 w-full rounded" /></div>;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiRepeat className="text-white" /> Unit Converter
        </h3>
      </div>

      {/* type tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {Object.keys(units).map((t) => (
          <button key={t} onClick={() => handleTypeChange(t)} className={`text-[11px] px-2.5 py-1.5 rounded-lg capitalize transition-all ${type === t ? "bg-white/15 text-white font-medium" : "bg-white/[0.04] text-white/30 hover:text-white/50 hover:bg-white/[0.08]"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="mb-2">
        <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1.5">From</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
            placeholder="Enter value"
          />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="bg-white/[0.04] border border-white/10 rounded-xl px-2.5 py-2.5 text-white text-[11px] focus:outline-none focus:border-white/25 transition-colors">
            {(units[type] || []).map((u) => <option key={u.id} value={u.id} className="bg-[#0f1923]">{u.symbol}</option>)}
          </select>
        </div>
      </div>

      {/* swap button */}
      <div className="flex justify-center my-2">
        <button onClick={handleSwap} className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.1] transition-all">
          <FiArrowDown className="text-sm" />
        </button>
      </div>

      {/* output */}
      <div>
        <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1.5">To</p>
        <div className="flex items-center gap-2">
          <div className={`flex-1 bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${result ? "text-white border-white/15" : "text-white/20 border-white/5"}`}>
            {result || "—"}
          </div>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="bg-white/[0.04] border border-white/10 rounded-xl px-2.5 py-2.5 text-white text-[11px] focus:outline-none focus:border-white/25 transition-colors">
            {(units[type] || []).map((u) => <option key={u.id} value={u.id} className="bg-[#0f1923]">{u.symbol}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
