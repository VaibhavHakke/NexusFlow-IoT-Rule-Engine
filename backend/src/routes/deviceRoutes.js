const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceName: String,
    location: String,
    temperature: Number,
    humidity: Number,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);