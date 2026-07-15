import requests
from django.conf import settings



class TMDBClient:
    def __init__(self):
        self.base_url = settings.TMDB_BASE_URL
        self.headers = {
            'Authorization': f'Bearer {settings.TMDB_ACCESS_TOKEN}',
            'accept': 'application/json'
        }

    def search_movies_by_text(self, query_param, page):
        response = requests.get(
            f'{self.base_url}/search/movie',
            headers=self.headers,
            params={'query': query_param, 'page': page},
            timeout=5
        )

        response.raise_for_status()
        return response.json()
    
    def search_movie_details(self, movie_id):
        response = requests.get(
            f'{self.base_url}/movie/{movie_id}',
            headers=self.headers,
            params={'append_to_response': 'credits'},
            timeout=5
        )

        response.raise_for_status()
        data = response.json()

        data['credits']['cast'] = data['credits']['cast'][:4]
        return data
        
