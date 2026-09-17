const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    graphId: { type: mongoose.Schema.Types.ObjectId, ref: 'Graph' },
    nodeId: { type: String },
    deviceId: { type: String },
    message: { type: String, required: true },
    value: { type: Number },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Alert', AlertSchema);