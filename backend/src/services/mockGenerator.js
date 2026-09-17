const Telemetry = require('../models/Telemetry');
const { pushTelemetry } = require('./streamCompiler');

const DEMO_DEVICES = [
  { deviceId: 'turbine-01', deviceType: 'turbine', unit: '°C', base: 65, jitter: 20 },
  { deviceId: 'turbine-02', deviceType: 'turbine', unit: '°C', base: 60, jitter: 15 },
  { deviceId: 'pump-01', deviceType: 'pump', unit: 'psi', base: 40, jitter: 10 },
];

function randomReading(device) {
  const spike = Math.random() < 0.08 ? device.jitter * 1.8 : 0;
  const noise = (Math.random() - 0.5) * device.jitter;
  const value = Math.max(0, device.base + noise + spike);
  return Math.round(value * 100) / 100;
}

let intervalHandle = null;

function startMockGenerator(intervalMs = 1000) {
  if (intervalHandle) return;

  intervalHandle = setInterval(() => {
    DEMO_DEVICES.forEach((device) => {
      const value = randomReading(device);
      const timestamp = new Date();

      const reading = {
        deviceId: device.deviceId,
        deviceType: device.deviceType,
        unit: device.unit,
        value,
        timestamp,
      };

      pushTelemetry(reading);

      Telemetry.create({
        timestamp,
        metadata: {
          deviceId: device.deviceId,
          deviceType: device.deviceType,
          unit: device.unit,
        },
        value,
      }).catch(() => {});
    });
  }, intervalMs);

  console.log(`[MockGenerator] Started — emitting demo telemetry every ${intervalMs}ms.`);
}

function stopMockGenerator() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

module.exports = { startMockGenerator, stopMockGenerator, DEMO_DEVICES };