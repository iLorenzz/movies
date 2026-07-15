def build_poster_url(poster_path, size='w154'):
    if not poster_path:
        return None
    return f'https://image.tmdb.org/t/p/{size}{poster_path}'