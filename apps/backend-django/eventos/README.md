# App: `eventos`

Canal de venta en eventos/bar: la noche, las pulseras NFC, las cuentas por persona y grupo, las comandas y los pagos.

**Modelos:** `Evento` · `PulseraNfc` · `GrupoEvento` · `ClienteEvento` ·
`PedidoEvento` · `DetallePedidoEvento` · `AlertaConsumo` · `PagoEvento`.

La cadena es: `Evento` → `GrupoEvento` (la mesa) → `ClienteEvento` (la persona
con su pulsera) → `PedidoEvento` → `DetallePedidoEvento`.

Un `Evento` no es solo una fiesta: es **una jornada de venta que se abre y se
cierra**. En un negocio que abre a diario, es el día de hoy. La `PulseraNfc`
solo guarda el UID del chip y su condición física — a quién se le prestó vive
en `ClienteEvento`, una fila nueva cada vez.

Un `PedidoEvento` sin `ClienteEvento` es la **venta de mostrador**: se paga al
instante y no hay cuenta que cobrar después. Un `PagoEvento` salda el grupo
completo, la parte de una persona o una venta de mostrador — nunca dos cosas a
la vez, y la base de datos lo obliga.

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
