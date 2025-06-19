const DEFAULT_PORT = 8080;
const backendHost = import.meta.env.VITE_BACKEND_IP || 'localhost';

export const BACKEND_URL = `http://${backendHost}:${DEFAULT_PORT}`;