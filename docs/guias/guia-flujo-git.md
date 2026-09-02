# Guía de flujo de trabajo con Git

Acuerdo del equipo para no pisarnos el trabajo.

---

## Ramas

| Rama | Para qué |
| --- | --- |
| `main` | Código estable. **No se hace commit directo aquí.** |
| `dev` | Integración del trabajo del equipo (opcional si el equipo es pequeño). |
| `feature/<nombre>` | Una funcionalidad nueva. |
| `fix/<nombre>` | Corrección de un error. |
| `docs/<nombre>` | Cambios solo de documentación. |

```bash
git checkout dev
git fetch
git pull origin dev
git checkout -b feature/registro-de-productos
```

---

## Commits

Formato [Conventional Commits](https://www.conventionalcommits.org/es/):

```
<tipo>(<alcance opcional>): <descripción en presente>
```

| Tipo | Cuándo |
| --- | --- |
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de un error |
| `docs` | Documentación |
| `refactor` | Cambio de código sin cambiar el comportamiento |
| `test` | Pruebas |
| `chore` | Configuración, dependencias, tareas de mantenimiento |

Ejemplos:

```
feat(catalog): agregar modelo de producto
fix(inventory): corregir cálculo de stock disponible
docs(guias): agregar guía de instalación
chore(docker): actualizar postgres a 18
```

---

## Antes de subir

```bash
./dev.sh lint      # revisa el estilo en backend y frontend
./dev.sh test      # corre las pruebas
```

---

## Pull request

```bash
git push origin feature/registro-de-productos
```

En el PR: qué se hizo, cómo probarlo y capturas si hay cambios visuales.
Se necesita al menos una revisión de otra persona antes de mezclar.

---

## Archivos que NO se suben

Ya están en `.gitignore`, pero para tenerlo claro:

- `.env` (los `.env.example` **sí** se suben)
- `node_modules/`, `dist/`
- `.venv/`, `__pycache__/`
- `media/` (archivos subidos por usuarios), `staticfiles/`

Sí se suben, en cambio:

- Las **migraciones** de Django: son parte del código.
- El **`package-lock.json`**: es lo que garantiza que todos instalemos
  exactamente las mismas versiones de npm. Si instalas una dependencia nueva,
  súbelo junto con el `package.json`.

---

## Después de traer cambios de otros

```bash
git pull origin dev

# Si cambiaron las dependencias, el Dockerfile o el package.json
./dev.sh up --build

# Si hay migraciones nuevas
./dev.sh migrate
```
