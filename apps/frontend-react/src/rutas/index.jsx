import { Route, Routes } from 'react-router-dom'

import PaginaInicio from '@/paginas/PaginaInicio.jsx'
import PaginaNoEncontrada from '@/paginas/PaginaNoEncontrada.jsx'

/** Mapa de rutas de la aplicación. Cada módulo agrega las suyas aquí. */
export default function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  )
}
