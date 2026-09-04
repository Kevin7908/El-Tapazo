"""Errores compartidos por todas las apps."""

from nucleo.excepciones.base import ErrorDeNegocio
from nucleo.excepciones.manejador import manejador_de_excepciones

__all__ = ["ErrorDeNegocio", "manejador_de_excepciones"]
