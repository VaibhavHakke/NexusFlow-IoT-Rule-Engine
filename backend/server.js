const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "NexusFlow backend is running" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`NexusFlow backend running on port ${PORT}`);
});