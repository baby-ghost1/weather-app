import { createContext, useContext, useState } from "react";

const UnitContext = createContext();

export const useUnit = () => useContext(UnitContext);

export const UnitProvider = ({ children }) => {
  const [units, setUnits] = useState("metric");

  const toggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const tempUnit = units === "metric" ? "°C" : "°F";
  const speedUnit = units === "metric" ? "m/s" : "mph";

  return (
    <UnitContext.Provider value={{ units, toggleUnits, tempUnit, speedUnit }}>
      {children}
    </UnitContext.Provider>
  );
};
