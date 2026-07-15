from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

from .movie_service import TMDBClient
from .serializers import SearchMovieResultSerializer, SearchMovieDetailsSerializer



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
                {'error': 'Filme não encontrado no TMDB.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except requests.exceptions.Timeout:
            return Response(
                {'error': 'Tempo de resposta do TMDB esgotado.'},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        
        serializer = SearchMovieDetailsSerializer(data=raw_data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)

        


