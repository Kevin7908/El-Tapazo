#!/bin/sh
# Se ejecuta antes del comando principal del contenedor de backend.
set -e

echo "==> Aplicando migraciones..."
python manage.py migrate --noinput

exec "$@"
