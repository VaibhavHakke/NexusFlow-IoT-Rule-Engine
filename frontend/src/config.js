export const DEMO_MODE = true;

export const API_BASE = '';
export const WS_URL = `ws://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000/ws`;