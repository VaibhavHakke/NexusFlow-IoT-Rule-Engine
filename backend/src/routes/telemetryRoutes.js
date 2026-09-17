const express = require("express");
const router = express.Router();
const Telemetry = require("../models/Telemetry");
const { DEMO_DEVICES } = require("../services/mockGenerator");

// GET /api/telemetry/devices
// Returns the known device list (from the mock generator config) —
// this is what's actually emitting data right now, not a separate Mongo collection.
router.get("/devices", (req, res) => {
  res.json(DEMO_DEVICES);
});

// GET /api/telemetry/:deviceId/recent?limit=60
// Used to hydrate the chart with recent history from MongoDB on page load,
// so the dashboard isn't empty right after a refresh.
router.get("/:deviceId/recent", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 60, 500);
    const readings = await Telemetry.find({ "metadata.deviceId": req.params.deviceId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    res.json(readings.reverse());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch telemetry history" });
  }
});

module.exports = router;