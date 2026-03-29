// Switch between local and production API base URL
// __DEV__ is true when running via `expo start`, false in production builds

// [FIX 2026-03-29] Changed from 10.0.2.2 (emulator-only) to actual Wi-Fi IP for physical phone testing
// If using Android emulator instead, change back to "http://10.0.2.2:5000"
const LOCAL_URL = "http://192.168.0.7:5000";
const PROD_URL = "https://zentree-backend-24l6.onrender.com";

export const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;
