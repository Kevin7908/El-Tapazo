"""Permisos por rol de la app `usuarios`."""

from rest_framework.permissions import BasePermission


class EsAdministradorDelNegocio(BasePermission):
    """Solo el administrador de un negocio gestiona a su gente.

    Deja fuera también al staff de la plataforma, que no tiene negocio: lo
    suyo es dar de alta negocios, no administrar el día a día de uno. Para eso
    usa el comando `invitar_administrador`.
    """

    message = "Solo un administrador puede gestionar las invitaciones de su negocio."

    def has_permission(self, request, view) -> bool:
        usuario = request.user
        return bool(usuario.is_authenticated and usuario.negocio_id and usuario.es_administrador)
