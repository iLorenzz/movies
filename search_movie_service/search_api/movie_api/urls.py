from django.urls import path
from .views import MovieSearchView




urlpatterns = [
    path('movies/', MovieSearchView.as_view(), name='movies')
]