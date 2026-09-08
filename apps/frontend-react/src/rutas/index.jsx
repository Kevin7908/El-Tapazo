import { Route, Routes } from 'react-router-dom'

import PaginaInicio from '@/paginas/PaginaInicio.jsx'
import PaginaLogin from '@/paginas/PaginaLogin.jsx'
import PaginaRegistro from '@/paginas/PaginaRegistro.jsx'
import PaginaRecuperarPassword from '@/paginas/PaginaRecuperarPassword.jsx'
import PaginaRestablecerPassword from '@/paginas/PaginaRestablecerPassword.jsx'
import PaginaNoEncontrada from '@/paginas/PaginaNoEncontrada.jsx'

export default function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<PaginaLogin />} />

      <Route path="/login" element={<PaginaLogin />} />

      <Route path="/registro" element={<PaginaRegistro />} />

      <Route path="/inicio" element={<PaginaInicio />} />

      <Route path="/recuperar-password" element={<PaginaRecuperarPassword />} />

      <Route path="/restablecer-password" element={<PaginaRestablecerPassword />} />

      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  )
}
