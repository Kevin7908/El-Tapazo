# Guía: conectarse a la API (acceso y cuentas)

Para el equipo de frontend. Aquí está **todo el contrato** del módulo de
identidad: qué endpoints hay, qué reciben, qué devuelven y qué hacer con cada
error.

La documentación interactiva, siempre al día porque la genera el propio
código, está en **<http://localhost:8000/api/docs/>** (con `./dev.sh up`
corriendo). Este documento explica lo que ahí no cabe: el *por qué* y el
*cómo montarlo*.

> **Antes de escribir código**, lee
> [las convenciones del frontend](../frontend/convenciones.md) y
> [la estructura](../frontend/estructura.md). Lo que sigue las respeta al pie
> de la letra, y en la revisión de PR se comprueba.

---

## Índice

1. [Lo primero: no hay registro](#1-lo-primero-no-hay-registro)
2. [Cómo funciona la sesión](#2-cómo-funciona-la-sesión)
3. [Los endpoints](#3-los-endpoints)
4. [Los errores](#4-los-errores)
5. [Las pantallas que tiene que crear el frontend](#5-las-pantallas-que-tiene-que-crear-el-frontend)
6. [Cómo montarlo en React](#6-cómo-montarlo-en-react)
7. [Checklist antes del PR](#7-checklist-antes-del-pr)

---

# 1. Lo primero: no hay registro

**No existe pantalla de "crear cuenta".** Y no es que falte: es una decisión de
diseño. Si cualquiera pudiera registrarse, cualquiera podría meterse en un
negocio ajeno.

Las cuentas nacen de una **invitación**:

```
El staff de la plataforma crea el negocio y invita a su administrador
        │  (desde la terminal: ./dev.sh manage invitar_administrador)
        ▼
El administrador abre el enlace del correo, elige su contraseña y entra
        │
        ▼
Desde la aplicación, invita a sus meseros y cajeros
        │
        ▼
Cada uno abre su enlace, elige su contraseña y entra
```

Consecuencias para el frontend:

- La pantalla de acceso tiene **iniciar sesión** y **¿olvidaste tu contraseña?**.
  Nada más. Ningún "regístrate".
- Hace falta una pantalla pública en `/invitacion` para aceptar la invitación.
- El **rol** (`admin`, `mesero`, `cajero`) lo pone quien invita. El formulario
  de aceptación no tiene ese campo, y mandarlo no sirve de nada: el backend lo
  ignora.

---

# 2. Cómo funciona la sesión

## Dos tokens

| Token | Dura | Para qué |
| --- | --- | --- |
| `acceso` | 15 minutos | Va en la cabecera de **cada** petición |
| `refresco` | 7 días | Solo sirve para pedir un `acceso` nuevo |

Cada petición autenticada lleva:

```
Authorization: Bearer <acceso>
```

Cuando el `acceso` caduca, la API responde `401`. Ahí se llama a
`sesiones/renovacion/` con el `refresco` y se reintenta. Eso lo hace el
interceptor de axios, **una sola vez y en un solo archivo** — ningún componente
se entera de que existen los tokens.

## El refresco rota

Cada renovación entrega un **refresco nuevo y anula el anterior**. Es lo que
hace que un token robado deje de servir en cuanto la persona legítima renueva.

⚠️ **Esto tiene una consecuencia práctica que hay que respetar:** si dos
peticiones fallan con `401` a la vez y cada una lanza su propia renovación, la
segunda usará un refresco ya anulado y sacará al usuario de la aplicación. La
solución está en el [interceptor de más abajo](#el-interceptor-que-renueva-solo):
**una sola renovación a la vez**, y las demás peticiones esperan a esa.

## Dónde guardar los tokens

- **`refresco` en `localStorage`.** Así la sesión sobrevive a un F5.
- **`acceso` en memoria** (una variable del módulo). Es el que viaja en cada
  petición y el que menos dura; si se pierde al recargar, el interceptor
  consigue otro con el refresco.
- **Nunca** en una cookie escrita desde JavaScript, ni en la URL, ni en el
  estado de React Query.

---

# 3. Los endpoints

Todo cuelga de `/api/v1/usuarios/`. La URL base sale de
`configuracion/entorno.js` (`VITE_API_URL`), **nunca escrita a mano**.

| Método | Ruta | ¿Token? | Qué hace |
| --- | --- | --- | --- |
| `POST` | `/sesiones/` | no | Iniciar sesión |
| `POST` | `/sesiones/renovacion/` | no | Cambiar el refresco por un acceso nuevo |
| `POST` | `/sesiones/cierre/` | sí | Cerrar sesión (invalida el refresco) |
| `GET` | `/yo/` | sí | Datos del usuario con la sesión abierta |
| `POST` | `/contrasena/recuperacion/` | no | Pedir el enlace de "olvidé mi contraseña" |
| `POST` | `/contrasena/restablecimiento/` | no | Elegir contraseña nueva desde el enlace |
| `POST` | `/contrasena/cambio/` | sí | Cambiar la contraseña estando dentro |
| `POST` | `/verificacion-correo/solicitud/` | no | Reenviar el enlace de verificación |
| `POST` | `/verificacion-correo/confirmacion/` | no | Confirmar el correo desde el enlace |
| `GET` | `/invitaciones/pendiente/?token=` | no | Ver de qué es una invitación |
| `POST` | `/invitaciones/aceptacion/` | no | Aceptar la invitación y crear la cuenta |
| `GET` | `/invitaciones/` | admin | Listar las invitaciones del negocio |
| `POST` | `/invitaciones/` | admin | Invitar a alguien |
| `DELETE` | `/invitaciones/{id}/` | admin | Cancelar una invitación pendiente |
| `POST` | `/invitaciones/{id}/reenvio/` | admin | Reenviar (genera un enlace nuevo) |

"admin" = hace falta token **y** que el usuario tenga rol `admin`. Un mesero
recibe `403`.

---

## Iniciar sesión

`POST /api/v1/usuarios/sesiones/`

```json
{ "correo": "ana@bar.com", "contrasena": "Bar.Tapaso.2026" }
```

**201**

```json
{
  "acceso": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresco": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "correo": "ana@bar.com",
    "nombre": "Ana",
    "apellido": "Ríos",
    "nombre_completo": "Ana Ríos",
    "telefono": "3001234567",
    "rol": "admin",
    "es_administrador": true,
    "negocio": { "id": 1, "nombre_comercial": "Bar El Tapaso" },
    "correo_verificado_en": "2026-09-04T15:19:18-05:00",
    "fecha_alta": "2026-09-04T15:19:18-05:00"
  }
}
```

El objeto `usuario` es el mismo que devuelve `GET /yo/`. Guárdalo en
`estado/` (es estado de interfaz, no datos de servidor) y úsalo para pintar el
nombre, mostrar u ocultar el menú de administración y decidir a qué rutas puede
entrar.

**Puede fallar de cuatro maneras**, y cada una se atiende distinto:

| Estado | `codigo` | Qué debe hacer la pantalla |
| --- | --- | --- |
| `401` | `credenciales_invalidas` | "Correo o contraseña incorrectos" bajo el formulario |
| `403` | `correo_no_verificado` | Ofrecer el botón **"Reenviar correo de verificación"** → `verificacion-correo/solicitud/` |
| `403` | `usuario_inactivo` | "Tu cuenta está desactivada, habla con tu administrador" |
| `403` | `negocio_suspendido` | Mensaje de negocio suspendido; no tiene sentido reintentar |

## Renovar

`POST /api/v1/usuarios/sesiones/renovacion/` → `{ "refresco": "..." }`

**200** `{ "acceso": "...", "refresco": "..." }` — guarda **los dos**: el
refresco cambió.

Si responde `401` con `sesion_invalida`, la sesión murió: borra todo y manda a
la pantalla de acceso.

## Cerrar sesión

`POST /api/v1/usuarios/sesiones/cierre/` → `{ "refresco": "..." }` → **204**

Llámalo siempre, no te limites a borrar el `localStorage`: esto invalida el
token en el servidor, y en un bar los dispositivos se comparten.

## Quién soy

`GET /api/v1/usuarios/yo/` → **200** con el objeto `usuario` de arriba.

Úsalo al arrancar la aplicación para recuperar la sesión tras un F5.

## Recuperar la contraseña

**Paso 1 — pedir el enlace.** `POST /contrasena/recuperacion/`

```json
{ "correo": "ana@bar.com" }
```

**202**, sin cuerpo. Responde 202 **exista o no ese correo**, a propósito: si
contestara distinto, la pantalla serviría para averiguar quién tiene cuenta.
Así que el mensaje es siempre el mismo: *"Si ese correo tiene una cuenta, te
llegará un enlace"*.

**Paso 2 — usar el enlace.** El correo lleva a
`{URL_FRONTEND}/nueva-contrasena?uid=Mg&token=dedzw6-8e439f...`.
Esa pantalla lee los dos parámetros y manda:

`POST /contrasena/restablecimiento/`

```json
{ "uid": "Mg", "token": "dedzw6-8e439f...", "contrasena": "Otra.Clave.2026" }
```

**204** → manda a iniciar sesión. Cambiar la contraseña **cierra todas las
sesiones abiertas**.

## Cambiar la contraseña estando dentro

`POST /contrasena/cambio/`

```json
{ "contrasena_actual": "...", "contrasena_nueva": "..." }
```

**200** con el mismo cuerpo que iniciar sesión. ⚠️ **Guarda los tokens nuevos**:
el cambio cerró todas las sesiones, incluida la que estabas usando. Si no los
guardas, la siguiente petición dará `401`.

## Verificar el correo

Casi nadie pasa por aquí: quien acepta una invitación **ya llega verificado**,
porque para aceptarla tuvo que abrir el enlace que llegó a su correo. Estas dos
rutas son para las cuentas creadas a mano desde el admin de Django.

- `POST /verificacion-correo/solicitud/` → `{ "correo": "..." }` → **202**
- `POST /verificacion-correo/confirmacion/` → `{ "uid": "...", "token": "..." }` → **204**

El enlace sirve **una sola vez**. Abrirlo dos veces devuelve `enlace_invalido`;
en esa pantalla, muestra *"Este enlace ya se usó o venció"* y un botón para
iniciar sesión.

## Aceptar una invitación

**Paso 1 — enseñar de qué es.** `GET /invitaciones/pendiente/?token=...`

**200**

```json
{
  "correo": "luis@bar.com",
  "rol": "mesero",
  "negocio": "Bar El Tapaso",
  "expira_en": "2026-09-11T15:19:18-05:00"
}
```

Píntalo antes del formulario: *"Te invitaron a **Bar El Tapaso** como
**mesero**"*. El correo llega ya decidido, así que se muestra pero **no se
edita**.

**Paso 2 — aceptar.** `POST /invitaciones/aceptacion/`

```json
{
  "token": "_fSquwmLQdUuzh71...",
  "nombre": "Luis",
  "apellido": "Pérez",
  "telefono": "3001234567",
  "contrasena": "Bar.Tapaso.2026"
}
```

**201** con el mismo cuerpo que iniciar sesión: **la persona queda dentro**, no
hay que mandarla al login. Guarda los tokens y llévala al panel.

Errores propios de esta pantalla:

| `codigo` | Qué mostrar |
| --- | --- |
| `invitacion_no_encontrada` | "Este enlace no es válido" |
| `invitacion_vencida` | "La invitación venció. Pídele otra a tu administrador" |
| `invitacion_ya_aceptada` | "Esta invitación ya se usó" + botón de iniciar sesión |
| `contrasena_insegura` | La lista de `detalles.errores`, tal cual: ya viene en español |

## Gestionar invitaciones (solo administradores)

`GET /invitaciones/` — **paginado**, como todos los listados de esta API:

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 2,
      "correo": "luis@bar.com",
      "rol": "mesero",
      "creada_por": "Ana Ríos",
      "expira_en": "2026-09-11T15:19:18-05:00",
      "aceptada_en": null,
      "esta_pendiente": true,
      "esta_vencida": false,
      "creado_en": "2026-09-04T15:19:18-05:00"
    }
  ]
}
```

`POST /invitaciones/` → `{ "correo": "...", "rol": "mesero" }` → **201**.

**No mandes `negocio`.** El backend lo toma del usuario autenticado y lo que
venga en el cuerpo lo ignora: es lo que impide invitar gente a un negocio
ajeno.

`DELETE /invitaciones/{id}/` → **204** (solo pendientes).
`POST /invitaciones/{id}/reenvio/` → **200**; genera un enlace nuevo y anula el
anterior.

---

# 4. Los errores

**Todos** los errores de la API tienen la misma forma. Se maneja **una vez**,
en el interceptor, y los componentes solo miran el `codigo`:

```json
{
  "error": {
    "codigo": "contrasena_insegura",
    "mensaje": "La contraseña no cumple los requisitos mínimos.",
    "detalles": {
      "errores": ["Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres."]
    }
  }
}
```

- **`codigo`** es lo estable. Compara contra él, **nunca contra `mensaje`**: el
  texto puede cambiar sin aviso.
- **`mensaje`** está escrito en español y para una persona: se puede mostrar
  tal cual.
- **`detalles`** solo aparece cuando hay algo más que decir. En un error de
  formulario trae los campos:

```json
{
  "error": {
    "codigo": "datos_invalidos",
    "mensaje": "Revisa los datos enviados.",
    "detalles": { "contrasena": ["Este campo es requerido."] }
  }
}
```

## Códigos que devuelve este módulo

| `codigo` | HTTP | Cuándo |
| --- | --- | --- |
| `credenciales_invalidas` | 401 | Correo o contraseña incorrectos |
| `correo_no_verificado` | 403 | Falta abrir el enlace de verificación |
| `usuario_inactivo` | 403 | La cuenta está desactivada |
| `negocio_suspendido` | 403 | El negocio no puede operar |
| `sesion_invalida` | 401 | El refresco venció, se anuló o es falso |
| `contrasena_insegura` | 400 | No pasa los mínimos; los motivos van en `detalles.errores` |
| `contrasena_actual_incorrecta` | 400 | Al cambiar la contraseña |
| `enlace_invalido` | 400 | Enlace de recuperación o verificación vencido, usado o falso |
| `invitacion_no_encontrada` | 404 | El token no corresponde a ninguna |
| `invitacion_vencida` | 409 | Existe, pero se pasó de fecha |
| `invitacion_ya_aceptada` | 409 | Ya se usó |
| `invitacion_pendiente_duplicada` | 409 | Ya hay una pendiente para ese correo |
| `correo_ya_registrado` | 409 | Ese correo ya tiene cuenta |

## Códigos generales (cualquier endpoint)

| `codigo` | HTTP | Cuándo |
| --- | --- | --- |
| `datos_invalidos` | 400 | Error de formulario; los campos van en `detalles` |
| `no_autenticado` | 401 | Falta el token o caducó → **renovar y reintentar** |
| `sin_permiso` | 403 | Autenticado, pero el rol no alcanza |
| `no_encontrado` | 404 | No existe, **o es de otro negocio** |
| `demasiadas_peticiones` | 429 | Se pasó del límite (10 intentos de acceso por minuto) |

> **`404` no siempre significa "no existe".** Si pides algo de otro negocio,
> la API responde `404`, no `403`: decir "existe pero no es tuyo" ya sería
> contar de más.

---

# 5. Las pantallas que tiene que crear el frontend

Los correos que manda el backend apuntan al frontend, no a la API. Estas tres
rutas **tienen que existir** o los enlaces no llevarán a ninguna parte:

| Ruta | Parámetros en la URL | Qué hace |
| --- | --- | --- |
| `/invitacion` | `?token=` | Muestra la invitación y pide nombre, apellido, teléfono y contraseña |
| `/nueva-contrasena` | `?uid=` y `?token=` | Pide la contraseña nueva |
| `/verificar-correo` | `?uid=` y `?token=` | Confirma sola al montarse y avisa del resultado |

Las tres son **públicas**: quien las abre todavía no tiene sesión. No las metas
detrás de `RutaProtegida`.

La base de esos enlaces la fija la variable `URL_FRONTEND` del `.env` del
backend. En desarrollo es `http://localhost:5173`.

**En desarrollo el correo no se envía: se imprime en los logs.** Para ver el
enlace:

```bash
./dev.sh logs backend
```

---

# 6. Cómo montarlo en React

Siguiendo [la estructura acordada](../frontend/estructura.md):

```
src/
├── librerias/clienteApi.js          ← los interceptores, una sola vez
├── estado/sesion.js                 ← el usuario y los tokens
├── rutas/RutaProtegida.jsx
└── modulos/autenticacion/
    ├── api/apiAutenticacion.js      ← el ÚNICO archivo que conoce estas URLs
    ├── hooks/useSesion.js
    └── paginas/
        ├── PaginaAcceso.jsx
        ├── PaginaRecuperarContrasena.jsx
        ├── PaginaNuevaContrasena.jsx
        ├── PaginaVerificarCorreo.jsx
        └── PaginaAceptarInvitacion.jsx
```

## La capa `api/` — nadie más conoce las URLs

```js
// modulos/autenticacion/api/apiAutenticacion.js
import { clienteApi } from '@/librerias/clienteApi'

export const iniciarSesion = (credenciales) =>
  clienteApi.post('/usuarios/sesiones/', credenciales).then((r) => r.data)

export const obtenerUsuarioActual = () =>
  clienteApi.get('/usuarios/yo/').then((r) => r.data)

export const cerrarSesion = (refresco) =>
  clienteApi.post('/usuarios/sesiones/cierre/', { refresco })

export const pedirRecuperacion = (correo) =>
  clienteApi.post('/usuarios/contrasena/recuperacion/', { correo })

export const restablecerContrasena = (datos) =>
  clienteApi.post('/usuarios/contrasena/restablecimiento/', datos)

export const obtenerInvitacion = (token) =>
  clienteApi.get('/usuarios/invitaciones/pendiente/', { params: { token } }).then((r) => r.data)

export const aceptarInvitacion = (datos) =>
  clienteApi.post('/usuarios/invitaciones/aceptacion/', datos).then((r) => r.data)
```

Ningún componente llama a `axios` ni a `fetch`. Si mañana cambia una ruta, se
toca **este** archivo y nada más.

## El interceptor que renueva solo

Este es el archivo delicado. Lo escribe **una persona, una vez**, y el resto del
equipo no lo vuelve a mirar.

```js
// librerias/clienteApi.js
import axios from 'axios'

import { entorno } from '@/configuracion/entorno'
import { leerRefresco, guardarSesion, borrarSesion } from '@/estado/sesion'

export const clienteApi = axios.create({
  baseURL: entorno.urlApi,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// El acceso vive en memoria: es el que más cambia y el que menos dura.
let tokenDeAcceso = null
export const fijarTokenDeAcceso = (token) => { tokenDeAcceso = token }

clienteApi.interceptors.request.use((config) => {
  if (tokenDeAcceso) config.headers.Authorization = `Bearer ${tokenDeAcceso}`
  return config
})

// Una sola renovación a la vez. Si dos peticiones fallan juntas y cada una
// renovara por su cuenta, la segunda usaría un refresco ya anulado —el backend
// los rota— y sacaría al usuario de la aplicación.
let renovacionEnCurso = null

const renovar = () => {
  renovacionEnCurso ??= axios
    .post(`${entorno.urlApi}/usuarios/sesiones/renovacion/`, { refresco: leerRefresco() })
    .then(({ data }) => {
      fijarTokenDeAcceso(data.acceso)
      guardarSesion({ refresco: data.refresco })
      return data.acceso
    })
    .finally(() => { renovacionEnCurso = null })
  return renovacionEnCurso
}

clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const peticion = error.config
    const codigo = error.response?.data?.error?.codigo

    // Solo se renueva cuando caducó el acceso, y solo una vez por petición.
    if (codigo === 'no_autenticado' && !peticion._reintentada && leerRefresco()) {
      peticion._reintentada = true
      try {
        peticion.headers.Authorization = `Bearer ${await renovar()}`
        return clienteApi(peticion)
      } catch {
        borrarSesion()
        window.location.href = '/acceso'
      }
    }
    return Promise.reject(error)
  },
)
```

⚠️ **No reintentes con `credenciales_invalidas` ni con `sesion_invalida`.** Esos
no se arreglan renovando: el primero es una contraseña mal escrita y el segundo
es una sesión muerta.

## Mostrar el error de la API

```js
// utilidades/errores.js
const MENSAJE_POR_DEFECTO = 'No se pudo completar la operación. Intenta de nuevo.'

/** El mensaje que ya viene listo para una persona. */
export const mensajeDeError = (error) =>
  error?.response?.data?.error?.mensaje ?? MENSAJE_POR_DEFECTO

/** El código estable, para reaccionar distinto según el caso. */
export const codigoDeError = (error) => error?.response?.data?.error?.codigo

/** Los errores por campo, para pintarlos bajo cada input. */
export const erroresDeCampo = (error) => error?.response?.data?.error?.detalles ?? {}
```

Con eso, una pantalla queda así:

```jsx
const { mutate, isPending, error } = useMutation({ mutationFn: iniciarSesion })

{codigoDeError(error) === 'correo_no_verificado' ? (
  <BotonReenviarVerificacion correo={correo} />
) : (
  error && <p role="alert">{mensajeDeError(error)}</p>
)}
```

## Los tres estados, siempre

Como dicen las convenciones: **cargando, error y vacío**. Una lista de
invitaciones sin el "todavía no has invitado a nadie" se siente rota.

```jsx
if (isLoading) return <Cargando />
if (error) return <Aviso>{mensajeDeError(error)}</Aviso>
if (!datos.results.length) return <Vacio>Todavía no has invitado a nadie.</Vacio>
```

## Qué va en React Query y qué en `estado/`

| Dato | Dónde |
| --- | --- |
| La lista de invitaciones | **React Query** (`useQuery`) — viene del servidor |
| El usuario con sesión abierta | `estado/sesion.js` — es estado de interfaz |
| Los tokens | `estado/sesion.js` (refresco) y memoria (acceso) |

El error más común es meter la respuesta de un `GET` en un store global. Eso ya
lo hace React Query, con caché, `isLoading` y revalidación incluidos.

## Rutas protegidas

```jsx
// rutas/RutaProtegida.jsx
export default function RutaProtegida({ rolesPermitidos, children }) {
  const { usuario, cargando } = useSesion()

  if (cargando) return <Cargando />
  if (!usuario) return <Navigate to="/acceso" replace />
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-permiso" replace />
  }
  return children
}
```

> Esconder un botón **no es seguridad**: el backend comprueba el rol en cada
> petición y devuelve `403` o `404` igual. Esto es comodidad para el usuario,
> no protección.

---

# 7. Checklist antes del PR

- [ ] Ningún `axios` ni `fetch` dentro de un componente.
- [ ] Las URLs solo aparecen en `modulos/autenticacion/api/`.
- [ ] La URL base sale de `configuracion/entorno.js`, no escrita a mano.
- [ ] El `acceso` no se guarda en `localStorage`; el `refresco` sí.
- [ ] Los errores se leen del `codigo`, nunca comparando el texto del mensaje.
- [ ] Existen `/invitacion`, `/nueva-contrasena` y `/verificar-correo`, y son
      **públicas**.
- [ ] Toda vista con datos contempla cargando, error y vacío.
- [ ] Al cambiar la contraseña se guardan los tokens nuevos de la respuesta.
- [ ] Al cerrar sesión se llama a `/sesiones/cierre/`, no solo se borra el
      `localStorage`.
- [ ] `./dev.sh lint` y `./dev.sh test front` en verde.

---

## Si algo no cuadra

1. Mira `/api/docs/`: es el contrato generado por el propio código.
2. Mira los logs: `./dev.sh logs backend` (ahí salen también los correos).
3. Si un endpoint no hace lo que dice esta guía, **es un bug del backend**.
   Repórtalo; no lo rodees desde el frontend.
