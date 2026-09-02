# App: `inventory`

Stock por bodega, movimientos (kardex), ajustes y transferencias.

## Estado

Estructura creada, sin implementación todavía.

## Carpetas

| Carpeta | Qué va aquí |
| --- | --- |
| `api/` | Vistas/ViewSets, serializers y routers (capa HTTP). |
| `dto/` | Objetos de transferencia de datos entre capas (dataclasses). |
| `exceptions/` | Excepciones propias del dominio de esta app. |
| `migrations/` | Migraciones de base de datos (generadas por Django). |
| `permissions/` | Permisos de DRF específicos de esta app. |
| `repositories/` | Acceso a datos: consultas al ORM aisladas del resto. |
| `selectors/` | Lecturas / consultas de negocio (read side). |
| `services/` | Reglas de negocio y escrituras (write side). |
| `tests/` | Pruebas de esta app. |
| `validators/` | Validaciones reutilizables de datos del dominio. |

Los archivos sueltos (`models.py`, `admin.py`, `apps.py`, `urls.py`) tienen el rol
estándar de Django. Ver `docs/backend/estructura.md` para el detalle de la arquitectura.
