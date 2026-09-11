# El Tapaso

Sistema de inventario. Monorepo con el backend (API) y el frontend (interfaz web)
separados, y todo el entorno de desarrollo dockerizado para que a todo el equipo
le funcione con las mismas versiones.

## Stack

| Parte | Tecnología | Versión |
| --- | --- | --- |
| Backend | Python / Django / Django REST Framework | 3.13 / 5.2 LTS / 3.16 |
| Base de datos | PostgreSQL | 18 |
| Frontend | Node.js / React / Vite | 24 LTS / 19 / 8 |
| Entorno | Docker + Docker Compose | — |

## Arranque rápido

```bash
git clone <url-del-repo>
cd El-Tapaso
./dev.sh up --build
```

El script `dev.sh` crea el `.env`, **busca puertos libres** (si el 8000 o el 5432
ya los usa otro programa, toma el siguiente disponible), levanta los tres
contenedores y al final te imprime las URLs:

| Servicio | URL (puertos por defecto) |
| --- | --- |
| Frontend | http://localhost:5173 |
| API | http://localhost:8000/api/v1/ |
| Documentación de la API | http://localhost:8000/api/docs/ |
| Admin de Django | http://localhost:8000/admin/ |
| PostgreSQL | localhost:5432 |

```bash
./dev.sh down       # apagar
./dev.sh status     # ver estado y URLs
./dev.sh logs       # ver logs
./dev.sh help       # todas las opciones
```

Paso a paso completo en [`docs/guias/guia-instalacion.md`](docs/guias/guia-instalacion.md).

## Estructura del repositorio

```
El-Tapaso/
├── apps/
│   ├── backend-django/     API en Django (ver docs/backend/estructura.md)
│   └── frontend-react/     Interfaz en React (ver docs/frontend/estructura.md)
├── docker/                 Configuración auxiliar de contenedores (nginx, init de la BD)
├── docs/                   Documentación del proyecto
│   ├── guias/              Cómo instalar, levantar y trabajar en el proyecto
│   ├── backend/            Qué va en cada carpeta del backend
│   └── frontend/           Qué va en cada carpeta del frontend
├── dev.sh                  Script para encender/apagar el entorno
├── compose.yaml            Entorno de desarrollo
├── compose.prod.yaml       Entorno de producción (referencia)
└── .env.example            Plantilla de variables de entorno
```

## Documentación

- [Guía de instalación](docs/guias/guia-instalacion.md) — de cero a la app corriendo.
- [Guía de comandos](docs/guias/guia-comandos.md) — chuleta del día a día.
- [Guía de base de datos](docs/guias/guia-base-de-datos.md) — modo local vs Supabase.
- [Guía de Docker](docs/guias/guia-docker.md) — cómo funciona el entorno y cómo arreglar problemas.
- [Flujo de trabajo con Git](docs/guias/guia-flujo-git.md) — ramas, commits y PRs.
- [Estructura del backend](docs/backend/estructura.md) · [Convenciones](docs/backend/convenciones.md) · [Crear una app nueva](docs/backend/crear-nueva-app.md)
- [Estructura del frontend](docs/frontend/estructura.md) · [Convenciones](docs/frontend/convenciones.md)

## Estado

Entorno y documentación listos, y el modelo de datos **completo**: las 24
tablas tienen su modelo de Django y su migración — `negocios`, `usuarios`,
`invitaciones`, el catálogo (`categorias`, `proveedores`, `productos`,
`productos_proveedores`), `clientes`, el inventario (`ubicaciones`,
`existencias`, `movimientos_inventario`), el evento completo (`eventos`,
`pulseras_nfc`, `dispositivos_nfc`, `grupos_evento`, `clientes_evento`,
`pedidos_evento`, `detalle_pedido_evento`, `alertas_consumo`, `pagos_evento`) y
la distribución (`clientes_distribucion`, `pedidos_distribucion`,
`detalle_pedido_distribucion`, `pagos_distribucion`).

Encima de las tablas está el **núcleo compartido** —permisos por rol, el mixin
que saca el negocio del usuario autenticado y el manejador global de errores— y
**las siete apps completas** con su lógica y su API: `negocios`, `usuarios`,
`catalogo`, `clientes`, `inventario`, `eventos` y `distribucion`. El inventario
descuenta, traslada, ajusta y anula con el kardex como fuente de verdad, y
aguanta dos meseros vendiendo a la vez; la barra abre caja sola, lleva cuentas
con pulsera, cobra y cierra cuadrando; el mayoreo le toma el pedido a una
tienda, lo despacha descontando de la bodega, lo devuelve entero si no se pudo
entregar, lo vuelve a despachar y lo cobra por abonos, avisando de quién se
pasó del plazo; y por encima de todo, el staff da de alta y suspende negocios,
y el administrador ve cuánto puso cada canal.

**El backend está completo** (342 pruebas en verde). Lo siguiente son las
**pantallas**: todavía no hay ninguna.
