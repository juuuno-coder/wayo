const PRODUCTION_API_URL = "https://wayo.fly.dev";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;
export const WEBSOCKET_URL = API_BASE_URL.replace(/^http/, 'ws') + '/cable';
