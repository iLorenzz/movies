from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import requests

from .movie_service import TMDBClient
from .serializers import SearchMovieResultSerializer, SearchMovieDetailsSerializer, RatingSerializer
from .models import Rating

from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied




class MovieSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('query')
        if not query:
            return Response(
                {'error': 'Parameter query ir required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            page = int(request.query_params.get('page', 1))
        except (TypeError, ValueError):
            page = 1

        
        client = TMDBClient()

        try:
            raw_data = client.search_movies_by_text(query, page)

        except requests.exceptions.Timeout:
            return Response(
                {'error': 'Timeout: time exceeded for TMDB request'},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        
        except requests.exceptions.HTTPError:
            return Response(
                {'error': 'Error while querying TMDB'},
                status=status.HTTP_502_BAD_GATEWAY
            )
        
        serializer = SearchMovieResultSerializer(data=raw_data['results'], many=True)
        serializer.is_valid(raise_exception=True)

        return Response({
            'page': raw_data['page'],
            'total_pages': raw_data['total_pages'],
            'total_results': raw_data['total_results'],
            'results': serializer.data
        })
    
class MovieDetailsView(APIView):
    def get(self, request, id):        
        client = TMDBClient()

        try:
            raw_data = client.search_movie_details(id)
        except requests.exceptions.HTTPError:
            return Response(
                {'error': 'Movie not found in TMDB data base'},
                status=status.HTTP_404_NOT_FOUND
            )
        except requests.exceptions.Timeout:
            return Response(
                {'error': 'Timeout: time exceeded for TMDB request'},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        
        serializer = SearchMovieDetailsSerializer(data=raw_data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)
    
class RatingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(user_id=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class RatingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id, user):
        rating = get_object_or_404(Rating, pk=id)
        if rating.user_id != user:
            raise PermissionDenied('Editing this rate is not permitted')
        return rating
    
    def get(self, request, id):
        rating = self.get_object(id, request.user)
        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def put(self, request, id):
        rating = self.get_object(id, request.user)
        serializer = RatingSerializer(rating, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, id):
        rating = self.get_object(id, request.user)
        rating.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RatingSearchByUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ratings = Rating.objects.filter(user_id=request.user)
        movie_ids = [r.movie_id for r in ratings]


        client = TMDBClient()
        movies = client.search_movies_details_bulk(movie_ids)
        movies_by_id = {m['id']: m for m in movies}

        results = []
        for rating in ratings:
            movie = movies_by_id.get(rating.movie_id)

            results.append({
                'rating_id': rating.id,
                'score': rating.score,
                'movie_id': rating.movie_id,
                'title': movie['title'] if movie else None,
                'poster_patch': movie['poster_path'] if movie else None,
            })

        return Response(results, status=status.HTTP_200_OK)


