const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceName: { type: String, required: true },
    location: { type: String, default: "Lab A" },
    temperature: { type: Number },
    humidity: { type: Number, default: 0 },
    status: { type: String, enum: ["Online", "Offline"], default: "Online" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);