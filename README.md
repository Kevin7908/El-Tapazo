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
- [Guía de Docker](docs/guias/guia-docker.md) — cómo funciona el entorno y cómo arreglar problemas.
- [Flujo de trabajo con Git](docs/guias/guia-flujo-git.md) — ramas, commits y PRs.
- [Estructura del backend](docs/backend/estructura.md) · [Convenciones](docs/backend/convenciones.md) · [Crear una app nueva](docs/backend/crear-nueva-app.md)
- [Estructura del frontend](docs/frontend/estructura.md) · [Convenciones](docs/frontend/convenciones.md)

## Estado

Estructura inicial: carpetas, contenedores y documentación. Todavía **no hay
lógica de negocio** implementada (modelos, endpoints ni pantallas).
