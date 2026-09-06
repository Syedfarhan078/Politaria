from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
     path("country/<int:country_id>/", views.country_detail, name="country_detail"),
]
