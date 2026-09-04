# Guía: probar los correos sin enviar ninguno

El sistema manda tres correos —la **invitación**, la **recuperación de
contraseña** y la **verificación del correo**—, y los tres llevan dentro un
enlace con un token. Esta guía es para comprobar que ese enlace se genera bien
y que el token funciona, **sin configurar nada y sin gastar cupo de envío**.

> **No necesitas credenciales de correo.** En desarrollo el correo no se envía:
> se imprime completo, con el enlace listo para copiar. Es más rápido que abrir
> un buzón y no depende de que un proveedor esté de buenas.

---

## Índice

1. [Dónde sale el correo](#1-dónde-sale-el-correo)
2. [Cómo sacar el enlace](#2-cómo-sacar-el-enlace)
3. [Los tres correos: cómo disparar cada uno](#3-los-tres-correos-cómo-disparar-cada-uno)
4. [Comprobar que el token funciona](#4-comprobar-que-el-token-funciona)
5. [Las cuatro comprobaciones que importan](#5-las-cuatro-comprobaciones-que-importan)
6. [Problemas frecuentes](#6-problemas-frecuentes)
7. [Si de verdad necesitas enviar correos](#7-si-de-verdad-necesitas-enviar-correos)

---

# 1. Dónde sale el correo

Esto es lo que más confunde al principio: **el correo aparece en un sitio
distinto según cómo lo dispares.** No es un error, es cómo funciona la salida
por consola.

| Cómo lo disparaste | Dónde aparece el correo |
| --- | --- |
| Alguien usó la aplicación, o llamaste a la API | En los **logs del servidor**: `./dev.sh logs backend` |
| Lo lanzaste con `./dev.sh manage <comando>` | En la **salida de ese mismo comando**, ahí en tu terminal |

El motivo: `./dev.sh manage` arranca un proceso aparte, así que lo que imprime
sale por tu terminal, no por el log del servidor que está corriendo.

## Ver los logs

```bash
./dev.sh logs backend
```

Esto se queda **enganchado en vivo** (`Ctrl+C` para salir), que es justo lo que
quieres cuando vas a hacer clic en algo y ver el correo aparecer.

Para mirar hacia atrás, lo que ya pasó:

```bash
docker compose logs backend --tail 80
```

---

# 2. Cómo sacar el enlace

Un correo se ve así en la consola. Empieza por las cabeceras y va entre dos
líneas de guiones:

```
Content-Type: text/plain; charset="utf-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 8bit
Subject: Te invitaron a Bar El Tapaso en El Tapaso
From: El Tapaso <no-responder@el-tapaso.com>
To: luis@bar.com
Date: Fri, 04 Sep 2026 22:02:32 -0000

Hola,

Te invitaron a trabajar en Bar El Tapaso como Mesero.

Para entrar tienes que crear tu contraseña. Abre este enlace:

http://localhost:5173/invitacion?token=Q2WmCri9jDIteBNu6MAVe2dapVpo2HI8Y51_V-QIavY

El enlace vence el 11 de Septiembre de 2026 a las 17:02. Si se te pasa, pídele al administrador
que te envíe otro.
-------------------------------------------------------------------------------
```

Copia la URL y pégala en el navegador. Apunta al **frontend**
(`localhost:5173`), no a la API: esas pantallas las pinta React.

## El atajo

Si no quieres leer el bloque entero, este comando te deja el último enlace que
se generó:

```bash
docker compose logs backend --tail 200 | grep -o 'http://localhost:5173/[^ ]*' | tail -1
```

---

# 3. Los tres correos: cómo disparar cada uno

Los ejemplos usan el puerto **8000**, que es el de `.env.example`. Si cambiaste
`BACKEND_PORT` en tu `.env`, usa el tuyo.

## Invitación

Es el correo con el que nace toda cuenta: **no hay registro público**.

**Al primer administrador de un negocio** lo invita el staff desde la terminal
(el `--negocio` es el id que ves en la URL del admin de Django):

```bash
./dev.sh manage invitar_administrador --negocio 1 --correo ana@bar.com
```

👉 El correo sale **en la salida de ese comando**, no en los logs.

**A los demás** los invita ese administrador desde la aplicación, o con la API:

```bash
curl -X POST http://localhost:8000/api/v1/usuarios/invitaciones/ \
  -H "Authorization: Bearer <tu-acceso>" \
  -H "Content-Type: application/json" \
  -d '{"correo": "luis@bar.com", "rol": "mesero"}'
```

👉 Aquí sí: el correo sale **en los logs del backend**.

## Recuperación de contraseña

```bash
curl -X POST http://localhost:8000/api/v1/usuarios/contrasena/recuperacion/ \
  -H "Content-Type: application/json" \
  -d '{"correo": "maria@bar.com"}'
```

Responde **202** siempre, exista o no ese correo. No es un descuido: si
contestara distinto, cualquiera podría averiguar quién tiene cuenta probando
correos uno por uno. Para saber si de verdad salió, mira los logs.

## Verificación del correo

Casi nunca hace falta: **quien acepta una invitación ya llega verificado**,
porque para aceptarla tuvo que abrir el enlace que le llegó. Este flujo es para
las cuentas creadas a mano desde el admin de Django.

```bash
curl -X POST http://localhost:8000/api/v1/usuarios/verificacion-correo/solicitud/ \
  -H "Content-Type: application/json" \
  -d '{"correo": "maria@bar.com"}'
```

También responde **202** siempre, por lo mismo.

---

# 4. Comprobar que el token funciona

Mientras el frontend no tenga las pantallas `/invitacion`,
`/nueva-contrasena` y `/verificar-correo`, el enlace que copias no lleva a
ninguna parte. Puedes probar el token igual, llamando a la API directamente.

## Aceptar una invitación

El enlace trae un solo parámetro, `token`:

```
http://localhost:5173/invitacion?token=Q2WmCri9jDIteBNu...
```

Primero, mirar de qué es la invitación (esto es lo que la pantalla usará para
decir "te invitaron a X como mesero"):

```bash
curl "http://localhost:8000/api/v1/usuarios/invitaciones/pendiente/?token=Q2WmCri9jDIteBNu..."
```

```json
{"correo":"luis@bar.com","rol":"mesero","negocio":"Bar El Tapaso","expira_en":"..."}
```

Y aceptarla:

```bash
curl -X POST http://localhost:8000/api/v1/usuarios/invitaciones/aceptacion/ \
  -H "Content-Type: application/json" \
  -d '{
    "token": "Q2WmCri9jDIteBNu...",
    "nombre": "Luis",
    "apellido": "Pérez",
    "telefono": "3001234567",
    "contrasena": "Bar.Tapaso.2026"
  }'
```

**201** y devuelve la sesión ya abierta: `acceso`, `refresco` y el `usuario`.
No hay que volver a iniciar sesión.

## Restablecer la contraseña

Este enlace trae **dos** parámetros, `uid` y `token`:

```
http://localhost:5173/nueva-contrasena?uid=Mg&token=dee4p4-3781ec3bca94...
```

```bash
curl -X POST http://localhost:8000/api/v1/usuarios/contrasena/restablecimiento/ \
  -H "Content-Type: application/json" \
  -d '{"uid": "Mg", "token": "dee4p4-3781ec3bca94...", "contrasena": "Nueva.Clave.Tapaso.2026"}'
```

**204** y a iniciar sesión con la nueva.

## Verificar el correo

Igual, `uid` y `token`:

```bash
curl -X POST http://localhost:8000/api/v1/usuarios/verificacion-correo/confirmacion/ \
  -H "Content-Type: application/json" \
  -d '{"uid": "Mg", "token": "dee4q2-3792fc5377..."}'
```

**204**, y a partir de ahí esa cuenta ya puede iniciar sesión.

## Sacar `uid` y `token` sin copiarlos a mano

```bash
ENLACE=$(docker compose logs backend --tail 200 | grep -o 'http://localhost:5173/[^ ]*' | tail -1)
UID_=$(echo "$ENLACE" | sed -n 's/.*uid=\([^&]*\).*/\1/p')
TOK=$(echo "$ENLACE"  | sed -n 's/.*token=\(.*\)/\1/p')
echo "uid=$UID_  token=$TOK"
```

---

# 5. Las cuatro comprobaciones que importan

Si vas a dar por bueno el flujo, comprueba estas cuatro cosas. Las tres
primeras son las que se rompen en silencio.

**1. El enlace está entero.** Tiene que verse `&token=`, nunca `&amp;token=`.
Si aparece escapado, el frontend leería un parámetro llamado `amp;token` y
nunca encontraría el token. (Pasó una vez; hay una prueba que lo vigila.)

**2. El enlace sirve UNA sola vez.** Usa el mismo dos veces seguidas: la
segunda tiene que fallar.

```json
{"error":{"codigo":"enlace_invalido","mensaje":"El enlace no es válido o ya venció. Solicita uno nuevo."}}
```

Con `HTTP 400`. Si la segunda vez funciona, hay un problema serio.

**3. Un token no sirve para otra cosa.** El de recuperación no verifica el
correo, y al revés: los dos tienen firma distinta. Los dos casos dan
`enlace_invalido`.

**4. El rol lo pone quien invita.** Manda `"rol": "admin"` en el cuerpo de
`invitaciones/aceptacion/` y comprueba que el usuario creado **no** es
administrador: ese campo se ignora, viene de la invitación. Si alguien pudiera
elegir su propio rol, cualquier invitado se haría administrador.

---

# 6. Problemas frecuentes

| Lo que ves | Qué pasa |
| --- | --- |
| No aparece ningún correo en los logs | Lo lanzaste con `./dev.sh manage`: sale en la salida de ese comando, no en los logs. Ver [§1](#1-dónde-sale-el-correo) |
| `./dev.sh logs backend` se queda quieto | Es normal: sigue el log en vivo. Dispara la acción en otra terminal, o sal con `Ctrl+C` |
| La recuperación responde 202 pero no llega nada | Ese correo no tiene cuenta, o la cuenta está desactivada. Responde 202 igual, a propósito |
| `enlace_invalido` la primera vez | Copiaste el enlace cortado. Ojo con `uid` y `token`: son **dos** parámetros separados por `&` |
| `correo_no_verificado` al iniciar sesión | La cuenta existe y la contraseña está bien, pero falta abrir el enlace de verificación. Ver [§3](#3-los-tres-correos-cómo-disparar-cada-uno) |
| `demasiadas_peticiones` (429) | El freno contra fuerza bruta: 10 intentos de acceso por minuto y 5 correos por hora, por IP. Espera un rato |
| `invitacion_pendiente_duplicada` | Ya hay una invitación sin usar para ese correo. Cancélala o reenvíala desde la aplicación |

---

# 7. Si de verdad necesitas enviar correos

Solo hace falta para comprobar la entrega real: que llegue a la bandeja de
entrada y no a la carpeta de spam. Para todo lo demás, la consola alcanza.

Dos avisos antes de pedir la clave del proyecto:

- **El cupo es compartido.** Todas las claves SMTP de una misma cuenta comen del
  mismo plato: 300 correos al día entre todos. Si alguien prueba en bucle, se
  acaban para el resto.
- **Es más limpio tener la tuya.** Una cuenta gratuita de Brevo son 300 correos
  diarios propios y tu propio remitente. Si dejas el proyecto, no hay nada que
  revocar.

Los pasos y el `.env` están en la
[guía de instalación, §5](guia-instalacion.md#5-el-correo-en-desarrollo),
incluido el detalle del host de Brevo que no coincide con lo que dice su panel.

---

## Referencias

- [Guía de instalación](guia-instalacion.md) — levantar el proyecto y configurar el `.env`
- [Conectarse a la API](guia-api-autenticacion.md) — todos los endpoints, con ejemplos y códigos de error
- <http://localhost:8000/api/docs/> — el contrato, generado por el propio código
