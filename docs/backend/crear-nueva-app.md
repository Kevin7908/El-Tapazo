# Crear una app nueva

Receta para agregar un módulo de negocio (por ejemplo `sales` o `reports`)
manteniendo la estructura del proyecto.

---

## 1. Crear la app

```bash
./dev.sh startapp sales
```

Queda en `apps/backend-django/sales/` con la estructura mínima de Django.

---

## 2. Completar la estructura del proyecto

```bash
docker compose exec backend bash -c '
cd /app/sales
for d in api dto exceptions permissions repositories selectors services tests validators; do
  mkdir -p $d && touch $d/__init__.py
done
touch README.md
'
```

---

## 3. Ajustar `apps.py`

```python
from django.apps import AppConfig


class SalesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sales"
    verbose_name = "Sales"
```

---

## 4. Registrarla en la configuración

En `config/settings/base.py`, dentro de `LOCAL_APPS`:

```python
LOCAL_APPS = [
    "core",
    "accounts",
    ...
    "sales",     # <- nueva
]
```

---

## 5. Crear `urls.py` y engancharla

`sales/urls.py`:

```python
app_name = "sales"

urlpatterns = []
```

En `config/urls.py`, dentro de `api_v1_patterns`:

```python
path("sales/", include("sales.urls")),
```

---

## 6. Escribir el README de la app

`sales/README.md`: para qué sirve el módulo y qué entidades maneja. Copiar la
tabla de carpetas de otra app para mantener el formato.

---

## 7. Verificar y migrar

```bash
./dev.sh manage check
./dev.sh makemigrations sales
./dev.sh migrate
```

---

## 8. Agregarla a las pruebas

En `pyproject.toml`, sumar `"sales"` a `testpaths` y a
`[tool.ruff.lint.isort] known-first-party`.

---

## Antes de crear una app, pregúntate

Una app nueva se justifica cuando el módulo tiene **sus propias entidades y sus
propias reglas**. Si solo son dos o tres campos más de algo que ya existe, va
dentro de la app que ya lo maneja. Demasiadas apps pequeñas hacen el proyecto
más difícil de seguir que unas pocas bien delimitadas.
