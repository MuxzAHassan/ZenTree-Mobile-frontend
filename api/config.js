// Switch between local and production API base URL
// __DEV__ is true when running via `expo start`, false in production builds

const LOCAL_URL = "http://10.0.2.2:5000"; // Android emulator → host machine
const PROD_URL = "https://zentree-backend-24l6.onrender.com";

export const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;
