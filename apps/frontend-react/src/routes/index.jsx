import { Route, Routes } from 'react-router-dom'

import HomePage from '@/pages/HomePage.jsx'
import NotFoundPage from '@/pages/NotFoundPage.jsx'

/** Mapa de rutas de la aplicación. Cada feature agrega las suyas aquí. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
