import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: "",
    },
    lat: {
      type: Number,
    },
    lon: {
      type: Number,
    },
    temp: {
      type: Number,
    },
    weather: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

searchHistorySchema.index({ createdAt: -1 });

export default mongoose.model("SearchHistory", searchHistorySchema);
