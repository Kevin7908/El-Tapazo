"""Fixtures compartidas por las pruebas de todas las apps."""

import pytest
from rest_framework.test import APIClient


@pytest.fixture
def cliente_api() -> APIClient:
    """Cliente HTTP para las pruebas de API."""
    return APIClient()
