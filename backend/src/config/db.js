const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexusflow';

  try {
    await mongoose.connect(uri);
    console.log(`[MongoDB] Connected -> ${mongoose.connection.name}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    console.error('[MongoDB] Server will keep running in DEMO/MOCK mode using in-memory data only.');
    return;
  }

  await ensureTimeSeriesCollection();
}

async function ensureTimeSeriesCollection() {
  const db = mongoose.connection.db;
  const collections = await db.listCollections({ name: 'telemetries' }).toArray();

  if (collections.length > 0) {
    console.log('[MongoDB] "telemetries" time-series collection already exists.');
    return;
  }

  try {
    await db.createCollection('telemetries', {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'seconds',
      },
      expireAfterSeconds: 60 * 60 * 24 * 30,
    });
    console.log('[MongoDB] Created "telemetries" as a Time-Series collection.');
  } catch (err) {
    console.warn('[MongoDB] Could not create time-series collection:', err.message);
    console.warn('[MongoDB] Make sure you are running MongoDB 5.0+ for native Time-Series support.');
  }
}

module.exports = connectDB;