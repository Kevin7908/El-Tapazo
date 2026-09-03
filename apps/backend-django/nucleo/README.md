# App: `nucleo`

Código transversal que usan todas las demás apps. No contiene reglas de negocio
de ningún dominio concreto.

| Carpeta | Qué va aquí |
| --- | --- |
| `api/` | Clases base para vistas y serializers, mixins de DRF. |
| `excepciones/` | Excepciones base y el manejador global de errores de DRF. |
| `middleware/` | Middlewares propios (id de petición, negocio activo, etc.). |
| `paginacion/` | Clases de paginación compartidas. |
| `utilidades/` | Utilidades genéricas (fechas, textos, códigos). |
| `pruebas/` | Pruebas de lo anterior. |

En `models.py` viven los modelos abstractos base:

- `ModeloConFechas` — añade `creado_en` y `actualizado_en`.
- `ModeloDelNegocio` — añade además la columna `negocio`, de la que depende el
  aislamiento entre negocios.
