import { Outlet } from 'react-router-dom'

import PanelDeMarca from '@/componentes/estructura/PanelDeMarca'
import TintaDeFondo from '@/componentes/estructura/TintaDeFondo'

/**
 * El armazón de las pantallas de identidad.
 *
 * En el celular ocupa la pantalla entera. En escritorio es un marco centrado
 * sobre un fondo gris: la tinta y el panel de marca quedan dentro del marco, y
 * lo de fuera es solo fondo.
 *
 * Es una ruta que envuelve a las demás, así que no se vuelve a montar al pasar
 * de una pantalla a otra: la tinta se extiende una vez, no en cada clic.
 */
export default function PlantillaAcceso() {
  return (
    <div className="flex min-h-dvh lg:items-center lg:justify-center lg:bg-gris-100 lg:p-8">
      <div className="relative flex w-full overflow-hidden lg:h-[min(700px,calc(100dvh-4rem))] lg:max-w-295 lg:rounded-[14px] lg:border lg:border-gris-300 lg:bg-blanco lg:shadow-marco">
        <TintaDeFondo />
        <PanelDeMarca />

        <main className="relative z-10 flex min-w-0 flex-1 flex-col items-center overflow-y-auto px-6.5 pt-7 pb-10 lg:justify-center lg:px-14 lg:py-12">
          <div className="flex w-full max-w-100 flex-col gap-6.5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
