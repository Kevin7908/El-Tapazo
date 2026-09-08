# Convenciones del frontend

---

## Nombres de archivos

| Tipo | Estilo | Ejemplo |
| --- | --- | --- |
| Componentes | `PascalCase.jsx` | `ProductCard.jsx` |
| Hooks | `camelCase` empezando por `use` | `useProducts.js` |
| Utilidades y servicios | `camelCase.js` | `formatCurrency.js`, `productsApi.js` |
| Carpetas | `camelCase` o `kebab-case`, consistente | `modulos/catalogo/` |
| Pruebas | igual que el archivo + `.test.jsx` | `ProductCard.test.jsx` |
| Constantes | `MAYÚSCULAS` dentro del archivo | `MOVEMENT_TYPES` |

Un componente por archivo, y el nombre del archivo igual al del componente.

---

## Componentes

- Siempre funciones, con `export default` para el componente principal.
- Componentes cortos: si pasa de ~150 líneas, hay que partirlo.
- Separar el que **muestra** del que **trae datos**: la página busca los datos,
  el componente los recibe por props y los pinta.
- Nada de lógica de negocio pesada dentro del JSX: sacarla a un hook o a
  `utilidades/`.

```jsx
// TarjetaProducto.jsx
export default function TarjetaProducto({ producto, alSeleccionar }) {
  return (
    <article onClick={() => alSeleccionar(producto.id)}>
      <h3>{producto.nombre}</h3>
    </article>
  )
}
```

---

## Estado

| Tipo de estado | Con qué se maneja |
| --- | --- |
| Estado de un componente | `useState` |
| Estado compartido entre pocos componentes | Levantarlo al padre o `useContext` |
| **Datos del servidor** | **React Query** (`useQuery` / `useMutation`) |
| Estado global de la interfaz (sesión, tema) | `estado/` |

El error más común es guardar en un store la lista de productos que vino de la
API. Eso lo maneja React Query: ya trae caché, `isLoading`, `error` y
revalidación.

---

## Llamadas a la API

- Nunca `axios` ni `fetch` directo dentro de un componente.
- La capa `modulos/<x>/api/` es la única que conoce las URLs.
- Los hooks envuelven esas funciones con React Query.
- La URL base sale de `configuracion/entorno.js`, jamás escrita a mano.

```js
// modulos/catalogo/api/apiProductos.js
import { clienteApi } from '@/librerias/clienteApi'

export const obtenerProductos = (params) =>
  clienteApi.get('/catalogo/productos/', { params }).then((r) => r.data)
```

```js
// modulos/catalogo/hooks/useProductos.js
import { useQuery } from '@tanstack/react-query'
import { obtenerProductos } from '../api/apiProductos'

export function useProductos(params) {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: () => obtenerProductos(params),
  })
}
```

---

## Manejo de estados de carga y error

Toda vista que trae datos debe contemplar los tres casos: cargando, error y
vacío. Una tabla sin el mensaje de "no hay resultados" se siente rota.

---

## Estilos

- Variables CSS en `estilos/globales.css` para colores, espaciados y tipografía.
- Nada de colores escritos a mano dentro de los componentes.
- Diseño responsive: la app se va a usar también desde el celular en la bodega.

---

## Imports

Orden: librerías externas → imports con `@/` → imports relativos. Los separa una
línea en blanco. `eslint` avisa de los imports sin usar.

---

## Variables de entorno

- Solo las que empiezan por `VITE_` llegan al navegador.
- **Nada de secretos**: el bundle es público y cualquiera lo puede leer.
- Toda variable nueva se agrega también a `.env.example` y al `compose.yaml`.

---

## Pruebas

Con Vitest + Testing Library. Se prueba lo que ve el usuario, no la
implementación:

```bash
./dev.sh test front
docker compose exec frontend npm run test
```

Prioridad: utilidades puras, hooks con lógica y componentes de formulario.

---

## Antes de subir

```bash
./dev.sh lint      # eslint
./dev.sh format    # prettier
./dev.sh test front
```
