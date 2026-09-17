const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Alert = require('../models/Alert');

router.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 500);

  if (mongoose.connection.readyState !== 1) {
    return res.json([]);
  }

  const alerts = await Alert.find().sort({ timestamp: -1 }).limit(limit).lean();
  res.json(alerts);
});

module.exports = router;