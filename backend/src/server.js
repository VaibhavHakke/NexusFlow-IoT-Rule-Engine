const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "NexusFlow backend is running"
    });
});

// Device routes
app.use("/api/devices", deviceRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`NexusFlow backend running on http://localhost:${PORT}`);
});