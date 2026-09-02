import axios from 'axios'

import { env } from '@/config/env'

/** Cliente HTTP compartido. Las features lo usan desde su carpeta `api/`. */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Aquí se agregan los interceptores (token de sesión, manejo de 401, etc.).
