/**
 * These mock devices stand in for real hardware. When real telemetry
 * arrives (via the backend's /api/telemetry/ingest), replace/extend this
 * list — the Sensor node dropdown in the Rule Builder reads from here
 * (or from the backend's /api/telemetry/devices once DEMO_MODE = false).
 */
export const DEMO_DEVICES = [
  { deviceId: 'turbine-01', deviceType: 'turbine', unit: '°C', base: 65, jitter: 20 },
  { deviceId: 'turbine-02', deviceType: 'turbine', unit: '°C', base: 60, jitter: 15 },
  { deviceId: 'pump-01', deviceType: 'pump', unit: 'psi', base: 40, jitter: 10 },
];

/** Generates one realistic-looking reading for a device, with occasional spikes. */
export function randomReading(device) {
  const spike = Math.random() < 0.08 ? device.jitter * 1.8 : 0;
  const noise = (Math.random() - 0.5) * device.jitter;
  const value = Math.max(0, device.base + noise + spike);
  return Math.round(value * 100) / 100;
}