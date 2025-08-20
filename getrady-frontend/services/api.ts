import axios, { InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

// Détermination de l’URL API :
// 1) Variable d’environnement injectée par EAS (EXPO_PUBLIC_API_URL)
// 2) Champ extra.apiUrl dans app.json / app.config
// 3) Valeur de secours (prod) – à adapter si besoin
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig as any)?.extra?.apiUrl ||
  'https://api.getrady.com';

export const api = axios.create({
  baseURL: BASE_URL,
  /* withCredentials: true, */
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = globalThis.token;
  if (token) {
    const h = config.headers;

    if (h && typeof h === 'object' && 'set' in h) {
      h.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers = {
        ...(h as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  }
  return config;
});