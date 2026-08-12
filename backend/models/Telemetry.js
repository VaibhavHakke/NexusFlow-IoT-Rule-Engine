const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
    },

    metadata: {
      deviceId: {
        type: String,
        required: true,
      },
      deviceType: {
        type: String,
        default: "Turbine Sensor",
      },
    },

    temperature: Number,
    pressure: Number,
    vibration: Number,
  },
  {
    collection: "telemetry",
  }
);

module.exports = mongoose.model("Telemetry", telemetrySchema);