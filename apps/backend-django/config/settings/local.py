"""Configuración para desarrollo local (Docker Compose)."""

from .base import *  # noqa: F403

DEBUG = True
ALLOWED_HOSTS = ["*"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# En desarrollo se aceptan todos los orígenes para no pelear con CORS.
CORS_ALLOW_ALL_ORIGINS = True
