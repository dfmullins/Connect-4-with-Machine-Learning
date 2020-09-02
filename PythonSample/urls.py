from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('sample1/', include('sample1.urls')),
    path('admin/', admin.site.urls),
]
