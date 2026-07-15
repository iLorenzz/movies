import requests
from django.conf import settings
from django.core.cache import cache

from concurrent.futures import ThreadPoolExecutor



class TMDBClient:
    CACHE_TTL = 3600

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
        cache_key = f'tmdb_movie_{movie_id}'
        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return cached_data

        response = requests.get(
            f'{self.base_url}/movie/{movie_id}',
            headers=self.headers,
            params={'append_to_response': 'credits'},
            timeout=5
        )

        response.raise_for_status()
        data = response.json()

        data['credits']['cast'] = data['credits']['cast'][:4]

        cache.set(cache_key, data, self.CACHE_TTL)
        return data
    
    def search_movies_details_bulk(self, movie_ids):
        cached_results = {}
        ids_to_fetch = []

        for movie_id in movie_ids:
            cached = cache.get(f'tmdb_movie_{movie_id}')

            if cached is not None:
                cached_results[movie_id] = cached
            else:
                ids_to_fetch.append(movie_id)
        
        if ids_to_fetch:
            with ThreadPoolExecutor(max_workers=5) as executor:
                fetched = executor.map(self.search_movie_details, ids_to_fetch)

                for movie_id, data in zip(ids_to_fetch, fetched):
                    cached_results[movie_id] = data

        return [cached_results[index] for index in movie_ids]
    
        
