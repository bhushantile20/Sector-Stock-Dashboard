from django.urls import path
from . import views

urlpatterns = [
    path("sectors/", views.sectors_view, name="sectors"),
    path("companies/", views.companies_view, name="companies"),
    path("analyze/", views.analyze_view, name="analyze"),
]
