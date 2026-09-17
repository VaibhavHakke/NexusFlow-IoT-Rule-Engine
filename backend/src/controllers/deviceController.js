import Device from "../models/Device.js";

export const getDevices = async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
};

export const createDevice = async (req, res) => {
  const device = await Device.create(req.body);
  res.status(201).json(device);
};