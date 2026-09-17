const mongoose = require('mongoose');

const TelemetrySchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    metadata: {
      deviceId: { type: String, required: true },
      deviceType: { type: String, default: 'sensor' },
      unit: { type: String, default: '' },
    },
    value: { type: Number, required: true },
  },
  { collection: 'telemetries', versionKey: false }
);

module.exports = mongoose.model('Telemetry', TelemetrySchema);