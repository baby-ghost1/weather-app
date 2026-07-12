const Loader = () => (
  <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
    <div className="w-14 h-14 rounded-full border-4 border-white/10 border-t-white/80 animate-spin" />
    <p className="text-white/50 text-sm mt-4">Fetching weather data...</p>
  </div>
);

export default Loader;
