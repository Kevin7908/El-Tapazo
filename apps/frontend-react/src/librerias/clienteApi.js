import axios from 'axios'

import { entorno } from '@/configuracion/entorno'

/** Cliente HTTP compartido. Los módulos lo usan desde su carpeta `api/`. */
export const clienteApi = axios.create({
  baseURL: entorno.urlApi,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Aquí se agregan los interceptores (token de sesión, manejo del 401, etc.).
