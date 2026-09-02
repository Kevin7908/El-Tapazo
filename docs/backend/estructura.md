# Estructura del backend

Qué va exactamente en cada carpeta de `apps/backend-django/`.

---

## Vista general

```
apps/backend-django/
├── config/                 Configuración del proyecto Django (no es una app)
│   ├── settings/
│   │   ├── base.py         Configuración común a todos los entornos
│   │   ├── local.py        Desarrollo
│   │   ├── production.py   Producción
│   │   └── test.py         Pruebas
│   ├── urls.py             Mapa de URLs raíz
│   ├── wsgi.py             Punto de entrada para gunicorn
│   └── asgi.py             Punto de entrada asíncrono
│
├── core/                   Código compartido entre todas las apps
├── accounts/               Usuarios, autenticación y roles
├── catalog/                Productos, categorías, marcas, unidades
├── warehouses/             Bodegas y ubicaciones
├── suppliers/              Proveedores
├── inventory/              Stock, movimientos (kardex), ajustes y transferencias
├── purchases/              Órdenes de compra y entradas de mercancía
│
├── requirements/           Dependencias por entorno
├── scripts/                Scripts del contenedor (entrypoint)
├── static/                 Archivos estáticos propios del backend
├── media/                  Archivos subidos por los usuarios
├── templates/              Plantillas HTML (correos, admin)
├── locale/                 Traducciones
├── manage.py               Comandos de Django
├── pyproject.toml          Configuración de ruff, pytest y coverage
└── Dockerfile
```

Cada app de dominio es un **módulo del negocio**, y todas tienen la misma
estructura interna por dentro. Así, si sabes moverte en una, sabes moverte en
todas.

---

## Anatomía de una app

```
catalog/
├── api/            Capa HTTP: vistas, serializers, routers
├── dto/            Objetos de transferencia de datos entre capas
├── exceptions/     Errores propios del dominio
├── migrations/     Migraciones de base de datos (las genera Django)
├── permissions/    Permisos de DRF de esta app
├── repositories/   Acceso a datos: consultas al ORM
├── selectors/      Consultas de negocio (lectura)
├── services/       Reglas de negocio (escritura)
├── tests/          Pruebas
├── validators/     Validaciones reutilizables
├── __init__.py
├── admin.py        Registro en el panel de administración
├── apps.py         Configuración de la app
├── models.py       Tablas de la base de datos
├── urls.py         Rutas de la app
└── README.md       Para qué sirve esta app
```

---

## Cómo fluye una petición

```
Petición HTTP
     │
     ▼
 urls.py ──> api/views.py ──> api/serializers.py   (¿los datos llegan bien?)
     │                              │
     │                              ▼
     │                        validators/          (¿son válidos para el negocio?)
     │                              │
     │              ┌───────────────┴───────────────┐
     │              ▼                               ▼
     │        selectors/  (leer)            services/  (escribir)
     │              │                               │
     │              └───────────────┬───────────────┘
     │                              ▼
     │                        repositories/         (hablar con el ORM)
     │                              │
     │                              ▼
     │                          models.py           (tablas)
     ▼
Respuesta JSON
```

**Regla de oro:** la vista no toma decisiones de negocio. Recibe, delega y
responde.

---

## Carpeta por carpeta

### `api/` — la capa HTTP

Todo lo que tiene que ver con HTTP y con el formato de entrada/salida.

- `views.py` (o `viewsets.py`) — recibe la petición, llama a un *service* o a un
  *selector*, devuelve la respuesta. Debe ser corto.
- `serializers.py` — convierte JSON ↔ objetos de Python y valida el **formato**
  de los datos (tipos, campos obligatorios, longitudes).
- `routers.py` / `urls.py` — arma las rutas de la app.
- `filters.py` — filtros de `django-filter` para los listados.

No va aquí: reglas de negocio, consultas complejas al ORM.

### `services/` — las reglas de negocio (escritura)

Una función por caso de uso. Reciben datos ya validados, ejecutan la regla y
guardan. Son el corazón del sistema: aquí vive lo que hace el negocio, no en la
vista ni en el modelo.

Ejemplos para este proyecto: `registrar_entrada_de_mercancia`,
`transferir_entre_bodegas`, `ajustar_stock`.

Reglas: una función = una acción; reciben tipos simples o DTOs, no objetos
`request`; si tocan varias tablas, van dentro de una transacción.

### `selectors/` — las consultas de negocio (lectura)

El espejo de `services/` para leer. Devuelven los datos ya preparados para
mostrar: `obtener_stock_por_bodega`, `listar_productos_bajo_minimo`.

