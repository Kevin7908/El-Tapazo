# Estructura del frontend

Qué va exactamente en cada carpeta de `apps/frontend-react/`.

La organización es **por funcionalidad** (*feature-based*): el código de una
misma parte del negocio vive junto, en vez de estar repartido entre carpetas
gigantes de `components/`, `hooks/` y `services/`.

---

## Vista general

```
apps/frontend-react/
├── public/                 Archivos servidos tal cual (favicon, robots.txt)
├── src/
│   ├── app/                Arranque de la aplicación
│   │   ├── main.jsx        Punto de entrada: monta React en el DOM
│   │   ├── App.jsx         Componente raíz
│   │   └── providers.jsx   Providers globales (datos, router, tema, auth)
│   │
│   ├── assets/             Imágenes, iconos y fuentes usadas desde el código
│   │
│   ├── components/         Componentes compartidos por toda la app
│   │   ├── ui/             Piezas básicas sin lógica de negocio (Button, Input, Modal)
│   │   ├── common/         Componentes reutilizables con algo de lógica (DataTable, SearchBar)
│   │   └── layout/         Piezas de la estructura visual (Header, Sidebar, Footer)
│   │
│   ├── config/             Constantes y lectura de variables de entorno
│   │
│   ├── features/           EL NÚCLEO: una carpeta por módulo del negocio
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── inventory/
│   │   ├── warehouses/
│   │   ├── suppliers/
│   │   └── purchases/
│   │
│   ├── hooks/              Hooks reutilizables por toda la app
│   ├── layouts/            Plantillas de página (con sidebar, en blanco, de login)
│   ├── lib/                Configuración de librerías externas (axios, react-query)
│   ├── pages/              Páginas globales que no pertenecen a una feature (404, Home)
│   ├── routes/             Definición de las rutas y protección de rutas privadas
│   ├── store/              Estado global compartido
│   ├── styles/             Estilos globales y variables de diseño
│   ├── utils/              Funciones auxiliares puras (formatear moneda, fechas)
│   └── tests/              Configuración y utilidades de pruebas
│
├── index.html              Plantilla base de Vite
├── vite.config.js          Configuración de Vite (alias @, servidor, pruebas)
├── eslint.config.js        Reglas del linter
├── jsconfig.json           Hace que el editor entienda el alias @
├── package.json            Dependencias y scripts
└── Dockerfile
```

---

## Anatomía de una feature

Cada carpeta de `features/` es un módulo autocontenido:

```
features/catalog/
├── api/            Llamadas HTTP de este módulo (getProducts, createProduct)
├── components/     Componentes que solo usa este módulo (ProductForm, ProductCard)
├── hooks/          Hooks del módulo (useProducts, useProductForm)
├── pages/          Pantallas completas (ProductListPage, ProductDetailPage)
├── store/          Estado local del módulo, si lo necesita
└── utils/          Funciones auxiliares del módulo
```

**Regla:** si algo lo usa **una sola** feature, va dentro de esa feature. Solo
cuando lo necesita una segunda feature se sube a `src/components/`, `src/hooks/`
o `src/utils/`. Así se evita el `components/` inmanejable con 80 archivos
sueltos.

**Regla 2:** una feature no importa cosas de otra feature. Si dos necesitan lo
mismo, ese código sube un nivel.

---

## Cómo fluye un dato

```
 Página (features/catalog/pages/ProductListPage.jsx)
      │  usa
      ▼
 Hook  (features/catalog/hooks/useProducts.js)   ← react-query: caché, loading, errores
      │  llama
      ▼
 API   (features/catalog/api/productsApi.js)
      │  usa
      ▼
 apiClient (lib/apiClient.js)  ── axios configurado con la URL base y el token
      │
      ▼
 Backend Django  /api/v1/catalog/products/
```

El componente no llama a `axios` directamente: llama a un hook. El hook llama a
la capa `api/`. Así, si cambia un endpoint, se toca un solo archivo.

---

## Carpeta por carpeta

### `app/`

El arranque. `main.jsx` monta React; `App.jsx` es la raíz; `providers.jsx`
concentra todos los providers globales (React Query, Router, y más adelante el
de autenticación o el de tema). Se toca poco.

### `components/ui/`

Piezas de interfaz genéricas y "tontas": `Button`, `Input`, `Select`, `Modal`,
`Spinner`. No saben nada del negocio y no hacen peticiones. Son las que dan
consistencia visual a toda la app.

### `components/common/`

Componentes reutilizables que sí tienen algo de lógica pero siguen sin ser de un
módulo concreto: `DataTable`, `SearchBar`, `Pagination`, `ConfirmDialog`.

### `components/layout/`

`Header`, `Sidebar`, `Footer`, `Breadcrumbs`: las piezas con las que se arman
los layouts.

### `layouts/`

Plantillas de página completas que combinan lo anterior: `MainLayout` (sidebar +
header, para la app ya autenticada), `AuthLayout` (pantalla limpia para el
login). Las rutas se envuelven con un layout.

### `config/`

`env.js` es el **único** archivo donde se lee `import.meta.env`. El resto del
código importa `env` desde aquí. También van las constantes globales (estados,
roles, tipos de movimiento).

### `lib/`

Configuración de librerías externas en un solo lugar:
- `apiClient.js` — instancia de axios con la URL base, los headers y los
  interceptores (agregar el token, manejar el 401).
- `queryClient.js` — configuración de React Query.

### `hooks/`

Hooks generales: `useDebounce`, `useLocalStorage`, `useMediaQuery`. Los que son
de un módulo van en `features/<x>/hooks/`.

### `pages/`

Páginas que no pertenecen a ninguna feature: `HomePage`, `NotFoundPage`,
`ForbiddenPage`. Las páginas de negocio viven en `features/<x>/pages/`.

### `routes/`

`index.jsx` define el árbol de rutas. Aquí también va `ProtectedRoute`, el
componente que manda al login si no hay sesión.

### `store/`

Estado global que cruza módulos: sesión del usuario, notificaciones, tema.
**Ojo:** los datos que vienen del servidor no van aquí — de eso se encarga React
Query. El store es solo para estado de la interfaz.

### `styles/`

`global.css` con el reset y las variables CSS (colores, espaciados, tipografía).

### `utils/`

Funciones puras y sin dependencias: `formatCurrency`, `formatDate`,
`calcularTotal`. Fáciles de probar.

### `tests/`

`setup.js` para Vitest y utilidades compartidas. Las pruebas de cada componente
van al lado del componente (`Button.test.jsx`).

---

## El alias `@`

`@` apunta a `src/`. Evita los imports frágiles con `../../../`:

```js
import { apiClient } from '@/lib/apiClient'      // ✅
import { apiClient } from '../../../lib/apiClient'  // ❌
```

Está configurado en `vite.config.js` (para el build) y en `jsconfig.json` (para
que el editor lo autocomplete).

---

## ¿Dónde pongo mi código? — chuleta

| Lo que quiero hacer | Dónde va |
| --- | --- |
| Una pantalla nueva de productos | `features/catalog/pages/` |
| El formulario de esa pantalla | `features/catalog/components/` |
| Llamar al endpoint de productos | `features/catalog/api/` |
| Traer y cachear esos datos | `features/catalog/hooks/` (con React Query) |
| Un botón que se usa en toda la app | `components/ui/` |
| Una tabla reutilizable | `components/common/` |
| Formatear pesos colombianos | `utils/` |
| Guardar el usuario logueado | `store/` |
| Registrar una ruta nueva | `routes/index.jsx` |
| Un color o espaciado del diseño | `styles/global.css` |
