import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Get all devices" });
});

router.post("/", (req, res) => {
  res.json({ message: "Device created" });
});

export default router;