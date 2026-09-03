"""Alinea los nombres internos con los nuevos nombres de las tablas.

Renombrar una tabla en PostgreSQL no renombra su secuencia, sus índices ni sus
restricciones: después de `usuarios_usuario` → `usuarios` (e `invitaciones`,
`usuarios_grupos`, `usuarios_permisos`), todo eso seguía llamándose
`usuarios_usuario_*` y aparecía así al leer el esquema.

Los nombres nuevos son exactamente los que Django habría generado si las
tablas se hubieran llamado así desde el principio.
"""

from django.db import migrations

RENOMBRES = [
    # --- usuarios ---------------------------------------------------------- #
    ("SEQUENCE", "usuarios_usuario_id_seq", "usuarios_id_seq"),
    ("CONSTRAINT usuarios", "usuarios_usuario_pkey", "usuarios_pkey"),
    ("CONSTRAINT usuarios", "usuarios_usuario_correo_key", "usuarios_correo_key"),
    (
        "CONSTRAINT usuarios",
        "usuarios_usuario_negocio_id_814aaf1f_fk_negocios_negocio_id",
        "usuarios_negocio_id_2f199429_fk_negocios_id",
    ),
    ("INDEX", "usuarios_usuario_correo_80ace29b_like", "usuarios_correo_02971567_like"),
    ("INDEX", "usuarios_usuario_negocio_id_814aaf1f", "usuarios_negocio_id_2f199429"),

    # --- invitaciones ------------------------------------------------------ #
    ("SEQUENCE", "usuarios_invitacion_id_seq", "invitaciones_id_seq"),
    ("CONSTRAINT invitaciones", "usuarios_invitacion_pkey", "invitaciones_pkey"),
    (
        "CONSTRAINT invitaciones",
        "usuarios_invitacion_hash_token_key",
        "invitaciones_hash_token_key",
    ),
    (
        "CONSTRAINT invitaciones",
        "usuarios_invitacion_negocio_id_5af81e03_fk_negocios_negocio_id",
        "invitaciones_negocio_id_93958f0b_fk_negocios_id",
    ),
    (
        "CONSTRAINT invitaciones",
        "usuarios_invitacion_creada_por_id_0703d793_fk_usuarios_",
        "invitaciones_creada_por_id_1d30d102_fk_usuarios_id",
    ),
    (
        "CONSTRAINT invitaciones",
        "usuarios_invitacion_aceptada_por_id_23f4c7c6_fk_usuarios_",
        "invitaciones_aceptada_por_id_90b43c9d_fk_usuarios_id",
    ),
    (
        "INDEX",
        "usuarios_invitacion_aceptada_por_id_23f4c7c6",
        "invitaciones_aceptada_por_id_90b43c9d",
    ),
    (
        "INDEX",
        "usuarios_invitacion_creada_por_id_0703d793",
        "invitaciones_creada_por_id_1d30d102",
    ),
    ("INDEX", "usuarios_invitacion_creado_en_c874ea14", "invitaciones_creado_en_b3c43e45"),
    (
        "INDEX",
        "usuarios_invitacion_hash_token_c8ad122c_like",
        "invitaciones_hash_token_32d36f05_like",
    ),
    ("INDEX", "usuarios_invitacion_negocio_id_5af81e03", "invitaciones_negocio_id_93958f0b"),

    # --- usuarios_grupos (tabla puente hacia auth_group) ------------------- #
    ("SEQUENCE", "usuarios_usuario_groups_id_seq", "usuarios_grupos_id_seq"),
    ("CONSTRAINT usuarios_grupos", "usuarios_usuario_groups_pkey", "usuarios_grupos_pkey"),
    (
        "CONSTRAINT usuarios_grupos",
        "usuarios_usuario_groups_usuario_id_group_id_4ed5b09e_uniq",
        "usuarios_grupos_usuario_id_group_id_1097394d_uniq",
    ),
    (
        "CONSTRAINT usuarios_grupos",
        "usuarios_usuario_gro_usuario_id_7a34077f_fk_usuarios_",
        "usuarios_grupos_usuario_id_72c46a6b_fk_usuarios_id",
    ),
    (
        "CONSTRAINT usuarios_grupos",
        "usuarios_usuario_groups_group_id_e77f6dcf_fk_auth_group_id",
        "usuarios_grupos_group_id_f7bf68b7_fk_auth_group_id",
    ),
    ("INDEX", "usuarios_usuario_groups_group_id_e77f6dcf", "usuarios_grupos_group_id_f7bf68b7"),
    (
        "INDEX",
        "usuarios_usuario_groups_usuario_id_7a34077f",
        "usuarios_grupos_usuario_id_72c46a6b",
    ),

    # --- usuarios_permisos (tabla puente hacia auth_permission) ------------ #
    ("SEQUENCE", "usuarios_usuario_user_permissions_id_seq", "usuarios_permisos_id_seq"),
    (
        "CONSTRAINT usuarios_permisos",
        "usuarios_usuario_user_permissions_pkey",
        "usuarios_permisos_pkey",
    ),
    (
        "CONSTRAINT usuarios_permisos",
        "usuarios_usuario_user_pe_usuario_id_permission_id_217cadcd_uniq",
        "usuarios_permisos_usuario_id_permission_id_85b53a8b_uniq",
    ),
    (
        "CONSTRAINT usuarios_permisos",
        "usuarios_usuario_use_usuario_id_60aeea80_fk_usuarios_",
        "usuarios_permisos_usuario_id_4cb02bdc_fk_usuarios_id",
    ),
    (
        "CONSTRAINT usuarios_permisos",
        "usuarios_usuario_use_permission_id_4e5c0f2f_fk_auth_perm",
        "usuarios_permisos_permission_id_6e69ac22_fk_auth_permission_id",
    ),
    (
        "INDEX",
        "usuarios_usuario_user_permissions_permission_id_4e5c0f2f",
        "usuarios_permisos_permission_id_6e69ac22",
    ),
    (
        "INDEX",
        "usuarios_usuario_user_permissions_usuario_id_60aeea80",
        "usuarios_permisos_usuario_id_4cb02bdc",
    ),
]


def sentencias(renombres):
    for tipo, viejo, nuevo in renombres:
        if tipo.startswith("CONSTRAINT "):
            tabla = tipo.split(" ", 1)[1]
            yield f'ALTER TABLE "{tabla}" RENAME CONSTRAINT "{viejo}" TO "{nuevo}";'
        else:
            yield f'ALTER {tipo} "{viejo}" RENAME TO "{nuevo}";'


class Migration(migrations.Migration):
    dependencies = [("usuarios", "0002_renombrar_tablas_usuarios")]

    operations = [
        migrations.RunSQL(
            sql="\n".join(sentencias(RENOMBRES)),
            reverse_sql="\n".join(
                sentencias([(t, nuevo, viejo) for t, viejo, nuevo in RENOMBRES])
            ),
        ),
    ]
