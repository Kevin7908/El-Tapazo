import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ELEMENTOS_DEL_MENU } from '@/configuracion/menu'
import { RUTAS } from '@/configuracion/rutas'
import EsqueletoDeAcceso from '@/modulos/autenticacion/componentes/EsqueletoDeAcceso'
import EsqueletoDelTablero from '@/modulos/tablero/componentes/EsqueletoDelTablero'
import PaginaEnConstruccion from '@/paginas/PaginaEnConstruccion.jsx'
import PaginaNoEncontrada from '@/paginas/PaginaNoEncontrada.jsx'
import PlantillaAcceso from '@/plantillas/PlantillaAcceso'
import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal'

import RutaProtegida from './RutaProtegida'

// Cada pantalla se descarga cuando se abre. Mientras llega se ve su esqueleto,
// con la misma forma que va a tener, para que nada salte al aparecer.
const PaginaIniciarSesion = lazy(
  () => import('@/modulos/autenticacion/paginas/PaginaIniciarSesion')
)
const PaginaAceptarInvitacion = lazy(
  () => import('@/modulos/autenticacion/paginas/PaginaAceptarInvitacion')
)
const PaginaRecuperarContrasena = lazy(
  () => import('@/modulos/autenticacion/paginas/PaginaRecuperarContrasena')
)
const PaginaNuevaContrasena = lazy(
  () => import('@/modulos/autenticacion/paginas/PaginaNuevaContrasena')
)
const PaginaVerificarCorreo = lazy(
  () => import('@/modulos/autenticacion/paginas/PaginaVerificarCorreo')
)
const PaginaTablero = lazy(() => import('@/modulos/tablero/paginas/PaginaTablero'))

// Las secciones del menú que todavía no tienen pantalla se ven dentro del panel,
// con el menú a mano, en vez de mandar a la página de «no existe».
const SECCIONES_EN_CONSTRUCCION = ELEMENTOS_DEL_MENU.filter(
  (elemento) => elemento.ruta !== RUTAS.inicio
)

export default function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RUTAS.acceso} replace />} />

      <Route element={<PlantillaAcceso />}>
        <Route
          path={RUTAS.acceso}
          element={
            <Suspense fallback={<EsqueletoDeAcceso campos={2} />}>
              <PaginaIniciarSesion />
            </Suspense>
          }
        />
        <Route
          path={RUTAS.invitacion}
          element={
            <Suspense fallback={<EsqueletoDeAcceso campos={4} conCaja />}>
              <PaginaAceptarInvitacion />
            </Suspense>
          }
        />
        <Route
          path={RUTAS.recuperarContrasena}
          element={
            <Suspense fallback={<EsqueletoDeAcceso campos={1} />}>
              <PaginaRecuperarContrasena />
            </Suspense>
          }
        />
        <Route
          path={RUTAS.nuevaContrasena}
          element={
            <Suspense fallback={<EsqueletoDeAcceso campos={1} conCaja />}>
              <PaginaNuevaContrasena />
            </Suspense>
          }
        />
        <Route
          path={RUTAS.verificarCorreo}
          element={
            <Suspense fallback={<EsqueletoDeAcceso campos={1} />}>
              <PaginaVerificarCorreo />
            </Suspense>
          }
        />
      </Route>

      <Route
        element={
          <RutaProtegida>
            <PlantillaPrincipal />
          </RutaProtegida>
        }
      >
        <Route
          path={RUTAS.inicio}
          element={
            <Suspense fallback={<EsqueletoDelTablero />}>
              <PaginaTablero />
            </Suspense>
          }
        />
        {SECCIONES_EN_CONSTRUCCION.map((seccion) => (
          <Route
            key={seccion.ruta}
            path={seccion.ruta}
            element={<PaginaEnConstruccion titulo={seccion.etiqueta} />}
          />
        ))}
      </Route>

      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  )
}
