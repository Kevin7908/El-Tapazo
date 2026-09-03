from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as AdminDeUsuarioBase

from .models import Invitacion, Usuario


@admin.register(Usuario)
class UsuarioAdmin(AdminDeUsuarioBase):
    """Admin ajustado a que el identificador es el correo, no un `username`."""

    ordering = ("correo",)
    list_display = ("correo", "nombre_completo", "negocio", "rol", "activo")
    list_filter = ("activo", "rol", "negocio", "is_superuser")
    search_fields = ("correo", "nombre", "apellido")

    fieldsets = (
        (None, {"fields": ("correo", "password")}),
        ("Datos personales", {"fields": ("nombre", "apellido", "telefono")}),
        ("Negocio", {"fields": ("negocio", "rol")}),
        (
            "Permisos",
            {"fields": ("activo", "es_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Fechas", {"fields": ("last_login", "fecha_alta")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "correo",
                    "nombre",
                    "apellido",
                    "negocio",
                    "rol",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


@admin.register(Invitacion)
class InvitacionAdmin(admin.ModelAdmin):
    list_display = ("correo", "negocio", "rol", "expira_en", "aceptada_en")
    list_filter = ("negocio", "rol")
    search_fields = ("correo",)
    readonly_fields = ("hash_token", "aceptada_en", "aceptada_por")
