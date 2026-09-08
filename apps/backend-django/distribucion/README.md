# App: `distribucion`

Canal de venta mayorista (B2B): tiendas cliente y sus pedidos.

**Modelos:** `ClienteDistribucion` · `PedidoDistribucion` ·
`DetallePedidoDistribucion`.

Mismo catálogo que el bar, otro precio (`producto.precio_mayorista`) y, casi
siempre, crédito: entre `fecha_pedido` y `fecha_entrega` corre el plazo de la
tienda. El `precio_unitario` de cada línea se congela al vender, para que
cambiar la lista de precios no reescriba las facturas del mes pasado.

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
