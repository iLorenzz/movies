from django.test import TestCase
from .movie_service import TMDBClient
from rest_framework.test import APITestCase
from rest_framework import status

class TestMovieService(APITestCase):
    def test_serach_movie_by_text_returns_200(self):
        print("Mehtod: test_search_by_text")

        client = TMDBClient()

        response = client.search_movies_by_text('matrix', 1)
        print(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
