/**
 * NEXUSFLOW — MODE SWITCH
 * ------------------------------------------------------------------
 * Right now the whole app runs on DEMO DATA generated in the browser,
 * so you can design pages / test the rule builder without needing the
 * Node.js + Express + MongoDB backend running.
 *
 * When your backend + MongoDB are ready, just change this ONE line:
 *
 *     export const DEMO_MODE = false;
 *
 * ...and the app will automatically switch to:
 *   - fetching real devices from GET  /api/telemetry/devices
 *   - streaming real telemetry over  ws://<host>:5000/ws
 *   - saving/activating graphs via   /api/graphs
 *
 * No other files need to change — every component reads data through
 * the useTelemetryEngine() hook, which picks the right source based on
 * this flag. See src/hooks/useTelemetryEngine.js
 * ------------------------------------------------------------------
 */
export const DEMO_MODE = true;

// Only used when DEMO_MODE is false. Change if your backend runs elsewhere.
export const API_BASE = '';
export const WS_URL = `ws://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000/ws`;