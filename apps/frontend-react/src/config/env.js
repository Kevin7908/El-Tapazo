/** Único punto donde se leen las variables de entorno de Vite. */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  appName: import.meta.env.VITE_APP_NAME ?? 'El Tapaso',
  isDev: import.meta.env.DEV,
}
