"""Identidad y acceso al sistema.

Aquí vive **solo quien opera el software**: administradores, meseros y cajeros.
Los clientes de un evento no son usuarios: no se registran ni tienen contraseña
(su identidad es la pulsera NFC, en la app `eventos`).

Nota sobre los nombres: unos pocos atributos van en inglés porque Django los
exige por contrato — `password` y `last_login` (los define `AbstractBaseUser`),
e `is_superuser`, `groups` y `user_permissions` (los define `PermissionsMixin`).
Todo lo que sí controlamos está en español; `activo` y `es_staff` exponen además
las propiedades `is_active` e `is_staff` que el framework consulta por nombre.
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

from nucleo.models import ModeloConFechas


class Rol(models.TextChoices):
    """Rol de una persona dentro de su negocio."""

    ADMINISTRADOR = "admin", "Administrador"
    MESERO = "mesero", "Mesero"
    CAJERO = "cajero", "Cajero"


class GestorDeUsuarios(BaseUserManager):
    """Creación de usuarios usando el correo como identificador.

    Los métodos conservan sus nombres en inglés porque son los que invocan
    Django y el comando `createsuperuser`.
    """

    use_in_migrations = True

    def _crear(self, correo: str, password: str | None, **extras) -> "Usuario":
        if not correo:
            raise ValueError("El correo electrónico es obligatorio.")
        usuario = self.model(correo=self.normalize_email(correo).lower(), **extras)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_user(self, correo: str, password: str | None = None, **extras) -> "Usuario":
        extras.setdefault("es_staff", False)
        extras.setdefault("is_superuser", False)
        return self._crear(correo, password, **extras)

    def create_superuser(self, correo: str, password: str | None = None, **extras) -> "Usuario":
        """Staff de la plataforma: administra negocios, no pertenece a ninguno."""
        extras.setdefault("es_staff", True)
        extras.setdefault("is_superuser", True)
        if extras.get("es_staff") is not True:
            raise ValueError("Un superusuario debe tener es_staff=True.")
        if extras.get("is_superuser") is not True:
            raise ValueError("Un superusuario debe tener is_superuser=True.")
        return self._crear(correo, password, **extras)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """Una persona que opera el sistema.

    Pertenece a un único negocio. La excepción es el staff de la plataforma
    (`is_superuser`), que existe por encima de los negocios y es quien los da
    de alta: sin él no habría forma de crear el primer administrador.
    """

    correo = models.EmailField("correo electrónico", max_length=150, unique=True)
    nombre = models.CharField("nombre", max_length=120)
    apellido = models.CharField("apellido", max_length=120)
    telefono = models.CharField("teléfono", max_length=20, blank=True)

    negocio = models.ForeignKey(
        "negocios.Negocio",
        on_delete=models.PROTECT,
        related_name="usuarios",
        verbose_name="negocio",
        null=True,
        blank=True,
        help_text="Vacío solo para el staff de la plataforma.",
    )
    rol = models.CharField("rol", max_length=20, choices=Rol.choices, blank=True)

    activo = models.BooleanField(
        "activo",
        default=True,
        help_text="Desactivar en vez de borrar: borrar rompe la trazabilidad.",
    )
    es_staff = models.BooleanField("accede al admin de Django", default=False)
    fecha_alta = models.DateTimeField("fecha de alta", default=timezone.now)

    objects = GestorDeUsuarios()

    USERNAME_FIELD = "correo"
    REQUIRED_FIELDS = ["nombre", "apellido"]

    class Meta:
        ordering = ["nombre", "apellido"]
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(is_superuser=True)
                    | (models.Q(negocio__isnull=False) & ~models.Q(rol=""))
                ),
                name="usuario_requiere_negocio_y_rol",
                violation_error_message=(
                    "Todo usuario debe pertenecer a un negocio y tener un rol, "
                    "salvo el staff de la plataforma."
                ),
            ),
        ]

    def __str__(self) -> str:
        return f"{self.nombre_completo} <{self.correo}>"

    # -- Nombres que Django consulta por contrato ---------------------------- #
    @property
    def is_active(self) -> bool:
        return self.activo

    @property
    def is_staff(self) -> bool:
        return self.es_staff

    # -- Propiedades del dominio --------------------------------------------- #
    @property
    def nombre_completo(self) -> str:
        return f"{self.nombre} {self.apellido}".strip()

    @property
    def es_administrador(self) -> bool:
        return self.rol == Rol.ADMINISTRADOR


class Invitacion(ModeloConFechas):
    """Alta de un trabajador por correo.

    Los trabajadores no se registran solos: un administrador los invita y ellos
    definen su propia contraseña al aceptar. Así el administrador nunca conoce
    la clave de su equipo y la trazabilidad se sostiene.

    Del token se guarda únicamente el hash: si alguien lee la base de datos, no
    puede usar la invitación.
    """

    negocio = models.ForeignKey(
        "negocios.Negocio",
        on_delete=models.PROTECT,
        related_name="invitaciones",
        verbose_name="negocio",
    )
    correo = models.EmailField("correo invitado", max_length=150)
    rol = models.CharField("rol", max_length=20, choices=Rol.choices)
    hash_token = models.CharField("hash del token", max_length=64, unique=True)

    creada_por = models.ForeignKey(
        "usuarios.Usuario",
        on_delete=models.PROTECT,
        related_name="invitaciones_enviadas",
        verbose_name="invitada por",
    )
    expira_en = models.DateTimeField("expira en")
    aceptada_en = models.DateTimeField("aceptada en", null=True, blank=True)
    aceptada_por = models.ForeignKey(
        "usuarios.Usuario",
        on_delete=models.SET_NULL,
        related_name="invitacion_aceptada",
        verbose_name="aceptada por",
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-creado_en"]
        verbose_name = "invitación"
        verbose_name_plural = "invitaciones"
        constraints = [
            models.UniqueConstraint(
                fields=["negocio", "correo"],
                condition=models.Q(aceptada_en__isnull=True),
                name="invitacion_pendiente_unica_por_correo",
                violation_error_message="Ya hay una invitación pendiente para ese correo.",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.correo} → {self.negocio} ({self.get_rol_display()})"

    @property
    def esta_vencida(self) -> bool:
        return timezone.now() >= self.expira_en

    @property
    def esta_pendiente(self) -> bool:
        return self.aceptada_en is None and not self.esta_vencida
