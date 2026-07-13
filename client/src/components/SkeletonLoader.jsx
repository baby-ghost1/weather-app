const SkeletonLoader = ({ type = "card" }) => {
  const shimmer = "animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded";

  if (type === "card") {
    return (
      <div className="glass rounded-2xl p-5 space-y-3">
        <div className="flex justify-between">
          <div className={`${shimmer} h-3 w-24`} />
          <div className={`${shimmer} h-5 w-16 rounded-lg`} />
        </div>
        <div className={`${shimmer} h-8 w-20`} />
        <div className={`${shimmer} h-3 w-32`} />
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`${shimmer} h-3 flex-1 rounded-full`} />
          ))}
        </div>
      </div>
    );
  }

  if (type === "details") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-2">
            <div className={`${shimmer} h-8 w-8 rounded-lg mx-auto`} />
            <div className={`${shimmer} h-4 w-12 mx-auto`} />
            <div className={`${shimmer} h-3 w-16 mx-auto`} />
          </div>
        ))}
      </div>
    );
  }

  if (type === "forecast") {
    return (
      <div className="flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 min-w-[100px] space-y-2">
            <div className={`${shimmer} h-3 w-12 mx-auto`} />
            <div className={`${shimmer} h-8 w-8 rounded-full mx-auto`} />
            <div className={`${shimmer} h-4 w-10 mx-auto`} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
