import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Lab A",
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);