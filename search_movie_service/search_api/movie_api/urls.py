from django.urls import path
from .views import MovieSearchView, MovieDetailsView




urlpatterns = [
    path('movies/', MovieSearchView.as_view(), name='movies-search'),
    path('movie/details/<int:id>/', MovieDetailsView.as_view(), name='movies-details')
]