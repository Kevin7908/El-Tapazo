"""Alinea los nombres internos con el nuevo nombre de la tabla.

Renombrar una tabla en PostgreSQL no renombra su secuencia, sus índices ni sus
restricciones: después de `negocios_negocio` → `negocios`, todo eso seguía
llamándose `negocios_negocio_*` y aparecía así al leer el esquema.

Los nombres nuevos son exactamente los que Django habría generado si la tabla
se hubiera llamado `negocios` desde el principio.
"""

from django.db import migrations

RENOMBRES = [
    # (tipo, nombre viejo, nombre nuevo)
    ("SEQUENCE", "negocios_negocio_id_seq", "negocios_id_seq"),
    ("CONSTRAINT negocios", "negocios_negocio_pkey", "negocios_pkey"),
    ("CONSTRAINT negocios", "negocios_negocio_nit_key", "negocios_nit_key"),
    ("INDEX", "negocios_negocio_creado_en_18711ce5", "negocios_creado_en_78e19ac9"),
    ("INDEX", "negocios_negocio_nit_4b7f6c27_like", "negocios_nit_d3cde860_like"),
]


def sentencias(renombres):
    for tipo, viejo, nuevo in renombres:
        if tipo.startswith("CONSTRAINT "):
            tabla = tipo.split(" ", 1)[1]
            yield f'ALTER TABLE "{tabla}" RENAME CONSTRAINT "{viejo}" TO "{nuevo}";'
        else:
            yield f'ALTER {tipo} "{viejo}" RENAME TO "{nuevo}";'


class Migration(migrations.Migration):
    dependencies = [("negocios", "0002_renombrar_tabla_negocios")]

    operations = [
        migrations.RunSQL(
            sql="\n".join(sentencias(RENOMBRES)),
            reverse_sql="\n".join(
                sentencias([(t, nuevo, viejo) for t, viejo, nuevo in RENOMBRES])
            ),
        ),
    ]
