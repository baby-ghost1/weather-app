import SearchHistory from "../models/SearchHistory.js";

export const getHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const addHistory = async (req, res, next) => {
  try {
    const { city, country, lat, lon, temp, weather } = req.body;

    if (!city) {
      return res.status(400).json({ success: false, message: "City is required" });
    }

    const entry = await SearchHistory.create({
      city,
      country,
      lat,
      lon,
      temp,
      weather,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await SearchHistory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found" });
    }

    res.json({ success: true, message: "Entry deleted" });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({});
    res.json({ success: true, message: "History cleared" });
  } catch (error) {
    next(error);
  }
};
