const express = require("express");
const deviceModel = require("../models/deviceModel");

const router = express.Router();

// GET all devices
router.get("/", (req, res) => {
    try {
        const devices = deviceModel.getAllDevices();

        res.json({
            success: true,
            devices
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get devices"
        });
    }
});

// GET one device
router.get("/:id", (req, res) => {
    try {
        const device = deviceModel.getDeviceById(
            Number(req.params.id)
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        res.json({
            success: true,
            device
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get device"
        });
    }
});

// POST new device
router.post("/", (req, res) => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Device name and type are required"
            });
        }

        const device = deviceModel.createDevice(name, type);

        res.status(201).json({
            success: true,
            message: "Device created successfully",
            device
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create device"
        });
    }
});

module.exports = router;