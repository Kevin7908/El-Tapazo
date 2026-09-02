"""Mapa de URLs del proyecto.

Cada app de dominio expone sus rutas en /api/v1/<app>/.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

api_v1_patterns = [
    path("accounts/", include("accounts.urls")),
    path("catalog/", include("catalog.urls")),
    path("warehouses/", include("warehouses.urls")),
    path("suppliers/", include("suppliers.urls")),
    path("inventory/", include("inventory.urls")),
    path("purchases/", include("purchases.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
