# App: `eventos`

Canal de venta en eventos/bar: la noche, las pulseras NFC, las cuentas por persona y grupo, las comandas y los pagos.

**Modelos previstos:** `Evento`, `PulseraNfc`, `GrupoEvento`, `ClienteEvento`, `PedidoEvento`, `DetallePedidoEvento`, `AlertaConsumo`, `PagoEvento`.

## Carpetas

| Carpeta | Qué va aquí |
| --- | --- |
| `api/` | Vistas, serializers y routers (capa HTTP). |
| `dtos/` | Objetos de transferencia de datos entre capas (dataclasses). |
| `excepciones/` | Excepciones propias del dominio de esta app. |
| `migrations/` | Migraciones de base de datos (nombre exigido por Django). |
| `permisos/` | Permisos de DRF específicos de esta app. |
| `repositorios/` | Acceso a datos: consultas al ORM aisladas del resto. |
| `selectores/` | Lecturas / consultas de negocio. |
| `servicios/` | Reglas de negocio y escrituras. |
| `pruebas/` | Pruebas de esta app. |
| `validadores/` | Validaciones reutilizables del dominio. |

Reglas de código: [`varios/reglas/`](../../../varios/reglas/README.md) ·
Arquitectura: [`docs/backend/estructura.md`](../../../docs/backend/estructura.md)
