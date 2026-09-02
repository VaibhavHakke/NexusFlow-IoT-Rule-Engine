export const DEMO_DEVICES = [
  { deviceId: 'turbine-01', deviceType: 'turbine', unit: '°C', base: 65, jitter: 20 },
  { deviceId: 'turbine-02', deviceType: 'turbine', unit: '°C', base: 60, jitter: 15 },
  { deviceId: 'pump-01', deviceType: 'pump', unit: 'psi', base: 40, jitter: 10 },
];

export function randomReading(device) {
  const spike = Math.random() < 0.08 ? device.jitter * 1.8 : 0;
  const noise = (Math.random() - 0.5) * device.jitter;
  const value = Math.max(0, device.base + noise + spike);
  return Math.round(value * 100) / 100;
}