# App: `core`

Código transversal que usan todas las demás apps. No contiene reglas de negocio
de ningún dominio concreto.

| Carpeta | Qué va aquí |
| --- | --- |
| `api/` | Clases base para vistas y serializers, mixins de DRF. |
| `exceptions/` | Excepciones base y el exception handler global de DRF. |
| `middleware/` | Middlewares propios (request id, logging, etc.). |
| `pagination/` | Clases de paginación compartidas. |
| `utils/` | Utilidades genéricas (fechas, textos, códigos). |
| `tests/` | Pruebas de lo anterior. |

En `models.py` van los modelos abstractos base (por ejemplo `TimeStampedModel`
con `created_at` / `updated_at`) que heredan los modelos de las demás apps.
