import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/telemetry/devices", (req, res) => {
  res.json([
    { id: 1, name: "Temperature Sensor" },
    { id: 2, name: "Humidity Sensor" }
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 NexusFlow backend running on http://localhost:${PORT}`);
});