Separar lectura de escritura evita que un archivo gigante mezcle las dos cosas.

### `repositories/` — el acceso a datos

Las consultas al ORM aisladas en un solo lugar. Los *services* y *selectors*
llaman al repositorio en vez de escribir `Model.objects.filter(...)` regados por
todo el código.

Ventaja: si cambia una consulta o hay que optimizarla, se toca un solo archivo,
y las pruebas pueden reemplazar el repositorio por uno falso.

### `dto/` — objetos de transferencia

`dataclasses` que llevan datos entre capas sin arrastrar objetos de Django.
Sirven para que un *service* reciba un paquete de datos claro y tipado en vez de
un diccionario suelto.

### `validators/` — validaciones reutilizables

Funciones que verifican reglas del dominio: que un SKU tenga el formato
acordado, que una cantidad no sea negativa, que un NIT sea válido. Se usan desde
los serializers, los modelos o los services.

Diferencia con el serializer: el serializer valida **forma** (es un entero, no
está vacío); el validator valida **negocio** (ese código ya existe, esa cantidad
supera el stock).

### `permissions/` — quién puede hacer qué

Clases de permisos de DRF propias de la app: `EsAdministradorDeBodega`,
`PuedeAjustarInventario`.

### `exceptions/` — errores del dominio

Excepciones propias (`StockInsuficiente`, `ProductoDuplicado`) que los services
lanzan y que el manejador global de `core/exceptions/` traduce a una respuesta
HTTP con su código correspondiente. Así el negocio no sabe nada de HTTP.

### `migrations/` — historial de la base de datos

Las genera Django con `makemigrations`. **Se suben a git** y no se editan a
mano salvo casos puntuales (migraciones de datos).

### `tests/` — pruebas

Un archivo por capa: `test_services.py`, `test_selectors.py`, `test_api.py`,
`test_models.py`. Ver [convenciones.md](convenciones.md).

### `models.py` — las tablas

Solo la definición de datos: campos, relaciones, `Meta`, `__str__`, propiedades
calculadas simples. Las reglas de negocio con varios pasos van en `services/`,
no en el modelo.

Si una app llega a tener muchos modelos, `models.py` puede volverse la carpeta
`models/` con un archivo por modelo y un `__init__.py` que los reexporte.

### `admin.py` — panel de administración

Registro de los modelos para el admin de Django. Muy útil para cargar datos de
prueba.

### `urls.py` — rutas de la app

Se incluye desde `config/urls.py` bajo `/api/v1/<app>/`.

---

## `core/` — lo compartido

Lo que usan todas las apps y no pertenece a ningún dominio:

| Carpeta | Contenido |
| --- | --- |
| `models.py` | Modelos abstractos base, p. ej. `TimeStampedModel` con `created_at`/`updated_at`. |
| `api/` | Vistas y serializers base, mixins comunes. |
| `exceptions/` | Excepción base del proyecto y el *exception handler* global de DRF. |
| `pagination/` | Clases de paginación compartidas. |
| `middleware/` | Middlewares propios. |
| `utils/` | Utilidades genéricas. |

Si algo se usa en dos apps o más, probablemente va en `core/`.

---

## `config/` — la configuración

No es una app: es el proyecto. La configuración está partida por entorno para
que desarrollo y producción no compartan valores peligrosos:

- `base.py` — todo lo común. Lee las variables sensibles del entorno.
- `local.py` — `DEBUG = True`, correo por consola, CORS abierto.
- `production.py` — `DEBUG = False`, HTTPS forzado, cookies seguras, whitenoise.
- `test.py` — ajustes para que las pruebas corran rápido.

Cuál se usa lo decide la variable `DJANGO_SETTINGS_MODULE` (la define el
`compose.yaml`).

---

## ¿Dónde pongo mi código? — chuleta

| Lo que quiero hacer | Dónde va |
| --- | --- |
| Definir una tabla nueva | `models.py` |
| Exponer un endpoint | `api/views.py` + `urls.py` |
| Convertir un modelo a JSON | `api/serializers.py` |
| "Al registrar una entrada, sumar stock y crear el movimiento" | `services/` |
| "Traer los productos por debajo del stock mínimo" | `selectors/` |
| Una consulta al ORM que se repite | `repositories/` |
| "El SKU debe tener este formato" | `validators/` |
| "Solo el jefe de bodega puede hacer esto" | `permissions/` |
| "No hay stock suficiente" (error) | `exceptions/` |
| Algo que usan dos o más apps | `core/` |
