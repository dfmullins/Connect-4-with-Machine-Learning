from django.urls import path

from . import views

urlpatterns = [
    path('<str:module>/<str:action>', views.index, name='index'),
    path('<str:module>/<str:action>/<str:params>', views.index, name='index'),
    path('<str:module>/', views.index, name='index'),
    path('', views.index, name='index'),
]