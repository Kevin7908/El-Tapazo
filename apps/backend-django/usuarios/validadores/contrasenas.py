"""Validación de contraseñas, en un solo sitio.

La usan los tres caminos por los que alguien elige una contraseña: aceptar la
invitación, restablecerla desde el enlace y cambiarla desde la aplicación.
"""

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as ErrorDeValidacionDeDjango

from usuarios.excepciones import ContrasenaInsegura
from usuarios.models import Usuario


def validar_contrasena(*, contrasena: str, usuario: Usuario | None = None) -> None:
    """Aplica los `AUTH_PASSWORD_VALIDATORS` del proyecto.

    Se le pasa el usuario cuando existe para que Django rechace además las
    contraseñas parecidas al correo o al nombre.

    Raises:
        ContrasenaInsegura: con la lista de motivos en `detalles`.
    """
    try:
        validate_password(contrasena, user=usuario)
    except ErrorDeValidacionDeDjango as exc:
        raise ContrasenaInsegura(errores=list(exc.messages)) from exc
