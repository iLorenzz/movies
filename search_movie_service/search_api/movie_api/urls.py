from django.urls import path
from .views import MovieSearchView, MovieDetailsView, RatingCreateView, RatingDetailView



urlpatterns = [
    path('movies/', MovieSearchView.as_view(), name='movies-search'),
    path('movie/details/<int:id>/', MovieDetailsView.as_view(), name='movies-details'),
    path('rating/', RatingCreateView.as_view(), name='create-rating'),
    path('rating/<int:id>/', RatingDetailView.as_view(), name='detail-rating')
]